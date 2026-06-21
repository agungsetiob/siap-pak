<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\Equipment;
use App\Services\FonnteService;

#[Signature('app:send-calibration-reminder')]
#[Description('Send calibration reminder notifications via WhatsApp')]
class SendCalibrationReminder extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $fonnte = app(FonnteService::class);
        $adminPhone = config('services.fonnte.admin_phone');

        if (! $adminPhone) {
            $this->error('Admin phone number is not configured.');

            return self::FAILURE;
        }

        $equipmentsH30 = Equipment::with('room')
            ->whereDate('next_calibration_date', now()->addDays(30))
            ->get();

        $equipmentsH7 = Equipment::with('room')
            ->whereDate('next_calibration_date', now()->addDays(7))
            ->get();

        $message = '';

        if ($equipmentsH30->isNotEmpty()) {
            $message .= "*PENGINGAT KALIBRASI (H-30)*\n";

            foreach ($equipmentsH30 as $equipment) {
                $message .= sprintf(
                    "- %s (%s) di Ruang %s\n",
                    $equipment->name,
                    $equipment->inventory_number,
                    $equipment->room?->name ?? '-'
                );
            }

            $message .= "\n";
        }

        if ($equipmentsH7->isNotEmpty()) {
            $message .= "*PERINGATAN KALIBRASI (H-7)*\n";

            foreach ($equipmentsH7 as $equipment) {
                $message .= sprintf(
                    "- %s (%s) di Ruang %s\n",
                    $equipment->name,
                    $equipment->inventory_number,
                    $equipment->room?->name ?? '-'
                );
            }
        }

        if ($message === '') {
            $this->info('No calibration reminders to send.');

            return self::SUCCESS;
        }

        $header = "⚠️ *Sistem Notifikasi SIMAK*\n\n";

        $footer = "\n\nMohon segera mempersiapkan dokumen dan menghubungi vendor terkait.";

        $fonnte->sendMessage(
            $adminPhone,
            $header . $message . $footer
        );

        $this->info('Calibration reminder sent successfully.');

        return self::SUCCESS;
    }
}
