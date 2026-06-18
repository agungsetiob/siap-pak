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

export default function Show({ auth, equipment }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            certificate_number: "",
            testing_institution: "",
            calibration_date: "",
            next_calibration_date: "",
            result: "laik",
            notes: "",
            certificate_file: null,
        });

    const openModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("calibrations.store", equipment.id), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
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

    const isAdmin = auth.user.role === 'admin';

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
            <Head title={`Detail ${equipment.name} - SIAP PAK`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* INFO ALAT */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {equipment.name}
                            </h3>
                            <p className="text-gray-500 font-mono">
                                {equipment.inventory_number}
                            </p>
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
                                                    {new Date(
                                                        rep.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                    )}
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
                                    onClick={openModal}
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
                                                    {cal.calibration_date}
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
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    cal.id,
                                                                )
                                                            }
                                                            className="text-red-600 hover:underline"
                                                        >
                                                            Hapus
                                                        </button>
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
                </div>
            </div>

            {/* MODAL TAMBAH KALIBRASI */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxWidth="2xl"
            >
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-4">
                        Input Hasil Kalibrasi
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
                                value="Upload Dokumen Sertifikat (PDF/JPG)"
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
                            <InputError
                                message={errors.certificate_file}
                                className="mt-2"
                            />
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
                                : "Simpan Data Kalibrasi"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
