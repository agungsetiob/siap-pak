import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
    Package, AlertTriangle, 
    FileText, ChevronRight, CheckCircle, 
    Activity, Clock, Bell, 
    TrendingUp, Building2, User
} from 'lucide-react';

export default function Ruangan({ auth, stats, myReports, roomName, chartData }) {
    
    // Pemetaan warna berdasarkan status tiket
    const getStatusColor = (status) => {
        if (status.includes('MENUNGGU')) return '#EF4444';
        if (status.includes('DIPROSES')) return '#F59E0B';
        if (status.includes('SELESAI')) return '#10B981';
        return '#9CA3AF';
    };

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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Dashboard Ruangan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Ruangan" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4 space-y-6">

                    {/* Welcome Banner */}
                    <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl shadow-lg shadow-emerald-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl"></div>
                        <div className="relative p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                        <User className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-white/80 text-xs font-medium uppercase tracking-wider">Selamat Datang</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white">
                                    {auth.user.name}
                                </h3>
                                <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                                    Anda login sebagai user dari unit <strong className="text-white">{roomName}</strong>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <div className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                                    <p className="text-white/80 text-xs">Ruangan</p>
                                    <p className="text-white font-bold flex items-center gap-1.5">
                                        <Building2 className="w-4 h-4" />
                                        {roomName}
                                    </p>
                                </div>
                                <Link 
                                    href={route('reports.index')} 
                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl"
                                >
                                    <FileText className="w-4 h-4" />
                                    Buat Laporan
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Card 1: Total Alat */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Alat di Ruangan</p>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <p className="text-2xl font-bold text-gray-800">{stats.my_equipments}</p>
                                        <span className="text-xs text-gray-400">Unit</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: '100%' }}></div>
                            </div>
                        </div>

                        {/* Card 2: Laporan Aktif */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">Laporan Aktif</p>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <p className="text-2xl font-bold text-gray-800">{stats.my_active_reports}</p>
                                        <span className="text-xs text-gray-400">Tiket</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-orange-500/10 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${Math.min((stats.my_active_reports / (stats.my_equipments || 1)) * 100, 100)}%` }}></div>
                            </div>
                        </div>

                        {/* Card 3: Selesai */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Laporan Selesai</p>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <p className="text-2xl font-bold text-gray-800">{stats.my_completed_reports || 0}</p>
                                        <span className="text-xs text-gray-400">Tiket</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: `${Math.min(((stats.my_completed_reports || 0) / (stats.my_equipments || 1)) * 100, 100)}%` }}></div>
                            </div>
                        </div>

                        {/* Card 4: Total Laporan */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Total Laporan</p>
                                    <div className="flex items-baseline gap-1.5 mt-1">
                                        <p className="text-2xl font-bold text-gray-800">{stats.my_total_reports || 0}</p>
                                        <span className="text-xs text-gray-400">Tiket</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform duration-200">
                                    <FileText className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                            <div className="mt-3 w-full bg-gray-200/50 rounded-full h-1.5 overflow-hidden">
                                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Bar Chart - Status Tiket */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-800">Status Pemrosesan Tiket</h3>
                                </div>
                                <span className="text-xs text-gray-400">Ruangan: {roomName}</span>
                            </div>
                            <div className="p-4">
                                <div className="w-full h-64">
                                    {chartData.statusDistribution.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                                            <BarChart 
                                                data={chartData.statusDistribution} 
                                                layout="vertical" 
                                                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                            >
                                                <defs>
                                                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.8} />
                                                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.8} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                                <XAxis 
                                                    type="number" 
                                                    stroke="#9CA3AF" 
                                                    allowDecimals={false}
                                                    style={{ fontSize: '11px' }}
                                                    tickLine={false}
                                                />
                                                <YAxis 
                                                    dataKey="name" 
                                                    type="category" 
                                                    stroke="#4B5563" 
                                                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                                                    tickLine={false}
                                                    width={80}
                                                />
                                                <Tooltip 
                                                    contentStyle={{ 
                                                        backgroundColor: 'white', 
                                                        border: '1px solid #E5E7EB',
                                                        borderRadius: '8px',
                                                        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                                <Bar 
                                                    dataKey="value" 
                                                    radius={[0, 8, 8, 0]} 
                                                    maxBarSize={35}
                                                    barSize={30}
                                                    animationDuration={1500}
                                                    animationEasing="ease-in-out"
                                                >
                                                    {chartData.statusDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                            <FileText className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-sm font-medium text-gray-500">Belum ada data tiket</p>
                                            <p className="text-xs text-gray-400">Tiket akan muncul setelah Anda membuat laporan</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600">
                                    <Bell className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Informasi Cepat</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total Alat</p>
                                        <p className="text-lg font-bold text-gray-800">{stats.my_equipments} Unit</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl border border-orange-100">
                                    <div className="p-2 bg-orange-500/10 rounded-lg">
                                        <Clock className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Menunggu / Diproses</p>
                                        <p className="text-lg font-bold text-gray-800">{stats.my_active_reports} Tiket</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                                    <div className="p-2 bg-green-500/10 rounded-lg">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Selesai</p>
                                        <p className="text-lg font-bold text-gray-800">{stats.my_completed_reports || 0} Tiket</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                                    <div className="p-2 bg-purple-500/10 rounded-lg">
                                        <FileText className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Total Laporan</p>
                                        <p className="text-lg font-bold text-gray-800">{stats.my_total_reports || 0} Tiket</p>
                                    </div>
                                </div>
                                <Link 
                                    href={route('reports.index')} 
                                    className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 font-medium shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:shadow-xl"
                                >
                                    Buat Laporan Baru
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Recent Reports Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                    <FileText className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-800">Riwayat Laporan Terakhir</h3>
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
                                                Alat Kesehatan
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
                                    {myReports.map((report, index) => (
                                        <tr 
                                            key={report.id} 
                                            className={`border-b hover:bg-emerald-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                        >
                                            <td className="px-6 py-4 font-mono font-bold text-blue-600 text-sm">
                                                {report.ticket_number}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-gray-800">
                                                {report.equipment?.name}
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
                                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-xs font-medium hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all duration-200 hover:shadow-lg"
                                                >
                                                    Lihat Log
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {myReports.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="w-12 h-12 text-gray-300" />
                                                    <p className="text-gray-500 font-medium">Belum ada riwayat laporan</p>
                                                    <p className="text-gray-400 text-sm">Mulai buat laporan untuk alat di ruangan Anda</p>
                                                    <Link 
                                                        href={route('reports.index')} 
                                                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg text-sm font-medium hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 transition-all duration-200 hover:shadow-lg"
                                                    >
                                                        Buat Laporan
                                                        <ChevronRight className="w-4 h-4" />
                                                    </Link>
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
            `}</style>
        </AuthenticatedLayout>
    );
}