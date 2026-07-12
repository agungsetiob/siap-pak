import React from 'react';
import { Head } from '@inertiajs/react';
import { formatDate } from "@/Helpers/date";

export default function Print({ report }) {

    // Ambil semua notes dari progress_logs - hanya yang status_snapshot = 'diproses'
    const getAllNotes = () => {
        if (!report.progress_logs || report.progress_logs.length === 0) {
            return ['Tidak ada catatan'];
        }
        
        // Filter hanya yang status_snapshot = 'diproses'
        const notes = report.progress_logs
            .filter(log => log.status_snapshot === 'diproses') // Filter status diproses
            .map(log => log.notes)
            .filter(note => note && note.trim() !== '');
        
        return notes.length > 0 ? notes : ['Tidak ada catatan analisa'];
    };

    // Ambil notes dengan status = 'selesai' untuk hasil
    const getResultNotes = () => {
        if (!report.progress_logs || report.progress_logs.length === 0) {
            return null;
        }
        
        // Cari log dengan status_snapshot = 'selesai'
        const selesaiLog = report.progress_logs.find(log => log.status_snapshot === 'selesai');
        
        // Jika ada dan memiliki notes, return notes,否则 return null
        if (selesaiLog && selesaiLog.notes && selesaiLog.notes.trim() !== '') {
            return selesaiLog.notes;
        }
        
        return null;
    };

    const allNotes = getAllNotes();
    const resultNote = getResultNotes();

    const renderHTML = (content) => {
        if (!content) return null;
        return <div dangerouslySetInnerHTML={{ __html: content }} />;
    };

    const getPrintDate = () => {
        const now = new Date();
        return now.toLocaleDateString('id-ID', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const printDate = getPrintDate();

    return (
        <div className="bg-white min-h-screen text-black font-sans">
            <Head title={`Cetak Berita Acara - ${report.ticket_number}`} />

            <div className="print:hidden p-6 bg-gray-100 border-b border-gray-300 flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Cetak Berita Acara</h1>
                    <p className="text-gray-600 mt-1">No. Tiket: {report.ticket_number}</p>
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

            {/* ========================================== */}
            {/* AREA KERTAS CETAK A4 */}
            {/* ========================================== */}
            <div className="w-full max-w-4xl mx-auto p-8 bg-white text-sm leading-relaxed">
                
                {/* KOP SURAT RESMI */}
                <div className="border-b-4 border-double border-black mb-4 flex items-center">
                    <img src="/logo_tanbu.png" alt="Logo RS" className="w-24 h-24 object-contain mr-2" onError={(e) => { e.target.style.display = 'none'; }} />
                    <div className="text-center p-3">
                        <h3 className="text-lg font-bold uppercase tracking-tight">Pemerintah Kabupaten Tanah Bumbu</h3>
                        <h1 className="text-xl font-extrabold uppercase tracking-tight">UPTD RSUD dr. H. Andi Abdurrahman Noor</h1>
                        <p className="text-sm font-semibold">Alamat: Jl. H. M. Amin KM. 10 RT. 03 Desa Sepunggur 
                            Kec. Kusan Tengah Kab. Tanah Bumbu  Prov. Kalimantan Selatan KP 72273 
                            email : <span className="text-blue-600 underline">rsud tanahbumbu@gmail.com / rsud.tanbu@gmail.com</span> Telepon : 08115000266 / 05186070767</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-lg font-bold underline uppercase tracking-wide">FORMULIR PERBAIKAN ALAT KESEHATAN</h2>
                </div>

                {/* GRID INFORMASI UTAMA */}
                <div className="grid grid-cols-2 gap-6 border border-black p-4 rounded-lg mb-6">
                    <div className="space-y-2 border-r border-gray-300 pr-4">
                        <h3 className="font-bold border-b pb-1 text-gray-700 uppercase text-xs">I. Informasi Laporan</h3>
                        <p><span className="text-gray-500 inline-block w-28">Jenis Kendala</span>: <span className="font-semibold capitalize">{report.type}</span></p>
                        <p><span className="text-gray-500 inline-block w-28">Waktu Lapor</span>: <span>{formatDate(report.created_at)}</span></p>
                        <p><span className="text-gray-500 inline-block w-28">Status</span>: <span className="font-bold uppercase text-blue-800">{report.status.replace('_', ' ')}</span></p>
                        <p><span className="text-gray-500 inline-block w-28">User Pelapor</span>: <span>{report.reporter?.name}</span></p>
                    </div>
                    <div className="space-y-2 pl-2">
                        <h3 className="font-bold border-b pb-1 text-gray-700 uppercase text-xs">II. Spesifikasi Alat Kesehatan</h3>
                        <p><span className="text-gray-500 inline-block w-28">Nama Alat</span>: <span className="font-bold text-gray-900">{report.equipment?.name}</span></p>
                        <p><span className="text-gray-500 inline-block w-28">Ruangan</span>: <span>{report.equipment?.room?.name || '-'}</span></p>
                        <p><span className="text-gray-500 inline-block w-28">Merk / Tipe</span>: <span>{report.equipment?.brand || '-'}</span></p>
                        <p><span className="text-gray-500 inline-block w-28">Serial Number</span>: <span className="font-mono">{report.equipment?.serial_number || '-'}</span></p>
                    </div>
                </div>

                {/* Analisa Kerusakan - Hanya status_snapshot = 'diproses' */}
                <div className="border border-black p-4 rounded-lg mb-6">
                    <h3 className="font-bold border-b border-gray-300 pb-1 text-gray-800 uppercase text-xs mb-2">III. Analisa Kerusakan</h3>
                    <div className="space-y-2">
                        {allNotes.length > 0 ? (
                            <div>
                                {allNotes.map((note, index) => (
                                    <div key={index} className="mb-2">
                                        {renderHTML(note)}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400 italic">Tidak ada catatan analisa</p>
                        )}
                    </div>
                </div>

                {/* Tindakan Perbaikan */}
                <div className="border border-black p-4 rounded-lg mb-6">
                    <h3 className="font-bold border-b border-gray-300 pb-1 text-gray-800 uppercase text-xs mb-2">IV. Tindakan Perbaikan</h3>
                    <div className="space-y-2">
                        {report.action_taken ? (
                            <div dangerouslySetInnerHTML={{ __html: report.action_taken }} />
                        ) : (
                            <p>-------------------------------------------------------</p>
                        )}
                    </div>
                </div>

                {/* Bagian Hasil dan Tanda Tangan - 3 Kolom dengan Border */}
                <div className="border border-black rounded-lg overflow-hidden mb-6">
                    {/* Header */}
                    <div className="bg-gray-50 p-3 border-b border-black">
                        <h3 className="font-bold text-gray-800 uppercase text-xs text-center">V. Hasil & Verifikasi</h3>
                    </div>
                    
                    {/* 3 Kolom */}
                    <div className="grid grid-cols-3 divide-x divide-black">
                        {/* Kolom 1: Hasil Perbaikan */}
                        <div className="p-4 min-h-[150px] flex flex-col">
                            <div className="flex-1 border-2 border-dashed border-gray-300 rounded p-2 min-h-[80px] flex items-start justify-start">
                                {resultNote ? (
                                    <div className="w-full text-sm">
                                        {renderHTML(resultNote)}
                                    </div>
                                ) : (
                                    <span className="text-gray-400 text-xs w-full text-center">(Kosong)</span>
                                )}
                            </div>
                        </div>

                        {/* Kolom 2: Tanda Tangan Pelapor */}
                        <div className="p-4 min-h-[150px] flex flex-col items-center justify-between">
                            <p className="text-xs font-bold text-gray-600 uppercase text-center">Pelapor</p>
                            <div className="h-16 flex items-center justify-center w-full">
                                {report.room_approved_at && report.reporter?.signature_path ? (
                                    <img src={`/storage/${report.reporter.signature_path}`} alt="TTD Pelapor" className="max-h-16 object-contain mix-blend-multiply" />
                                ) : (
                                    <span className="text-[10px] text-gray-300 italic">Belum TTD</span>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-xs underline">{report.reporter?.name || '-'}</p>
                            </div>
                        </div>

                        {/* Kolom 3: Tanda Tangan Teknisi */}
                        <div className="p-4 min-h-[150px] flex flex-col items-center justify-between">
                            <p className="text-xs font-bold text-gray-600 uppercase text-center">Petugas (Teknisi)</p>
                            <div className="h-16 flex items-center justify-center w-full">
                                {report.status === 'selesai' && (() => {
                                    const selesaiLog = report.progress_logs?.find(log => log.status_snapshot === 'selesai');
                                    if (selesaiLog && selesaiLog.user?.signature_path) {
                                        return <img src={`/storage/${selesaiLog.user.signature_path}`} alt="TTD Admin" className="max-h-16 object-contain mix-blend-multiply" />;
                                    }
                                })()}
                                {(!report.status === 'selesai' || !report.progress_logs?.find(log => log.status_snapshot === 'selesai')?.user?.signature_path) && (
                                    <span className="text-[10px] text-gray-300 italic">Belum TTD</span>
                                )}
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-xs underline">
                                    {report.status === 'selesai' ? (report.progress_logs?.find(log => log.status_snapshot === 'selesai')?.user?.name || 'Teknisi') : 'Belum TTD'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer dengan Teknisi dan Biaya */}
                    <div className="grid grid-cols-2 gap-4 p-3 border-t border-black bg-gray-50">
                        <div>
                            <p className="text-xs font-bold text-gray-600 uppercase">Teknisi Pelaksana: {report.external_technician || 'Internal'}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-600 uppercase">Biaya: {report.cost > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(report.cost)}` : 'Rp 0'}</p>                                
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-[10px] text-gray-400 border-t border-gray-200 pt-2 font-mono">
                    Dokumen dirilis otomatis melalui SIMEDI pada: {printDate}
                </div>
            </div>
        </div>
    );
}