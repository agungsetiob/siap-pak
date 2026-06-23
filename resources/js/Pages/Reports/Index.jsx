import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { 
    Search, 
    Plus, 
    FileText, 
    Clock, 
    CheckCircle, 
    AlertCircle, 
    XCircle,
    ChevronRight,
    ChevronDown,
    Check
} from "lucide-react";
import { Combobox, ComboboxInput, ComboboxOptions, ComboboxOption, ComboboxButton } from '@headlessui/react';

export default function Index({ auth, reports, equipments }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchEquipment, setSearchEquipment] = useState("");
    const isRuangan = auth.user.role === "ruangan";

    const { data, setData, post, reset, errors, processing, clearErrors } =
        useForm({
            equipment_id: "",
            type: "kerusakan",
            description: "",
        });

    // Filter equipments based on search
    const filteredEquipments = useMemo(() => {
        if (!searchEquipment) return equipments;
        return equipments.filter(eq => 
            eq.name.toLowerCase().includes(searchEquipment.toLowerCase()) ||
            eq.inventory_number?.toLowerCase().includes(searchEquipment.toLowerCase()) ||
            eq.brand?.toLowerCase().includes(searchEquipment.toLowerCase())
        );
    }, [equipments, searchEquipment]);

    // Mendapatkan object alat yang sedang dipilih untuk Combobox display
    const selectedEquipment = useMemo(() => {
        return equipments.find(eq => eq.id == data.equipment_id) || null;
    }, [data.equipment_id, equipments]);

    const openModal = () => {
        clearErrors();
        reset();
        setSearchEquipment("");
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("reports.store"), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                setSearchEquipment("");
                alert(
                    "Laporan berhasil dikirim dan notifikasi WA telah diteruskan ke Admin/Teknisi.",
                );
            },
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            menunggu: "bg-red-100 text-red-800 border-red-200",
            diproses: "bg-yellow-100 text-yellow-800 border-yellow-200",
            selesai: "bg-green-100 text-green-800 border-green-200",
            dibatalkan: "bg-gray-100 text-gray-800 border-gray-200",
        };
        const icons = {
            menunggu: <AlertCircle className="w-3.5 h-3.5" />,
            diproses: <Clock className="w-3.5 h-3.5" />,
            selesai: <CheckCircle className="w-3.5 h-3.5" />,
            dibatalkan: <XCircle className="w-3.5 h-3.5" />,
        };
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status]}`}
            >
                {icons[status]}
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Tiket Laporan & Pemeliharaan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Laporan" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Header Area */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    Daftar Tiket
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    Pantau status laporan kerusakan, pemeliharaan, dan kalibrasi alat.
                                </p>
                            </div>

                            <button
                                onClick={openModal}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Buat Laporan
                            </button>
                        </div>

                        {/* Tabel Tiket */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold">No. Tiket</th>
                                        <th className="px-6 py-4 font-semibold">Alat Kesehatan</th>
                                        {!isRuangan && (
                                            <th className="px-6 py-4 font-semibold">Ruangan Pelapor</th>
                                        )}
                                        <th className="px-6 py-4 font-semibold">Jenis</th>
                                        <th className="px-6 py-4 font-semibold">Deskripsi</th>
                                        <th className="px-6 py-4 font-semibold text-center">Status</th>
                                        <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {reports.data.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="hover:bg-gray-50/80 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-semibold text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                                                    {report.ticket_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">
                                                    {report.equipment?.name}
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {report.equipment?.inventory_number}
                                                </div>
                                            </td>

                                            {!isRuangan && (
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">
                                                        {report.equipment?.room?.name || '-'}
                                                    </span>
                                                </td>
                                            )}

                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                                    ${report.type === 'kerusakan' ? 'bg-red-100 text-red-700' : 
                                                      report.type === 'pemeliharaan' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-purple-100 text-purple-700'}`}
                                                >
                                                    {report.type === 'kerusakan' ? '🔧' : 
                                                     report.type === 'pemeliharaan' ? '🛠️' : '📊'}
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className="truncate max-w-[200px] text-gray-600"
                                                    title={report.description}
                                                >
                                                    {report.description}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(report.status)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={route("reports.show", report.id)}
                                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                                                >
                                                    Detail
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {reports.data.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={isRuangan ? 6 : 7}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="w-12 h-12 text-gray-300" />
                                                    <p className="text-sm font-medium">Belum ada data laporan</p>
                                                    <p className="text-xs text-gray-400">Laporan yang dibuat akan muncul di sini</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {reports.links && reports.links.length > 0 && (
                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    Menampilkan {reports.from || 0} - {reports.to || 0} dari {reports.total || 0} data
                                </div>
                                <div className="flex gap-1">
                                    {reports.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                link.active 
                                                    ? 'bg-blue-600 text-white shadow-sm' 
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200'
                                            } ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Buat Laporan */}
            <Modal
                show={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSearchEquipment("");
                }}
                maxWidth="2xl"
            >
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25">
                            <Plus className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Buat Laporan Baru</h2>
                            <p className="text-sm text-gray-500">Isi detail laporan kerusakan / pemeliharaan alat</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* ==================================================== */}
                        {/* INPUT PENCARIAN ALAT (Diganti Menggunakan Headless UI) */}
                        {/* ==================================================== */}
                        <div>
                            <InputLabel value="Pilih Alat Kesehatan" className="text-sm font-semibold mb-1.5" />
                            <Combobox 
                                value={selectedEquipment} 
                                onChange={(eq) => setData('equipment_id', eq ? eq.id : '')}
                            >
                                <div className="relative">
                                    <div className="relative w-full cursor-default overflow-hidden rounded-xl border border-gray-300 bg-gray-50/50 text-left focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all duration-200 sm:text-sm">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                                        <ComboboxInput
                                            className="w-full border-none py-2.5 pl-9 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 bg-transparent outline-none"
                                            displayValue={(eq) => eq ? `${eq.name} (${eq.inventory_number})` : ''}
                                            onChange={(event) => setSearchEquipment(event.target.value)}
                                            placeholder="Ketik nama, nomor inventaris, atau merk alat..."
                                            autoComplete="off"
                                        />
                                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <ChevronDown className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" aria-hidden="true" />
                                        </ComboboxButton>
                                    </div>
                                    
                                    <ComboboxOptions className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {filteredEquipments.length === 0 && searchEquipment !== '' ? (
                                            <div className="relative cursor-default select-none py-3 px-4 text-gray-500 text-center">
                                                Alat tidak ditemukan.
                                            </div>
                                        ) : (
                                            filteredEquipments.map((eq) => (
                                                <ComboboxOption
                                                    key={eq.id}
                                                    className={({ active }) =>
                                                        `relative cursor-default select-none py-2.5 pl-10 pr-4 transition-colors ${
                                                            active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                        }`
                                                    }
                                                    value={eq}
                                                >
                                                    {({ selected, active }) => (
                                                        <>
                                                            <span className={`block truncate ${selected ? 'font-semibold text-blue-700' : 'font-medium'}`}>
                                                                {eq.name} 
                                                                <span className={`ml-2 text-xs ${active ? 'text-blue-500' : 'text-gray-400'}`}>
                                                                    ({eq.inventory_number}) {eq.brand ? `- ${eq.brand}` : ''}
                                                                </span>
                                                            </span>
                                                            {selected ? (
                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                                                    <Check className="h-4 w-4" aria-hidden="true" />
                                                                </span>
                                                            ) : null}
                                                        </>
                                                    )}
                                                </ComboboxOption>
                                            ))
                                        )}
                                    </ComboboxOptions>
                                </div>
                            </Combobox>
                            <InputError message={errors.equipment_id} className="mt-2" />
                            <p className="text-xs text-gray-400 mt-1.5 text-right">
                                {filteredEquipments.length} alat tersedia
                            </p>
                        </div>
                        {/* ==================================================== */}

                        {/* Jenis Laporan */}
                        <div>
                            <InputLabel htmlFor="type" value="Jenis Laporan" className="text-sm font-semibold" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-1.5">
                                {[
                                    { value: 'kerusakan', label: 'Kerusakan / Perbaikan', icon: '🔧', color: 'red' },
                                    { value: 'pemeliharaan', label: 'Pemeliharaan Rutin', icon: '🛠️', color: 'blue' },
                                    { value: 'kalibrasi', label: 'Kalibrasi', icon: '📊', color: 'green' },
                                ].map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                            data.type === option.value
                                                ? `border-${option.color}-500 bg-${option.color}-50`
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="type"
                                            value={option.value}
                                            checked={data.type === option.value}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="hidden"
                                        />
                                        <span className="text-lg">{option.icon}</span>
                                        <span className={`text-sm font-medium ${data.type === option.value ? `text-${option.color}-700` : 'text-gray-600'}`}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.type} className="mt-2" />
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <InputLabel htmlFor="description" value="Keluhan / Deskripsi Masalah" className="text-sm font-semibold" />
                            <textarea
                                id="description"
                                rows="4"
                                className="mt-1 w-full border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 resize-none p-3"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                placeholder="Jelaskan secara detail kendala yang terjadi pada alat..."
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                            <p className="text-xs text-gray-400 mt-1.5 text-right">
                                {data.description.length}/500 karakter
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton 
                            onClick={() => {
                                setIsModalOpen(false);
                                setSearchEquipment("");
                            }}
                            className="w-full sm:w-auto justify-center"
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="w-full sm:w-auto justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded px-6 py-2.5 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200"
                            disabled={processing}
                        >
                            {processing ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Mengirim...
                                </span>
                            ) : (
                                'Kirim Laporan'
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}