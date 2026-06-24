<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\EquipmentQr;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Carbon\Carbon;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class QrController extends Controller
{
    public function generate(Equipment $equipment)
    {
        $token = Str::random(20);

        EquipmentQr::updateOrCreate(
            ['equipment_id' => $equipment->id],
            [
                'qr_code' => $token,
                'generated_at' => now(),
            ]
        );

        return back()->with('success', 'QR Code berhasil di-generate.');
    }

    public function scan($token)
    {
        $qr = EquipmentQr::where('qr_code', $token)->firstOrFail();

        $equipment = Equipment::with([
            'room',
            'movements.fromRoom',
            'movements.toRoom',
            'movements.mover',
            'reports.progressLogs',
            'calibrations' => function ($q) {
                $q->latest('calibration_date');
            }
        ])->findOrFail($qr->equipment_id);

        $calibrationWarning = false;
        $daysToCalibration = null;
        $warningMessage = '';

        if (!empty($equipment->next_calibration_date)) {
            Carbon::setLocale('id');
            $nextCalibrationDate = Carbon::parse($equipment->next_calibration_date);
            $daysToCalibration = now()->startOfDay()->diffInDays($nextCalibrationDate->startOfDay(), false); 

            if ($daysToCalibration <= 30 && $daysToCalibration >= 0) {
                $calibrationWarning = true;
                $warningMessage = "Waktu kalibrasi tersisa {$daysToCalibration} hari lagi! (Jatuh tempo: " . $nextCalibrationDate->isoFormat('d MMMM Y') . ")";
            } elseif ($daysToCalibration < 0) {
                $calibrationWarning = true;
                $warningMessage = "ALAT TELAH MELEWATI BATAS KALIBRASI (" . abs($daysToCalibration) . " hari yang lalu)!";
            }
        } else {
            $calibrationWarning = true;
            $warningMessage = "Jadwal kalibrasi berikutnya belum diatur di sistem master.";
        }

        return Inertia::render('Public/EquipmentScan', [
            'equipment' => $equipment,
            'calibrationStatus' => [
                'is_warning' => $calibrationWarning,
                'message' => $warningMessage,
                'days_left' => $daysToCalibration
            ]
        ]);
    }

    public function render($token)
    {
        EquipmentQr::where('qr_code', $token)->firstOrFail();

        $scanUrl = route('qr.scan', $token);

        $qrImage = QrCode::format('png')
            ->size(300)
            ->errorCorrection('H')
            ->merge(public_path('logo_qr.png'), 0.25, true)
            ->generate($scanUrl);

        return response($qrImage)->header('Content-Type', 'image/png');
    }

    public function batchGenerate(Request $request)
    {
        $request->validate([
            'mode' => 'required|in:all_missing,by_room',
            'room_id' => 'required_if:mode,by_room|nullable|exists:rooms,id'
        ]);

        $query = Equipment::whereDoesntHave('qr');

        if ($request->mode === 'by_room') {
            $query->where('room_id', $request->room_id);
        }

        $equipments = $query->get();

        if ($equipments->isEmpty()) {
            return back()->withErrors(['error' => 'Semua alat pada kriteria ini sudah punya QR.']);
        }

        $equipments->each(function ($equipment) {
            EquipmentQr::create([
                'equipment_id' => $equipment->id,
                'qr_code' => Str::random(20),
                'generated_at' => now(),
            ]);
        });

        return back()->with('success', $equipments->count() . ' QR Code berhasil di-generate secara massal!');
    }

    public function printBatch(Request $request)
    {
        $query = Equipment::with(['qr', 'room'])->whereHas('qr');

        if ($request->filled('room_id')) {
            $query->where('room_id', $request->room_id);
        }

        $equipments = $query->orderBy('room_id')->orderBy('name')->get();

        if ($equipments->isEmpty()) {
            return back()->withErrors(['error' => 'Tidak ada QR Code yang bisa dicetak pada kriteria ini. Pastikan Anda sudah Generate QR terlebih dahulu.']);
        }

        return Inertia::render('Admin/Equipments/PrintQr', [
            'equipments' => $equipments,
            'room' => $request->filled('room_id') ? Room::find($request->room_id) : null
        ]);
    }
}
