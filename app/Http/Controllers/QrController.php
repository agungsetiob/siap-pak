<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\EquipmentQr;
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

        // --- LOGIKA WARNING KALIBRASI DINAMIS (ACUAN: TABEL EQUIPMENTS) ---
        $calibrationWarning = false;
        $daysToCalibration = null;
        $warningMessage = '';

        // Kita langsung cek dari data master alat, bukan dari relasi calibrations
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
            // Jika kosong di tabel peralatan
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

        $qrImage = QrCode::format('svg')
            ->size(300)
            ->errorCorrection('H')
            ->merge(public_path('logo_tanbu.png'), 0.25, true)
            ->generate($scanUrl);

        return response($qrImage)->header('Content-Type', 'image/svg+xml');
    }
}
