import React from 'react';
import { Head } from '@inertiajs/react';
import { formatDate } from '@/Helpers/date';

export default function EquipmentScan({ equipment, calibrationStatus }) {

    return (
        <div className="min-h-screen bg-gray-100 pb-10">
            <Head title={`Detail Alat - ${equipment.name}`} />

            {/* Header Mobile */}
            <div className="bg-blue-600 text-white p-6 shadow-md rounded-b-3xl mb-6">
                <h1 className="text-2xl font-bold leading-tight">{equipment.name}</h1>
                <p className="text-blue-100 font-mono mt-2">{equipment.inventory_number}</p>
                <div className="mt-4 inline-block px-3 py-1 bg-white text-blue-600 rounded-full text-sm font-bold shadow-sm">
                    Lokasi: {equipment.room?.name || 'Belum Ditetapkan'}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 space-y-4">
                
                {/* WARNING KALIBRASI <= 30 HARI */}
                {calibrationStatus.is_warning && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm flex items-start animate-pulse">
                        <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <div>
                            <h3 className="text-red-800 font-bold">PERINGATAN KALIBRASI</h3>
                            <p className="text-red-700 text-sm mt-1">{calibrationStatus.message}</p>
                        </div>
                    </div>
                )}

                {/* Status Kondisi */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Status Saat Ini</h3>
                    <div className="flex items-center">
                        <span className={`px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider w-full text-center
                            ${equipment.condition === 'baik' ? 'bg-green-100 text-green-800' : 
                              equipment.condition === 'rusak_ringan' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {equipment.condition.replace('_', ' ')}
                        </span>
                    </div>
                </div>

                {/* Histori Kalibrasi Terakhir */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Kalibrasi Terakhir</h3>
                    {equipment.calibrations && equipment.calibrations.length > 0 ? (
                        <div className="text-gray-800">
                            <p className="font-bold text-lg">{formatDate(equipment.calibrations[0].calibration_date)}</p>
                            <p className="text-sm text-gray-500">Hasil: <span className="font-semibold">{equipment.calibrations[0].result}</span></p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic">Belum ada data kalibrasi.</p>
                    )}
                </div>

                {/* Histori Mutasi / Perpindahan */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Histori Perpindahan</h3>
                    <div className="space-y-3">
                        {equipment.movements && equipment.movements.length > 0 ? (
                            equipment.movements.map((move, idx) => (
                                <div key={idx} className="border-l-2 border-blue-500 pl-3">
                                    <p className="text-xs text-gray-500">{formatDate(move.moved_at)}</p>
                                    <p className="text-sm text-gray-800 font-medium">
                                        {move.from_room?.name || 'Gudang'} &rarr; <span className="text-blue-600">{move.to_room?.name}</span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">Belum pernah dipindahkan.</p>
                        )}
                    </div>
                </div>

                {/* Histori Kerusakan / Perawatan */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Riwayat Perbaikan</h3>
                    <div className="space-y-4">
                        {equipment.reports && equipment.reports.length > 0 ? (
                            equipment.reports.slice(0, 5).map((rep, idx) => (
                                <div key={idx} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-xs font-bold text-gray-500">{formatDate(rep.created_at)}</span>
                                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${rep.status === 'selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{rep.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-800 font-medium">{rep.description}</p>
                                    {rep.action_taken && <p className="text-xs text-gray-500 mt-1">Tindakan: {rep.action_taken}</p>}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm italic">Belum ada riwayat kerusakan.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}