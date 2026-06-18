<?php

use Illuminate\Support\Facades\Schedule;
use App\Models\Equipment;
use App\Services\FonnteService;

Schedule::call(function () {
    $fonnte = app(FonnteService::class);
    $adminPhone = config('services.fonnte.admin_phone');

    // Cek H-30 Kalibrasi
    $equipmentsH30 = Equipment::whereDate('next_calibration_date', now()->addDays(30))->get();
    
    // Cek H-7 Kalibrasi
    $equipmentsH7 = Equipment::whereDate('next_calibration_date', now()->addDays(7))->get();

    $message = "";

    if ($equipmentsH30->count() > 0) {
        $message .= "*PENGINGAT KALIBRASI (H-30)*\n";
        foreach ($equipmentsH30 as $eq) {
            $message .= "- {$eq->name} ({$eq->inventory_number}) di Ruang {$eq->room->name}\n";
        }
        $message .= "\n";
    }

    if ($equipmentsH7->count() > 0) {
        $message .= "*PERINGATAN KALIBRASI (H-7)*\n";
        foreach ($equipmentsH7 as $eq) {
            $message .= "- {$eq->name} ({$eq->inventory_number}) di Ruang {$eq->room->name}\n";
        }
    }

    if ($message !== "") {
        $header = "⚠️ *Sistem Notifikasi SIAP PAK*\n\n";
        $footer = "\nMohon segera persiapkan dokumen dan hubungi vendor terkait.";
        $fonnte->sendMessage($adminPhone, $header . $message . $footer);
    }
})->dailyAt('08:00');