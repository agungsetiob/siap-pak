<?php

namespace App\Http\Controllers;

use App\Models\Calibration;
use App\Models\Equipment;
use Illuminate\Http\Request;
use App\Services\CalibrationService;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CalibrationController extends Controller
{
    protected CalibrationService $service;

    public function __construct(CalibrationService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $calibrations = Calibration::with(['equipment.room', 'admin'])
            ->latest('calibration_date')
            ->paginate(10);

        $upcomingCalibrations = Equipment::with('room')
            ->whereNotNull('next_calibration_date')
            ->whereDate('next_calibration_date', '<=', now()->addDays(30))
            ->orderBy('next_calibration_date', 'asc')
            ->get();

        $stats = [
            'total'       => Calibration::count(),
            'upcoming'    => Equipment::whereNotNull('next_calibration_date')
                ->whereDate('next_calibration_date', '<=', now()->addDays(30))
                ->count(),
            'expired'     => Equipment::whereNotNull('next_calibration_date')
                ->whereDate('next_calibration_date', '<', now())
                ->count(),
            'withCert'    => Calibration::whereNotNull('certificate_file')->count(),
        ];

        return Inertia::render('Admin/Calibrations/Index', [
            'calibrations'        => $calibrations,
            'upcomingCalibrations' => $upcomingCalibrations,
            'stats'               => $stats,
        ]);
    }

    public function store(Request $request, Equipment $equipment)
    {
        $request->validate($this->service->rules());

        $this->service->store($request, $equipment);

        return back()->with('success', 'Riwayat kalibrasi berhasil ditambahkan.');
    }

    public function update(Request $request, Calibration $calibration)
    {
        $request->validate($this->service->rules());

        $this->service->update($request, $calibration);

        return back()->with('success', 'Riwayat kalibrasi berhasil diperbaiki.');
    }

    public function destroy(Calibration $calibration)
    {
        if ($calibration->certificate_file) {
            Storage::disk('public')->delete($calibration->certificate_file);
        }

        $calibration->delete();

        return back()->with('success', 'Data kalibrasi berhasil dihapus.');
    }
}
