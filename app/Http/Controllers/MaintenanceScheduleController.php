<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceSchedule;
use App\Models\Equipment;
use App\Models\Technician;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaintenanceScheduleController extends Controller
{
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

        MaintenanceSchedule::create($v);
        return back()->with('success', 'Jadwal pemeliharaan berhasil diatur.');
    }

    public function update(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        $v = $request->validate([
            'equipment_id' => 'required|exists:equipments,id',
            'technician_id' => 'required|exists:technicians,id',
            'scheduled_date' => 'required|date',
            'status' => 'required|in:menunggu,selesai,terlewat',
        ]);

        $maintenanceSchedule->update($v);
        return back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function updateStatus(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        $v = $request->validate(['status' => 'required|in:menunggu,selesai,terlewat']);
        $maintenanceSchedule->update(['status' => $v['status']]);
        return back()->with('success', 'Status pemeliharaan berhasil diubah.');
    }

    public function destroy(MaintenanceSchedule $maintenanceSchedule)
    {
        $maintenanceSchedule->delete();
        return back()->with('success', 'Jadwal pemeliharaan berhasil dihapus.');
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

        $v['status'] = 'selesai';
        $v['executed_by'] = auth()->id();
        $v['executed_at'] = now();

        $maintenanceSchedule->update($v);

        return redirect()->route('maintenance-schedules.index')
            ->with('success', 'Laporan pemeliharaan berhasil disimpan dan jadwal diselesaikan.');
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

    public function approve(Request $request, MaintenanceSchedule $maintenanceSchedule)
    {
        $user = auth()->user();

        if (empty($user->signature_path)) {
            return back()->withErrors(['error' => 'Gagal menyetujui. Anda wajib meng-upload tanda tangan di menu Profil terlebih dahulu.']);
        }

        $maintenanceSchedule->update([
            'room_approved_at' => now(),
            'approved_by' => $user->id,
        ]);

        return back()->with('success', 'Pemeliharaan alat berhasil disetujui dan ditandatangani.');
    }
}
