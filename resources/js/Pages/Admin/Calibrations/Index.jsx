import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { Head, Link, router } from "@inertiajs/react";
import { formatDate } from "@/Helpers/date";
import {
    Calendar,
    AlertCircle,
    CheckCircle,
    XCircle,
    FileText,
    Package,
    Building2,
    Users,
    Clock,
    ChevronRight,
    Download,
    Trash2,
    List,
    Grid,
} from "lucide-react";

export default function Index({
    auth,
    calibrations,
    upcomingCalibrations,
    stats,
}) {
    const [viewMode, setViewMode] = useState("table");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        destroy(route("calibrations.destroy", deleteId));
        setIsDeleteModalOpen(false);
    };

    const getResultBadge = (result) => {
        const styles = {
            laik: "bg-green-100 text-green-800 border-green-200",
            laik_dengan_catatan:
                "bg-yellow-100 text-yellow-800 border-yellow-200",
            tidak_laik: "bg-red-100 text-red-800 border-red-200",
        };
        const icons = {
            laik: <CheckCircle className="w-3.5 h-3.5" />,
            laik_dengan_catatan: <AlertCircle className="w-3.5 h-3.5" />,
            tidak_laik: <XCircle className="w-3.5 h-3.5" />,
        };
        const labels = {
            laik: "LAIK",
            laik_dengan_catatan: "LAIK DENGAN CATATAN",
            tidak_laik: "TIDAK LAIK",
        };
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase border ${styles[result]}`}
            >
                {icons[result]}
                {labels[result]}
            </span>
        );
    };

    const getDaysRemaining = (dateString) => {
        const today = new Date();
        const targetDate = new Date(dateString);
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    // Stats
    const totalCalibrations = calibrations.total || 0;
    const upcomingCount = upcomingCalibrations.length;
    const expiredCount = upcomingCalibrations.filter(
        (eq) => getDaysRemaining(eq.next_calibration_date) < 0,
    ).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Manajemen Kalibrasi
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Kalibrasi" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4 space-y-6">
                    {/* --- Stats Cards --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                                        Total Kalibrasi
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {stats.total}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-500/10 rounded-xl">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-orange-600 uppercase tracking-wider">
                                        Akan Datang (H-30)
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {stats.upcoming}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-500/10 rounded-xl">
                                    <Clock className="w-6 h-6 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                                        Terlewat
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {stats.expired}
                                    </p>
                                </div>
                                <div className="p-3 bg-red-500/10 rounded-xl">
                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                                        Sertifikat Terupload
                                    </p>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {stats.withCert}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-500/10 rounded-xl">
                                    <Download className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- SECTION: PERINGATAN JATUH TEMPO --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-200 flex items-center gap-3">
                            <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-600">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">
                                    Perhatian: Jatuh Tempo Kalibrasi (H-30)
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Alat kesehatan yang perlu segera dikalibrasi
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">
                                    {upcomingCount} Alat
                                </span>
                            </div>
                        </div>
                        <div className="p-0">
                            {upcomingCalibrations.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="bg-gray-50 border-b text-gray-700 uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-3.5 h-3.5" />
                                                        Alat Kesehatan
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        Ruangan
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        Jatuh Tempo
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-right">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {upcomingCalibrations.map((eq) => {
                                                const days = getDaysRemaining(
                                                    eq.next_calibration_date,
                                                );
                                                const isExpired = days < 0;
                                                return (
                                                    <tr
                                                        key={eq.id}
                                                        className="border-b hover:bg-orange-50/50 transition-all duration-150"
                                                    >
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-gray-800">
                                                                {eq.name}
                                                            </div>
                                                            <div className="text-xs text-gray-400 font-mono">
                                                                {
                                                                    eq.inventory_number
                                                                }
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {eq.room?.name ||
                                                                "-"}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div
                                                                className={`font-bold ${isExpired ? "text-red-600" : "text-orange-600"}`}
                                                            >
                                                                {formatDate(
                                                                    eq.next_calibration_date,
                                                                )}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-0.5">
                                                                {isExpired
                                                                    ? `Terlewat ${Math.abs(days)} hari`
                                                                    : `Tersisa ${days} hari`}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <Link
                                                                href={route(
                                                                    "equipments.show",
                                                                    eq.id,
                                                                )}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg font-semibold text-xs transition-all duration-200"
                                                            >
                                                                Update Kalibrasi
                                                                <ChevronRight className="w-3.5 h-3.5" />
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                                    <p className="text-gray-500 font-medium">
                                        Semua alat dalam kondisi aman
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        Tidak ada kalibrasi yang mendekati jatuh
                                        tempo
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- SECTION: ARSIP KALIBRASI --- */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-gray-500/20 rounded-lg text-gray-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">
                                        Arsip Sertifikat Kalibrasi
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Riwayat kalibrasi semua alat
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="flex bg-gray-200 rounded-xl p-1">
                                    <button
                                        onClick={() => setViewMode("table")}
                                        className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === "table" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode("grid")}
                                        className={`p-1.5 rounded-lg transition-all duration-200 ${viewMode === "grid" ? "bg-white shadow-sm text-gray-800" : "text-gray-500 hover:text-gray-700"}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {viewMode === "table" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-600">
                                    <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                        <tr>
                                            <th className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Tgl Kalibrasi
                                                </div>
                                            </th>
                                            <th className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Package className="w-3.5 h-3.5" />
                                                    Alat & Ruangan
                                                </div>
                                            </th>
                                            <th className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3.5 h-3.5" />
                                                    Penguji & No. Sertifikat
                                                </div>
                                            </th>
                                            <th className="px-6 py-4">Hasil</th>
                                            <th className="px-6 py-4">
                                                Sertifikat
                                            </th>
                                            <th className="px-6 py-4 text-center">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {calibrations.data.map((cal, index) => (
                                            <tr
                                                key={cal.id}
                                                className={`bg-white border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                                            >
                                                <td className="px-6 py-4 font-medium">
                                                    {formatDate(
                                                        cal.calibration_date,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link
                                                        href={route(
                                                            "equipments.show",
                                                            cal.equipment_id,
                                                        )}
                                                        className="font-semibold text-blue-600 hover:underline"
                                                    >
                                                        {cal.equipment?.name}
                                                    </Link>
                                                    <div className="text-xs text-gray-400">
                                                        {
                                                            cal.equipment?.room
                                                                ?.name
                                                        }
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">
                                                        {cal.testing_institution ||
                                                            "-"}
                                                    </div>
                                                    <div className="font-mono text-xs text-gray-500">
                                                        {cal.certificate_number ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getResultBadge(cal.result)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {cal.certificate_file ? (
                                                        <a
                                                            href={`/storage/${cal.certificate_file}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-all duration-200"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            Lihat PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(cal.id)
                                                        }
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {calibrations.data.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="flex flex-col items-center gap-2">
                                                        <FileText className="w-12 h-12 text-gray-300" />
                                                        <p className="text-gray-500 font-medium">
                                                            Belum ada arsip
                                                            kalibrasi
                                                        </p>
                                                        <p className="text-gray-400 text-sm">
                                                            Tambahkan riwayat
                                                            kalibrasi dari
                                                            halaman detail alat
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                {calibrations.data.map((cal) => (
                                    <div
                                        key={cal.id}
                                        className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div
                                                className={`p-2.5 rounded-xl ${
                                                    cal.result === "laik"
                                                        ? "bg-green-50 text-green-600"
                                                        : cal.result ===
                                                            "laik_dengan_catatan"
                                                          ? "bg-yellow-50 text-yellow-600"
                                                          : "bg-red-50 text-red-600"
                                                }`}
                                            >
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleDelete(cal.id)
                                                }
                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="mb-3">
                                            <Link
                                                href={route(
                                                    "equipments.show",
                                                    cal.equipment_id,
                                                )}
                                                className="font-semibold text-blue-600 hover:underline"
                                            >
                                                {cal.equipment?.name}
                                            </Link>
                                            <p className="text-xs text-gray-400">
                                                {cal.equipment?.room?.name}
                                            </p>
                                        </div>
                                        <div className="space-y-1.5 text-sm border-t border-gray-100 pt-3">
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                                <span>
                                                    {formatDate(
                                                        cal.calibration_date,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="truncate">
                                                    {cal.testing_institution ||
                                                        "-"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getResultBadge(cal.result)}
                                            </div>
                                            {cal.certificate_file && (
                                                <a
                                                    href={`/storage/${cal.certificate_file}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition-all duration-200 mt-1"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Lihat Sertifikat
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {calibrations.data.length === 0 && (
                                    <div className="col-span-full text-center py-12">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText className="w-12 h-12 text-gray-300" />
                                            <p className="text-gray-500 font-medium">
                                                Tidak ada arsip
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                            <span className="text-sm text-gray-600">
                                Menampilkan{" "}
                                <strong>{calibrations.from || 0}</strong> sampai{" "}
                                <strong>{calibrations.to || 0}</strong> dari{" "}
                                <strong>{calibrations.total}</strong> data
                            </span>
                            <div className="flex flex-wrap gap-1">
                                {calibrations.links.map((link, index) => (
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
            <Modal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                maxWidth="sm"
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 pb-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl text-white">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Konfirmasi Hapus
                            </h2>
                            <p className="text-sm text-gray-500">
                                Apakah Anda yakin ingin menghapus data alat ini?
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="rounded-xl"
                        >
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
