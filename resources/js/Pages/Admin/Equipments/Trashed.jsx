import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Trashed({ auth, equipments }) {
    
    const handleRestore = (id) => {
        if (confirm('Kembalikan alat ini ke daftar inventaris aktif?')) {
            router.post(route('equipments.restore', id));
        }
    };

    const handleForceDelete = (id) => {
        if (confirm('PERINGATAN: Hapus alat ini secara PERMANEN? Data tidak bisa dikembalikan lagi.')) {
            router.delete(route('equipments.forceDelete', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tong Sampah: Alat Kesehatan</h2>}>
            <Head title="Arsip Alat - SIMAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-4">
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
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-bold text-gray-900">
                                                {item.name} <br/>
                                                <span className="font-mono text-xs text-gray-500">{item.inventory_number}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{item.room?.name || '-'}</td>
                                            <td className="px-6 py-4 text-red-600">
                                                {new Date(item.deleted_at).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => handleRestore(item.id)} className="text-green-600 hover:underline font-bold mr-4">
                                                    Restore
                                                </button>
                                                <button onClick={() => handleForceDelete(item.id)} className="text-red-600 hover:underline font-bold">
                                                    Hapus Permanen
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {equipments.data.length === 0 && (
                                        <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">Tong sampah kosong.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}