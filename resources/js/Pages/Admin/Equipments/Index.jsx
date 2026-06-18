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

export default function Index({ auth, equipments, rooms, filters }) {
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
                next_calibration_date: equipment.next_calibration_date || "",
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Master Alat Kesehatan
                </h2>
            }
        >
            <Head title="Alat Kesehatan - SIAP PAK" />

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
                                    <button
                                        onClick={() => openModal()}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition whitespace-nowrap"
                                    >
                                        + Tambah Alat
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

                        {/* Input: Merk/Brand */}
                        <div>
                            <InputLabel htmlFor="brand" value="Merk / Brand" />
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
                                className="mt-1 block w-full md:w-1/2 bg-gray-50"
                                value={data.next_calibration_date}
                                onChange={(e) =>
                                    setData(
                                        "next_calibration_date",
                                        e.target.value,
                                    )
                                }
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Biarkan kosong jika alat tidak memerlukan
                                kalibrasi rutin.
                            </p>
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
        </AuthenticatedLayout>
    );
}
