<?php

namespace App\Http\Controllers;

use App\Models\Calibration;
use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CalibrationController extends Controller
{

    public function index()
    {
        // 1. Ambil riwayat kalibrasi global (semua alat)
        $calibrations = Calibration::with(['equipment.room', 'admin'])
            ->latest('calibration_date')
            ->paginate(15);

        // 2. Ambil alat yang jadwal kalibrasinya mendekati H-30 atau sudah lewat
        $upcomingCalibrations = Equipment::with('room')
            ->whereNotNull('next_calibration_date')
            ->whereDate('next_calibration_date', '<=', now()->addDays(30))
            ->orderBy('next_calibration_date', 'asc')
            ->get();

        return \Inertia\Inertia::render('Admin/Calibrations/Index', [
            'calibrations' => $calibrations,
            'upcomingCalibrations' => $upcomingCalibrations,
        ]);
    }
    public function store(Request $request, Equipment $equipment)
    {
        $request->validate([
            'certificate_number' => 'nullable|string|max:255',
            'testing_institution' => 'nullable|string|max:255',
            'calibration_date' => 'required|date',
            'next_calibration_date' => 'required|date|after:calibration_date',
            'result' => 'required|in:laik,tidak_laik,laik_dengan_catatan',
            'certificate_file' => 'nullable|mimes:pdf,jpg,png|max:2048', // Max 2MB
            'notes' => 'nullable|string',
        ]);

        $filePath = null;
        if ($request->hasFile('certificate_file')) {
            $filePath = $request->file('certificate_file')->store('calibrations', 'public');
        }

        // Simpan riwayat kalibrasi
        $equipment->calibrations()->create([
            'certificate_number' => $request->certificate_number,
            'certificate_file' => $filePath,
            'testing_institution' => $request->testing_institution,
            'calibration_date' => $request->calibration_date,
            'next_calibration_date' => $request->next_calibration_date,
            'result' => $request->result,
            'notes' => $request->notes,
            'created_by' => auth()->id(),
        ]);

        // Update tanggal kalibrasi berikutnya di tabel utama (untuk trigger notifikasi WA)
        $equipment->update([
            'next_calibration_date' => $request->next_calibration_date
        ]);

        return back()->with('success', 'Riwayat kalibrasi berhasil ditambahkan.');
    }

    public function destroy(Calibration $calibration)
    {
        // Hapus file fisik jika ada
        if ($calibration->certificate_file) {
            Storage::disk('public')->delete($calibration->certificate_file);
        }

        $calibration->delete();

        return back()->with('success', 'Data kalibrasi berhasil dihapus.');
    }
}
