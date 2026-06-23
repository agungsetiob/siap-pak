import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, technicians, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        id: '',
        name: '',
        phone_number: '',
        specialization: '',
        is_active: 1,
    });

    const openModal = (tech = null) => {
        clearErrors();
        if (tech) {
            setIsEditing(true);
            setData({
                id: tech.id,
                name: tech.name,
                phone_number: tech.phone_number,
                specialization: tech.specialization || '',
                is_active: tech.is_active,
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
            put(route('technicians.update', data.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('technicians.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Master Teknisi Elektromedis / IT</h2>}>
            <Head title="Master Teknisi - SIAP PAK" />
            <div className="py-12"><div className="max-w-7xl mx-auto sm:px-6 lg:px-8"><div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
                    <form onSubmit={(e) => { e.preventDefault(); router.get(route('technicians.index'), { search }, { preserveState: true }); }} className="flex gap-2">
                        <TextInput type="text" placeholder="Cari teknisi..." value={search} onChange={e => setSearch(e.target.value)} className="block w-64" />
                        <PrimaryButton type="submit">Cari</PrimaryButton>
                    </form>
                    <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">+ Tambah Teknisi</button>
                </div>
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">No. WA</th>
                            <th className="px-6 py-4">Spesialisasi</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {technicians.data.map(tech => (
                            <tr key={tech.id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-bold text-gray-900">{tech.name}</td>
                                <td className="px-6 py-4 font-mono text-blue-600">{tech.phone_number}</td>
                                <td className="px-6 py-4 capitalize">{tech.specialization || '-'}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${tech.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {tech.is_active ? 'AKTIF' : 'NON-AKTIF'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => openModal(tech)} className="text-blue-600 hover:underline mr-4 font-medium">Edit</button>
                                    <button onClick={() => { if(confirm('Hapus teknisi ini?')) destroy(route('technicians.destroy', tech.id)) }} className="text-red-600 hover:underline font-medium">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div></div></div>

            {/* MODAL FORM */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold border-b pb-3 mb-4">{isEditing ? 'Edit Data Teknisi' : 'Tambah Teknisi Baru'}</h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap" />
                            <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={e => setData('name', e.target.value)} required />
                        </div>
                        <div>
                            <InputLabel htmlFor="phone_number" value="Nomor WhatsApp (Format: 08xx/62xx)" />
                            <TextInput id="phone_number" className="mt-1 block w-full" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} required />
                        </div>
                        <div>
                            <InputLabel htmlFor="specialization" value="Spesialisasi Keahlian" />
                            <TextInput id="specialization" placeholder="Cth: Radiologi, Lab, Elektromedis Umum" className="mt-1 block w-full" value={data.specialization} onChange={e => setData('specialization', e.target.value)} />
                        </div>
                        <div>
                            <InputLabel htmlFor="is_active" value="Status Akun" />
                            <select id="is_active" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.is_active} onChange={e => setData('is_active', e.target.value)}>
                                <option value={1}>Aktif / Siap Bertugas</option>
                                <option value={0}>Non-Aktif / Cuti</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}