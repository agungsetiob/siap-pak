import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FlashMessage from '@/Components/FlashMessage';
import {
    Plus, Search, Edit, Trash2, Building2,
    Phone, Mail, MapPin, Tag, FileText,
    Grid, List, ChevronDown, CheckCircle,
    Users, Briefcase, Package, Coins
} from 'lucide-react';
import { formatRupiah } from '@/Helpers/rupiah';

export default function Index({ auth, vendors, filters, flash, stats }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState('table');

    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        id: '',
        name: '',
        phone_number: '',
        email: '',
        address: '',
        vendor_type: '',
        notes: '',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('vendors.index'), { search }, { preserveState: true });
    };

    const openModal = (vendor = null) => {
        clearErrors();
        if (vendor) {
            setIsEditing(true);
            setData({
                id: vendor.id,
                name: vendor.name,
                phone_number: vendor.phone_number || '',
                email: vendor.email || '',
                address: vendor.address || '',
                vendor_type: vendor.vendor_type || '',
                notes: vendor.notes || '',
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
            put(route('vendors.update', data.id), { onSuccess: () => { setIsModalOpen(false); reset() } });
        } else {
            post(route('vendors.store'), { onSuccess: () => { setIsModalOpen(false); reset() } });
        }
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        destroy(route("vendors.destroy", deleteId));
        setIsDeleteModalOpen(false);
    };

    // Get vendor type badge color
    const getVendorTypeBadge = (type) => {
        const styles = {
            supplier: 'bg-blue-100 text-blue-700 border-blue-200',
            teknisi: 'bg-purple-100 text-purple-700 border-purple-200',
            kalibrasi: 'bg-green-100 text-green-700 border-green-200',
            lainnya: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        const icons = {
            supplier: <Briefcase className="w-3 h-3" />,
            teknisi: <Users className="w-3 h-3" />,
            kalibrasi: <CheckCircle className="w-3 h-3" />,
            lainnya: <Tag className="w-3 h-3" />,
        };
        const label = {
            supplier: 'Supplier Alkes',
            teknisi: 'Jasa Teknisi',
            kalibrasi: 'Institusi Kalibrasi',
            lainnya: 'Lainnya',
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[type] || styles.lainnya}`}>
                {icons[type] || icons.lainnya}
                {label[type] || type || 'Lainnya'}
            </span>
        );
    };

    // Get color for vendor
    const getVendorColor = (name) => {
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
                            Master Vendor / Supplier
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Master Vendor" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">
                    {/* <FlashMessage flash={flash} /> */}

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
                                                placeholder="Cari nama atau jenis vendor..."
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
                                    {/* Add Vendor Button */}
                                    <button
                                        onClick={() => openModal()}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">Tambah Vendor</span>
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
                                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Vendor</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total_vendors}</p>
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
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        Nama Vendor
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        Kontak
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-3.5 h-3.5" />
                                                        Jenis
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        Catatan
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {vendors.data.map((vendor, index) => (
                                                <tr
                                                    key={vendor.id}
                                                    className={`bg-white border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`p-1.5 rounded-lg ${getVendorColor(vendor.name)}`}>
                                                                <Building2 className="w-4 h-4" />
                                                            </div>
                                                            <span className="font-semibold text-gray-800">{vendor.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="space-y-0.5">
                                                            {vendor.phone_number && (
                                                                <div className="flex items-center gap-1.5 text-sm">
                                                                    <Phone className="w-3 h-3 text-gray-400" />
                                                                    <span>{vendor.phone_number}</span>
                                                                </div>
                                                            )}
                                                            {vendor.email && (
                                                                <div className="flex items-center gap-1.5 text-sm text-blue-600">
                                                                    <Mail className="w-3 h-3" />
                                                                    <a href={`mailto:${vendor.email}`} className="hover:underline">
                                                                        {vendor.email}
                                                                    </a>
                                                                </div>
                                                            )}
                                                            {!vendor.phone_number && !vendor.email && (
                                                                <span className="text-gray-400 text-xs">-</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getVendorTypeBadge(vendor.vendor_type)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="max-w-xs truncate" title={vendor.notes}>
                                                            {vendor.notes || <span className="text-gray-400 text-xs">-</span>}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openModal(vendor)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(vendor.id)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {vendors.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Building2 className="w-12 h-12 text-gray-300" />
                                                            <p className="text-gray-500 font-medium">Data vendor tidak ditemukan</p>
                                                            <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian atau tambahkan vendor baru</p>
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
                                    {vendors.data.map((vendor) => (
                                        <div
                                            key={vendor.id}
                                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2.5 rounded-xl ${getVendorColor(vendor.name)}`}>
                                                    <Building2 className="w-5 h-5" />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => openModal(vendor)}
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(vendor.id)}
                                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h4 className="font-semibold text-gray-800 text-base">{vendor.name}</h4>
                                                <div className="mt-1.5">
                                                    {getVendorTypeBadge(vendor.vendor_type)}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-sm border-t border-gray-100 pt-3">
                                                {vendor.phone_number && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        <span>{vendor.phone_number}</span>
                                                    </div>
                                                )}
                                                {vendor.email && (
                                                    <div className="flex items-center gap-2 text-blue-600">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        <a href={`mailto:${vendor.email}`} className="hover:underline truncate">
                                                            {vendor.email}
                                                        </a>
                                                    </div>
                                                )}
                                                {vendor.address && (
                                                    <div className="flex items-start gap-2 text-gray-600">
                                                        <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs line-clamp-2">{vendor.address}</span>
                                                    </div>
                                                )}
                                                {vendor.notes && (
                                                    <div className="flex items-start gap-2 text-gray-500">
                                                        <FileText className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                                                        <span className="text-xs line-clamp-2">{vendor.notes}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {vendors.data.length === 0 && (
                                        <div className="col-span-full text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Building2 className="w-12 h-12 text-gray-300" />
                                                <p className="text-gray-500 font-medium">Data vendor tidak ditemukan</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Menampilkan <strong>{vendors.from || 0}</strong> sampai <strong>{vendors.to || 0}</strong> dari <strong>{vendors.total}</strong> data
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {vendors.links.map((link, index) => (
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

            {/* --- MODAL FORM --- */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                            <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Edit Vendor' : 'Tambah Vendor Baru'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditing ? 'Perbarui informasi vendor' : 'Isi data vendor dengan lengkap'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Vendor / Perusahaan" required />
                            <div className="relative mt-1">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="name"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Cth: PT Medika Jaya"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="phone_number" value="Nomor Telepon" />
                                <div className="relative mt-1">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <TextInput
                                        id="phone_number"
                                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        value={data.phone_number}
                                        onChange={e => setData('phone_number', e.target.value)}
                                        placeholder="0812-3456-7890"
                                    />
                                </div>
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="vendor@perusahaan.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="vendor_type" value="Jenis Vendor" />
                            <div className="relative mt-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    id="vendor_type"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                    value={data.vendor_type}
                                    onChange={e => setData('vendor_type', e.target.value)}
                                >
                                    <option value="">-- Pilih Jenis Vendor --</option>
                                    <option value="supplier">Supplier Alkes</option>
                                    <option value="teknisi">Jasa Teknisi / Servis</option>
                                    <option value="kalibrasi">Institusi Kalibrasi</option>
                                    <option value="lainnya">Lainnya</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="address" value="Alamat Lengkap" />
                            <div className="relative mt-1">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    id="address"
                                    rows="2"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                    value={data.address}
                                    onChange={e => setData('address', e.target.value)}
                                    placeholder="Jl. Contoh No. 123, Jakarta"
                                />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="notes" value="Catatan Tambahan" />
                            <div className="relative mt-1">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea
                                    id="notes"
                                    rows="2"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    placeholder="Catatan penting tentang vendor ini..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            disabled={processing}
                            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
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
                            <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus data vendor ini?</p>
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