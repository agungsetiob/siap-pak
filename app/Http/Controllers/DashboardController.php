<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Cek role user, lempar ke dashboard yang sesuai
        if ($user->role === 'admin') {
            return $this->adminDashboard();
        }

        return $this->ruanganDashboard($user);
    }

    private function adminDashboard()
    {
        // Statistik untuk Admin/Manajemen
        $stats = [
            'total_equipments' => Equipment::count(),
            'equipments_rusak' => Equipment::whereIn('condition', ['rusak_ringan', 'rusak_berat'])->count(),
            'reports_pending' => Report::where('status', 'menunggu')->count(),
            'reports_processing' => Report::where('status', 'diproses')->count(),
        ];

        // 5 Laporan terbaru yang butuh tindakan (Menunggu / Diproses)
        $recentReports = Report::with(['equipment.room', 'reporter'])
            ->whereIn('status', ['menunggu', 'diproses'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'recentReports' => $recentReports,
        ]);
    }

    private function ruanganDashboard($user)
    {
        // Statistik khusus ruangan yang login
        $stats = [
            'my_equipments' => Equipment::where('room_id', $user->room_id)->count(),
            'my_active_reports' => Report::where('reported_by', $user->id)
                                         ->whereIn('status', ['menunggu', 'diproses'])
                                         ->count(),
        ];

        // 5 Laporan terakhir dari ruangan ini
        $myReports = Report::with('equipment')
            ->where('reported_by', $user->id)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Ruangan', [
            'stats' => $stats,
            'myReports' => $myReports,
            'roomName' => $user->room->name ?? 'Ruangan',
        ]);
    }
}