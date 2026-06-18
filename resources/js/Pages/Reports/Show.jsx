import React, { useState } from 'react';
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

    // State untuk form update progress (Khusus Admin)
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
                reset('notes'); // Hanya reset field catatan agar bisa diisi lagi
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
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Tiket: <span className="font-mono text-blue-600">{report.ticket_number}</span>
                    </h2>
                    <Link href={route('reports.index')} className="text-sm text-gray-600 hover:text-gray-900 underline">
                        &larr; Kembali ke Daftar
                    </Link>
                </div>
            }
        >
            <Head title={`Tiket ${report.ticket_number} - SIAP PAK`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* KOLOM KIRI: Informasi Detail Tiket */}
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

                    {/* KOLOM KANAN: Timeline Log & Form Update */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Area Form Update (Hanya tampil untuk Admin jika tiket belum selesai) */}
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
                                        
                                        {/* Tampilkan field ini jika status diubah menjadi selesai */}
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

                        {/* Riwayat Tindakan (Data Akhir) - Muncul jika tiket sudah selesai */}
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

                        {/* Area Log Timeline */}
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 border-b pb-3 mb-6">Log & Riwayat Status</h3>
                            
                            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                                {report.progress_logs && report.progress_logs.map((log, index) => (
                                    <div key={log.id} className="relative pl-6">
                                        {/* Titik / Bullet Timeline */}
                                        <span className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-white
                                            ${log.status_snapshot === 'menunggu' ? 'bg-red-500' : 
                                              log.status_snapshot === 'diproses' ? 'bg-yellow-500' : 
                                              log.status_snapshot === 'selesai' ? 'bg-green-500' : 'bg-gray-500'}`}
                                        ></span>
                                        
                                        <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                                            <h4 className="font-bold text-gray-900 capitalize text-md">
                                                Status: {log.status_snapshot}
                                            </h4>
                                            <time className="text-xs font-mono text-gray-500 mt-1 sm:mt-0">
                                                {formatDate(log.created_at)}
                                            </time>
                                        </div>
                                        
                                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md border border-gray-100 mt-2">
                                            {log.notes}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            Diperbarui oleh: {log.user?.name || 'Sistem'}
                                        </p>
                                    </div>
                                ))}
                                
                                {(!report.progress_logs || report.progress_logs.length === 0) && (
                                    <p className="pl-6 text-gray-500 text-sm">Belum ada riwayat tindak lanjut.</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}