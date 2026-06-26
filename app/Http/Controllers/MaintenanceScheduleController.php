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
        $query = MaintenanceSchedule::with([
            'equipment.room',
            'technician'
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $schedules = $query->orderBy('scheduled_date', 'asc')
            ->paginate(10)
            ->withQueryString();

        $technicians = Technician::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'specialization']);

        $statsQuery = MaintenanceSchedule::selectRaw('
        COUNT(*) as total,
        SUM(IF(status = "menunggu", 1, 0)) as pending,
        SUM(IF(status = "selesai", 1, 0)) as completed,
        SUM(IF(status = "terlewat", 1, 0)) as overdue
    ')->first();

        $stats = [
            'total'     => (int) $statsQuery->total,
            'pending'   => (int) $statsQuery->pending,
            'completed' => (int) $statsQuery->completed,
            'overdue'   => (int) $statsQuery->overdue,
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
            'notes' => 'nullable|string',
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
            'notes' => 'nullable|string',
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
}
