import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, rooms, filters, errors: pageErrors }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        id: '',
        name: '',
        code: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('rooms.index'), { search }, { preserveState: true });
    };

    const openModal = (room = null) => {
        clearErrors();
        if (room) {
            setIsEditing(true);
            setData({
                id: room.id,
                name: room.name,
                code: room.code || '',
            });
        } else {
            setIsEditing(false);
            reset();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('rooms.update', data.id), { onSuccess: () => closeModal() });
        } else {
            post(route('rooms.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Hapus ruangan ini secara permanen?')) {
            destroy(route('rooms.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Master Ruangan / Unit</h2>}
        >
            <Head title="Master Ruangan - SIAP PAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Alert Error jika gagal hapus karena berelasi */}
                    {pageErrors.error && (
                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                            <p className="font-bold">Gagal</p>
                            <p>{pageErrors.error}</p>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                                <TextInput
                                    type="text"
                                    placeholder="Cari nama ruangan..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full md:w-72"
                                />
                                <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
                                    Cari
                                </button>
                            </form>
                            <button 
                                onClick={() => openModal()} 
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
                            >
                                + Tambah Ruangan
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 border">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 w-1/4">Kode Ruangan</th>
                                        <th className="px-6 py-4">Nama Ruangan / Unit</th>
                                        <th className="px-6 py-4 text-center">Jumlah Alat</th>
                                        <th className="px-6 py-4 text-center w-1/4">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rooms.data.map((item) => (
                                        <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-mono text-gray-600">{item.code || '-'}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                                    {item.equipments_count} Alat
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-800 mr-4 font-medium">Edit</button>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {rooms.data.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Data ruangan tidak ditemukan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Sederhana */}
                        <div className="mt-6 flex flex-wrap gap-1 justify-end">
                            {rooms.links.map((link, index) => (
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

            {/* Modal Form */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">
                        {isEditing ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="code" value="Kode Ruangan (Opsional)" />
                            <TextInput
                                id="code"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                placeholder="Cth: IGD-01"
                            />
                            <InputError message={errors.code} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="name" value="Nama Ruangan / Unit Pelayanan" />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Cth: Instalasi Gawat Darurat"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3 bg-blue-600" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}