import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FlashMessage from '@/Components/FlashMessage';
import { formatRupiah } from '@/Helpers/rupiah';
import {
    Plus, Search, Edit, Trash2, Building2,
    Hash, Package, Grid, List, Coins
} from 'lucide-react';

export default function Index({ auth, rooms, filters, flash, stats }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState('table');

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

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        destroy(route("rooms.destroy", deleteId));
        setIsDeleteModalOpen(false);
    };

    // Get color for room
    const getRoomColor = (name) => {
        const colors = [
            'bg-blue-50 text-blue-700 border-blue-200',
            'bg-purple-50 text-purple-700 border-purple-200',
            'bg-pink-50 text-pink-700 border-pink-200',
            'bg-green-50 text-green-700 border-green-200',
            'bg-yellow-50 text-yellow-700 border-yellow-200',
            'bg-indigo-50 text-indigo-700 border-indigo-200',
            'bg-red-50 text-red-700 border-red-200',
            'bg-teal-50 text-teal-700 border-teal-200',
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Master Ruangan / Unit
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Master Ruangan" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">

                    <FlashMessage flash={flash} />

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            {/* --- Header & Form Pencarian --- */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-80">
                                        <form onSubmit={handleSearch} className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Cari nama ruangan..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                                            />
                                        </form>
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={handleSearch}
                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        Cari
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                    {/* Add Room Button */}
                                    <button
                                        onClick={() => openModal()}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">Tambah Ruangan</span>
                                    </button>

                                    {/* View Toggle */}
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="Tampilan Tabel"
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="Tampilan Grid"
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* --- Stats Cards --- */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Ruangan</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_rooms}</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/10 rounded-xl">
                                            <Building2 className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">{stats.most_equipments?.name}</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                                {stats.most_equipments?.equipments_count} alat
                                            </p>
                                        </div>
                                        <div className="p-3 bg-purple-500/10 rounded-xl">
                                            <Package className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">{stats.highest_value?.name}</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                                {formatRupiah(stats.highest_value?.equipments_sum_price)}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-500/10 rounded-xl">
                                            <Coins className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Tabel Data --- */}
                            {viewMode === 'table' ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Hash className="w-3.5 h-3.5" />
                                                        Kode Ruangan
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        Nama Ruangan / Unit
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Package className="w-3.5 h-3.5" />
                                                        Jumlah Alat
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rooms.data.map((item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className={`bg-white border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg font-mono text-xs font-bold">
                                                            <Hash className="w-3 h-3" />
                                                            {item.code || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-lg ${getRoomColor(item.name)}`}>
                                                                <Building2 className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-semibold text-gray-800">{item.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold
                                                            ${item.equipments_count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                                                        >
                                                            <Package className="w-3 h-3" />
                                                            {item.equipments_count || 0} Alat
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openModal(item)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {rooms.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Building2 className="w-12 h-12 text-gray-300" />
                                                            <p className="text-gray-500 font-medium">Data ruangan tidak ditemukan</p>
                                                            <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian atau tambahkan ruangan baru</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Grid View
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {rooms.data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2.5 rounded-xl ${getRoomColor(item.name)}`}>
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h4 className="font-semibold text-gray-800 text-base">{item.name}</h4>
                                                {item.code && (
                                                    <p className="text-xs text-gray-400 font-mono mt-0.5">
                                                        <Hash className="w-3 h-3 inline mr-1" />
                                                        {item.code}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                                                    ${item.equipments_count > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}
                                                >
                                                    <Package className="w-3 h-3" />
                                                    {item.equipments_count || 0} Alat
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {rooms.data.length === 0 && (
                                        <div className="col-span-full text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Building2 className="w-12 h-12 text-gray-300" />
                                                <p className="text-gray-500 font-medium">Data ruangan tidak ditemukan</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Menampilkan <strong>{rooms.from || 0}</strong> sampai <strong>{rooms.to || 0}</strong> dari <strong>{rooms.total}</strong> data
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {rooms.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                                                ${link.active ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" :
                                                    "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"} 
                                                ${!link.url && "opacity-40 cursor-not-allowed"}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modal Form --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditing ? 'Perbarui informasi ruangan' : 'Isi data ruangan dengan lengkap'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="code" value="Kode Ruangan" />
                            <div className="relative mt-1">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="code"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="Cth: IGD-01"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">Kode ruangan bersifat opsional</p>
                            <InputError message={errors.code} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="name" value="Nama Ruangan / Unit Pelayanan" required />
                            <div className="relative mt-1">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Cth: Instalasi Gawat Darurat"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={closeModal} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center gap-3 pb-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl text-white">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h2>
                            <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus data ruangan ini?</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton type="button" onClick={() => setIsDeleteModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={confirmDelete}
                            className="ml-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl px-6 py-2.5 shadow-lg shadow-red-500/20"
                        >
                            Hapus
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}