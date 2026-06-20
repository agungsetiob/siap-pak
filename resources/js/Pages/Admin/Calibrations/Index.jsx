import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { formatDate } from '@/Helpers/date';

export default function Index({ auth, calibrations, upcomingCalibrations }) {
    
    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus riwayat kalibrasi ini? File sertifikat juga akan terhapus.')) {
            router.delete(route('calibrations.destroy', id));
        }
    };

    const getResultBadge = (result) => {
        if (result === 'laik') return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">LAIK</span>;
        if (result === 'tidak_laik') return <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">TIDAK LAIK</span>;
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">LAIK DENGAN CATATAN</span>;
    };

    // Helper untuk menghitung sisa hari
    const getDaysRemaining = (dateString) => {
        const today = new Date();
        const targetDate = new Date(dateString);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Kalibrasi</h2>}
        >
            <Head title="Jadwal & Riwayat Kalibrasi - SIMAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* SECTION 1: PERINGATAN JATUH TEMPO */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-red-100">
                        <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-2">
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                            <h3 className="text-lg font-bold text-red-900">Perlu Perhatian: Jatuh Tempo Kalibrasi (H-30)</h3>
                        </div>
                        <div className="p-0">
                            {upcomingCalibrations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-3">Alat Kesehatan</th>
                                                <th className="px-6 py-3">Ruangan</th>
                                                <th className="px-6 py-3">Jatuh Tempo</th>
                                                <th className="px-6 py-3 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingCalibrations.map(eq => {
                                                const days = getDaysRemaining(eq.next_calibration_date);
                                                return (
                                                    <tr key={eq.id} className="border-b hover:bg-red-50 transition">
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900">{eq.name}</div>
                                                            <div className="font-mono text-xs text-gray-500">{eq.inventory_number}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">{eq.room?.name}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-bold ${days < 0 ? 'text-red-600' : 'text-orange-600'}`}>
                                                                {formatDate(eq.next_calibration_date)}
                                                            </span>
                                                            <br/>
                                                            <span className="text-xs text-gray-500">
                                                                {days < 0 ? `Terlewat ${Math.abs(days)} hari` : `Tersisa ${days} hari`}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link href={route('equipments.show', eq.id)} className="px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded font-semibold text-xs transition">
                                                                Update Kalibrasi &rarr;
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500 font-medium">
                                    Semua alat kesehatan dalam kondisi aman. Tidak ada kalibrasi yang mendekati jatuh tempo.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SECTION 2: ARSIP RIWAYAT KALIBRASI */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Arsip Sertifikat Kalibrasi Global</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Tgl Kalibrasi</th>
                                        <th className="px-6 py-4">Alat & Ruangan</th>
                                        <th className="px-6 py-4">Penguji & No. Sertifikat</th>
                                        <th className="px-6 py-4">Hasil</th>
                                        <th className="px-6 py-4">Sertifikat</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {calibrations.data.map((cal) => (
                                        <tr key={cal.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium">{formatDate(cal.calibration_date)}</td>
                                            <td className="px-6 py-4">
                                                <Link href={route('equipments.show', cal.equipment_id)} className="font-bold text-blue-600 hover:underline">
                                                    {cal.equipment?.name}
                                                </Link>
                                                <div className="text-xs text-gray-500">{cal.equipment?.room?.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{cal.testing_institution || '-'}</div>
                                                <div className="font-mono text-xs text-gray-500">{cal.certificate_number || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4">{getResultBadge(cal.result)}</td>
                                            <td className="px-6 py-4">
                                                {cal.certificate_file ? (
                                                    <a href={`/storage/${cal.certificate_file}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                        Lihat PDF
                                                    </a>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => handleDelete(cal.id)} className="text-red-600 hover:underline font-medium">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {calibrations.data.length === 0 && (
                                        <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">Belum ada data arsip kalibrasi di sistem.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        <div className="mt-6 flex flex-wrap gap-1 justify-end p-4">
                            {calibrations.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${link.active ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}