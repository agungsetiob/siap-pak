import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import { formatDate } from "@/Helpers/date";

export default function Show({ auth, equipment, rooms }) {
    const isAdmin = auth.user.role === "admin";
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
    
    // STATE BARU: Untuk mendeteksi apakah sedang mode Edit Kalibrasi
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

    // FUNGSI MODIFIKASI: Menangani Buka Modal (Tambah maupun Edit)
    const openModal = (calibration = null) => {
        clearErrors();
        if (calibration) {
            // Mode EDIT
            setIsEditCalibration(true);
            setData({
                id: calibration.id,
                _method: "put", // Paksa Laravel membacanya sebagai route PUT
                certificate_number: calibration.certificate_number || "",
                testing_institution: calibration.testing_institution || "",
                report_id: calibration.report_id || "",
                calibration_date: calibration.calibration_date ? calibration.calibration_date.substring(0, 10) : "",
                next_calibration_date: calibration.next_calibration_date ? calibration.next_calibration_date.substring(0, 10) : "",
                result: calibration.result || "laik",
                notes: calibration.notes || "",
                certificate_file: null, // Jangan tampilkan file lama, kosongkan untuk upload baru
            });
        } else {
            // Mode TAMBAH BARU
            setIsEditCalibration(false);
            reset();
            setData("_method", "post"); // Kembalikan ke normal
        }
        setIsModalOpen(true);
    };

    // FUNGSI MODIFIKASI: Menangani Submit Form (Tambah maupun Edit)
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
        if (result === "laik")
            return (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                    LAIK
                </span>
            );
        if (result === "tidak_laik")
            return (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                    TIDAK LAIK
                </span>
            );
        return (
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">
                LAIK DENGAN CATATAN
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

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Alat Kesehatan
                    </h2>
                    <Link
                        href={route("equipments.index")}
                        className="text-sm text-blue-600 hover:underline"
                    >
                        &larr; Kembali ke Master Alat
                    </Link>
                </div>
            }
        >
            <Head title={`Detail ${equipment.name} - SIMAK`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* INFO ALAT */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {equipment.name}
                                    </h3>
                                    <p className="text-gray-500 font-mono mt-1">
                                        {equipment.inventory_number}
                                    </p>
                                </div>

                                {/* Container tombol di kanan */}
                                <div className="flex flex-row items-center gap-3 mt-3 sm:mt-0">
                                    {isAdmin && (
                                        <button
                                            onClick={() =>
                                                setIsMoveModalOpen(true)
                                            }
                                            className="px-4 py-2 bg-orange-500 text-white rounded shadow-sm hover:bg-orange-600 font-semibold text-sm transition"
                                        >
                                            <svg
                                                className="w-4 h-4 inline mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                                />
                                            </svg>
                                            Pindah Ruangan
                                        </button>
                                    )}

                                    {/* Tombol Generate & Cetak QR */}
                                    {!equipment.qr ? (
                                        <Link
                                            href={route(
                                                "equipments.generateQr",
                                                equipment.id,
                                            )}
                                            method="post"
                                            as="button"
                                            className="px-4 py-2 bg-purple-600 text-white rounded shadow-sm hover:bg-purple-700 font-semibold text-sm transition"
                                        >
                                            Generate QR Code
                                        </Link>
                                    ) : (
                                        <div className="flex flex-col items-center bg-white p-2 rounded border shadow-sm">
                                            <img
                                                src={route(
                                                    "qr.render",
                                                    equipment.qr.qr_code,
                                                )}
                                                alt={`QR Code ${equipment.name}`}
                                                className="w-20 h-20"
                                            />
                                            <a
                                                href={route(
                                                    "qr.render",
                                                    equipment.qr.qr_code,
                                                )}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 hover:underline mt-2 flex items-center"
                                            >
                                                <svg
                                                    className="w-3 h-3 mr-1"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                                                    />
                                                </svg>
                                                Cetak QR
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">
                                        Ruangan
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {equipment.room?.name || "-"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">
                                        Merk / Tipe
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {equipment.brand || "-"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">
                                        Serial Number
                                    </span>
                                    <span className="font-medium text-gray-900">
                                        {equipment.serial_number || "-"}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">
                                        Kondisi Saat Ini
                                    </span>
                                    <span className="font-medium text-gray-900 capitalize">
                                        {equipment.condition.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col justify-center items-center text-center">
                            <p className="text-gray-500 text-sm mb-1">
                                Jadwal Kalibrasi Berikutnya
                            </p>
                            <p className="text-xl font-bold text-blue-600">
                                {equipment.next_calibration_date
                                    ? formatDate(
                                          equipment.next_calibration_date,
                                      )
                                    : "Belum Terjadwal"}
                            </p>
                        </div>
                    </div>

                    {/* RIWAYAT PERAWATAN & PERBAIKAN */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 mb-6">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                Riwayat Perawatan & Perbaikan
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">
                                            Tanggal Lapor
                                        </th>
                                        <th className="px-6 py-4">No. Tiket</th>
                                        <th className="px-6 py-4">Jenis</th>
                                        <th className="px-6 py-4">Keluhan</th>
                                        <th className="px-6 py-4">
                                            Tindakan Akhir
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-center">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.reports &&
                                        equipment.reports.map((rep) => (
                                            <tr
                                                key={rep.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium">
                                                    {formatDate(rep.created_at)}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-blue-600">
                                                    {rep.ticket_number}
                                                </td>
                                                <td className="px-6 py-4 capitalize">
                                                    {rep.type}
                                                </td>
                                                <td
                                                    className="px-6 py-4 truncate max-w-[150px]"
                                                    title={rep.description}
                                                >
                                                    {rep.description}
                                                </td>
                                                <td
                                                    className="px-6 py-4 truncate max-w-[150px]"
                                                    title={
                                                        rep.action_taken || "-"
                                                    }
                                                >
                                                    {rep.action_taken || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                    ${
                                                        rep.status === "selesai"
                                                            ? "bg-green-100 text-green-800"
                                                            : rep.status ===
                                                                "menunggu"
                                                              ? "bg-red-100 text-red-800"
                                                              : rep.status ===
                                                                  "diproses"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-gray-100 text-gray-800"
                                                    }`}
                                                    >
                                                        {rep.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={route(
                                                            "reports.show",
                                                            rep.id,
                                                        )}
                                                        className="text-blue-600 hover:underline font-medium"
                                                    >
                                                        Lihat Tiket
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    {(!equipment.reports ||
                                        equipment.reports.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Belum ada riwayat perbaikan atau
                                                perawatan untuk alat ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIWAYAT KALIBRASI */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                Riwayat & Sertifikat Kalibrasi
                            </h3>
                            {isAdmin && (
                                <button
                                    onClick={() => openModal()} // Panggil tanpa argumen untuk Tambah
                                    className="px-4 py-2 bg-blue-600 text-white rounded shadow-sm hover:bg-blue-700 text-sm font-semibold"
                                >
                                    + Tambah Riwayat Kalibrasi
                                </button>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">
                                            Tgl Kalibrasi
                                        </th>
                                        <th className="px-6 py-4">
                                            Lembaga Penguji
                                        </th>
                                        <th className="px-6 py-4">
                                            No. Sertifikat
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
                                    {equipment.calibrations &&
                                        equipment.calibrations.map((cal) => (
                                            <tr
                                                key={cal.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900">
                                                        {formatDate(cal.calibration_date)}
                                                    </div>
                                                    {cal.report && (
                                                        <Link 
                                                            href={route('reports.show', cal.report.id)} 
                                                            className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full inline-block mt-1 hover:underline"
                                                        >
                                                            Terkait: {cal.report.ticket_number}
                                                        </Link>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {cal.testing_institution ||
                                                        "-"}
                                                </td>
                                                <td className="px-6 py-4 font-mono">
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
                                                            className="text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                                ></path>
                                                            </svg>
                                                            Lihat PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isAdmin ? (
                                                        <>
                                                            {/* TOMBOL EDIT DITAMBAHKAN DI SINI */}
                                                            <button
                                                                onClick={() => openModal(cal)}
                                                                className="text-blue-600 hover:underline mr-4 font-medium"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        cal.id,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:underline font-medium"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-gray-400">
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
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Belum ada data kalibrasi.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* RIWAYAT PERPINDAHAN / MUTASI ALAT */}
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-100 mb-6">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                Riwayat Perpindahan / Mutasi
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="bg-white border-b text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-4">
                                            Waktu Pindah
                                        </th>
                                        <th className="px-6 py-4">
                                            Dari Ruangan
                                        </th>
                                        <th className="px-6 py-4">
                                            Ke Ruangan
                                        </th>
                                        <th className="px-6 py-4">
                                            Dipindahkan Oleh
                                        </th>
                                        <th className="px-6 py-4">
                                            Keterangan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipment.movements &&
                                        equipment.movements.map((move) => (
                                            <tr
                                                key={move.id}
                                                className="border-b hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 font-medium">
                                                    {formatDate(move.moved_at)}
                                                </td>
                                                <td className="px-6 py-4 text-red-600 font-medium">
                                                    {move.from_room?.name ||
                                                        "Gudang/Awal"}
                                                </td>
                                                <td className="px-6 py-4 text-green-600 font-medium">
                                                    {move.to_room?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {move.mover?.name}
                                                </td>
                                                <td className="px-6 py-4 italic text-gray-500">
                                                    {move.notes || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    {(!equipment.movements ||
                                        equipment.movements.length === 0) && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                Belum ada riwayat perpindahan
                                                untuk alat ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL TAMBAH & EDIT KALIBRASI */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxWidth="2xl"
            >
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">
                        {isEditCalibration ? "Update Hasil Kalibrasi" : "Input Hasil Kalibrasi"}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="calibration_date"
                                value="Tanggal Pelaksanaan"
                            />
                            <TextInput
                                id="calibration_date"
                                type="date"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.calibration_date}
                                onChange={(e) =>
                                    setData("calibration_date", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.calibration_date}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="next_calibration_date"
                                value="Tgl Kalibrasi Berikutnya (Jatuh Tempo)"
                            />
                            <TextInput
                                id="next_calibration_date"
                                type="date"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.next_calibration_date}
                                onChange={(e) =>
                                    setData(
                                        "next_calibration_date",
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            <InputError
                                message={errors.next_calibration_date}
                                className="mt-2"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="testing_institution"
                                value="Lembaga Penguji / Vendor"
                            />
                            <TextInput
                                id="testing_institution"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.testing_institution}
                                onChange={(e) =>
                                    setData(
                                        "testing_institution",
                                        e.target.value,
                                    )
                                }
                                placeholder="Cth: BPFK Surabaya"
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="certificate_number"
                                value="Nomor Sertifikat"
                            />
                            <TextInput
                                id="certificate_number"
                                type="text"
                                className="mt-1 block w-full bg-gray-50"
                                value={data.certificate_number}
                                onChange={(e) =>
                                    setData(
                                        "certificate_number",
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="result"
                                value="Hasil Kalibrasi"
                            />
                            <select
                                id="result"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.result}
                                onChange={(e) =>
                                    setData("result", e.target.value)
                                }
                            >
                                <option value="laik">Laik</option>
                                <option value="laik_dengan_catatan">
                                    Laik Dengan Catatan
                                </option>
                                <option value="tidak_laik">Tidak Laik</option>
                            </select>
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="certificate_file"
                                value={isEditCalibration ? "Update Sertifikat (Opsional)" : "Upload Dokumen Sertifikat (PDF/JPG)"}
                            />
                            <input
                                id="certificate_file"
                                type="file"
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) =>
                                    setData(
                                        "certificate_file",
                                        e.target.files[0],
                                    )
                                }
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {isEditCalibration && (
                                <p className="text-xs text-gray-400 mt-1">Biarkan kosong jika tidak ingin mengubah file sertifikat.</p>
                            )}
                            <InputError
                                message={errors.certificate_file}
                                className="mt-2"
                            />
                        </div>
                        {/* Input Pilihan Tiket Referensi */}
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="report_id"
                                value="Referensi Tiket Perbaikan (Opsional)"
                            />
                            <select
                                id="report_id"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-white"
                                value={data.report_id}
                                onChange={(e) => setData("report_id", e.target.value)}
                            >
                                <option value="">-- Tidak Terkait Tiket Manapun --</option>
                                {equipment.reports && equipment.reports.map((rep) => (
                                    <option key={rep.id} value={rep.id}>
                                        {rep.ticket_number} - {rep.description.substring(0, 50)}... ({formatDate(rep.created_at)})
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Pilih tiket jika kalibrasi ini dilakukan sebagai tindak lanjut dari laporan kerusakan.
                            </p>
                            <InputError message={errors.report_id} className="mt-2" />
                        </div>
                        <div className="md:col-span-2">
                            <InputLabel
                                htmlFor="notes"
                                value="Catatan / Keterangan Tambahan"
                            />
                            <textarea
                                id="notes"
                                rows="2"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                            ></textarea>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-blue-600"
                            disabled={processing}
                        >
                            {processing
                                ? "Menyimpan..."
                                : isEditCalibration ? "Update Data Kalibrasi" : "Simpan Data Kalibrasi"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* MODAL PINDAH RUANGAN */}
            <Modal
                show={isMoveModalOpen}
                onClose={() => setIsMoveModalOpen(false)}
                maxWidth="md"
            >
                <form onSubmit={handleMoveSubmit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">
                        Mutasi Alat ke Ruangan Lain
                    </h2>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-3 rounded-md border text-sm">
                            <span className="text-gray-500">
                                Lokasi Saat Ini:{" "}
                            </span>
                            <strong className="text-gray-900">
                                {equipment.room?.name || "Belum ada ruangan"}
                            </strong>
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="to_room_id"
                                value="Pindah Ke Ruangan"
                            />
                            <select
                                id="to_room_id"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-white"
                                value={moveData.to_room_id}
                                onChange={(e) =>
                                    setMoveData("to_room_id", e.target.value)
                                }
                                required
                            >
                                <option value="">
                                    -- Pilih Ruangan Tujuan --
                                </option>
                                {rooms &&
                                    rooms.map((room) => (
                                        <option
                                            key={room.id}
                                            value={room.id}
                                            disabled={
                                                room.id === equipment.room_id
                                            }
                                        >
                                            {room.name}{" "}
                                            {room.id === equipment.room_id
                                                ? "(Lokasi Saat Ini)"
                                                : ""}
                                        </option>
                                    ))}
                            </select>
                            <InputError
                                message={moveErrors.to_room_id}
                                className="mt-2"
                            />
                        </div>

                        <div>
                            <InputLabel
                                htmlFor="move_notes"
                                value="Keterangan / Alasan Pindah (Opsional)"
                            />
                            <textarea
                                id="move_notes"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-white"
                                rows="3"
                                value={moveData.notes}
                                onChange={(e) =>
                                    setMoveData("notes", e.target.value)
                                }
                                placeholder="Contoh: Dipinjam sementara untuk ruang operasi..."
                            ></textarea>
                            <InputError
                                message={moveErrors.notes}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton
                            onClick={() => setIsMoveModalOpen(false)}
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="bg-orange-500 hover:bg-orange-600 focus:bg-orange-600"
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