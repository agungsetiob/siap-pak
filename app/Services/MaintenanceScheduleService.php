<?php

namespace App\Services;

use App\Models\MaintenanceSchedule;
use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MaintenanceScheduleService
{
    public function __construct(protected FonnteService $fonnteService) {}
    protected function ensureNotApproved(MaintenanceSchedule $schedule)
    {
        if ($schedule->room_approved_at && $schedule->approved_by) {
            throw new \RuntimeException('approved');
        }
    }

    public function store(array $data)
    {
        return MaintenanceSchedule::create($data);
    }

    public function update(MaintenanceSchedule $schedule, array $data)
    {
        $this->ensureNotApproved($schedule);
        $schedule->update($data);
        return $schedule;
    }

    public function updateStatus(MaintenanceSchedule $schedule, string $status)
    {
        $this->ensureNotApproved($schedule);
        $schedule->update(['status' => $status]);
        return $schedule;
    }

    public function destroy(MaintenanceSchedule $schedule)
    {
        $this->ensureNotApproved($schedule);
        return $schedule->delete();
    }

    public function saveReport(MaintenanceSchedule $schedule, array $data, int $userId)
    {
        $this->ensureNotApproved($schedule);

        return DB::transaction(function () use ($schedule, $data, $userId) {
            $data['status'] = 'selesai';
            $data['executed_by'] = $userId;
            $data['executed_at'] = now();

            $schedule->update($data);

            $admins = User::where('role', 'admin')->get();
            Notification::send($admins, new SystemNotification(
                'Laporan Pemeliharaan Selesai',
                "Jadwal {$schedule->id} untuk alat {$schedule->equipment->name} telah diselesaikan.",
                route('maintenance-schedules.report', $schedule->id)
            ));

            if ($schedule->equipment && $schedule->equipment->room) {
                $roomUser = $schedule->equipment->room->users()
                    ->where('role', 'ruangan')
                    ->first();

                if ($roomUser) {
                    $roomUser->notify(new SystemNotification(
                        'Laporan Pemeliharaan Selesai',
                        "Alat {$schedule->equipment->name} di ruangan {$schedule->equipment->room->name} telah selesai diperiksa.",
                        route('maintenance-schedules.report', $schedule->id)
                    ));

                    if ($roomUser->phone_number) {
                        $notes = $data['notes'] ?? 'Tidak ada catatan tambahan.';
                        $message = "*Update Pemeliharaan SIMEDI*\n\n"
                            . "Alat: {$schedule->equipment->name}\n"
                            . "Ruangan: {$schedule->equipment->room->name}\n"
                            . "Hasil: {$schedule->result_status}\n"
                            . "Status: SELESAI\n"
                            . "Catatan: {$notes}\n\n";
                        $this->fonnteService->send($roomUser->phone_number, $message);
                    }
                }
            }

            return $schedule;
        });
    }
}
