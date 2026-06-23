<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use App\Models\MaintenanceSchedule;
use App\Services\FonnteService;
use Carbon\Carbon;

#[Signature('app:send-maintenance-w-a')]
#[Description('Command description')]
class SendMaintenanceWA extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(FonnteService $fonnteService)
    {
        $schedules = MaintenanceSchedule::with(['equipment.room', 'technician'])
            ->whereDate('scheduled_date', Carbon::today())
            ->where('status', 'menunggu')
            ->get();

        if ($schedules->isEmpty()) {
            $this->info('Tidak ada jadwal pemeliharaan hari ini.');
            return;
        }

        foreach ($schedules as $schedule) {
            $teknisi = $schedule->technician;
            $alat = $schedule->equipment;
            $ruangan = $alat->room ? $alat->room->name : 'Gudang/Awal';

            $message = "*PENGINGAT PEMELIHARAAN ALAT (SIMAK)* 🏥\n\n";
            $message .= "Halo sdr/i *{$teknisi->name}*,\n";
            $message .= "Hari ini Anda memiliki jadwal pemeliharaan alat kesehatan dengan rincian:\n\n";
            $message .= "🛠️ *Nama Alat:* {$alat->name}\n";
            $message .= "📇 *No. Inventaris:* {$alat->inventory_number}\n";
            $message .= "📍 *Lokasi/Ruangan:* {$ruangan}\n\n";
            $message .= "Mohon segera dilakukan pengecekan dan *update status* di dalam sistem. Terima kasih!\n\n";
            $message .= "_Pesan ini dikirim otomatis oleh SIMAK RSUD DHAAN";

            $response = $fonnteService->send($teknisi->phone_number, $message);

            if ($response['success']) {
                $this->info("Berhasil mengirim pesan ke {$teknisi->name} ({$teknisi->phone_number})");
            } else {
                $this->error("Gagal kirim WA ke {$teknisi->name}. Silakan cek Log Laravel.");
            }
        }

        $this->info('Proses pengiriman WA selesai.');
    }
}
