import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Index({ auth, reports, equipments }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isRuangan = auth.user.role === "ruangan";

    const { data, setData, post, reset, errors, processing, clearErrors } =
        useForm({
            equipment_id: "",
            type: "kerusakan",
            description: "",
        });

    const openModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("reports.store"), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
                alert(
                    "Laporan berhasil dikirim dan notifikasi WA telah diteruskan ke Admin/Teknisi.",
                );
            },
        });
    };

    // Fungsi pembantu untuk warna badge status
    const getStatusBadge = (status) => {
        const styles = {
            menunggu: "bg-red-100 text-red-800 border-red-200",
            diproses: "bg-yellow-100 text-yellow-800 border-yellow-200",
            selesai: "bg-green-100 text-green-800 border-green-200",
            dibatalkan: "bg-gray-100 text-gray-800 border-gray-200",
        };
        return (
            <span
                className={`px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}
            >
                {status}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tiket Laporan & Pemeliharaan
                </h2>
            }
        >
            <Head title="Laporan - SIMAK" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-100">
                        {/* --- Header Area --- */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    Daftar Tiket
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Pantau status laporan kerusakan dan jadwal
                                    pemeliharaan.
                                </p>
                            </div>

                            {/* Tombol Buat Laporan HANYA muncul untuk Ruangan */}
                            {/* {isRuangan && ( */}
                            <button
                                onClick={openModal}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold shadow-sm transition"
                            >
                                + Buat Laporan
                            </button>
                            {/* )} */}
                        </div>

                        {/* --- Tabel Tiket Laporan --- */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            <table className="w-full text-sm text-left text-gray-600">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4">No. Tiket</th>
                                        <th className="px-6 py-4">
                                            Alat Kesehatan
                                        </th>
                                        {!isRuangan && (
                                            <th className="px-6 py-4">
                                                Ruangan Pelapor
                                            </th>
                                        )}
                                        <th className="px-6 py-4">
                                            Jenis Laporan
                                        </th>
                                        <th className="px-6 py-4">
                                            Kendala / Deskripsi
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
                                    {reports.data.map((report) => (
                                        <tr
                                            key={report.id}
                                            className="bg-white border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="px-6 py-4 font-mono font-medium text-blue-600">
                                                {report.ticket_number}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">
                                                    {report.equipment?.name}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {
                                                        report.equipment
                                                            ?.inventory_number
                                                    }
                                                </div>
                                            </td>

                                            {!isRuangan && (
                                                <td className="px-6 py-4 font-medium text-gray-700">
                                                    {
                                                        report.equipment?.room
                                                            ?.name
                                                    }
                                                </td>
                                            )}

                                            <td className="px-6 py-4">
                                                <span className="capitalize">
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div
                                                    className="truncate w-48"
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
                                                    href={route(
                                                        "reports.show",
                                                        report.id,
                                                    )}
                                                    className="font-semibold text-blue-600 hover:text-blue-800 transition underline"
                                                >
                                                    Detail & Log
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
                                                Belum ada data laporan saat ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="mt-6 flex flex-wrap gap-1 justify-end">
                            {reports.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1.5 border rounded-md text-sm transition-colors ${link.active ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url && 'opacity-40 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Modal Form Buat Laporan (Khusus Ruangan) --- */}
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                maxWidth="lg"
            >
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-3 mb-5">
                        Buat Laporan Baru
                    </h2>

                    <div className="space-y-4">
                        {/* Input: Pilih Alat Kesehatan */}
                        <div>
                            <InputLabel
                                htmlFor="equipment_id"
                                value="Pilih Alat Kesehatan"
                            />
                            <select
                                id="equipment_id"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.equipment_id}
                                onChange={(e) =>
                                    setData("equipment_id", e.target.value)
                                }
                            >
                                <option value="">-- Pilih Alat --</option>
                                {equipments.map((eq) => (
                                    <option key={eq.id} value={eq.id}>
                                        {eq.name} ({eq.inventory_number})
                                    </option>
                                ))}
                            </select>
                            <InputError
                                message={errors.equipment_id}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Jenis Laporan */}
                        <div>
                            <InputLabel htmlFor="type" value="Jenis Laporan" />
                            <select
                                id="type"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                            >
                                <option value="kerusakan">
                                    Kerusakan / Perbaikan
                                </option>
                                <option value="pemeliharaan">
                                    Pemeliharaan Rutin
                                </option>
                            </select>
                            <InputError
                                message={errors.type}
                                className="mt-2"
                            />
                        </div>

                        {/* Input: Deskripsi / Keluhan */}
                        <div>
                            <InputLabel
                                htmlFor="description"
                                value="Keluhan / Deskripsi Masalah"
                            />
                            <textarea
                                id="description"
                                rows="4"
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm mt-1 block w-full bg-gray-50 resize-none"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                placeholder="Jelaskan secara detail kendala yang terjadi pada alat..."
                            ></textarea>
                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-blue-600 hover:bg-blue-700"
                            disabled={processing}
                        >
                            {processing ? "Mengirim..." : "Kirim Laporan"}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
