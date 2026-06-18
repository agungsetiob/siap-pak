<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Report;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return $this->adminDashboard();
        }

        return $this->ruanganDashboard($user);
    }

    private function adminDashboard()
    {
        $stats = [
            'total_equipments' => Equipment::count(),
            'equipments_rusak' => Equipment::whereIn('condition', ['rusak_ringan', 'rusak_berat'])->count(),
            'reports_pending' => Report::where('status', 'menunggu')->count(),
            'reports_processing' => Report::where('status', 'diproses')->count(),
        ];

        $recentReports = Report::with(['equipment.room', 'reporter'])
            ->whereIn('status', ['menunggu', 'diproses'])
            ->latest()
            ->take(5)
            ->get();

        // 1. Grafik Tren Laporan Bulanan (6 Bulan Terakhir)
        $monthlyTrends = Report::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month_year, DATE_FORMAT(created_at, '%b') as month_name, COUNT(*) as total")
            ->groupBy('month_year', 'month_name')
            ->orderBy('month_year', 'asc')
            ->take(6)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->month_name,
                    'Jumlah Laporan' => $item->total,
                ];
            });

        // 2. Grafik Komposisi Kondisi Alat Kesehatan
        $conditionDistribution = Equipment::selectRaw("`condition`, COUNT(*) as total")
            ->groupBy('condition')
            ->get()
            ->map(function ($item) {
                $labels = [
                    'baik' => 'Baik / Laik',
                    'rusak_ringan' => 'Rusak Ringan',
                    'rusak_berat' => 'Rusak Berat',
                ];
                return [
                    'name' => $labels[$item->condition] ?? $item->condition,
                    'value' => $item->total,
                ];
            });

        return Inertia::render('Dashboard/Admin', [
            'stats' => $stats,
            'recentReports' => $recentReports,
            'chartData' => [
                'monthlyTrends' => $monthlyTrends,
                'conditionDistribution' => $conditionDistribution,
            ]
        ]);
    }

    private function ruanganDashboard($user)
    {
        $stats = [
            'my_equipments' => Equipment::where('room_id', $user->room_id)->count(),
            'my_active_reports' => Report::where('reported_by', $user->id)
                                         ->whereIn('status', ['menunggu', 'diproses'])
                                         ->count(),
        ];

        $myReports = Report::with('equipment')
            ->where('reported_by', $user->id)
            ->latest()
            ->take(5)
            ->get();

        // Grafik Status Tiket Khusus Ruangan Ini
        $statusDistribution = Report::where('reported_by', $user->id)
            ->selectRaw("status, COUNT(*) as total")
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => strtoupper($item->status),
                    'value' => $item->total,
                ];
            });

        return Inertia::render('Dashboard/Ruangan', [
            'stats' => $stats,
            'myReports' => $myReports,
            'roomName' => $user->room->name ?? 'Ruangan',
            'chartData' => [
                'statusDistribution' => $statusDistribution
            ]
        ]);
    }
}