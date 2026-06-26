import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link, router } from "@inertiajs/react";
import { Plus, FileText, Clock, CheckCircle, AlertCircle, XCircle, ChevronRight } from "lucide-react";
import FlashMessage from "@/Components/FlashMessage";
import ReportModal from "./Partials/ReportModal";

export default function Index({ auth, reports, flash }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isRuangan = auth.user.role === "ruangan";

    const { data, setData, post, reset, errors, processing, clearErrors } = useForm({
        equipment_id: "",
        selected_equipment: null,
        type: "kerusakan",
        description: "",
    });

    const openModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route("reports.store"), {
            onSuccess: () => closeModal(),
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
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status]}`}>
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
                    <FlashMessage flash={flash} />
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        
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
                                        <tr key={report.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                            <td className="px-6 py-4">
                                                <span className="font-mono font-semibold text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                                                    {report.ticket_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-800">{report.equipment?.name}</div>
                                                <div className="text-xs text-gray-400">{report.equipment?.inventory_number}</div>
                                            </td>
                                            {!isRuangan && (
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-700">{report.equipment?.room?.name || '-'}</span>
                                                </td>
                                            )}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                                                    ${report.type === 'kerusakan' ? 'bg-red-100 text-red-700' : 
                                                      report.type === 'pemeliharaan' ? 'bg-blue-100 text-blue-700' : 
                                                      'bg-purple-100 text-purple-700'}`}
                                                >
                                                    {report.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="truncate max-w-[200px] text-gray-600" title={report.description}>
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
                                            <td colSpan={isRuangan ? 6 : 7} className="px-6 py-12 text-center text-gray-500">
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
                                                link.active ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-800 border border-gray-200'
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

            {/* Panggil Modal Component */}
            <ReportModal
                show={isModalOpen}
                onClose={closeModal}
                onSubmit={submit}
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
            />

        </AuthenticatedLayout>
    );
}