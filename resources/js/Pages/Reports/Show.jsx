import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatDate } from "@/Helpers/date";

export default function Show({ auth, report }) {
    const isAdmin = auth.user.role === 'admin';
    const isSelesai = report.status === 'selesai' || report.status === 'dibatalkan';

    const { data, setData, put, processing, errors, reset } = useForm({
        status: report.status === 'menunggu' ? 'diproses' : report.status,
        notes: '',
        action_taken: report.action_taken || '',
        external_technician: report.external_technician || '',
        cost: report.cost || '',
    });

    const submitProgress = (e) => {
        e.preventDefault();
        put(route('reports.progress.update', report.id), {
            onSuccess: () => {
                reset('notes');
                alert('Progress berhasil diperbarui dan notifikasi telah dikirim ke pelapor.');
            },
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            menunggu: 'bg-red-100 text-red-800',
            diproses: 'bg-yellow-100 text-yellow-800',
            selesai: 'bg-green-100 text-green-800',
            dibatalkan: 'bg-gray-100 text-gray-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between print:hidden">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Tiket: <span className="font-mono text-blue-600">{report.ticket_number}</span>
                    </h2>
                    <div className="flex gap-4 items-center">
                        {/* TOMBOL CETAK DI SHOW.JSX */}
                        <button 
                            onClick={() => window.open(route('reports.print', report.id), '_blank')} 
                            className="px-4 py-2 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 font-semibold flex items-center shadow"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Cetak Dokumen
                        </button>
                        <Link href={route('reports.index')} className="text-sm text-gray-600 hover:text-gray-900 underline">
                            &larr; Kembali
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Tiket ${report.ticket_number} - SIAP PAK`} />

            {/* ========================================================= */}
            {/* 1. TAMPILAN LAYAR MONITOR (Otomatis Hilang Saat Print)     */}
            {/* ========================================================= */}
            <div className="py-12 print:hidden">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* KOLOM KIRI (INFORMASI & ALAT) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Informasi Laporan</h3>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="text-gray-500 mb-1">Status Saat Ini</p>
                                    {getStatusBadge(report.status)}
                                </div>
                                <div>
                                    <p className="text-gray-500">Waktu Lapor</p>
                                    <p className="font-medium text-gray-900">{formatDate(report.created_at, { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Dilaporkan Oleh</p>
                                    <p className="font-medium text-gray-900">
                                        {report.reporter?.name} <span className="text-gray-400">({report.reporter?.room?.name || 'Unit'})</span>
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Jenis Laporan</p>
                                    <p className="font-medium text-gray-900 capitalize">{report.type}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Deskripsi Kendala</p>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200 text-gray-700 whitespace-pre-wrap">
                                        {report.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-4">Identitas Alat</h3>
                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Nama Alat</p>
                                    <p className="font-bold text-gray-900">{report.equipment?.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">No. Inventaris</p>
                                    <p className="font-mono text-gray-700">{report.equipment?.inventory_number}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Merk / Serial Number</p>
                                    <p className="font-medium text-gray-900">
                                        {report.equipment?.brand || '-'} / {report.equipment?.serial_number || '-'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="lg:col-span-2 space-y-6">
                        {isAdmin && !isSelesai && (
                            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                <h3 className="text-lg font-bold text-blue-900 mb-4">Tindak Lanjut Perbaikan</h3>
                                <form onSubmit={submitProgress} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="status" value="Ubah Status" />
                                            <select
                                                id="status"
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                            >
                                                <option value="diproses">Sedang Diproses / Dicek</option>
                                                <option value="selesai">Selesai Diperbaiki</option>
                                                <option value="dibatalkan">Dibatalkan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="external_technician" value="Teknisi / Vendor Luar (Opsional)" />
                                            <TextInput
                                                id="external_technician"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.external_technician}
                                                onChange={(e) => setData('external_technician', e.target.value)}
                                                placeholder="Nama Vendor / Teknisi"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="notes" value="Catatan / Progress (Wajib)" />
                                            <textarea
                                                id="notes"
                                                rows="2"
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full"
                                                value={data.notes}
                                                onChange={(e) => setData('notes', e.target.value)}
                                                placeholder="Cth: Sedang mengecek kerusakan power supply..."
                                                required
                                            ></textarea>
                                            <InputError message={errors.notes} className="mt-2" />
                                        </div>
                                        
                                        {data.status === 'selesai' && (
                                            <>
                                                <div className="md:col-span-2">
                                                    <InputLabel htmlFor="action_taken" value="Tindakan yang Dilakukan" />
                                                    <textarea
                                                        id="action_taken"
                                                        rows="2"
                                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full"
                                                        value={data.action_taken}
                                                        onChange={(e) => setData('action_taken', e.target.value)}
                                                        placeholder="Cth: Penggantian kabel power dan kalibrasi ulang..."
                                                    ></textarea>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <InputLabel htmlFor="cost" value="Total Biaya (Rp) - Opsional" />
                                                    <TextInput
                                                        id="cost"
                                                        type="number"
                                                        className="mt-1 block w-full md:w-1/2"
                                                        value={data.cost}
                                                        onChange={(e) => setData('cost', e.target.value)}
                                                        placeholder="Tanpa titik/koma"
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <PrimaryButton className="bg-blue-600 hover:bg-blue-700" disabled={processing}>
                                            {processing ? 'Menyimpan...' : 'Simpan Progress & Kirim Notifikasi'}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}

                        {isSelesai && report.action_taken && (
                            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                <h3 className="text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                    Laporan Selesai Ditangani
                                </h3>
                                <div className="space-y-2 text-sm text-green-800">
                                    <p><strong>Tindakan:</strong> {report.action_taken}</p>
                                    {report.external_technician && <p><strong>Dikerjakan Oleh:</strong> {report.external_technician}</p>}
                                    {report.cost > 0 && <p><strong>Biaya:</strong> Rp {new Intl.NumberFormat('id-ID').format(report.cost)}</p>}
                                </div>
                            </div>
                        )}

                        {/* PANEL VERIFIKASI MONITOR */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-md font-bold text-gray-900 border-b pb-3 mb-4 flex items-center gap-2 tracking-wide uppercase text-xs text-gray-500">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                Verifikasi & Status Persetujuan Komponen
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-between min-h-[160px]">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Approve Pelapor (Ruangan)</span>
                                    <div className="my-3 flex items-center justify-center w-full min-h-[4rem]">
                                        {report.room_approved_at ? (
                                            report.reporter?.signature_path ? (
                                                <img src={`/storage/${report.reporter.signature_path}`} alt="TTD Pelapor" className="max-h-16 object-contain mix-blend-multiply" />
                                            ) : (
                                                <span className="text-xs text-green-600 font-bold tracking-wider bg-green-100 px-2 py-1 rounded">DISETUJUI</span>
                                            )
                                        ) : (
                                            isSelesai ? (
                                                !isAdmin ? (
                                                    <button 
                                                        onClick={() => {
                                                            if(confirm('Apakah alat sudah berfungsi dengan baik? Tanda tangan Anda akan dibubuhkan.')){
                                                                router.post(route('reports.approve', report.id), {}, {
                                                                    onError: (err) => { if(err.error) alert(err.error); }
                                                                });
                                                            }
                                                        }}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-md text-xs font-bold shadow hover:bg-green-700 transition"
                                                    >
                                                        ✓ Setujui & Tanda Tangani
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-3 py-1 rounded border border-yellow-200 animate-pulse text-center">
                                                        Menunggu Verifikasi<br/>Pihak Ruangan
                                                    </span>
                                                )
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Menunggu perbaikan selesai</span>
                                            )
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-gray-800 text-sm">{report.reporter?.name}</p>
                                        <p className="text-[10px] text-gray-400">Unit: {report.reporter?.room?.name || 'Staf'}</p>
                                        {report.room_approved_at && <p className="text-[9px] text-green-600 font-mono font-bold mt-1">Disetujui: {formatDate(report.room_approved_at)}</p>}
                                    </div>
                                </div>

                                <div className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex flex-col items-center justify-between min-h-[160px]">
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Approve Admin (IPSRS)</span>
                                    <div className="my-3 h-16 flex items-center justify-center">
                                        {report.status === 'selesai' ? (
                                            (() => {
                                                const selesaiLog = report.progress_logs?.find(log => log.status_snapshot === 'selesai');
                                                if (selesaiLog && selesaiLog.user?.signature_path) {
                                                    return <img src={`/storage/${selesaiLog.user.signature_path}`} alt="TTD Admin" className="max-h-16 object-contain mix-blend-multiply" />;
                                                }
                                                return <span className="text-xs text-green-600 font-bold tracking-wider bg-green-100 px-2 py-1 rounded">APPROVED</span>;
                                            })()
                                        ) : (
                                            <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-3 py-1 rounded border border-yellow-200 animate-pulse">Menunggu Tindakan</span>
                                        )}
                                    </div>
                                    <div className="text-center">
                                        <p className="font-bold text-gray-800 text-sm">{report.status === 'selesai' ? (report.progress_logs?.find(log => log.status_snapshot === 'selesai')?.user?.name || 'Admin IPSRS') : 'Belum Diverifikasi'}</p>
                                        <p className="text-[10px] text-gray-400">Status Kelayakan: <span className="uppercase font-bold">{report.status}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LOG MONITOR */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-6">Log & Riwayat Status</h3>
                            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                                {report.progress_logs && report.progress_logs.map((log) => (
                                    <div key={log.id} className="relative pl-6">
                                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white
                                            ${log.status_snapshot === 'menunggu' ? 'bg-red-500' : 
                                              log.status_snapshot === 'diproses' ? 'bg-yellow-500' : 
                                              log.status_snapshot === 'selesai' ? 'bg-green-500' : 'bg-gray-500'}`}
                                        ></span>
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                                            <h4 className="font-bold text-gray-900 capitalize text-md">Status: {log.status_snapshot}</h4>
                                            <time className="text-xs font-mono text-gray-500 mt-1 sm:mt-0">{formatDate(log.created_at)}</time>
                                        </div>
                                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100 mt-2">{log.notes}</div>
                                        <p className="text-xs text-gray-400 mt-2">Diperbarui oleh: {log.user?.name || 'Sistem'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}