import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function Index({ auth, vendors, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
            put(route('vendors.update', data.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('vendors.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data vendor ini? Data alat tidak akan hilang, hanya status vendornya menjadi kosong.')) {
            destroy(route('vendors.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Master Vendor / Supplier</h2>}>
            <Head title="Master Vendor - SIAP PAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <TextInput
                                    type="text"
                                    placeholder="Cari nama atau jenis..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-64"
                                />
                                <PrimaryButton type="submit" className="bg-gray-800">Cari</PrimaryButton>
                            </form>
                            <button onClick={() => openModal()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition">
                                + Tambah Vendor
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">Nama Vendor</th>
                                        <th className="px-6 py-4">Kontak</th>
                                        <th className="px-6 py-4">Jenis</th>
                                        <th className="px-6 py-4">Catatan</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vendors.data.map((vendor) => (
                                        <tr key={vendor.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900">{vendor.name}</td>
                                            <td className="px-6 py-4">
                                                <div>{vendor.phone_number || '-'}</div>
                                                <div className="text-xs text-blue-600">{vendor.email}</div>
                                            </td>
                                            <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">{vendor.vendor_type || '-'}</td>
                                            <td className="px-6 py-4 truncate max-w-xs" title={vendor.notes}>{vendor.notes || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => openModal(vendor)} className="font-medium text-blue-600 hover:underline mr-4">Edit</button>
                                                <button onClick={() => handleDelete(vendor.id)} className="font-medium text-red-600 hover:underline">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {vendors.data.length === 0 && (
                                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">Tidak ada data vendor yang ditemukan.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL FORM */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">{isEditing ? 'Edit Vendor' : 'Tambah Vendor Baru'}</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Vendor / Perusahaan" />
                            <TextInput id="name" className="mt-1 block w-full" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="phone_number" value="Nomor Telepon" />
                                <TextInput id="phone_number" className="mt-1 block w-full" value={data.phone_number} onChange={e => setData('phone_number', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput id="email" type="email" className="mt-1 block w-full" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="vendor_type" value="Jenis Vendor" />
                            <select id="vendor_type" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.vendor_type} onChange={e => setData('vendor_type', e.target.value)}>
                                <option value="">-- Pilih Jenis --</option>
                                <option value="supplier">Supplier Alkes</option>
                                <option value="teknisi">Jasa Teknisi / Servis</option>
                                <option value="kalibrasi">Institusi Kalibrasi</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel htmlFor="address" value="Alamat Lengkap" />
                            <textarea id="address" rows="2" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.address} onChange={e => setData('address', e.target.value)}></textarea>
                        </div>
                        <div>
                            <InputLabel htmlFor="notes" value="Catatan Tambahan" />
                            <textarea id="notes" rows="2" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full" value={data.notes} onChange={e => setData('notes', e.target.value)}></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton disabled={processing}>{processing ? 'Menyimpan...' : 'Simpan Data'}</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}