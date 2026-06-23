<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\Equipment;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ReportController extends Controller
{
    public function __construct(protected ReportService $reportService) {}

    public function index()
    {
        $user = Auth::user();

        $query = Report::with(['equipment.room', 'reporter', 'progressLogs.user'])->latest();

        if ($user->role === 'ruangan') {
            $query->where('reported_by', $user->id);

            $equipments = Equipment::where('room_id', $user->room_id)->get(['id', 'name', 'inventory_number']);
        } else {
            $equipments = Equipment::with('room')->get(['id', 'name', 'inventory_number', 'room_id']);
        }

        $reports = $query->paginate(10);

        return Inertia::render('Reports/Index', [
            'reports' => $reports,
            'equipments' => $equipments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'equipment_id' => 'required|exists:equipments,id',
            'type' => 'required|in:kerusakan,pemeliharaan',
            'description' => 'required|string',
        ]);

        $this->reportService->createReport($request->all(), Auth::user());

        return redirect()->back()->with('success', 'Laporan berhasil dibuat dan diteruskan ke Teknisi.');
    }

    public function updateProgress(Request $request, Report $report)
    {
        $request->validate([
            'status' => 'required|in:diproses,selesai,dibatalkan',
            'notes' => 'required|string',
            'action_taken' => 'nullable|string',
            'external_technician' => 'nullable|string',
            'cost' => 'nullable|integer',
        ]);

        $this->reportService->updateProgress($report, $request->all(), Auth::user());

        return redirect()->back()->with('success', 'Progress laporan berhasil diperbarui dan notifikasi telah dikirim.');
    }

    public function show(Report $report)
    {
        $report->load(['equipment.room', 'reporter.room', 'progressLogs.user', 'calibrationData']);

        if (Auth::user()->role === 'ruangan' && $report->reported_by !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses untuk melihat tiket laporan ruangan lain.');
        }

        return Inertia::render('Reports/Show', [
            'report' => $report,
        ]);
    }

    public function approve(Request $request, Report $report)
    {
        $user = auth()->user();

        if (empty($user->signature_path)) {
            return back()->withErrors(['error' => 'Gagal menyetujui. Anda wajib meng-upload tanda tangan di menu Profil terlebih dahulu.']);
        }

        $report->update([
            'room_approved_at' => now(),
        ]);

        $report->progressLogs()->create([
            'updated_by' => $user->id,
            'status_snapshot' => 'disetujui_ruangan',
            'notes' => 'Pihak ruangan telah memverifikasi alat dan menyetujui hasil perbaikan.',
        ]);

        return back()->with('success', 'Laporan berhasil disetujui dan ditandatangani.');
    }

    public function print(Report $report)
    {
        $report->load(['equipment.room', 'reporter.room', 'progressLogs.user']);

        return Inertia::render('Reports/Print', [
            'report' => $report,
        ]);
    }
}
