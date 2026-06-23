import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, Link } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { formatDate } from "@/Helpers/date";

export default function Index({ auth, equipments, rooms, vendors, filters }) {
    const [search, setSearch] = useState(filters?.search || "");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        reset,
        errors,
        processing,
        clearErrors,
    } = useForm({
        id: "",
        room_id: "",
        inventory_number: "",
        name: "",
        brand: "",
        serial_number: "",
        condition: "baik",
        next_calibration_date: "",
        price: 0,
        vendor_id: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("equipments.index"),
            { search },
            { preserveState: true },
        );
    };

    const openModal = (equipment = null) => {
        clearErrors();
        if (equipment) {
            setIsEditing(true);
            setData({
                id: equipment.id,
                room_id: equipment.room_id,
                inventory_number: equipment.inventory_number,
                name: equipment.name,
                brand: equipment.brand || "",
                serial_number: equipment.serial_number || "",
                condition: equipment.condition,
                next_calibration_date: equipment.next_calibration_date 
                    ? equipment.next_calibration_date.substring(0, 10) 
                    : "",
                price: equipment.price || 0,
                vendor_id: equipment.vendor_id || "",
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
            put(route("equipments.update", data.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route("equipments.store"), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (
            window.confirm("Apakah Anda yakin ingin menghapus data alat ini?")
        ) {
            destroy(route("equipments.destroy", id));
        }
    };

    const isAdmin = auth.user.role === "admin";

    const [isBatchQrModalOpen, setIsBatchQrModalOpen] = useState(false);
    
    const { data: qrData, setData: setQrData, post: postBatchQr, processing: qrProcessing, errors: qrErrors, reset: resetQr } = useForm({
        mode: 'all_missing',
        room_id: '',
    });

    const handleBatchQrSubmit = (e) => {
        e.preventDefault();
        postBatchQr(route('equipments.batchGenerateQr'), {
            onSuccess: () => {
                setIsBatchQrModalOpen(false);
                resetQr();
            }
        });
    };

    const [isPrintQrModalOpen, setIsPrintQrModalOpen] = useState(false);
    const [printRoomId, setPrintRoomId] = useState('');

    const handlePrintSubmit = (e) => {
        e.preventDefault();
        const url = route('equipments.printBatchQr', printRoomId ? { room_id: printRoomId } : {});
        window.open(url, '_blank');
        setIsPrintQrModalOpen(false);
    };

    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const { data: importData, setData: setImportData, post: postImport, processing: importProcessing, errors: importErrors, reset: resetImport } = useForm({
        import_file: null,
    });

    const handleImportSubmit = (e) => {
        e.preventDefault();
        postImport(route('equipments.import'), {
            forceFormData: true,
            onSuccess: () => {
                setIsImportModalOpen(false);
                resetImport();
                alert('Import berhasil diselesaikan!');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Master Alat Kesehatan
                </h2>
            }
        >
            <Head title="Alat Kesehatan - SIMAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        {/* --- Header & Form Pencarian --- */}
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <form
                                onSubmit={handleSearch}
                                className="flex gap-2 w-full md:w-auto"
                            >
                                <TextInput
                                    type="text"
                                    placeholder="Cari nama atau no. inventaris..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full md:w-72"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
                                >
                                    Cari
                                </button>
                            </form>
                            {isAdmin && (
                                <div className="flex gap-2">
                                    <Link
                                        href={route("equipments.trashed")}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 border border-gray-300 font-semibold transition whitespace-nowrap"
                                    >
                                        Tong Sampah
                                    </Link>
                                    {/* TOMBOL IMPORT EXCEL */}
                                    <button 
                                        onClick={() => setIsImportModalOpen(true)} 
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition whitespace-nowrap flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Import Excel
                                    </button>
                                    <button
                                        onClick={() => openModal()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition whitespace-nowrap"
                                    >
                                        + Tambah Alat
                                    </button>
                                    <button 
                                        onClick={() => setIsBatchQrModalOpen(true)} 
                                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-semibold transition whitespace-nowrap"
                                    >
                                        <svg className="w-4 h-4 inline mr-1 -mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                                        Batch QR
                                    </button>
                                    <button 
                                        onClick={() => setIsPrintQrModalOpen(true)} 
                                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 font-semibold transition whitespace-nowrap flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                        Cetak QR
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* --- Tabel Data --- */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-4">
                                            No. Inventaris
                                        </th>
                                        <th className="px-6 py-4">
                                            Alat Kesehatan
                                        </th>
                                        <th className="px-6 py-4">Ruangan</th>
                                        <th className="px-6 py-4">Kondisi</th>
                                        <th className="px-6 py-4">
                                            Jadwal Kalibrasi
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipments.data.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="bg-white border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                {item.inventory_number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-800">
                                                    {item.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {item.brand || "Tanpa Merk"}{" "}
                                                    -{" "}
                                                    {item.serial_number ||
                                                        "S/N Kosong"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.room?.name || "-"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-bold tracking-wide
                                                    ${
                                                        item.condition ===
                                                        "baik"
                                                            ? "bg-green-100 text-green-700"
                                                            : item.condition ===
                                                                "rusak_ringan"
                                                              ? "bg-yellow-100 text-yellow-700"
                                                              : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {item.condition
                                                        .replace("_", " ")
                                                        .toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {item.next_calibration_date ? (
                                                    formatDate(
                                                        item.next_calibration_date,
                                                    )
                                                ) : (
                                                    <span className="text-gray-400">
                                                        Belum Ada
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={route(
                                                        "equipments.show",
                                                        item.id,
                                                    )}
                                                    className="font-medium text-green-600 hover:text-green-800 mr-4 transition"
                                                >
                                                    Detail & Histori
                                                </Link>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                openModal(item)
                                                            }
                                                            className="font-medium text-blue-600 hover:text-blue-800 mr-4 transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                )
                                                            }
                                                            className="font-medium text-red-600 hover:text-red-800 transition"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {equipments.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Data alat kesehatan tidak
                                                ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Pagination --- */}
                        <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Menampilkan {equipments.from || 0} sampai{" "}
                                {equipments.to || 0} dari total{" "}
                                {equipments.total} data
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {equipments.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            link.url && router.get(link.url)
                                        }
                                        disabled={!link.url}
                                        className={`px-3 py-1.5 border rounded-md text-sm transition-colors 
                                            ${link.active ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 hover:bg-gray-100"} 
                                            ${!link.url && "opacity-40 cursor-not-allowed"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modal Form Tambah/Edit --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">
                        {isEditing
                            ? "Edit Data Alat Kesehatan"
                            : "Tambah Alat Kesehatan Baru"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Input: Nomor Inventaris */}
                        <div>
                            <InputLabel
                                htmlFor="inventory_number"
                                value="Nomor Inventaris"
                            />
                            <TextInput
                                id="inventory_number"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.inventory_number}
                                onChange={(e) =>
                                    setData("inventory_number", e.target.value)
                                }
                                placeholder="Cth: INV-2026-001"
                            />
                            <InputError
                                message={errors.inventory_number}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Nama Alat */}
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nama Alat Kesehatan"
                            />
                            <TextInput
                                id="name"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                placeholder="Cth: Patient Monitor"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Ruangan */}
                        <div>
                            <InputLabel
                                htmlFor="room_id"
                                value="Unit / Ruangan"
                            />
                            <select
                                id="room_id"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.room_id}
                                onChange={(e) =>
                                    setData("room_id", e.target.value)
                                }
                            >
                                <option value="">-- Pilih Ruangan --</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.room_id}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Kondisi */}
                        <div>
                            <InputLabel
                                htmlFor="condition"
                                value="Kondisi Saat Ini"
                            />
                            <select
                                id="condition"
                                className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.condition}
                                onChange={(e) =>
                                    setData("condition", e.target.value)
                                }
                            >
                                <option value="baik">Baik</option>
                                <option value="rusak_ringan">
                                    Rusak Ringan
                                </option>
                                <option value="rusak_berat">Rusak Berat</option>
                            </select>
                            <InputError
                                message={errors.condition}
                                className="mt-2"
                            />
                        </div>

                        {/* --- TAMBAHAN: INPUT HARGA & VENDOR --- */}
                        <div>
                            <InputLabel htmlFor="price" value="Harga / Nilai Aset (Rp)" />
                            <TextInput
                                id="price"
                                type="number"
                                min="0"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                placeholder="Cth: 15000000"
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="vendor_id" value="Vendor / Supplier" />
                            <select
                                id="vendor_id"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.vendor_id}
                                onChange={(e) => setData("vendor_id", e.target.value)}
                            >
                                <option value="">-- Pilih Vendor (Opsional) --</option>
                                {vendors && vendors.map((vendor) => (
                                    <option key={vendor.id} value={vendor.id}>
                                        {vendor.name}
                                    </option>
                                ))}
                            </select>
                            <InputError message={errors.vendor_id} className="mt-2" />
                        </div>

                        {/* Input: Merk/Brand */}
                        <div>
                            <InputLabel htmlFor="brand" value="Merk / Tipe" />
                            <TextInput
                                id="brand"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.brand}
                                onChange={(e) =>
                                    setData("brand", e.target.value)
                                }
                                placeholder="Opsional"
                            />
                            <InputError
                                message={errors.brand}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Serial Number */}
                        <div>
                            <InputLabel
                                htmlFor="serial_number"
                                value="Serial Number"
                            />
                            <TextInput
                                id="serial_number"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.serial_number}
                                onChange={(e) =>
                                    setData("serial_number", e.target.value)
                                }
                                placeholder="Opsional"
                            />
                            <InputError
                                message={errors.serial_number}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Tanggal Kalibrasi */}
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="next_calibration_date"
                                value="Tanggal Kalibrasi Berikutnya"
                            />
                            <TextInput
                                id="next_calibration_date"
                                type="date"
                                className={`mt-1 block w-full md:w-1/2 ${isEditing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-50'}`}
                                value={data.next_calibration_date}
                                onChange={(e) =>
                                    setData("next_calibration_date", e.target.value)
                                }
                                disabled={isEditing} 
                            />
                            
                            {isEditing ? (
                                <p className="text-xs text-red-500 mt-1 font-medium">
                                    <svg className="w-3 h-3 inline mr-1 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    Untuk mengubah tanggal kalibrasi, gunakan menu "Tambah Riwayat Kalibrasi" di Halaman Detail.
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1">
                                    Biarkan kosong jika alat tidak memerlukan kalibrasi rutin.
                                </p>
                            )}

                            <InputError
                                message={errors.next_calibration_date}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg border-t border-gray-100">
                        <SecondaryButton onClick={closeModal}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-blue-600 hover:bg-blue-700"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* MODAL BATCH GENERATE QR */}
            <Modal show={isBatchQrModalOpen} onClose={() => setIsBatchQrModalOpen(false)} maxWidth="md">
                <form onSubmit={handleBatchQrSubmit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Generate QR Code Massal</h2>
                    
                    <p className="text-sm text-gray-500 mb-4">
                        Sistem hanya akan membuatkan QR Code untuk alat yang <strong>belum memiliki QR Code</strong>. Alat yang sudah punya tidak akan ditimpa/berubah.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="mode" value="Target Generate" />
                            <select 
                                id="mode" 
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={qrData.mode} 
                                onChange={(e) => setQrData('mode', e.target.value)}
                            >
                                <option value="all_missing">Semua Alat yang Belum Punya QR</option>
                                <option value="by_room">Pilih Berdasarkan Ruangan</option>
                            </select>
                        </div>

                        {qrData.mode === 'by_room' && (
                            <div className="animate-pulse duration-75">
                                <InputLabel htmlFor="room_id" value="Pilih Ruangan" />
                                <select 
                                    id="room_id" 
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-white"
                                    value={qrData.room_id} 
                                    onChange={(e) => setQrData('room_id', e.target.value)}
                                    required={qrData.mode === 'by_room'}
                                >
                                    <option value="">-- Pilih Ruangan --</option>
                                    {rooms && rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={qrErrors.room_id} className="mt-2" />
                            </div>
                        )}
                        <InputError message={qrErrors.error} className="mt-2" />
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsBatchQrModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="bg-purple-600 hover:bg-purple-700 focus:bg-purple-700" disabled={qrProcessing}>
                            {qrProcessing ? 'Memproses...' : 'Mulai Generate'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* MODAL CETAK QR MASSAL */}
            <Modal show={isPrintQrModalOpen} onClose={() => setIsPrintQrModalOpen(false)} maxWidth="sm">
                <form onSubmit={handlePrintSubmit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">Cetak Label Stiker QR</h2>
                    
                    <p className="text-sm text-gray-500 mb-4">
                        Pilih ruangan untuk mencetak label QR. Halaman cetak akan terbuka di tab baru.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="print_room_id" value="Filter Ruangan (Opsional)" />
                            <select 
                                id="print_room_id" 
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-white"
                                value={printRoomId} 
                                onChange={(e) => setPrintRoomId(e.target.value)}
                            >
                                <option value="">-- Cetak Semua Ruangan --</option>
                                {rooms && rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setIsPrintQrModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="bg-teal-600 hover:bg-teal-700 focus:bg-teal-700">
                            Buka Pratinjau Cetak
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            {/* MODAL IMPORT EXCEL */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <form onSubmit={handleImportSubmit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Import Data Alat (Excel)
                    </h2>
                    
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-800 mb-2">
                                <strong>Langkah 1:</strong> Download template Excel terlebih dahulu agar format kolom sesuai dengan sistem.
                            </p>
                            <a 
                                href={route('equipments.template')} 
                                className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 shadow-sm"
                            >
                                ↓ Download Template Excel
                            </a>
                        </div>

                        <div>
                            <InputLabel htmlFor="import_file" value="Langkah 2: Upload File Excel yang sudah diisi" />
                            <input
                                id="import_file"
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                onChange={(e) => setImportData('import_file', e.target.files[0])}
                                required
                            />
                            <InputError message={importErrors.import_file} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton type="button" onClick={() => setIsImportModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton className="bg-green-600 hover:bg-green-700 focus:bg-green-700" disabled={importProcessing}>
                            {importProcessing ? 'Mengimport Data...' : 'Mulai Import'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
