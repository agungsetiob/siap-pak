import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

export default function PrintQr({ equipments, room }) {
    
    useEffect(() => {
        setTimeout(() => {
            window.print();
        }, 2100);
    }, []);

    return (
        <div className="bg-white min-h-screen text-black font-sans">
            <Head title="Cetak Label QR" />

            {/* HEADER KONTROL (Disembunyikan saat dicetak) */}
            <div className="print:hidden p-6 bg-gray-100 border-b border-gray-300 flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Pratinjau Cetak Label QR</h1>
                    <p className="text-gray-600 mt-1">
                        Total: <strong>{equipments.length} label</strong> {room ? `untuk ruangan ${room.name}` : '(Semua Ruangan)'}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => window.close()} className="px-4 py-2 bg-gray-400 text-white rounded font-bold shadow-sm hover:bg-gray-500">
                        Tutup Tab
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-blue-600 text-white rounded font-bold shadow-sm hover:bg-blue-700 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Cetak Sekarang
                    </button>
                </div>
            </div>

            {/* Setting: 4 kolom untuk kertas A4 */}
            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-4 print:gap-3">
                {equipments.map((eq) => (
                    <div 
                        key={eq.id} 
                        // break-inside-avoid sangat krusial agar stiker tidak terpotong di antara 2 halaman
                        className="border-[1.5px] border-black rounded-lg p-2 flex flex-col items-center text-center break-inside-avoid h-full"
                    >
                        <div className="font-bold text-[9px] uppercase border-b border-gray-400 w-full pb-1 mb-1 tracking-tighter line-clamp-1">
                            RSUD dr. H. Andi Abdurrahman Noor
                        </div>
                        
                        {/* Gambar QR */}
                        <img 
                            src={route('qr.render', eq.qr.qr_code)} 
                            alt={`QR ${eq.name}`} 
                            className="w-24 h-24 my-1" 
                        />
                        
                        {/* Detail Alat */}
                        <div className="w-full mt-1 flex flex-col flex-grow justify-between">
                            <p className="font-bold text-[11px] leading-tight line-clamp-2 h-7">{eq.name}</p>
                            <div className="mt-1">
                                <p className="text-[10px] font-mono leading-none">{eq.inventory_number}</p>
                                <p className="text-[9px] bg-gray-200 mt-1 rounded px-1 py-0.5 inline-block border border-gray-300 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                                    {eq.room?.name || 'Gudang'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
        </div>
    );
}