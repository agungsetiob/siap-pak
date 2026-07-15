<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceSchedule;
use App\Models\Technician;
use App\Services\MaintenanceScheduleService;
use App\Services\FonnteService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceScheduleController extends Controller
{
    protected $service;
    protected $fonnteService;

    public function __construct(MaintenanceScheduleService $service, FonnteService $fonnteService)
    {
        $this->service = $service;
        $this->fonnteService = $fonnteService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $query = MaintenanceSchedule::with([
            'equipment.room',
            'technician',
            'approver',
            'executor'
        ]);

        if ($request->filled('status')) {   
            $query->where('status', $request->status);
        }

        if ($user->role === 'ruangan') {
            $query->whereHas('equipment', function ($q) use ($user) {
                $q->where('room_id', $user->room_id);
            });
        }

        $schedules = $query->orderBy('scheduled_date', 'asc')
            ->paginate(10)
            ->withQueryString();

        $technicians = Technician::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'specialization']);

        $statsQuery = MaintenanceSchedule::query();
        if ($user->role === 'ruangan') {
            $statsQuery->whereHas('equipment', function ($q) use ($user) {
                $q->where('room_id', $user->room_id);
            });
        }

        $stats = [
            'total'     => (clone $statsQuery)->count(),
            'pending'   => (clone $statsQuery)->where('status', 'menunggu')->count(),
            'completed' => (clone $statsQuery)->where('status', 'selesai')->count(),
            'overdue'   => (clone $statsQuery)->where('status', 'terlewat')->count(),
        ];

        return Inertia::render('Admin/MaintenanceSchedules/Index', [
            'schedules'   => $schedules,
            'technicians' => $technicians,
            'filters'     => $request->only(['status']),
            'stats'       => $stats,
        ]);
    }


    public function store(Request $request)
    {
        $v = $request->validate([
            'equipment_id' => 'required|exists:equipments,id',
            'technician_id' => 'required|exists:technicians,id',
            'scheduled_date' => 'required|date|after_or_equal:today',
        ]);

        $this->service->store($v);
        return back()->with('success', 'Jadwal pemeliharaan berhasil diatur.');
    }

    public function update(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        try {
            $v = $request->validate([
                'equipment_id' => 'required|exists:equipments,id',
                'technician_id' => 'required|exists:technicians,id',
                'scheduled_date' => 'required|date',
                'status' => 'required|in:menunggu,selesai,terlewat',
            ]);

            $this->service->update($maintenanceSchedule, $v);
            return back()->with('success', 'Jadwal berhasil diperbarui.');
        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'approved') {
                return back()->with('error', 'Jadwal sudah disetujui, tidak dapat diubah atau dihapus.');
            }
            throw $e;
        }
    }

    public function updateStatus(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        try {
            $v = $request->validate(['status' => 'required|in:menunggu,selesai,terlewat']);
            $this->service->updateStatus($maintenanceSchedule, $v['status']);
            return back()->with('success', 'Status pemeliharaan berhasil diubah.');
        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'approved') {
                return back()->with('error', 'Jadwal sudah disetujui, tidak dapat diubah atau dihapus.');
            }
            throw $e;
        }
    }

    public function destroy(MaintenanceSchedule $maintenanceSchedule)
    {
        try {
            $this->service->destroy($maintenanceSchedule);
            return back()->with('success', 'Jadwal pemeliharaan berhasil dihapus.');
        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'approved') {
                return back()->with('error', 'Jadwal sudah disetujui, tidak dapat dihapus.');
            }
            throw $e;
        }
    }

    public function reportForm(MaintenanceSchedule $maintenanceSchedule)
    {
        $maintenanceSchedule->load(['equipment.room', 'technician', 'approver', 'executor']);
        return Inertia::render('Admin/MaintenanceSchedules/Report', [
            'schedule' => $maintenanceSchedule
        ]);
    }

    public function saveReport(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        $user = auth()->user();

        if (empty($user->signature_path)) {
            return back()->with('error', 'Gagal. Anda wajib meng-upload tanda tangan di menu Profil terlebih dahulu.');
        }
        try {
            $v = $request->validate([
                'frequency' => 'required|in:Harian,Mingguan,Bulanan,Triwulanan,Semesteran,Tahunan',
                'checklist_results' => 'required|array',
                'maintenance_actions' => 'nullable|array',
                'action_other' => 'nullable|string',
                'result_status' => 'required|in:layak,layak_dengan_catatan,tidak_layak',
                'follow_up_notes' => 'nullable|string',
                'notes' => 'nullable|string',
                'executed_at' => 'nullable|date',
            ]);

            $this->service->saveReport($maintenanceSchedule, $v, auth()->id());
            return redirect()->route('maintenance-schedules.index')
                ->with('success', 'Laporan pemeliharaan berhasil disimpan dan jadwal diselesaikan.');
        } catch (\RuntimeException $e) {
            if ($e->getMessage() === 'approved') {
                return back()->with('error', 'Jadwal sudah disetujui, laporan tidak dapat diubah.');
            }
            throw $e;
        }
    }

    /**
     * Menampilkan halaman cetak form pemeliharaan.
     */
    public function print(MaintenanceSchedule $maintenanceSchedule)
    {
        $maintenanceSchedule->load(['equipment.room', 'technician', 'approver', 'executor']);

        return Inertia::render('Admin/MaintenanceSchedules/Print', [
            'schedule' => $maintenanceSchedule
        ]);
    }

    public function approve(MaintenanceSchedule $maintenanceSchedule)
    {
        $user = auth()->user();

        if (empty($user->signature_path)) {
            return back()->with('error', 'Gagal menyetujui. Anda wajib meng-upload tanda tangan di menu Profil terlebih dahulu.');
        }

        $maintenanceSchedule->update([
            'room_approved_at' => now(),
            'approved_by' => $user->id,
        ]);

        if ($maintenanceSchedule->executor && $maintenanceSchedule->executor->phone_number) {
            $message = "*Persetujuan Pemeliharaan SIMEDI*\n\n"
                . "Alat: {$maintenanceSchedule->equipment->name}\n"
                . "Ruangan: {$maintenanceSchedule->equipment->room->name}\n"
                . "Status: DISETUJUI\n"
                . "Disetujui oleh: {$user->name}\n\n"
                . "Terima kasih atas pelaksanaan pemeliharaan.";
            $this->fonnteService->send($maintenanceSchedule->executor->phone_number, $message);
        }

        return back()->with('success', 'Pemeliharaan alat berhasil disetujui dan ditandatangani.');
    }

}
