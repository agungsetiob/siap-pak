import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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
            menunggu: 'bg-red-100 text-red-800',
            diproses: 'bg-yellow-100 text-yellow-800',
            selesai: 'bg-green-100 text-green-800',
            dibatalkan: 'bg-gray-100 text-gray-800',
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Ruangan</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4 space-y-3">
                    
                    {/* Banner */}
                    <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-600 p-6 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Halo, {auth.user.name}!</h3>
                            <p className="text-gray-500 mt-1">Anda login sebagai perwakilan dari unit <strong className="text-blue-600">{roomName}</strong>.</p>
                        </div>
                        <Link href={route('reports.index')} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold hidden md:block">
                            + Buat Laporan Kerusakan
                        </Link>
                    </div>

                    {/* Layout Grid Utama */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Kolom Kiri: Kartu Statistik Ringkas */}
                        <div className="space-y-6 lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
                                <div className="p-4 rounded-full bg-blue-50 text-blue-600 mr-5">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Alat di Ruangan Anda</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.my_equipments} <span className="text-base font-normal text-gray-500">Unit</span></p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 flex items-center">
                                <div className="p-4 rounded-full bg-orange-50 text-orange-600 mr-5">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Laporan Sedang Aktif</p>
                                    <p className="text-3xl font-bold text-gray-900">{stats.my_active_reports} <span className="text-base font-normal text-gray-500">Tiket</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Grafik Status Tiket Ruangan */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-md font-bold text-gray-800 mb-4">Status Pemrosesan Tiket Ruangan</h3>
                            <div className="w-full h-44">
                                {chartData.statusDistribution.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData.statusDistribution} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" stroke="#9CA3AF" allowDecimals={false} />
                                            <YAxis dataKey="name" type="category" stroke="#4B5563" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                            <Tooltip />
                                            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30}>
                                                {chartData.statusDistribution.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={getStatusColor(entry.name)} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">Belum ada data tiket untuk grafik.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabel Laporan Saya */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Riwayat Laporan Terakhir Ruangan Ini</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">No. Tiket</th>
                                        <th className="px-6 py-3">Alat Kesehatan</th>
                                        <th className="px-6 py-3">Keluhan</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myReports.map(report => (
                                        <tr key={report.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono text-blue-600">{report.ticket_number}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{report.equipment?.name}</td>
                                            <td className="px-6 py-4 truncate max-w-xs" title={report.description}>{report.description}</td>
                                            <td className="px-6 py-4">{getStatusBadge(report.status)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={route('reports.show', report.id)} className="text-blue-600 hover:underline font-medium">
                                                    Lihat Log
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {myReports.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada riwayat laporan dari ruangan ini.</td></tr>
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