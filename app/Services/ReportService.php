<?php

namespace App\Services;

use App\Models\Report;
use App\Models\ReportProgress;
use App\Models\User;
use App\Notifications\SystemNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class ReportService
{
    public function __construct(protected FonnteService $fonnteService) {}

    public function createReport(array $data, User $reporter): Report
    {
        return DB::transaction(function () use ($data, $reporter) {
            $ticketNumber = 'REP-' . date('Ymd') . '-' . strtoupper(str()->random(4));

            $report = Report::create([
                'ticket_number' => $ticketNumber,
                'equipment_id' => $data['equipment_id'],
                'reported_by' => $reporter->id,
                'type' => $data['type'],
                'description' => $data['description'],
                'status' => 'menunggu',
            ]);

            ReportProgress::create([
                'report_id' => $report->id,
                'updated_by' => $reporter->id,
                'status_snapshot' => 'menunggu',
                'notes' => 'Laporan dibuat oleh ruangan.',
            ]);

            // --- 1. NOTIFIKASI INTERNAL KE SEMUA ADMIN ---
            $admins = User::where('role', 'admin')->get();
            Notification::send($admins, new SystemNotification(
                'Laporan Baru Masuk',
                "Tiket {$ticketNumber} dari " . ($reporter->room->name ?? 'N/A'),
                route('reports.show', $report->id)
            ));

            $adminPhone = config('services.fonnte.admin_phone');
            $message = "*Laporan Baru SIMAK*\n\n"
                . "Tiket: {$ticketNumber}\n"
                . "Ruangan: " . ($reporter->room->name ?? 'N/A') . "\n"
                . "Kendala: {$data['description']}\n\n"
                . "Mohon segera ditindaklanjuti.";

            $this->fonnteService->send($adminPhone, $message);

            return $report;
        });
    }

    public function updateProgress(Report $report, array $data, User $admin): Report
    {
        return DB::transaction(function () use ($report, $data, $admin) {
            $report->update([
                'status' => $data['status'],
                'action_taken' => $data['action_taken'] ?? $report->action_taken,
                'external_technician' => $data['external_technician'] ?? $report->external_technician,
                'cost' => $data['cost'] ?? $report->cost,
                'resolved_at' => $data['status'] === 'selesai' ? now() : $report->resolved_at,
            ]);

            ReportProgress::create([
                'report_id' => $report->id,
                'updated_by' => $admin->id,
                'status_snapshot' => $data['status'],
                'notes' => $data['notes'],
            ]);

            // --- 1. NOTIFIKASI INTERNAL KE RUANGAN PELAPOR ---
            $report->reporter->notify(new SystemNotification(
                'Status Laporan Diperbarui',
                "Tiket {$report->ticket_number} kini berstatus: " . strtoupper($data['status']),
                route('reports.show', $report->id)
            ));

            // --- 2. NOTIFIKASI WA KE RUANGAN PELAPOR ---
            if ($report->reporter->phone_number) {
                $statusText = strtoupper($data['status']);
                $message = "*Update Status SIMAK*\n\nTiket: {$report->ticket_number}\nStatus saat ini: *{$statusText}*\nCatatan Admin: {$data['notes']}";
                $this->fonnteService->send($report->reporter->phone_number, $message);
            }

            return $report;
        });
    }
}
