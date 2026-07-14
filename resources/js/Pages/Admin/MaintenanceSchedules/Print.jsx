import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { formatDate } from "@/Helpers/date";

const CHECKLIST_ITEMS = [
    { key: 'fisik', label: 'Kondisi fisik alat' },
    { key: 'kebersihan', label: 'Kebersihan alat' },
    { key: 'kabel', label: 'Kabel daya dan steker' },
    { key: 'sakelar', label: 'Sakelar/Power ON-OFF' },
    { key: 'display', label: 'Display/Indikator' },
    { key: 'tombol', label: 'Fungsi tombol/kontrol' },
    { key: 'baterai', label: 'Baterai (jika ada)' },
    { key: 'aksesori', label: 'Aksesori lengkap' },
    { key: 'uji_fungsi', label: 'Uji fungsi alat' },
    { key: 'alarm', label: 'Alarm (jika tersedia)' },
    { key: 'kalibrasi', label: 'Kalibrasi masih berlaku' },
    { key: 'label_id', label: 'Label identifikasi terbaca' },
];

const MAINTENANCE_ACTIONS = [
    'Pembersihan alat', 'Pemeriksaan fungsi', 'Pengencangan baut/sekrup', 
    'Pelumasan (jika diperlukan)', 'Penggantian komponen', 'Pengisian/Penggantian baterai'
];

export default function Print({ schedule }) {

    const getPrintDate = () => {
        const now = new Date();
        return now.toLocaleDateString('id-ID', { 
            day: 'numeric', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="bg-white min-h-screen text-black font-sans">
            <Head title={`Cetak Laporan Pemeliharaan - ${schedule.equipment?.name}`} />

            {/* HEADER KONTROL (Sembunyi saat dicetak) */}
            <div className="print:hidden p-6 bg-gray-100 border-b border-gray-300 flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cetak Laporan Pemeliharaan</h1>
                    <p className="text-gray-600 mt-1">Alat: {schedule.equipment?.name}</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.close()} className="px-4 py-2 bg-gray-400 text-white rounded font-bold shadow hover:bg-gray-500">
                        Tutup Tab
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow hover:bg-blue-700 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Cetak Sekarang
                    </button>
                </div>
            </div>

            {/* AREA KERTAS CETAK A4 */}
            <div className="w-full max-w-4xl mx-auto p-8 bg-white text-sm leading-relaxed text-gray-900">
                
                {/* KOP SURAT RESMI */}
                <div className="border-b-4 border-double border-black mb-6 flex items-center">
                    <img src="/logo_tanbu.png" alt="Logo RS" className="w-24 h-24 object-contain mr-2" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="text-center p-3 flex-1">
                        <h3 className="text-lg font-bold uppercase tracking-tight">Pemerintah Kabupaten Tanah Bumbu</h3>
                        <h1 className="text-xl font-extrabold uppercase tracking-tight">UPTD RSUD dr. H. Andi Abdurrahman Noor</h1>
                        <p className="text-xs font-semibold mt-1">Alamat: Jl. H. M. Amin KM. 10 RT. 03 Desa Sepunggur Kec. Kusan Tengah Kab. Tanah Bumbu Prov. Kalimantan Selatan KP 72273</p>
                        <p className="text-xs font-semibold">email : <span className="text-blue-600 underline">rsud.tanahbumbu@gmail.com / rsud.tanbu@gmail.com</span> Telepon : 08115000266 / 05186070767</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-lg font-bold underline uppercase tracking-wide">FORM PEMELIHARAAN RUTIN ALAT KESEHATAN</h2>
                </div>

                {/* A. IDENTITAS ALAT */}
                <div className="mb-6">
                    <h3 className="font-bold text-md uppercase mb-2">A. Identitas Alat</h3>
                    <table className="w-full text-sm">
                        <tbody>
                            <tr><td className="w-48 py-1">Nama Alat</td><td className="w-4">:</td><td className="font-bold">{schedule.equipment?.name}</td></tr>
                            <tr><td className="py-1">Merek/Tipe</td><td>:</td><td>{schedule.equipment?.brand || '-'}</td></tr>
                            <tr><td className="py-1">Nomor Seri</td><td>:</td><td className="font-mono">{schedule.equipment?.serial_number || '-'}</td></tr>
                            <tr><td className="py-1">Lokasi / Unit / Ruangan</td><td>:</td><td>{schedule.equipment?.room?.name || '-'}</td></tr>
                            <tr>
                                <td className="py-1">Frekuensi Pemeliharaan</td><td>:</td>
                                <td className="flex gap-4">
                                    {['Harian', 'Mingguan', 'Bulanan', 'Triwulanan', 'Semesteran', 'Tahunan'].map(f => (
                                        <span key={f} className="flex items-center gap-1">
                                            <span className="border border-black w-4 h-4 inline-flex items-center justify-center text-xs font-bold">
                                                {schedule.frequency === f ? '✓' : ''}
                                            </span> {f}
                                        </span>
                                    ))}
                                </td>
                            </tr>
                            <tr><td className="py-1">Tanggal Pemeliharaan</td><td>:</td><td>{formatDate(schedule.scheduled_date)}</td></tr>
                            <tr><td className="py-1">Teknisi / Petugas</td><td>:</td><td>{schedule.technician?.name}</td></tr>
                        </tbody>
                    </table>
                </div>

                {/* B. CHECKLIST PEMELIHARAAN */}
                <div className="mb-6">
                    <h3 className="font-bold text-md uppercase mb-2">B. Checklist Pemeliharaan</h3>
                    <table className="w-full text-sm border-collapse border border-black">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border border-black p-2 w-10 text-center">No</th>
                                <th className="border border-black p-2">Item Pemeriksaan</th>
                                <th className="border border-black p-2 w-20 text-center">Baik (✓)</th>
                                <th className="border border-black p-2 w-28 text-center">Tidak Baik (✓)</th>
                                <th className="border border-black p-2 w-20 text-center">N/A (✓)</th>
                                <th className="border border-black p-2 w-1/3">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody>
                            {CHECKLIST_ITEMS.map((item, index) => {
                                const result = schedule.checklist_results?.[item.key] || {};
                                return (
                                    <tr key={item.key}>
                                        <td className="border border-black p-2 text-center">{index + 1}</td>
                                        <td className="border border-black p-2">{item.label}</td>
                                        <td className="border border-black p-2 text-center font-bold text-lg leading-none">{result.status === 'baik' ? '✓' : ''}</td>
                                        <td className="border border-black p-2 text-center font-bold text-lg leading-none">{result.status === 'tidak_baik' ? '✓' : ''}</td>
                                        <td className="border border-black p-2 text-center font-bold text-lg leading-none">{result.status === 'na' ? '✓' : ''}</td>
                                        <td className="border border-black p-2 italic">{result.note || ''}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* C. TINDAKAN PEMELIHARAAN */}
                <div className="mb-6 break-inside-avoid">
                    <h3 className="font-bold text-md uppercase mb-2">C. Tindakan Pemeliharaan</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm pl-4">
                        {MAINTENANCE_ACTIONS.map(action => (
                            <div key={action} className="flex items-center gap-2">
                                <span className="border border-black w-4 h-4 inline-flex items-center justify-center text-xs font-bold">
                                    {(schedule.maintenance_actions || []).includes(action) ? '✓' : ''}
                                </span>
                                <span>{action}</span>
                            </div>
                        ))}
                        <div className="col-span-2 flex items-center gap-2 mt-1">
                            <span className="border border-black w-4 h-4 inline-flex items-center justify-center text-xs font-bold">
                                {schedule.action_other ? '✓' : ''}
                            </span>
                            <span>Lainnya: <span className="underline decoration-dotted ml-1">{schedule.action_other || '...................................................'}</span></span>
                        </div>
                    </div>
                </div>

                {/* D. HASIL PEMELIHARAAN */}
                <div className="mb-6 break-inside-avoid">
                    <h3 className="font-bold text-md uppercase mb-2">D. Hasil Pemeliharaan</h3>
                    <div className="space-y-2 text-sm pl-4">
                        <div className="flex items-center gap-2">
                            <span className="border border-black w-4 h-4 inline-flex items-center justify-center text-xs font-bold">
                                {schedule.result_status === 'layak' ? '✓' : ''}
                            </span>
                            <span>Alat layak digunakan.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="border border-black w-4 h-4 inline-flex items-center justify-center text-xs font-bold">
                                {schedule.result_status === 'layak_dengan_catatan' ? '✓' : ''}
                            </span>
                            <span>Alat layak digunakan dengan catatan.</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="border border-black w-4 h-4 inline-flex items-center justify-center text-xs font-bold">
                                {schedule.result_status === 'tidak_layak' ? '✓' : ''}
                            </span>
                            <span>Alat tidak layak digunakan dan memerlukan perbaikan.</span>
                        </div>
                        <div className="mt-2">
                            <p className="font-semibold">Catatan:</p>
                            <div className="min-h-[40px] border border-dashed border-gray-400 p-2 italic mt-1">
                                {schedule.notes || '-'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* E. TINDAK LANJUT */}
                <div className="mb-8 break-inside-avoid">
                    <h3 className="font-bold text-md uppercase mb-2">E. Tindak Lanjut</h3>
                    <div className="min-h-[40px] border border-dashed border-gray-400 p-2 italic text-sm pl-4">
                        {schedule.follow_up_notes || '-'}
                    </div>
                </div>

                {/* F. PENGESAHAN */}
                <div className="break-inside-avoid">
                    <h3 className="font-bold text-md uppercase mb-4">F. Pengesahan</h3>
                    <div className="grid grid-cols-2 gap-12 text-center text-sm">
                        <div className="flex flex-col items-center">
                            <p className="mb-16">Petugas Pemeliharaan</p>
                            <div className="border-b border-black w-48 mb-1">
                                <p className="font-bold uppercase">{schedule.technician?.name || '______________________'}</p>
                            </div>
                            <p>Tanda Tangan & Tanggal</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <p className="mb-16">Penanggung Jawab Ruangan</p>
                            <div className="border-b border-black w-48 mb-1">
                                <p className="font-bold uppercase">______________________</p>
                            </div>
                            <p>Tanda Tangan & Tanggal</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-right text-[10px] text-gray-500 font-mono italic">
                    Dicetak dari sistem SIAP PAK pada: {getPrintDate()}
                </div>
            </div>
        </div>
    );
}