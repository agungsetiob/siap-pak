import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, users, rooms, errors: pageErrors }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, reset, errors, processing, clearErrors } = useForm({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'ruangan',
        room_id: '',
    });

    const openModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const handleToggleStatus = (id, isActive) => {
        const action = isActive ? "menonaktifkan" : "mengaktifkan";
        if (confirm(`Yakin ingin ${action} akun pengguna ini?`)) {
            router.delete(route('users.destroy', id));
        }
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Pengguna</h2>}
        >
            <Head title="Manajemen Pengguna - SIAP PAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {pageErrors.error && (
                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm">
                            <p>{pageErrors.error}</p>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">Daftar Akun Sistem</h3>
                                <p className="text-sm text-gray-500">Kelola akses Admin dan perwakilan Unit/Ruangan.</p>
                            </div>
                            <button
                                onClick={openModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition"
                            >
                                + Tambah Akun
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b">
                                    <tr>
                                        <th className="px-6 py-4">Nama / Pengguna</th>
                                        <th className="px-6 py-4">Kontak</th>
                                        <th className="px-6 py-4 text-center">Hak Akses (Role)</th>
                                        <th className="px-6 py-4">Ruangan</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr key={user.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900 flex items-center gap-2">
                                                    {user.name}
                                                    {!user.is_active && (
                                                        <span className="bg-red-100 text-red-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-blue-600">{user.email}</div>
                                                <div className="text-xs text-gray-500 font-mono">{user.phone_number || 'Tanpa No. HP'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                    ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {user.role === 'admin' ? <span className="text-gray-400">Semua Akses</span> : (user.room?.name || '-')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {user.id !== auth.user.id && (
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.is_active)}
                                                        className={`${user.is_active
                                                            ? "text-yellow-600 hover:underline font-medium"
                                                            : "text-green-600 hover:underline font-medium"
                                                            }`}
                                                    >
                                                        {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                    </button>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                    {users.data.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Belum ada data pengguna.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-6 flex flex-wrap gap-1 justify-end">
                            {users.links.map((link, index) => (
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

            {/* MODAL TAMBAH AKUN */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Daftarkan Akun Baru</h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap / Penanggung Jawab" />
                            <TextInput id="name" type="text" className="mt-1 block w-full bg-gray-50" value={data.name} onChange={(e) => setData('name', e.target.value)} required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email (Digunakan untuk Login)" />
                            <TextInput id="email" type="email" className="mt-1 block w-full bg-gray-50" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone_number" value="No. WhatsApp (Awali 08...)" />
                            <TextInput id="phone_number" type="text" className="mt-1 block w-full bg-gray-50" value={data.phone_number} onChange={(e) => setData('phone_number', e.target.value)} placeholder="08123456789" />
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Hak Akses" />
                            <select id="role" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50" value={data.role} onChange={(e) => setData('role', e.target.value)}>
                                <option value="ruangan">Perwakilan Ruangan / Unit</option>
                                <option value="admin">Admin / Teknisi Internal</option>
                            </select>
                        </div>

                        {/* Dropdown Ruangan HANYA muncul jika role == ruangan */}
                        {data.role === 'ruangan' && (
                            <div>
                                <InputLabel htmlFor="room_id" value="Pilih Ruangan / Unit" />
                                <select id="room_id" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50" value={data.room_id} onChange={(e) => setData('room_id', e.target.value)} required>
                                    <option value="">-- Pilih Ruangan --</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.room_id} className="mt-2" />
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="password" value="Password Sementara" />
                            <TextInput id="password" type="password" className="mt-1 block w-full bg-gray-50" value={data.password} onChange={(e) => setData('password', e.target.value)} required />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg border-t border-gray-100">
                        <SecondaryButton onClick={closeModal}>Batal</SecondaryButton>
                        <PrimaryButton className="ml-3 bg-blue-600" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Buat Akun'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}