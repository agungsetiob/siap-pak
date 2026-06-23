import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { formatDate } from '@/Helpers/date';

export default function Index({ auth, schedules, equipments, technicians, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        id: '',
        equipment_id: '',
        technician_id: '',
        scheduled_date: '',
        status: 'menunggu',
        notes: '',
    });

    const openModal = (sched = null) => {
        clearErrors();
        if (sched) {
            setIsEditing(true);
            setData({
                id: sched.id,
                equipment_id: sched.equipment_id,
                technician_id: sched.technician_id,
                scheduled_date: sched.scheduled_date ? sched.scheduled_date.substring(0,10) : '',
                status: sched.status,
                notes: sched.notes || '',
            });
        } else {
            setIsEditing(false);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('maintenance-schedules.update', data.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('maintenance-schedules.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const changeStatusDirectly = (id, newStatus) => {
        router.put(route('maintenance-schedules.updateStatus', id), { status: newStatus }, { preserveScroll: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Jadwal Pemeliharaan Rutin (Preventive Maintenance)</h2>}>
            <Head title="Jadwal Pemeliharaan - SIAP PAK" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8"><div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
                    <div className="flex gap-4">
                        <select className="border-gray-300 rounded-md shadow-sm text-sm" value={filters.status || ''} onChange={e => router.get(route('maintenance-schedules.index'), { status: e.target.value }, { preserveState: true })}>
                            <option value="">-- Semua Status Jadwal --</option>
                            <option value="menunggu">🔄 Menunggu Pelaksanaan</option>
                            <option value="selesai">✅ Selesai Dikerjakan</option>
                            <option value="terlewat">❌ Terlewat / Overdue</option>
                        </select>
                    </div>
                    <button onClick={() => openModal()} className="px-4 py-2 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 transition">+ Atur Jadwal Baru</button>
                </div>
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Tanggal Kerja</th>
                            <th className="px-6 py-4">Alat Medis</th>
                            <th className="px-6 py-4">Teknisi Penanggung Jawab</th>
                            <th className="px-6 py-4 text-center">Status Notifikasi</th>
                            <th className="px-6 py-4 text-center">Ubah Status</th>
                            <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {schedules.data.map(sched => (
                            <tr key={sched.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-900">{formatDate(sched.scheduled_date)}</td>
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-800">{sched.equipment?.name}</div>
                                    <div className="text-xs text-gray-500 font-mono">{sched.equipment?.inventory_number} ({sched.equipment?.room?.name})</div>
                                </td>
                                <td className="px-6 py-4 font-medium text-blue-700">{sched.technician?.name}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase
                                        ${sched.status === 'selesai' ? 'bg-green-100 text-green-800' : 
                                          sched.status === 'terlewat' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {sched.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <select className="text-xs border-gray-300 rounded p-1 bg-gray-50" value={sched.status} onChange={e => changeStatusDirectly(sched.id, e.target.value)}>
                                        <option value="menunggu">Menunggu</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="terlewat">Terlewat</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => openModal(sched)} className="text-blue-600 hover:underline mr-3 font-medium">Edit</button>
                                    <button onClick={() => { if(confirm('Batalkan jadwal ini?')) destroy(route('maintenance-schedules.destroy', sched.id)) }} className="text-red-600 hover:underline font-medium">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></div></div>

            {/* MODAL INPUT JADWAL */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold border-b pb-3 mb-4">{isEditing ? 'Ubah Rencana Pemeliharaan' : 'Atur Rencana Pemeliharaan Rutin'}</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="equipment_id" value="Pilih Alat Kesehatan" />
                            <select id="equipment_id" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.equipment_id} onChange={e => setData('equipment_id', e.target.value)} required>
                                <option value="">-- Cari Alat --</option>
                                {equipments.map(eq => <option key={eq.id} value={eq.id}>{eq.name} [{eq.inventory_number}]</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="technician_id" value="Ditugaskan Kepada (Teknisi)" />
                            <select id="technician_id" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.technician_id} onChange={e => setData('technician_id', e.target.value)} required>
                                <option value="">-- Pilih Teknisi --</option>
                                {technicians.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>)}
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="scheduled_date" value="Tanggal Pelaksanaan Kerja" />
                            <TextInput id="scheduled_date" type="date" className="mt-1 block w-full" value={data.scheduled_date} onChange={e => setData('scheduled_date', e.target.value)} required />
                        </div>
                        {isEditing && (
                            <div>
                                <InputLabel htmlFor="status" value="Status Kerja" />
                                <select id="status" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.status} onChange={e => setData('status', e.target.value)}>
                                    <option value="menunggu">Menunggu</option>
                                    <option value="selesai">Selesai</option>
                                    <option value="terlewat">Terlewat</option>
                                </select>
                            </div>
                        )}
                        <div>
                            <InputLabel htmlFor="notes" value="Instruksi Khusus / Catatan Tugas" />
                            <textarea id="notes" rows="2" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.notes} onChange={e => setData('notes', e.target.value)} placeholder="Contoh: Cek filter oli pompa vakum atau kalibrasi kelistrikan..."></textarea>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan Rencana</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}