import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import DeleteModal from '@/Components/DeleteModal';

export default function Trashed({ auth, equipments }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleRestore = (id) => {
        router.post(route('equipments.restore', id));
    };

    const handleForceDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route('equipments.forceDelete', deleteId), {
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setDeleteId(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tong Sampah: Alat Kesehatan</h2>}
        >
            <Head title="Arsip Alat - SIMEDI" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-2 lg:px-2">
                    <div className="mb-2">
                        <Link href={route('equipments.index')} className="text-blue-600 hover:underline">
                            &larr; Kembali ke Inventaris Aktif
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-t-4 border-red-500">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Daftar Alat yang Dihapus</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs border-b">
                                    <tr>
                                        <th className="px-6 py-4">Nama Alat</th>
                                        <th className="px-6 py-4">Ruangan Asal</th>
                                        <th className="px-6 py-4">Tgl Dihapus</th>
                                        <th className="px-6 py-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipments.data.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {item.name} <br/>
                                                <span className="font-mono text-xs text-gray-500">{item.inventory_number}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{item.room?.name || '-'}</td>
                                            <td className="px-6 py-4 text-red-600">
                                                {new Date(item.deleted_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-4">
                                                <button 
                                                    onClick={() => handleRestore(item.id)} 
                                                    className="text-green-600 hover:text-green-800 font-semibold transition-colors"
                                                >
                                                    Restore
                                                </button>
                                                <button 
                                                    onClick={() => handleForceDelete(item.id)} 
                                                    className="text-red-600 hover:text-red-800 font-semibold transition-colors"
                                                >
                                                    Hapus Permanen
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {equipments.data.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                Tong sampah kosong.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Konfirmasi Hapus Permanen */}
            <DeleteModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus Permanen"
                message="Apakah Anda yakin ingin menghapus alat ini secara permanen? Data tidak bisa dikembalikan lagi."
            />
        </AuthenticatedLayout>
    );
}
