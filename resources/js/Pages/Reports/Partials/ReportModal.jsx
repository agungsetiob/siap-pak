import React from 'react';
import { Modal, InputLabel, InputError, PrimaryButton, SecondaryButton, AsyncSearchableSelect } from "@/Components";
import { Plus } from "lucide-react";

export default function ReportModal({ show, onClose, onSubmit, data, setData, errors, processing }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="2xl">
            <form onSubmit={onSubmit} className="p-6">
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
                    {/* Input Pencarian Alat Asynchronous */}
                    <div>
                        <AsyncSearchableSelect
                            fetchUrl="/api/equipments/search" // Sesuaikan dengan route API Anda
                            value={data.selected_equipment || null}
                            onChange={(equipment) => {
                                setData((prevData) => ({
                                    ...prevData,
                                    equipment_id: equipment ? equipment.id : '',
                                    selected_equipment: equipment
                                }));
                            }}
                            label="Pilih Alat Kesehatan"
                            placeholder="Ketik nama, nomor inventaris, atau merk alat..."
                            displayValue={(eq) => eq ? `${eq.name} (${eq.inventory_number}) ${eq.brand ? `- ${eq.brand}` : ''}` : ""}
                            required
                        />
                        <InputError message={errors.equipment_id} className="mt-2" />
                    </div>

                    {/* Jenis Laporan */}
                    <div>
                        <InputLabel htmlFor="type" value="Jenis Laporan" className="text-sm font-semibold mb-1.5 block" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                                { value: 'kerusakan', label: 'Kerusakan / Perbaikan', color: 'red', icon: '🔧' },
                                { value: 'pemeliharaan', label: 'Pemeliharaan Rutin', color: 'blue', icon: '⚙️' },
                                { value: 'kalibrasi', label: 'Kalibrasi', color: 'green', icon: '📏' },
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
                        <InputLabel htmlFor="description" value="Keluhan / Deskripsi Masalah" className="text-sm font-semibold mb-1.5 block" />
                        <textarea
                            id="description"
                            rows="4"
                            className="w-full border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-gray-50/50 resize-none p-3 text-sm"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            placeholder="Jelaskan secara detail kendala yang terjadi pada alat..."
                            required
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                        <p className="text-xs text-gray-400 mt-1.5 text-right">
                            {data.description.length}/500 karakter
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                    <SecondaryButton onClick={onClose} className="w-full sm:w-auto justify-center">
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        className="w-full sm:w-auto justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-200"
                        disabled={processing}
                    >
                        {processing ? 'Mengirim...' : 'Kirim Laporan'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}