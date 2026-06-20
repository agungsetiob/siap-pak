import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Admin({ auth, stats, recentReports, chartData }) {
    
    // Warna untuk Pie Chart Kondisi Alat
    const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

    const getStatusBadge = (status) => {
        const styles = {
            menunggu: 'bg-red-100 text-red-800',
            diproses: 'bg-yellow-100 text-yellow-800',
        };
        return (
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Manajemen SIMAK</h2>}
        >
            <Head title="Dashboard Admin - SIMAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Banner Selamat Datang */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white flex justify-between items-center">
                        <div>
                            <h3 className="text-2xl font-bold mb-1">Selamat Datang, {auth.user.name}!</h3>
                            <p className="text-blue-100 text-sm">Sistem Informasi Perbaikan Alat Kesehatan RSUD dr. H. Andi Abdurrahman Noor.</p>
                        </div>
                    </div>

                    {/* Grid Kartu Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Total Inventaris</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total_equipments} <span className="text-sm font-normal text-gray-500">Alat</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
                            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Alat Rusak</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.equipments_rusak} <span className="text-sm font-normal text-gray-500">Unit</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
                            <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Tiket Menunggu</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.reports_pending} <span className="text-sm font-normal text-gray-500">Laporan</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
                            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Sedang Dikerjakan</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.reports_processing} <span className="text-sm font-normal text-gray-500">Laporan</span></p>
                            </div>
                        </div>
                    </div>

                    {/* --- KELOMPOK GRAFIK / CHART VISUALISASI --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Grafik Garis Tren Laporan */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-md font-bold text-gray-800 mb-4">Tren Laporan Masuk Bulanan</h3>
                            <div className="w-full h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                                        <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="Jumlah Laporan" stroke="#2563EB" strokeWidth={3} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Grafik Lingkaran Kondisi Aset */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-between">
                            <h3 className="text-md font-bold text-gray-800 mb-2">Status Kondisi Aset Alkes</h3>
                            <div className="w-full h-56 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData.conditionDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {chartData.conditionDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* Legenda Manual Pie Chart */}
                            <div className="grid grid-cols-3 text-center text-xs pt-4 border-t border-gray-50">
                                {chartData.conditionDistribution.map((item, index) => (
                                    <div key={index}>
                                        <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                        <span className="text-gray-500 block truncate">{item.name}</span>
                                        <span className="font-bold text-gray-800">{item.value} Unit</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tabel Laporan Butuh Tindakan */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Tiket Terbaru (Butuh Tindakan)</h3>
                            <Link href={route('reports.index')} className="text-sm text-blue-600 hover:underline">Lihat Semua</Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">No. Tiket</th>
                                        <th className="px-6 py-3">Alat & Ruangan</th>
                                        <th className="px-6 py-3">Keluhan</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentReports.map(report => (
                                        <tr key={report.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono text-blue-600">{report.ticket_number}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{report.equipment?.name}</div>
                                                <div className="text-xs text-gray-500">{report.equipment?.room?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 truncate max-w-xs" title={report.description}>{report.description}</td>
                                            <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('reports.show', report.id)} className="px-3 py-1 bg-gray-800 text-white rounded text-xs hover:bg-gray-700">
                                                    Tindak Lanjuti
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {recentReports.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Semua laporan telah terselesaikan. Kerja bagus!</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}