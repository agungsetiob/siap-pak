import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer, 
    PieChart, Pie, Cell 
} from 'recharts';
import { formatRupiah } from '@/Helpers/rupiah';
import { 
    Package, AlertTriangle, 
    Clock, TrendingUp, Building2,
    FileText, ChevronRight, CheckCircle,
    Activity, PieChart as PieChartIcon,
    DollarSign, Truck, Shield
} from 'lucide-react';

export default function Admin({ auth, stats, recentReports, chartData, investments }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const conditionColors = {
        'Baik / Laik': '#10B981',   // Hijau
        'Rusak Ringan': '#F59E0B',  // Oranye
        'Rusak Berat': '#EF4444',   // Merah
    };

    const conditionOrder = ['Baik / Laik', 'Rusak Ringan', 'Rusak Berat'];

    const formattedPieData = [...chartData.conditionDistribution]
        .sort((a, b) => conditionOrder.indexOf(a.name) - conditionOrder.indexOf(b.name))
        .map(item => ({
            ...item,
            fill: conditionColors[item.name] || '#9CA3AF' // Fallback abu-abu jika tidak cocok
        }));

    const getStatusBadge = (status) => {
        const styles = {
            menunggu: 'bg-red-100 text-red-800 border-red-200',
            diproses: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            selesai: 'bg-green-100 text-green-800 border-green-200',
            dibatalkan: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        const icons = {
            menunggu: <AlertTriangle className="w-3.5 h-3.5" />,
            diproses: <Clock className="w-3.5 h-3.5" />,
            selesai: <CheckCircle className="w-3.5 h-3.5" />,
            dibatalkan: <Activity className="w-3.5 h-3.5" />,
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status]}`}>
                {icons[status]}
                {status}
            </span>
        );
    };

    // Stat cards configuration
    const statCards = [
        {
            title: 'Total Inventaris',
            value: stats.total_equipments,
            suffix: 'Alat',
            icon: Package,
            color: 'blue',
            bg: 'from-blue-50 to-indigo-50',
            border: 'border-blue-100',
            iconBg: 'bg-blue-500/10',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Alat Rusak',
            value: stats.equipments_rusak,
            suffix: 'Unit',
            icon: AlertTriangle,
            color: 'red',
            bg: 'from-red-50 to-rose-50',
            border: 'border-red-100',
            iconBg: 'bg-red-500/10',
            iconColor: 'text-red-600'
        },
        {
            title: 'Tiket Menunggu',
            value: stats.reports_pending,
            suffix: 'Laporan',
            icon: Clock,
            color: 'orange',
            bg: 'from-orange-50 to-amber-50',
            border: 'border-orange-100',
            iconBg: 'bg-orange-500/10',
            iconColor: 'text-orange-600'
        },
        {
            title: 'Sedang Dikerjakan',
            value: stats.reports_processing,
            suffix: 'Laporan',
            icon: Activity,
            color: 'yellow',
            bg: 'from-yellow-50 to-amber-50',
            border: 'border-yellow-100',
            iconBg: 'bg-yellow-500/10',
            iconColor: 'text-yellow-600'
        }
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Dashboard Manajemen
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-2 lg:px-2 space-y-6">

                    {/* Welcome Banner */}
                    <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-blue-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
                        <div className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <Shield className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Selamat Datang</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    {auth.user.name}
                                </h3>
                                <p className="text-blue-100 text-sm mt-1 max-w-xl">
                                    Sistem Informasi Maintenance Medical Device RSUD dr. H. Andi Abdurrahman Noor.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <p className="text-white/80 text-xs">Hari Ini</p>
                                    <p className="text-white font-bold">{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <p className="text-white/80 text-xs">Laporan</p>
                                    <p className="text-white font-bold">{stats.total_reports || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statCards.map((card, index) => {
                            const Icon = card.icon;
                            return (
                                <div
                                    key={index}
                                    className={`bg-gradient-to-br ${card.bg} rounded-2xl p-5 border ${card.border} hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                                            <div className="flex items-baseline gap-1.5 mt-1">
                                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                                                <span className="text-xs text-gray-400">{card.suffix}</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-xl ${card.iconBg} group-hover:scale-110 transition-transform duration-200`}>
                                            <Icon className={`w-6 h-6 ${card.iconColor}`} />
                                        </div>
                                    </div>
                                    <div className="mt-3 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full bg-gradient-to-r ${
                                                card.color === 'blue' ? 'from-blue-500 to-indigo-500' :
                                                card.color === 'red' ? 'from-red-500 to-rose-500' :
                                                card.color === 'orange' ? 'from-orange-500 to-amber-500' :
                                                'from-yellow-500 to-amber-500'
                                            }`}
                                            style={{ width: `${Math.min((card.value / (stats.total_equipments || 1)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Line Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-800">Tren Laporan Masuk Bulanan</h3>
                                </div>
                                <span className="text-xs text-gray-400">2026</span>
                            </div>
                            <div className="p-4">
                                <div className="w-full h-72">
                                    {mounted && (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="0%" stopColor="#2563EB" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={1} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '11px' }} tickLine={false} />
                                            <YAxis stroke="#9CA3AF" style={{ fontSize: '11px' }} allowDecimals={false} tickLine={false} />
                                            <Tooltip 
                                                contentStyle={{ 
                                                    backgroundColor: 'white', 
                                                    border: '1px solid #E5E7EB',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                }}
                                            />
                                            <Legend />
                                            <Line 
                                                type="monotone" 
                                                dataKey="Jumlah Laporan" 
                                                stroke="url(#lineGradient)" 
                                                strokeWidth={3} 
                                                activeDot={{ r: 8, fill: '#2563EB' }}
                                                dot={{ fill: '#2563EB', strokeWidth: 2 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Pie Chart */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex items-center gap-2">
                                <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                                    <PieChartIcon className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Status Kondisi Aset</h3>
                            </div>
                            <div className="p-4 flex flex-col items-center">
                                <div className="w-full h-56">
                                    {mounted && (
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <PieChart>
                                                <Pie
                                                    data={formattedPieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={4}
                                                    dataKey="value"
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'white', 
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                                <div className="grid grid-cols-3 gap-2 w-full mt-2 pt-3 border-t border-gray-100">
                                    {formattedPieData.map((item, index) => (
                                        <div key={index} className="text-center">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></span>
                                                <span className="text-xs text-gray-500 truncate">{item.name}</span>
                                            </div>
                                            <span className="text-sm font-bold text-gray-800">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Investment Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">Total Nilai Investasi Alat Kesehatan</h3>
                                    <p className="text-green-100 text-sm">Akumulasi keseluruhan aset yang terdaftar di sistem</p>
                                </div>
                            </div>
                            <div className="text-3xl font-extrabold text-white tracking-tight bg-white/10 px-5 py-2 rounded-xl backdrop-blur-sm border border-white/20">
                                {formatRupiah(investments.total)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                            {/* Per Ruangan */}
                            <div className="p-6">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-green-600" />
                                    Distribusi Per Ruangan
                                </h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {investments.perRoom.map((room) => (
                                        <div key={room.id} className="flex justify-between items-center border-b border-gray-50 pb-2.5 hover:bg-gray-50/50 px-2 py-1 rounded-lg transition-colors">
                                            <span className="text-sm font-medium text-gray-700">{room.name}</span>
                                            <span className="text-sm font-bold text-green-700">{formatRupiah(room.total_investment)}</span>
                                        </div>
                                    ))}
                                    {investments.perRoom.length === 0 && (
                                        <p className="text-sm text-gray-500 italic text-center py-4">Belum ada data harga alat per ruangan</p>
                                    )}
                                </div>
                            </div>

                            {/* Per Vendor */}
                            <div className="p-6">
                                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-blue-600" />
                                    Distribusi Per Vendor
                                </h4>
                                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                                    {investments.perVendor.map((vendor) => (
                                        <div key={vendor.id} className="flex justify-between items-center border-b border-gray-50 pb-2.5 hover:bg-gray-50/50 px-2 py-1 rounded-lg transition-colors">
                                            <span className="text-sm font-medium text-gray-700">{vendor.name}</span>
                                            <span className="text-sm font-bold text-blue-700">{formatRupiah(vendor.total_investment)}</span>
                                        </div>
                                    ))}
                                    {investments.perVendor.length === 0 && (
                                        <p className="text-sm text-gray-500 italic text-center py-4">Belum ada data harga alat dari vendor</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Tiket Terbaru</h3>
                            </div>
                            <Link 
                                href={route('reports.index')} 
                                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                            >
                                Lihat Semua
                                <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-3.5 h-3.5" />
                                                No. Tiket
                                            </div>
                                        </th>
                                        <th className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Package className="w-3.5 h-3.5" />
                                                Alat & Ruangan
                                            </div>
                                        </th>
                                        <th className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-3.5 h-3.5" />
                                                Keluhan
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-center">Status</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map((report, index) => (
                                        <tr 
                                            key={report.id} 
                                            className={`border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                        >
                                            <td className="px-6 py-4 font-mono font-bold text-blue-600 text-sm">
                                                {report.ticket_number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">{report.equipment?.name}</div>
                                                <div className="text-xs text-gray-400">{report.equipment?.room?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="truncate max-w-xs" title={report.description}>
                                                    {report.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(report.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link 
                                                    href={route('reports.show', report.id)} 
                                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-medium hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20 transition-all duration-200 hover:shadow-lg"
                                                >
                                                    Tindak Lanjuti
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentReports.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle className="w-12 h-12 text-green-400" />
                                                    <p className="text-gray-500 font-medium">Semua laporan telah terselesaikan</p>
                                                    <p className="text-gray-400 text-sm">Kerja bagus! Tidak ada tiket yang pending</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </AuthenticatedLayout>
    );
}