import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { FlashMessage, DeleteModal } from "@/Components";
import QrCodeModal from "./Partials/QrCodeModal";
import CalibrationModal from "./Partials/CalibrationModal";
import MoveRoomModal from "./Partials/MoveRoomModal";
import { formatDate } from "@/Helpers/date";
import {
    ArrowLeft,
    Package,
    Building2,
    Tag,
    Calendar,
    DollarSign,
    QrCode,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    Move,
    Eye,
    Edit,
    Trash2,
    Plus,
} from "lucide-react";

export default function Show({ auth, equipment, rooms, flash }) {
    const isAdmin = auth.user.role === "admin";

    // State untuk modal
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isCalibrationModalOpen, setIsCalibrationModalOpen] = useState(false);
    const [editingCalibration, setEditingCalibration] = useState(null);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Handler kalibrasi
    const openAddCalibration = () => {
        setEditingCalibration(null);
        setIsCalibrationModalOpen(true);
    };

    const openEditCalibration = (calibration) => {
        setEditingCalibration(calibration);
        setIsCalibrationModalOpen(true);
    };

    // Handler delete
    const handleDelete = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        router.delete(route("calibrations.destroy", deleteId));
        setIsDeleteModalOpen(false);
    };

    // Handler QR
    const handleGenerateQr = () => {
        if (!equipment.qr) {
            router.post(
                route("equipments.generateQr", equipment.id),
                {},
                {
                    onSuccess: () => {
                        setIsQrModalOpen(true);
                    },
                },
            );
        } else {
            setIsQrModalOpen(true);
        }
    };

    // Helper badges
    const getResultBadge = (result) => {
        const styles = {
            laik: "bg-green-100 text-green-700 border-green-200",
            laik_dengan_catatan:
                "bg-yellow-100 text-yellow-700 border-yellow-200",
            tidak_laik: "bg-red-100 text-red-700 border-red-200",
        };
        const icons = {
            laik: <CheckCircle className="w-3 h-3" />,
            laik_dengan_catatan: <AlertCircle className="w-3 h-3" />,
            tidak_laik: <XCircle className="w-3 h-3" />,
        };
        const labels = {
            laik: "LAIK",
            laik_dengan_catatan: "LAIK DENGAN CATATAN",
            tidak_laik: "TIDAK LAIK",
        };
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[result] || styles.laik}`}
            >
                {icons[result] || icons.laik}
                {labels[result] || result}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const styles = {
            selesai: "bg-green-100 text-green-700 border-green-200",
            menunggu: "bg-red-100 text-red-700 border-red-200",
            diproses: "bg-yellow-100 text-yellow-700 border-yellow-200",
            dibatalkan: "bg-gray-100 text-gray-700 border-gray-200",
        };
        const icons = {
            selesai: <CheckCircle className="w-3 h-3" />,
            menunggu: <Clock className="w-3 h-3" />,
            diproses: <AlertCircle className="w-3 h-3" />,
            dibatalkan: <XCircle className="w-3 h-3" />,
        };
        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.menunggu}`}
            >
                {icons[status] || icons.menunggu}
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Detail Alat Kesehatan
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title={`Detail ${equipment.name}`} />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4 space-y-6">
                    {/* Tombol Kembali */}
                    <Link
                        href={route("equipments.index")}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Master Alat
                    </Link>

                    {/* INFO ALAT */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <FlashMessage flash={flash} />
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl text-white shadow-lg shadow-blue-500/20">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {equipment.name}
                                        </h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm text-gray-500 font-mono">
                                                {equipment.inventory_number}
                                            </span>
                                            <span className="w-px h-4 bg-gray-300"></span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${equipment.condition === "baik" ? "bg-green-100 text-green-700" : equipment.condition === "rusak_ringan" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}
                                            >
                                                {equipment.condition
                                                    .replace("_", " ")
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                    <button
                                        onClick={handleGenerateQr}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <QrCode className="w-4 h-4" />
                                        {equipment.qr
                                            ? "Lihat QR"
                                            : "Generate QR"}
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() =>
                                                setIsMoveModalOpen(true)
                                            }
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 font-medium shadow-lg shadow-orange-500/20 transition-all duration-200 hover:shadow-xl"
                                        >
                                            <Move className="w-4 h-4" />
                                            Pindah
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid - tetap sama */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Ruangan
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {equipment.room?.name || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Tag className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Merk / Tipe
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {equipment.brand || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Nilai Aset
                                    </p>
                                    <p className="font-semibold text-green-700">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        }).format(equipment.price || 0)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Kalibrasi Berikutnya
                                    </p>
                                    <p className="font-semibold text-amber-700">
                                        {equipment.next_calibration_date
                                            ? formatDate(
                                                  equipment.next_calibration_date,
                                              )
                                            : "Belum Terjadwal"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIWAYAT PERAWATAN & PERBAIKAN - tetap */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" />
                                Riwayat Perawatan & Perbaikan
                            </h3>
                            <span className="text-xs text-gray-500">
                                {equipment.reports?.length || 0} tiket
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            No. Tiket
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Jenis
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Keluhan
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Tindakan
                                        </th>
                                        <th className="px-6 py-3 text-center font-semibold">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.reports &&
                                        equipment.reports.map((rep) => (
                                            <tr
                                                key={rep.id}
                                                className="border-b hover:bg-blue-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm">
                                                    {formatDate(rep.created_at)}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-blue-600 text-sm">
                                                    {rep.ticket_number}
                                                </td>
                                                <td className="px-6 py-4 capitalize text-sm">
                                                    {rep.type}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm max-w-[150px] truncate"
                                                    title={rep.description}
                                                >
                                                    {rep.description}
                                                </td>
                                                <td
                                                    className="px-6 py-4 text-sm max-w-[150px] truncate"
                                                    title={
                                                        rep.action_taken || "-"
                                                    }
                                                >
                                                    {rep.action_taken || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {getStatusBadge(rep.status)}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={route(
                                                            "reports.show",
                                                            rep.id,
                                                        )}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    {(!equipment.reports ||
                                        equipment.reports.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="w-10 h-10 text-gray-300" />
                                                    <p>
                                                        Belum ada riwayat
                                                        perbaikan atau perawatan
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIWAYAT KALIBRASI */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                Riwayat & Sertifikat Kalibrasi
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500">
                                    {equipment.calibrations?.length || 0} data
                                </span>
                                {isAdmin && (
                                    <button
                                        onClick={openAddCalibration}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        Tambah
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            Tanggal Kalibrasi
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Lembaga Penguji
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            No. Sertifikat
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Hasil
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Sertifikat
                                        </th>
                                        <th className="px-6 py-3 text-center font-semibold">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.calibrations &&
                                        equipment.calibrations.map((cal) => (
                                            <tr
                                                key={cal.id}
                                                className="border-b hover:bg-blue-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900">
                                                        {formatDate(
                                                            cal.calibration_date,
                                                        )}
                                                    </div>
                                                    {cal.report && (
                                                        <Link
                                                            href={route(
                                                                "reports.show",
                                                                cal.report.id,
                                                            )}
                                                            className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full inline-block mt-1 hover:underline"
                                                        >
                                                            Terkait:{" "}
                                                            {
                                                                cal.report
                                                                    .ticket_number
                                                            }
                                                        </Link>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {cal.testing_institution ||
                                                        "-"}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm">
                                                    {cal.certificate_number ||
                                                        "-"}
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
                                                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            Lihat PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isAdmin ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() =>
                                                                    openEditCalibration(
                                                                        cal,
                                                                    )
                                                                }
                                                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        cal.id,
                                                                    )
                                                                }
                                                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    {(!equipment.calibrations ||
                                        equipment.calibrations.length ===
                                            0) && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle className="w-10 h-10 text-gray-300" />
                                                    <p>
                                                        Belum ada data kalibrasi
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIWAYAT PERPINDAHAN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                <Move className="w-4 h-4 text-orange-600" />
                                Riwayat Perpindahan / Mutasi
                            </h3>
                            <span className="text-xs text-gray-500">
                                {equipment.movements?.length || 0} kali pindah
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">
                                            Waktu Pindah
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Dari Ruangan
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Ke Ruangan
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Dipindahkan Oleh
                                        </th>
                                        <th className="px-6 py-3 font-semibold">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.movements &&
                                        equipment.movements.map((move) => (
                                            <tr
                                                key={move.id}
                                                className="border-b hover:bg-blue-50/30 transition-colors"
                                            >
                                                <td className="px-6 py-4 text-sm">
                                                    {formatDate(move.moved_at)}
                                                </td>
                                                <td className="px-6 py-4 text-red-600 font-medium">
                                                    {move.from_room?.name ||
                                                        "Gudang/Awal"}
                                                </td>
                                                <td className="px-6 py-4 text-green-600 font-medium">
                                                    {move.to_room?.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    {move.mover?.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 italic">
                                                    {move.notes || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    {(!equipment.movements ||
                                        equipment.movements.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-10 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Move className="w-10 h-10 text-gray-300" />
                                                    <p>
                                                        Belum ada riwayat
                                                        perpindahan
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}
            <QrCodeModal
                show={isQrModalOpen}
                onClose={() => setIsQrModalOpen(false)}
                equipment={equipment}
            />

            <CalibrationModal
                key={editingCalibration?.id || "new"}
                show={isCalibrationModalOpen}
                onClose={() => {
                    setIsCalibrationModalOpen(false);
                    setEditingCalibration(null);
                }}
                equipment={equipment}
                calibration={editingCalibration}
            />

            <MoveRoomModal
                show={isMoveModalOpen}
                onClose={() => setIsMoveModalOpen(false)}
                equipment={equipment}
                rooms={rooms}
            />

            <DeleteModal
                show={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Konfirmasi Hapus"
                message="Apakah Anda yakin ingin menghapus data kalibrasi ini? File sertifikat juga akan terhapus."
            />
        </AuthenticatedLayout>
    );
}
