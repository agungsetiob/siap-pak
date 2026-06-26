import React from "react";
import {
    Modal,
    InputLabel,
    InputError,
    TextInput,
    PrimaryButton,
    SecondaryButton,
    AsyncSearchableSelect
} from "@/Components";
import { Calendar, User, Activity, FileText, ChevronDown } from "lucide-react";

export default function ScheduleModal({
    show,
    onClose,
    onSubmit,
    isEditing,
    data,
    setData,
    errors,
    processing,
    technicians,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={onSubmit} className="p-6">
                <div className="flex items-center gap-3 border-b pb-4 mb-6">
                    <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing
                                ? "Ubah Rencana Pemeliharaan"
                                : "Atur Rencana Pemeliharaan Rutin"}
                        </h2>
                        <p className="text-sm text-gray-500">
                            {isEditing
                                ? "Perbarui jadwal pemeliharaan"
                                : "Buat jadwal preventive maintenance baru"}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                        <AsyncSearchableSelect
                            fetchUrl={route("api.equipments.search")}
                            value={data.selected_equipment || null}
                            onChange={(equipment) => {
                                setData((prevData) => ({
                                    ...prevData,
                                    equipment_id: equipment ? equipment.id : "",
                                    selected_equipment: equipment,
                                }));
                            }}
                            label="Pilih Alat Kesehatan"
                            placeholder="Ketik nama alat atau nomor inventaris..."
                            displayValue={(eq) =>
                                eq
                                    ? `${eq.name} [${eq.inventory_number}] - ${eq.room?.name || "Tanpa Ruangan"}`
                                    : ""
                            }
                            required
                        />
                        <InputError
                            message={errors.equipment_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="technician_id"
                            value="Ditugaskan Kepada (Teknisi)"
                            required
                        />
                        <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                id="technician_id"
                                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                value={data.technician_id}
                                onChange={(e) =>
                                    setData("technician_id", e.target.value)
                                }
                            >
                                <option value="">-- Pilih Teknisi --</option>
                                {technicians.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.specialization || "Umum"})
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <InputError
                            message={errors.technician_id}
                            className="mt-2"
                        />
                    </div>

                    <div>
                        <InputLabel
                            htmlFor="scheduled_date"
                            value="Tanggal Pelaksanaan"
                            required
                        />
                        <div className="relative mt-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <TextInput
                                id="scheduled_date"
                                type="date"
                                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                                value={data.scheduled_date}
                                onChange={(e) =>
                                    setData("scheduled_date", e.target.value)
                                }
                                required
                            />
                        </div>
                        <InputError
                            message={errors.scheduled_date}
                            className="mt-2"
                        />
                    </div>

                    {isEditing && (
                        <div>
                            <InputLabel htmlFor="status" value="Status Kerja" />
                            <div className="relative mt-1">
                                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    id="status"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                    value={data.status}
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="menunggu">
                                        🔄 Menunggu
                                    </option>
                                    <option value="selesai">✅ Selesai</option>
                                    <option value="terlewat">
                                        ❌ Terlewat
                                    </option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <InputLabel
                            htmlFor="notes"
                            value="Instruksi Khusus / Catatan Tugas"
                        />
                        <div className="relative mt-1">
                            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <textarea
                                id="notes"
                                rows="2"
                                className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 py-2.5 px-4"
                                value={data.notes}
                                onChange={(e) =>
                                    setData("notes", e.target.value)
                                }
                                placeholder="Contoh: Cek filter oli pompa vakum atau kalibrasi kelistrikan..."
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 gap-3">
                    <SecondaryButton
                        type="button"
                        onClick={onClose}
                        className="rounded-xl"
                    >
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        disabled={processing}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-purple-500/20"
                    >
                        {processing ? "Menyimpan..." : "Simpan Rencana"}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
