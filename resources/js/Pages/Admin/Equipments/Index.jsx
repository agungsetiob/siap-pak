import React, { useState, Fragment } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, Link } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import FlashMessage from "@/Components/FlashMessage";
import { formatDate } from "@/Helpers/date";
import {
    Plus, Search, Trash2, Edit, Eye, FileSpreadsheet,
    QrCode, Printer, Download, ChevronDown,
    Building2, Package, Calendar, DollarSign,
    Tag, AlertCircle, CheckCircle, XCircle,
    ChevronRight
} from 'lucide-react';
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, Transition, Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';

// Searchable Combobox Component
const SearchableSelect = ({ options, value, onChange, label, placeholder, displayValue, required = false }) => {
    const [query, setQuery] = useState('');

    const filteredOptions = query === ''
        ? options
        : options.filter((option) => {
            const searchTerm = query.toLowerCase();
            const display = displayValue(option).toLowerCase();
            return display.includes(searchTerm);
        });

    return (
        <Combobox value={value} onChange={onChange}>
            <label
                htmlFor="combobox-input"
                className="block text-sm font-medium text-gray-700"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative mt-1">
                <ComboboxInput
                    id="combobox-input"
                    className="w-full rounded-xl border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 pl-10 pr-10 py-2.5"
                    placeholder={placeholder}
                    displayValue={displayValue}
                    onChange={(event) => setQuery(event.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
            </div>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <ComboboxOptions className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-xl py-1 overflow-auto border border-gray-200">
                    {filteredOptions.length === 0 && query !== '' ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Tidak ditemukan</div>
                    ) : (
                        filteredOptions.map((option) => (
                            <ComboboxOption
                                key={option.id}
                                value={option}
                                className="group px-4 py-2.5 hover:bg-blue-50 cursor-pointer transition-colors duration-150 flex items-center gap-3"
                            >
                                <CheckCircle className="h-4 w-4 text-transparent group-data-[selected]:text-blue-600" />
                                <span className="text-sm text-gray-700 group-data-[selected]:font-medium">
                                    {displayValue(option)}
                                </span>
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </Transition>
        </Combobox>
    );
};

// QR Dropdown Menu Component
const QrDropdown = ({ onGenerate, onPrint }) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl">
                <QrCode className="w-4 h-4" />
                <span className="hidden sm:inline">QR</span>
                <ChevronDown className="w-3 h-3 ml-1" />
            </MenuButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-lg border border-gray-100 py-1 focus:outline-none z-50">
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={onGenerate}
                                className={`${active ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                                    } group flex w-full items-center gap-3 px-4 py-3 text-sm transition-all duration-150`}
                            >
                                <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                                    <QrCode className="w-4 h-4" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">Generate QR</div>
                                    <div className="text-xs text-gray-500">Buat QR untuk alat yang belum punya</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ active }) => (
                            <button
                                onClick={onPrint}
                                className={`${active ? 'bg-teal-50 text-teal-700' : 'text-gray-700'
                                    } group flex w-full items-center gap-3 px-4 py-3 text-sm transition-all duration-150 border-t border-gray-100`}
                            >
                                <div className="p-1.5 bg-teal-100 rounded-lg text-teal-600">
                                    <Printer className="w-4 h-4" />
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="font-medium">Cetak Label QR</div>
                                    <div className="text-xs text-gray-500">Cetak stiker QR untuk ruangan</div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </MenuItem>
                </MenuItems>
            </Transition>
        </Menu>
    );
};

export default function Index({ auth, equipments, rooms, vendors, filters, flash }) {
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

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        destroy(route("equipments.destroy", deleteId));
        setIsDeleteModalOpen(false);
    };


    const isAdmin = auth.user.role === "admin";

    // QR Generate Modal
    const [isQrGenerateModalOpen, setIsQrGenerateModalOpen] = useState(false);
    const { data: qrData, setData: setQrData, post: postBatchQr, processing: qrProcessing, errors: qrErrors, reset: resetQr } = useForm({
        mode: 'all_missing',
        room_id: '',
    });

    const handleBatchQrSubmit = (e) => {
        e.preventDefault();
        postBatchQr(route('equipments.batchGenerateQr'), {
            onSuccess: () => {
                setIsQrGenerateModalOpen(false);
                resetQr();
                alert('QR Code berhasil digenerate!');
            }
        });
    };

    // QR Print Modal
    const [isQrPrintModalOpen, setIsQrPrintModalOpen] = useState(false);
    const [printRoomId, setPrintRoomId] = useState('');

    const handlePrintSubmit = (e) => {
        e.preventDefault();
        const url = route('equipments.printBatchQr', printRoomId ? { room_id: printRoomId } : {});
        window.open(url, '_blank');
        setIsQrPrintModalOpen(false);
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
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Master Alat Kesehatan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Alat Kesehatan" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">
                    <FlashMessage flash={flash} />
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                                placeholder="Cari nama atau no. inventaris..."
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

                                {isAdmin && (
                                    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                        {/* Import Button */}
                                        <button
                                            onClick={() => setIsImportModalOpen(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 font-medium shadow-lg shadow-green-500/20 transition-all duration-200 hover:shadow-xl"
                                        >
                                            <FileSpreadsheet className="w-4 h-4" />
                                            <span className="hidden sm:inline">Import</span>
                                        </button>

                                        {/* QR Dropdown */}
                                        <QrDropdown
                                            onGenerate={() => setIsQrGenerateModalOpen(true)}
                                            onPrint={() => setIsQrPrintModalOpen(true)}
                                        />

                                        {/* Add Equipment Button */}
                                        <button
                                            onClick={() => openModal()}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span className="hidden sm:inline">Tambah Alat</span>
                                        </button>
                                        <Link
                                            href={route("equipments.trashed")}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-xl hover:from-pink-600 hover:to-red-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Trash
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* --- Tabel Data --- */}
                            <div className="overflow-x-auto rounded-xl border border-gray-200">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-3.5 h-3.5" />
                                                    No. Inventaris
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-3.5 h-3.5" />
                                                    Alat Kesehatan
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    Ruangan
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 font-semibold">Kondisi</th>
                                            <th className="px-6 py-4 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Kalibrasi
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-center font-semibold">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {equipments.data.map((item, index) => (
                                            <tr
                                                key={item.id}
                                                className={`bg-white border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-mono font-bold text-blue-600 text-sm">
                                                        {item.inventory_number}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-800">
                                                        {item.name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                                                        <span>{item.brand || '-'}</span>
                                                        <span className="w-px h-3 bg-gray-300"></span>
                                                        <span className="font-mono">{item.serial_number || 'S/N Kosong'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                                        <Building2 className="w-3 h-3" />
                                                        {item.room?.name || '-'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide
                                                        ${item.condition === "baik" ? "bg-green-100 text-green-700 border border-green-200" :
                                                            item.condition === "rusak_ringan" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" :
                                                                "bg-red-100 text-red-700 border border-red-200"}`}
                                                    >
                                                        {item.condition === "baik" && <CheckCircle className="w-3 h-3" />}
                                                        {item.condition === "rusak_ringan" && <AlertCircle className="w-3 h-3" />}
                                                        {item.condition === "rusak_berat" && <XCircle className="w-3 h-3" />}
                                                        {item.condition.replace("_", " ").toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {item.next_calibration_date ? (
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="font-medium text-sm">
                                                                {formatDate(item.next_calibration_date)}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Belum Ada</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={route("equipments.show", item.id)}
                                                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200"
                                                            title="Detail & Histori"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        {isAdmin && (
                                                            <>
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
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {equipments.data.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <Package className="w-12 h-12 text-gray-300" />
                                                        <p className="text-gray-500 font-medium">Data alat kesehatan tidak ditemukan</p>
                                                        <p className="text-gray-400 text-sm">Coba ubah kata kunci pencarian atau tambahkan data baru</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Menampilkan <strong>{equipments.from || 0}</strong> sampai <strong>{equipments.to || 0}</strong> dari <strong>{equipments.total}</strong> data
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {equipments.links.map((link, index) => (
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

            {/* --- Modal Form Tambah/Edit --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="3xl">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                            <Package className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? "Edit Data Alat Kesehatan" : "Tambah Alat Kesehatan Baru"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditing ? "Perbarui informasi alat kesehatan" : "Isi data alat kesehatan dengan lengkap"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Input: Nomor Inventaris */}
                        <div>
                            <InputLabel htmlFor="inventory_number" value="Nomor Inventaris" required />
                            <div className="relative mt-1">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="inventory_number"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.inventory_number}
                                    onChange={(e) => setData("inventory_number", e.target.value)}
                                    placeholder="INV-2026-001"
                                />
                            </div>
                            <InputError message={errors.inventory_number} className="mt-2" />
                        </div>

                        {/* Input: Nama Alat */}
                        <div>
                            <InputLabel htmlFor="name" value="Nama Alat Kesehatan" required />
                            <div className="relative mt-1">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Patient Monitor"
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Input: Ruangan - Searchable */}
                        <div>
                            <SearchableSelect
                                options={rooms}
                                value={rooms.find(r => r.id === data.room_id) || null}
                                onChange={(room) => setData("room_id", room ? room.id : "")}
                                label="Unit / Ruangan"
                                placeholder="Cari ruangan..."
                                displayValue={(room) => room?.name || ""}
                                required
                            />
                            <InputError message={errors.room_id} className="mt-2" />
                        </div>

                        {/* Input: Kondisi */}
                        <div>
                            <InputLabel htmlFor="condition" value="Kondisi Saat Ini" />
                            <select
                                id="condition"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                value={data.condition}
                                onChange={(e) => setData("condition", e.target.value)}
                            >
                                <option value="baik">✅ Baik</option>
                                <option value="rusak_ringan">⚠️ Rusak Ringan</option>
                                <option value="rusak_berat">❌ Rusak Berat</option>
                            </select>
                            <InputError message={errors.condition} className="mt-2" />
                        </div>

                        {/* Input: Vendor - Searchable */}
                        <div>
                            <SearchableSelect
                                options={vendors || []}
                                value={vendors?.find(v => v.id === data.vendor_id) || null}
                                onChange={(vendor) => setData("vendor_id", vendor ? vendor.id : "")}
                                label="Vendor / Supplier"
                                placeholder="Cari vendor..."
                                displayValue={(vendor) => vendor?.name || ""}
                            />
                            <InputError message={errors.vendor_id} className="mt-2" />
                        </div>

                        {/* Input: Harga */}
                        <div>
                            <InputLabel htmlFor="price" value="Harga / Nilai Aset (Rp)" />
                            <div className="relative mt-1">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="price"
                                    type="number"
                                    min="0"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.price}
                                    onChange={(e) => setData("price", e.target.value)}
                                    placeholder="15000000"
                                />
                            </div>
                            <InputError message={errors.price} className="mt-2" />
                        </div>

                        {/* Input: Merk */}
                        <div>
                            <InputLabel htmlFor="brand" value="Merk / Tipe" />
                            <TextInput
                                id="brand"
                                type="text"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                value={data.brand}
                                onChange={(e) => setData("brand", e.target.value)}
                                placeholder="Opsional"
                            />
                            <InputError message={errors.brand} className="mt-2" />
                        </div>

                        {/* Input: Serial Number */}
                        <div>
                            <InputLabel htmlFor="serial_number" value="Serial Number" />
                            <TextInput
                                id="serial_number"
                                type="text"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                value={data.serial_number}
                                onChange={(e) => setData("serial_number", e.target.value)}
                                placeholder="Opsional"
                            />
                            <InputError message={errors.serial_number} className="mt-2" />
                        </div>

                        {/* Input: Tanggal Kalibrasi */}
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="next_calibration_date" value="Tanggal Kalibrasi Berikutnya" />
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="next_calibration_date"
                                    type="date"
                                    className={`pl-10 block w-full md:w-1/2 rounded-xl ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-gray-50'} border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200`}
                                    value={data.next_calibration_date}
                                    onChange={(e) => setData("next_calibration_date", e.target.value)}
                                    disabled={isEditing}
                                />
                            </div>
                            {isEditing ? (
                                <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    Untuk mengubah tanggal kalibrasi, gunakan menu "Tambah Riwayat Kalibrasi" di Halaman Detail
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Biarkan kosong jika alat tidak memerlukan kalibrasi rutin
                                </p>
                            )}
                            <InputError message={errors.next_calibration_date} className="mt-2" />
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={closeModal} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL GENERATE QR */}
            <Modal show={isQrGenerateModalOpen} onClose={() => setIsQrGenerateModalOpen(false)} maxWidth="md">
                <form onSubmit={handleBatchQrSubmit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
                            <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Generate QR Code Massal</h2>
                            <p className="text-sm text-gray-500">Buat QR untuk alat yang belum memiliki</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        Sistem hanya akan membuatkan QR Code untuk alat yang <strong>belum memiliki QR Code</strong>. Alat yang sudah punya tidak akan ditimpa.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <InputLabel htmlFor="mode" value="Target Generate" />
                            <select
                                id="mode"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                value={qrData.mode}
                                onChange={(e) => setQrData('mode', e.target.value)}
                            >
                                <option value="all_missing">Semua Alat yang Belum Punya QR</option>
                                <option value="by_room">Pilih Berdasarkan Ruangan</option>
                            </select>
                        </div>

                        {qrData.mode === 'by_room' && (
                            <div>
                                <SearchableSelect
                                    options={rooms}
                                    value={rooms.find(r => r.id === qrData.room_id) || null}
                                    onChange={(room) => setQrData('room_id', room ? room.id : '')}
                                    label="Pilih Ruangan"
                                    placeholder="Cari ruangan..."
                                    displayValue={(room) => room?.name || ""}
                                    required
                                />
                                <InputError message={qrErrors.room_id} className="mt-2" />
                            </div>
                        )}
                        <InputError message={qrErrors.error} className="mt-2" />
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton type="button" onClick={() => setIsQrGenerateModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-purple-500/20"
                            disabled={qrProcessing}
                        >
                            {qrProcessing ? 'Memproses...' : 'Mulai Generate'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL CETAK QR */}
            <Modal show={isQrPrintModalOpen} onClose={() => setIsQrPrintModalOpen(false)} maxWidth="md">
                <form onSubmit={handlePrintSubmit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white">
                            <Printer className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Cetak Label Stiker QR</h2>
                            <p className="text-sm text-gray-500">Cetak label QR untuk ruangan tertentu</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                        Pilih ruangan untuk mencetak label QR. Halaman cetak akan terbuka di tab baru.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <SearchableSelect
                                options={rooms}
                                value={rooms.find(r => r.id === printRoomId) || null}
                                onChange={(room) => setPrintRoomId(room ? room.id : '')}
                                label="Filter Ruangan (Opsional)"
                                placeholder="Cari ruangan..."
                                displayValue={(room) => room?.name || ""}
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton type="button" onClick={() => setIsQrPrintModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl px-6 py-2.5 shadow-lg shadow-teal-500/20"
                        >
                            Buka Pratinjau Cetak
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL IMPORT EXCEL */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <form onSubmit={handleImportSubmit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl text-white">
                            <FileSpreadsheet className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Import Data Alat (Excel)</h2>
                            <p className="text-sm text-gray-500">Upload file Excel untuk import data massal</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-800 mb-3 flex items-start gap-2">
                                <span className="font-bold mt-0.5">Langkah 1:</span>
                                <span>Download template Excel terlebih dahulu agar format kolom sesuai dengan sistem.</span>
                            </p>
                            <a
                                href={route('equipments.template')}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200"
                            >
                                <Download className="w-4 h-4" />
                                Download Template Excel
                            </a>
                        </div>

                        <div>
                            <InputLabel htmlFor="import_file" value="Langkah 2: Upload File Excel yang sudah diisi" />
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all duration-200">
                                <input
                                    id="import_file"
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                    onChange={(e) => setImportData('import_file', e.target.files[0])}
                                    required
                                />
                            </div>
                            <InputError message={importErrors.import_file} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton type="button" onClick={() => setIsImportModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-6 py-2.5 shadow-lg shadow-green-500/20"
                            disabled={importProcessing}
                        >
                            {importProcessing ? 'Mengimport...' : 'Mulai Import'}
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
                            <p className="text-sm text-gray-500">Apakah Anda yakin ingin menghapus data alat ini?</p>
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