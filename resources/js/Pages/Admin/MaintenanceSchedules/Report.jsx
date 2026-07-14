import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, ClipboardCheck, Wrench, CheckCircle, Save } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

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

export default function Report({ auth, schedule }) {
    const initializeChecklist = () => {
        if (schedule.checklist_results && schedule.checklist_results.fisik?.status !== undefined) {
            return schedule.checklist_results;
        }
        
        let defaultChecklist = {};
        CHECKLIST_ITEMS.forEach(item => {
            defaultChecklist[item.key] = { status: '', note: '' };
        });
        return defaultChecklist;
    };

    const { data, setData, put, processing, errors } = useForm({
        frequency: schedule.frequency || '',
        checklist_results: initializeChecklist(),
        maintenance_actions: schedule.maintenance_actions || [],
        action_other: schedule.action_other || '',
        result_status: schedule.result_status || '',
        notes: schedule.notes || '', 
        follow_up_notes: schedule.follow_up_notes || '',
    });

    const handleChecklistChange = (key, field, value) => {
        setData('checklist_results', { 
            ...data.checklist_results, 
            [key]: {
                ...data.checklist_results[key],
                [field]: value
            }
        });
    };

    const handleActionChange = (action) => {
        let currentActions = [...data.maintenance_actions];
        if (currentActions.includes(action)) {
            currentActions = currentActions.filter(a => a !== action);
        } else {
            currentActions.push(action);
        }
        setData('maintenance_actions', currentActions);
    };

    const submit = (e) => {
        e.preventDefault();
        put(route('maintenance-schedules.saveReport', schedule.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={null}>
            <Head title="Laporan Pemeliharaan" />

            <div className="py-2 max-w-8xl mx-auto sm:px-2 lg:px-2 space-y-6">
                
                <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ClipboardCheck className="w-6 h-6" /></div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Form Pemeliharaan Alat Kesehatan</h2>
                            <p className="text-sm text-gray-500">Isi hasil pengecekan sesuai kondisi di lapangan</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {/* Tombol Cetak Dokumen */}
                        <button 
                            onClick={() => window.open(route('maintenance-schedules.print', schedule.id), '_blank')}
                            className="flex items-center gap-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Cetak
                        </button>
                        <Link href={route('maintenance-schedules.index')} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg">
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </Link>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    
                    {/* BAGIAN A: IDENTITAS ALAT */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg border-b pb-3 mb-4 uppercase text-gray-700">A. Identitas Alat</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                            <div><span className="text-gray-500 block">Nama Alat</span><strong className="text-gray-900">{schedule.equipment?.name}</strong></div>
                            <div><span className="text-gray-500 block">Merek / Tipe</span><strong className="text-gray-900">{schedule.equipment?.brand || '-'}</strong></div>
                            <div><span className="text-gray-500 block">Nomor Seri</span><strong className="font-mono text-gray-900">{schedule.equipment?.serial_number || '-'}</strong></div>
                            <div><span className="text-gray-500 block">No. Inventaris</span><strong className="font-mono text-gray-900">{schedule.equipment?.inventory_number}</strong></div>
                            <div><span className="text-gray-500 block">Unit/Ruangan</span><strong className="text-gray-900">{schedule.equipment?.room?.name}</strong></div>
                            <div><span className="text-gray-500 block">Teknisi Bertugas</span><strong className="text-blue-700">{schedule.technician?.name}</strong></div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <span className="text-gray-700 font-bold block mb-3">Frekuensi Pemeliharaan:</span>
                            <div className="flex flex-wrap gap-4">
                                {['Harian', 'Mingguan', 'Bulanan', 'Triwulanan', 'Semesteran', 'Tahunan'].map((freq) => (
                                    <label key={freq} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="frequency" 
                                            value={freq} 
                                            checked={data.frequency === freq}
                                            onChange={e => setData('frequency', e.target.value)}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            required
                                        />
                                        <span className="text-sm text-gray-700">{freq}</span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.frequency} className="mt-2" />
                        </div>
                    </div>

                    {/* BAGIAN B: CHECKLIST PEMELIHARAAN */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-lg border-b pb-3 mb-4 uppercase text-gray-700">B. Checklist Pemeliharaan</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 w-12 text-center">No</th>
                                        <th className="px-4 py-3">Item Pemeriksaan</th>
                                        <th className="px-4 py-3 text-center w-24">Baik</th>
                                        <th className="px-4 py-3 text-center w-28">Tdk Baik</th>
                                        <th className="px-4 py-3 text-center w-20">N/A</th>
                                        <th className="px-4 py-3 w-1/3">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {CHECKLIST_ITEMS.map((item, index) => (
                                        <tr key={item.key} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 text-center font-medium text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{item.label}</td>
                                            <td className="px-4 py-3 text-center">
                                                <input type="radio" name={`status_${item.key}`} checked={data.checklist_results[item.key]?.status === 'baik'} onChange={() => handleChecklistChange(item.key, 'status', 'baik')} className="w-5 h-5 text-green-600 focus:ring-green-500 border-gray-300 cursor-pointer" required />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input type="radio" name={`status_${item.key}`} checked={data.checklist_results[item.key]?.status === 'tidak_baik'} onChange={() => handleChecklistChange(item.key, 'status', 'tidak_baik')} className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300 cursor-pointer" />
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input type="radio" name={`status_${item.key}`} checked={data.checklist_results[item.key]?.status === 'na'} onChange={() => handleChecklistChange(item.key, 'status', 'na')} className="w-5 h-5 text-gray-400 focus:ring-gray-400 border-gray-300 cursor-pointer" title="Not Applicable (Tidak Tersedia)" />
                                            </td>
                                            <td className="px-4 py-2">
                                                <input 
                                                    type="text" 
                                                    className="w-full border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm px-3 py-1.5 bg-white" 
                                                    placeholder="..."
                                                    value={data.checklist_results[item.key]?.note || ''}
                                                    onChange={(e) => handleChecklistChange(item.key, 'note', e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* BAGIAN C & D: TINDAKAN & HASIL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                            <h3 className="font-bold text-lg border-b pb-3 mb-4 uppercase text-gray-700 flex items-center gap-2"><Wrench className="w-5 h-5"/> C. Tindakan Pemeliharaan</h3>
                            <div className="space-y-3">
                                {MAINTENANCE_ACTIONS.map((action) => (
                                    <label key={action} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors">
                                        <input type="checkbox" checked={data.maintenance_actions.includes(action)} onChange={() => handleActionChange(action)} className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                        <span className="text-sm text-gray-700 font-medium">{action}</span>
                                    </label>
                                ))}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <InputLabel value="Lainnya:" className="text-xs text-gray-500 mb-1" />
                                    <input type="text" className="w-full border-b border-0 border-gray-300 focus:border-blue-500 focus:ring-0 px-0 text-sm bg-transparent" value={data.action_other} onChange={e => setData('action_other', e.target.value)} placeholder="Tulis tindakan lain jika ada..." />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg border-b pb-3 mb-4 uppercase text-gray-700 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> D. Hasil Pemeliharaan</h3>
                                <div className="space-y-3">
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.result_status === 'layak' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-200'}`}>
                                        <input type="radio" name="result" value="layak" checked={data.result_status === 'layak'} onChange={e => setData('result_status', e.target.value)} className="hidden" />
                                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${data.result_status === 'layak' ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}></div>
                                        <span className={`text-sm font-bold ${data.result_status === 'layak' ? 'text-green-800' : 'text-gray-600'}`}>Alat layak digunakan.</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.result_status === 'layak_dengan_catatan' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-100 hover:border-yellow-200'}`}>
                                        <input type="radio" name="result" value="layak_dengan_catatan" checked={data.result_status === 'layak_dengan_catatan'} onChange={e => setData('result_status', e.target.value)} className="hidden" />
                                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${data.result_status === 'layak_dengan_catatan' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'}`}></div>
                                        <span className={`text-sm font-bold ${data.result_status === 'layak_dengan_catatan' ? 'text-yellow-800' : 'text-gray-600'}`}>Alat layak digunakan dengan catatan.</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${data.result_status === 'tidak_layak' ? 'border-red-500 bg-red-50' : 'border-gray-100 hover:border-red-200'}`}>
                                        <input type="radio" name="result" value="tidak_layak" checked={data.result_status === 'tidak_layak'} onChange={e => setData('result_status', e.target.value)} className="hidden" />
                                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${data.result_status === 'tidak_layak' ? 'border-red-500 bg-red-500' : 'border-gray-300'}`}></div>
                                        <span className={`text-sm font-bold ${data.result_status === 'tidak_layak' ? 'text-red-800' : 'text-gray-600'}`}>Alat tidak layak digunakan (perlu perbaikan).</span>
                                    </label>
                                </div>
                                <InputError message={errors.result_status} className="mt-2" />

                                {/* TAMBAHAN CATATAN */}
                                <div className="mt-5 pt-5 border-t border-gray-100">
                                    <InputLabel value="Catatan:" className="text-gray-700 font-semibold mb-2" />
                                    <textarea 
                                        rows="3" 
                                        className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50 p-3 text-sm resize-none" 
                                        value={data.notes} 
                                        onChange={e => setData('notes', e.target.value)} 
                                        placeholder="Tuliskan catatan terkait hasil pemeliharaan di atas jika ada..."
                                    ></textarea>
                                    <InputError message={errors.notes} className="mt-2" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg border-b pb-3 mb-4 uppercase text-gray-700">E. Tindak Lanjut</h3>
                                <textarea 
                                    rows="3" 
                                    className="w-full rounded-xl border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50/50 p-3 text-sm resize-none" 
                                    value={data.follow_up_notes} 
                                    onChange={e => setData('follow_up_notes', e.target.value)} 
                                    placeholder="Tuliskan saran tindak lanjut ke depannya..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <PrimaryButton 
                        disabled={processing} 
                        className="fixed bottom-4 right-8 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-base shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all duration-200 rounded-xl"
                    >
                        {processing ? 'Menyimpan...' : <span className="flex items-center gap-2"><Save className="w-5 h-5"/> Simpan Laporan</span>}
                    </PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}