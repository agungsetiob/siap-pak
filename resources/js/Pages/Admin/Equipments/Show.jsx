import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import { 
    Modal, InputLabel, TextInput, InputError,
    PrimaryButton, SecondaryButton
 } from "@/Components";
import { formatDate } from "@/Helpers/date";
import {
    ArrowLeft,
    Package,
    Building2,
    Tag,
    Calendar,
    DollarSign,
    QrCode,
    Printer,
    Download,
    Eye,
    Edit,
    Trash2,
    Move,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock,
    ChevronRight,
    Plus,
} from "lucide-react";

export default function Show({ auth, equipment, rooms }) {
    const isAdmin = auth.user.role === "admin";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [isEditCalibration, setIsEditCalibration] = useState(false);

    const {
        data: moveData,
        setData: setMoveData,
        post: postMove,
        processing: moveProcessing,
        errors: moveErrors,
        reset: resetMove,
    } = useForm({
        to_room_id: "",
        notes: "",
    });

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            id: "",
            _method: "post",
            report_id: "",
            certificate_number: "",
            testing_institution: "",
            calibration_date: "",
            next_calibration_date: "",
            result: "laik",
            notes: "",
            certificate_file: null,
        });

    const openModal = (calibration = null) => {
        clearErrors();
        if (calibration) {
            setIsEditCalibration(true);
            setData({
                id: calibration.id,
                _method: "put",
                certificate_number: calibration.certificate_number || "",
                testing_institution: calibration.testing_institution || "",
                report_id: calibration.report_id || "",
                calibration_date: calibration.calibration_date ? calibration.calibration_date.substring(0, 10) : "",
                next_calibration_date: calibration.next_calibration_date ? calibration.next_calibration_date.substring(0, 10) : "",
                result: calibration.result || "laik",
                notes: calibration.notes || "",
                certificate_file: null,
            });
        } else {
            setIsEditCalibration(false);
            reset();
            setData("_method", "post");
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditCalibration) {
            post(route("calibrations.update", data.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        } else {
            post(route("calibrations.store", equipment.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (
            confirm(
                "Yakin ingin menghapus riwayat kalibrasi ini? File sertifikat juga akan terhapus.",
            )
        ) {
            router.delete(route("calibrations.destroy", id));
        }
    };

    const getResultBadge = (result) => {
        const styles = {
            laik: "bg-green-100 text-green-700 border-green-200",
            laik_dengan_catatan: "bg-yellow-100 text-yellow-700 border-yellow-200",
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
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[result] || styles.laik}`}>
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
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.menunggu}`}>
                {icons[status] || icons.menunggu}
                {status}
            </span>
        );
    };

    const handleMoveSubmit = (e) => {
        e.preventDefault();
        postMove(route("equipments.move", equipment.id), {
            onSuccess: () => {
                setIsMoveModalOpen(false);
                resetMove();
            },
        });
    };

    const handleGenerateQr = () => {
        if (!equipment.qr) {
            router.post(route("equipments.generateQr", equipment.id), {}, {
                onSuccess: () => {
                    setIsQrModalOpen(true);
                }
            });
        } else {
            setIsQrModalOpen(true);
        }
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
            <Head title={`Detail ${equipment.name} - SIMAK`} />

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

                    {/* INFO ALAT - CARD UTAMA */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
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
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${equipment.condition === "baik" ? "bg-green-100 text-green-700" : equipment.condition === "rusak_ringan" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                                                {equipment.condition.replace("_", " ").toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                    {/* QR Button */}
                                    <button
                                        onClick={handleGenerateQr}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <QrCode className="w-4 h-4" />
                                        {equipment.qr ? 'Lihat QR' : 'Generate QR'}
                                    </button>

                                    {isAdmin && (
                                        <button
                                            onClick={() => setIsMoveModalOpen(true)}
                                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 font-medium shadow-lg shadow-orange-500/20 transition-all duration-200 hover:shadow-xl"
                                        >
                                            <Move className="w-4 h-4" />
                                            Pindah
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50/50 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Ruangan</p>
                                    <p className="font-semibold text-gray-800">{equipment.room?.name || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <Tag className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Merk / Tipe</p>
                                    <p className="font-semibold text-gray-800">{equipment.brand || '-'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <DollarSign className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Nilai Aset</p>
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
                                    <p className="text-xs text-gray-500">Kalibrasi Berikutnya</p>
                                    <p className="font-semibold text-amber-700">
                                        {equipment.next_calibration_date
                                            ? formatDate(equipment.next_calibration_date)
                                            : "Belum Terjadwal"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIWAYAT PERAWATAN & PERBAIKAN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                        <th className="px-6 py-3 font-semibold">Tanggal</th>
                                        <th className="px-6 py-3 font-semibold">No. Tiket</th>
                                        <th className="px-6 py-3 font-semibold">Jenis</th>
                                        <th className="px-6 py-3 font-semibold">Keluhan</th>
                                        <th className="px-6 py-3 font-semibold">Tindakan</th>
                                        <th className="px-6 py-3 text-center font-semibold">Status</th>
                                        <th className="px-6 py-3 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.reports && equipment.reports.map((rep) => (
                                        <tr key={rep.id} className="border-b hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 text-sm">{formatDate(rep.created_at)}</td>
                                            <td className="px-6 py-4 font-mono text-blue-600 text-sm">{rep.ticket_number}</td>
                                            <td className="px-6 py-4 capitalize text-sm">{rep.type}</td>
                                            <td className="px-6 py-4 text-sm max-w-[150px] truncate" title={rep.description}>
                                                {rep.description}
                                            </td>
                                            <td className="px-6 py-4 text-sm max-w-[150px] truncate" title={rep.action_taken || '-'}>
                                                {rep.action_taken || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">{getStatusBadge(rep.status)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <Link
                                                    href={route("reports.show", rep.id)}
                                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!equipment.reports || equipment.reports.length === 0) && (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <FileText className="w-10 h-10 text-gray-300" />
                                                    <p>Belum ada riwayat perbaikan atau perawatan</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIWAYAT KALIBRASI */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                        onClick={() => openModal()}
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
                                        <th className="px-6 py-3 font-semibold">Tanggal Kalibrasi</th>
                                        <th className="px-6 py-3 font-semibold">Lembaga Penguji</th>
                                        <th className="px-6 py-3 font-semibold">No. Sertifikat</th>
                                        <th className="px-6 py-3 font-semibold">Hasil</th>
                                        <th className="px-6 py-3 font-semibold">Sertifikat</th>
                                        <th className="px-6 py-3 text-center font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.calibrations && equipment.calibrations.map((cal) => (
                                        <tr key={cal.id} className="border-b hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{formatDate(cal.calibration_date)}</div>
                                                {cal.report && (
                                                    <Link
                                                        href={route('reports.show', cal.report.id)}
                                                        className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full inline-block mt-1 hover:underline"
                                                    >
                                                        Terkait: {cal.report.ticket_number}
                                                    </Link>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">{cal.testing_institution || '-'}</td>
                                            <td className="px-6 py-4 font-mono text-sm">{cal.certificate_number || '-'}</td>
                                            <td className="px-6 py-4">{getResultBadge(cal.result)}</td>
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
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {isAdmin ? (
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button
                                                            onClick={() => openModal(cal)}
                                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cal.id)}
                                                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                                                            title="Hapus"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!equipment.calibrations || equipment.calibrations.length === 0) && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <CheckCircle className="w-10 h-10 text-gray-300" />
                                                    <p>Belum ada data kalibrasi</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIWAYAT PERPINDAHAN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                                        <th className="px-6 py-3 font-semibold">Waktu Pindah</th>
                                        <th className="px-6 py-3 font-semibold">Dari Ruangan</th>
                                        <th className="px-6 py-3 font-semibold">Ke Ruangan</th>
                                        <th className="px-6 py-3 font-semibold">Dipindahkan Oleh</th>
                                        <th className="px-6 py-3 font-semibold">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.movements && equipment.movements.map((move) => (
                                        <tr key={move.id} className="border-b hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 text-sm">{formatDate(move.moved_at)}</td>
                                            <td className="px-6 py-4 text-red-600 font-medium">{move.from_room?.name || "Gudang/Awal"}</td>
                                            <td className="px-6 py-4 text-green-600 font-medium">{move.to_room?.name}</td>
                                            <td className="px-6 py-4 text-sm">{move.mover?.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 italic">{move.notes || '-'}</td>
                                        </tr>
                                    ))}
                                    {(!equipment.movements || equipment.movements.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Move className="w-10 h-10 text-gray-300" />
                                                    <p>Belum ada riwayat perpindahan</p>
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

            {/* MODAL QR CODE */}
            <Modal show={isQrModalOpen} onClose={() => setIsQrModalOpen(false)} maxWidth="sm">
                <div className="p-6 text-center">
                    <div className="flex items-center gap-3 border-b pb-4 mb-4">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
                            <QrCode className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-lg font-bold text-gray-900">QR Code Alat</h3>
                            <p className="text-xs text-gray-500">{equipment.name}</p>
                        </div>
                    </div>

                    {equipment.qr ? (
                        <div className="flex flex-col items-center gap-4">
                            <img
                                src={route("qr.render", equipment.qr.qr_code)}
                                alt={`QR Code ${equipment.name}`}
                                className="w-48 h-48 object-contain border rounded-xl p-2 bg-white shadow-sm"
                            />
                            <div className="flex gap-3">
                                <a
                                    href={route("qr.render", equipment.qr.qr_code)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium shadow-lg shadow-teal-500/20 transition-all duration-200"
                                >
                                    <Printer className="w-4 h-4" />
                                    Cetak QR
                                </a>
                                <a
                                    href={route("qr.render", equipment.qr.qr_code)}
                                    download={`QR-${equipment.inventory_number}.png`}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200"
                                >
                                    <Download className="w-4 h-4" />
                                    Unduh PNG
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8">
                            <div className="flex flex-col items-center gap-3">
                                <QrCode className="w-16 h-16 text-gray-300" />
                                <p className="text-gray-500">Belum ada QR Code untuk alat ini</p>
                                <button
                                    onClick={() => {
                                        router.post(route("equipments.generateQr", equipment.id), {}, {
                                            onSuccess: () => {
                                                setIsQrModalOpen(false);
                                                // refresh page to show QR
                                                router.reload();
                                            }
                                        });
                                    }}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium"
                                >
                                    Generate Sekarang
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsQrModalOpen(false)} className="rounded-xl">
                            Tutup
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>

            {/* MODAL TAMBAH & EDIT KALIBRASI */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditCalibration ? "Update Hasil Kalibrasi" : "Input Hasil Kalibrasi"}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditCalibration ? "Perbarui data kalibrasi alat" : "Tambahkan riwayat kalibrasi baru"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <InputLabel htmlFor="calibration_date" value="Tanggal Pelaksanaan" required />
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="calibration_date"
                                    type="date"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.calibration_date}
                                    onChange={(e) => setData("calibration_date", e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.calibration_date} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="next_calibration_date" value="Tgl Kalibrasi Berikutnya" required />
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="next_calibration_date"
                                    type="date"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.next_calibration_date}
                                    onChange={(e) => setData("next_calibration_date", e.target.value)}
                                    required
                                />
                            </div>
                            <InputError message={errors.next_calibration_date} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="testing_institution" value="Lembaga Penguji / Vendor" />
                            <div className="relative mt-1">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="testing_institution"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.testing_institution}
                                    onChange={(e) => setData("testing_institution", e.target.value)}
                                    placeholder="Cth: BPFK Surabaya"
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="certificate_number" value="Nomor Sertifikat" />
                            <div className="relative mt-1">
                                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="certificate_number"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.certificate_number}
                                    onChange={(e) => setData("certificate_number", e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="result" value="Hasil Kalibrasi" />
                            <div className="relative mt-1">
                                <select
                                    id="result"
                                    className="block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                    value={data.result}
                                    onChange={(e) => setData("result", e.target.value)}
                                >
                                    <option value="laik">✅ Laik</option>
                                    <option value="laik_dengan_catatan">⚠️ Laik Dengan Catatan</option>
                                    <option value="tidak_laik">❌ Tidak Laik</option>
                                </select>
                                <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        <div>
                            <InputLabel htmlFor="certificate_file" value={isEditCalibration ? "Update Sertifikat (Opsional)" : "Upload Sertifikat"} />
                            <input
                                id="certificate_file"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                                onChange={(e) => setData("certificate_file", e.target.files[0])}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {isEditCalibration && (
                                <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengubah file</p>
                            )}
                            <InputError message={errors.certificate_file} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="report_id" value="Referensi Tiket Perbaikan (Opsional)" />
                            <select
                                id="report_id"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                value={data.report_id}
                                onChange={(e) => setData("report_id", e.target.value)}
                            >
                                <option value="">-- Tidak Terkait Tiket --</option>
                                {equipment.reports && equipment.reports.map((rep) => (
                                    <option key={rep.id} value={rep.id}>
                                        {rep.ticket_number} - {rep.description.substring(0, 40)}...
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">Pilih tiket jika kalibrasi sebagai tindak lanjut laporan</p>
                            <InputError message={errors.report_id} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel htmlFor="notes" value="Catatan / Keterangan" />
                            <textarea
                                id="notes"
                                rows="2"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                value={data.notes}
                                onChange={(e) => setData("notes", e.target.value)}
                                placeholder="Catatan tambahan tentang kalibrasi..."
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
                            disabled={processing}
                        >
                            {processing ? "Menyimpan..." : isEditCalibration ? "Update Kalibrasi" : "Simpan Kalibrasi"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL PINDAH RUANGAN */}
            <Modal show={isMoveModalOpen} onClose={() => setIsMoveModalOpen(false)} maxWidth="md">
                <form onSubmit={handleMoveSubmit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl text-white">
                            <Move className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Mutasi Alat ke Ruangan Lain</h2>
                            <p className="text-sm text-gray-500">Pindahkan alat ke ruangan yang baru</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Lokasi Saat Ini</span>
                            <span className="font-semibold text-gray-900">{equipment.room?.name || "Belum ada ruangan"}</span>
                        </div>

                        <div>
                            <InputLabel htmlFor="to_room_id" value="Pindah Ke Ruangan" required />
                            <div className="relative mt-1">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    id="to_room_id"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                    value={moveData.to_room_id}
                                    onChange={(e) => setMoveData("to_room_id", e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Ruangan Tujuan --</option>
                                    {rooms && rooms.map((room) => (
                                        <option
                                            key={room.id}
                                            value={room.id}
                                            disabled={room.id === equipment.room_id}
                                        >
                                            {room.name} {room.id === equipment.room_id ? "(Lokasi Saat Ini)" : ""}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={moveErrors.to_room_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="move_notes" value="Keterangan / Alasan Pindah" />
                            <textarea
                                id="move_notes"
                                className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
                                rows="3"
                                value={moveData.notes}
                                onChange={(e) => setMoveData("notes", e.target.value)}
                                placeholder="Contoh: Dipinjam sementara untuk ruang operasi..."
                            />
                            <InputError message={moveErrors.notes} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsMoveModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl px-6 py-2.5 shadow-lg shadow-orange-500/20"
                            disabled={moveProcessing}
                        >
                            {moveProcessing ? "Memproses..." : "Pindahkan Alat"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}