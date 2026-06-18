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

        // Logika pemisahan data berdasarkan Role
        if ($user->role === 'ruangan') {
            // Ruangan hanya melihat laporannya sendiri
            $query->where('reported_by', $user->id);

            // Siapkan data alat HANYA yang ada di ruangan tersebut untuk form dropdown
            $equipments = Equipment::where('room_id', $user->room_id)->get(['id', 'name', 'inventory_number']);
        } else {
            // Admin melihat semua alat dari semua ruangan
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
        // Hanya ruangan yang bisa membuat laporan (sesuaikan dengan kebijakan)
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
        // Pastikan route ini dilindungi middleware admin
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

    // Tambahkan method ini di dalam ReportController
    public function show(Report $report)
    {
        // Load semua relasi yang dibutuhkan untuk halaman detail
        $report->load(['equipment.room', 'reporter.room', 'progressLogs.user', 'calibrationData']);

        // Otorisasi: Jika yang login adalah 'ruangan', pastikan itu laporannya sendiri
        if (Auth::user()->role === 'ruangan' && $report->reported_by !== Auth::id()) {
            abort(403, 'Anda tidak memiliki akses untuk melihat tiket laporan ruangan lain.');
        }

        return Inertia::render('Reports/Show', [
            'report' => $report,
        ]);
    }
}
