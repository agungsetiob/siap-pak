import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { Modal, InputLabel, TextInput, InputError, PrimaryButton, SecondaryButton, DeleteModal } from "@/Components";
import {
    Plus,
    Search,
    Edit,
    Trash2,
    User,
    Phone,
    Briefcase,
    CheckCircle,
    XCircle,
    Grid,
    List,
    ChevronDown,
    Users,
    Shield,
    Award,
    Clock,
    UserCheck,
    UserX,
    Activity,
} from "lucide-react";
import FlashMessage from "@/Components/FlashMessage";

export default function Index({ auth, technicians, filters, flash, stats }) {
    const [search, setSearch] = useState(filters?.search || "");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState("table");

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
        name: "",
        phone_number: "",
        specialization: "",
        is_active: 1,
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("technicians.index"),
            { search },
            { preserveState: true },
        );
    };

    const openModal = (tech = null) => {
        clearErrors();
        if (tech) {
            setIsEditing(true);
            setData({
                id: tech.id,
                name: tech.name,
                phone_number: tech.phone_number,
                specialization: tech.specialization || "",
                is_active: tech.is_active,
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
            put(route("technicians.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route("technicians.store"), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
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
        destroy(route("technicians.destroy", deleteId));
        setIsDeleteModalOpen(false);
    };

    // Get status badge
    const getStatusBadge = (isActive) => {
        if (isActive) {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                    <CheckCircle className="w-3 h-3" />
                    AKTIF
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">
                <XCircle className="w-3 h-3" />
                NON-AKTIF
            </span>
        );
    };

    // Get color for technician
    const getTechColor = (name) => {
        const colors = [
            "bg-blue-50 text-blue-700 border-blue-200",
            "bg-purple-50 text-purple-700 border-purple-200",
            "bg-pink-50 text-pink-700 border-pink-200",
            "bg-green-50 text-green-700 border-green-200",
            "bg-yellow-50 text-yellow-700 border-yellow-200",
            "bg-indigo-50 text-indigo-700 border-indigo-200",
            "bg-red-50 text-red-700 border-red-200",
            "bg-teal-50 text-teal-700 border-teal-200",
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    // Get specialization icon
    const getSpecializationIcon = (spec) => {
        const specMap = {
            radiologi: <Shield className="w-3.5 h-3.5" />,
            lab: <Activity className="w-3.5 h-3.5" />,
            elektromedis: <Briefcase className="w-3.5 h-3.5" />,
            it: <Award className="w-3.5 h-3.5" />,
        };
        const lowerSpec = spec?.toLowerCase() || "";
        for (const [key, icon] of Object.entries(specMap)) {
            if (lowerSpec.includes(key)) {
                return icon;
            }
        }
        return <User className="w-3.5 h-3.5" />;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Master Teknisi
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Master Teknisi" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">
                    <FlashMessage flash={flash} />
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-80">
                                        <form
                                            onSubmit={handleSearch}
                                            className="relative"
                                        >
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Cari nama atau spesialisasi..."
                                                value={search}
                                                onChange={(e) =>
                                                    setSearch(e.target.value)
                                                }
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
                                    {/* Add Technician Button */}
                                    <button
                                        onClick={() => openModal()}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">
                                            Tambah Teknisi
                                        </span>
                                    </button>

                                    {/* View Toggle */}
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode("table")}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "table" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                                            title="Tampilan Tabel"
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode("grid")}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
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
                                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                                                Total Teknisi
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                                {stats.total}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-blue-500/10 rounded-xl">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                                                Aktif
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                                {stats.active}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-green-500/10 rounded-xl">
                                            <UserCheck className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                                                Non-Aktif
                                            </p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">
                                                {stats.inactive}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-red-500/10 rounded-xl">
                                            <UserX className="w-6 h-6 text-red-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Tabel Data --- */}
                            {viewMode === "table" ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5" />
                                                        Nama Teknisi
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        No. WhatsApp
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Award className="w-3.5 h-3.5" />
                                                        Spesialisasi
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {technicians.data.map(
                                                (tech, index) => (
                                                    <tr
                                                        key={tech.id}
                                                        className={`bg-white border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className={`p-1.5 rounded-lg ${getTechColor(tech.name)}`}
                                                                >
                                                                    <User className="w-4 h-4" />
                                                                </div>
                                                                <span className="font-semibold text-gray-800">
                                                                    {tech.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 text-sm font-mono text-blue-600">
                                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                                <a
                                                                    href={`https://wa.me/${tech.phone_number.replace(/^0/, "62")}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="hover:underline"
                                                                >
                                                                    {
                                                                        tech.phone_number
                                                                    }
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {tech.specialization ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium border border-purple-200">
                                                                    {getSpecializationIcon(
                                                                        tech.specialization,
                                                                    )}
                                                                    {
                                                                        tech.specialization
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400 text-xs">
                                                                    -
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            {getStatusBadge(
                                                                tech.is_active,
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center justify-center gap-2">
                                                                <button
                                                                    onClick={() =>
                                                                        openModal(
                                                                            tech,
                                                                        )
                                                                    }
                                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                    title="Edit"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            tech.id,
                                                                        )
                                                                    }
                                                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                    title="Hapus"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ),
                                            )}
                                            {technicians.data.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="px-6 py-12 text-center"
                                                    >
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Users className="w-12 h-12 text-red-400" />
                                                            <p className="text-gray-500 font-medium">
                                                                Data teknisi
                                                                tidak ditemukan
                                                            </p>
                                                            <p className="text-gray-400 text-sm">
                                                                Coba ubah kata
                                                                kunci pencarian
                                                                atau tambahkan
                                                                teknisi baru
                                                            </p>
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
                                    {technicians.data.map((tech) => (
                                        <div
                                            key={tech.id}
                                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div
                                                    className={`p-2.5 rounded-xl ${getTechColor(tech.name)}`}
                                                >
                                                    <User className="w-5 h-5" />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() =>
                                                            openModal(tech)
                                                        }
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                tech.id,
                                                            )
                                                        }
                                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h4 className="font-semibold text-gray-800 text-base">
                                                    {tech.name}
                                                </h4>
                                                <div className="mt-1.5 flex items-center gap-2">
                                                    {getStatusBadge(
                                                        tech.is_active,
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-1.5 text-sm border-t border-gray-100 pt-3">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                    <a
                                                        href={`https://wa.me/${tech.phone_number.replace(/^0/, "62")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline font-mono"
                                                    >
                                                        {tech.phone_number}
                                                    </a>
                                                </div>
                                                {tech.specialization && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Award className="w-3.5 h-3.5 text-gray-400" />
                                                        <span className="text-xs font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                                                            {
                                                                tech.specialization
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 text-gray-400 text-xs">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span>
                                                        Terdaftar:{" "}
                                                        {tech.created_at
                                                            ? new Date(
                                                                  tech.created_at,
                                                              ).toLocaleDateString(
                                                                  "id-ID",
                                                              )
                                                            : "-"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {technicians.data.length === 0 && (
                                        <div className="col-span-full text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-12 h-12 text-red-400" />
                                                <p className="text-gray-500 font-medium">
                                                    Data teknisi tidak ditemukan
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Menampilkan{" "}
                                    <strong>{technicians.from || 0}</strong>{" "}
                                    sampai{" "}
                                    <strong>{technicians.to || 0}</strong> dari{" "}
                                    <strong>{technicians.total}</strong> data
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {technicians.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            disabled={!link.url}
                                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                                                ${
                                                    link.active
                                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                                } 
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
            </div>

            {/* --- MODAL FORM --- */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxWidth="md"
            >
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing
                                    ? "Edit Data Teknisi"
                                    : "Tambah Teknisi Baru"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditing
                                    ? "Perbarui informasi teknisi"
                                    : "Isi data teknisi dengan lengkap"}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Nama Lengkap"
                                required
                            />
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="name"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Nama lengkap teknisi"
                                    required
                                />
                            </div>
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="phone_number"
                                value="Nomor WhatsApp"
                                required
                            />
                            <div className="relative mt-1">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="phone_number"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.phone_number}
                                    onChange={(e) =>
                                        setData("phone_number", e.target.value)
                                    }
                                    placeholder="0812-3456-7890"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">
                                Format: 08xx atau 62xx
                            </p>
                            <InputError
                                message={errors.phone_number}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="specialization"
                                value="Spesialisasi Keahlian"
                            />
                            <div className="relative mt-1">
                                <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="specialization"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.specialization}
                                    onChange={(e) =>
                                        setData(
                                            "specialization",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Cth: Radiologi, Lab, Elektromedis Umum"
                                />
                            </div>
                            <InputError
                                message={errors.specialization}
                                className="mt-2"
                            />
                        </div>
                        {isEditing && (
                            <div>
                                <InputLabel
                                    htmlFor="is_active"
                                    value="Status Akun"
                                />
                                <div className="relative mt-1">
                                    <select
                                        id="is_active"
                                        className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                        value={data.is_active}
                                        onChange={(e) =>
                                            setData("is_active", e.target.value)
                                        }
                                    >
                                        <option value={1}>
                                            ✅ Aktif / Siap Bertugas
                                        </option>
                                        <option value={0}>
                                            ❌ Non-Aktif / Cuti
                                        </option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                                <InputError
                                    message={errors.is_active}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton
                            onClick={() => setIsModalOpen(false)}
                            className="rounded-xl"
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            disabled={processing}
                            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
                        >
                            {processing ? "Menyimpan..." : "Simpan Data"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
            <DeleteModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus data teknisi ini?"
            />
        </AuthenticatedLayout>
    );
}
