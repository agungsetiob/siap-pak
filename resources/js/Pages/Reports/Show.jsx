import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { formatDate } from "@/Helpers/date";
import { 
    ChevronLeft, Printer, CheckCircle, Clock, AlertCircle, XCircle,
    User, Calendar, Package, Tag, FileText, Check, ThumbsUp, UserCheck,
    Building2, Wrench, MessageSquare
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

const RichTextEditor = ({ value, onChange, placeholder = "Tulis catatan Anda..." }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                // Remove link from StarterKit to avoid duplication
                link: false,
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
            Image,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm prose-blue max-w-none focus:outline-none min-h-[150px] p-4',
            },
        },
    });

    // Only render editor on client side to avoid hydration issues
    if (!isClient) {
        return (
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="p-4 text-gray-500">Loading editor...</div>
            </div>
        );
    }

    return (
        <div className="border border-gray-300 rounded-xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all duration-200 shadow-sm">
            {/* Toolbar */}
            <div className="border-b border-gray-200 bg-gray-50/80 p-2 flex flex-wrap gap-1 items-center">
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('bold') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Bold"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('italic') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Italic"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 4h4M6 20h4M14 4l-4 16" /></svg>
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                {/* Paragraf & Headings */}
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().setParagraph().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('paragraph') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Paragraph"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h7" /></svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Heading"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6v12M8 6v12M4 12h4M12 6v12M16 6v12M12 12h4" /></svg>
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                {/* Lists */}
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('bulletList') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Bullet List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16M4 6h.01M4 12h.01M4 18h.01" /></svg>
                </button>
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('orderedList') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Numbered List"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M7 12h10M7 8h10M7 16h10M3 6h2M3 12h2M3 18h2" /></svg>
                </button>

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                {/* TABLE CONTROLS */}
                <button
                    type="button"
                    onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                    title="Insert Table"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" /></svg>
                </button>
                {editor?.isActive('table') && (
                    <div className="flex bg-blue-50 rounded-lg p-0.5 border border-blue-100 ml-1">
                        <button type="button" onClick={() => editor.chain().focus().addColumnAfter().run()} className="p-1 text-blue-600 hover:bg-blue-200 rounded" title="Tambah Kolom"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg></button>
                        <button type="button" onClick={() => editor.chain().focus().addRowAfter().run()} className="p-1 text-blue-600 hover:bg-blue-200 rounded" title="Tambah Baris"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 4v16" /></svg></button>
                        <button type="button" onClick={() => editor.chain().focus().deleteTable().run()} className="p-1 text-red-600 hover:bg-red-200 rounded ml-1" title="Hapus Tabel"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                )}

                <div className="w-px h-5 bg-gray-300 mx-1"></div>

                <button
                    type="button"
                    onClick={() => {
                        const url = window.prompt('URL:');
                        if (url) {
                            editor?.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${editor?.isActive('link') ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-200'}`}
                    title="Link"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m3.172-3.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102" /></svg>
                </button>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default function Show({ auth, report }) {
    const isAdmin = auth.user.role === 'admin';
    const isSelesai = report.status === 'selesai' || report.status === 'dibatalkan';
    const [showAllLogs, setShowAllLogs] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        status: report.status === 'menunggu' ? 'diproses' : report.status,
        notes: '',
        action_taken: report.action_taken || '',
        external_technician: report.external_technician || '',
        cost: report.cost || '',
    });

    const submitProgress = (e) => {
        e.preventDefault();
        put(route('reports.progress.update', report.id), {
            onSuccess: () => {
                reset('notes');
                alert('Progress berhasil diperbarui dan notifikasi telah dikirim ke pelapor.');
            },
        });
    };

    const getStatusBadge = (status) => {
        const styles = {
            menunggu: 'bg-red-100 text-red-800 border-red-200',
            diproses: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            selesai: 'bg-green-100 text-green-800 border-green-200',
            dibatalkan: 'bg-gray-100 text-gray-800 border-gray-200',
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

    const displayLogs = showAllLogs ? report.progress_logs : report.progress_logs?.slice(0, 3);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={null}
        >
            <Head title={`Tiket ${report.ticket_number}`} />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4 mb-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 print:hidden">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                            <div>
                                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                                    Detail Tiket: <span className="font-mono text-blue-600">{report.ticket_number}</span>
                                </h2>
                            </div>
                        </div>
                        <div className="flex gap-3 items-center w-full sm:w-auto">
                            <button 
                                onClick={() => window.open(route('reports.print', report.id), '_blank')} 
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-600 font-medium shadow-lg shadow-gray-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-gray-500/30"
                            >
                                <Printer className="w-4 h-4" />
                                Cetak Dokumen
                            </button>
                            <Link 
                                href={route('reports.index')} 
                                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 font-medium"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Kembali
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* KOLOM KIRI */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Informasi Laporan
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span>
                                    {getStatusBadge(report.status)}
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Waktu Lapor</p>
                                        <p className="text-sm font-medium text-gray-900">{formatDate(report.created_at, { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Dilaporkan Oleh</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {report.reporter?.name}
                                            <span className="text-xs text-gray-400 ml-1">({report.reporter?.room?.name || 'Unit'})</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-xs text-gray-500">Jenis Laporan</p>
                                        <p className="text-sm font-medium text-gray-900 capitalize">{report.type}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 mb-2">Deskripsi Kendala</p>
                                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
                                        {report.description}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
                            <div className="px-5 py-4 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-purple-600" />
                                    Identitas Alat
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500">Nama Alat</p>
                                    <p className="text-sm font-bold text-gray-900">{report.equipment?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">No. Inventaris</p>
                                    <p className="text-sm font-mono text-gray-700">{report.equipment?.inventory_number || '-'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Merk</p>
                                        <p className="text-sm font-medium text-gray-900">{report.equipment?.brand || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Serial Number</p>
                                        <p className="text-sm font-mono text-gray-700">{report.equipment?.serial_number || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN */}
                    <div className="lg:col-span-2 space-y-6">
                        {isAdmin && !isSelesai && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <Wrench className="w-5 h-5" />
                                        Tindak Lanjut Perbaikan
                                    </h3>
                                    <p className="text-blue-100 text-xs mt-0.5">Update progress perbaikan alat</p>
                                </div>
                                <form onSubmit={submitProgress} className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="status" value="Status Perbaikan" className="text-sm font-semibold" />
                                            <select
                                                id="status"
                                                className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                value={data.status}
                                                onChange={(e) => setData('status', e.target.value)}
                                            >
                                                <option value="diproses">Sedang Diproses</option>
                                                <option value="selesai">Selesai Diperbaiki</option>
                                                <option value="dibatalkan">Dibatalkan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="external_technician" value="Teknisi / Vendor Luar" className="text-sm font-semibold" />
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                <TextInput
                                                    id="external_technician"
                                                    type="text"
                                                    className="pl-10 mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                    value={data.external_technician}
                                                    onChange={(e) => setData('external_technician', e.target.value)}
                                                    placeholder="Nama Vendor / Teknisi"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="notes" value="Catatan / Progress" className="text-sm font-semibold" />
                                        <RichTextEditor
                                            value={data.notes}
                                            onChange={(html) => setData('notes', html)}
                                            placeholder="Tulis detail progress perbaikan..."
                                        />
                                        <InputError message={errors.notes} className="mt-2" />
                                    </div>
                                    
                                    {data.status === 'selesai' && (
                                        <div className="space-y-4 p-4 bg-white/50 rounded-xl border border-green-200">
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="font-semibold">Detail Penyelesaian</span>
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="action_taken" value="Tindakan yang Dilakukan" />
                                                <RichTextEditor
                                                    value={data.action_taken}
                                                    onChange={(html) => setData('action_taken', html)}
                                                    placeholder="Jelaskan tindakan perbaikan yang dilakukan..."
                                                />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="cost" value="Total Biaya (Rp)" />
                                                <div className="relative">
                                                    <TextInput
                                                        id="cost"
                                                        type="number"
                                                        className="pl-3 mt-1 block w-full md:w-1/2 rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
                                                        value={data.cost}
                                                        onChange={(e) => setData('cost', e.target.value)}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <PrimaryButton 
                                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-3 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                    </svg>
                                                    Menyimpan...
                                                </span>
                                            ) : (
                                                'Simpan Progress & Kirim Notifikasi'
                                            )}
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}

                        {isSelesai && report.action_taken && (
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600">
                                    <h3 className="text-white font-bold flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5" />
                                        Laporan Selesai Ditangani
                                    </h3>
                                </div>
                                <div className="p-6 space-y-3">
                                    <div dangerouslySetInnerHTML={{ __html: report.action_taken }} className="text-sm text-gray-700 prose prose-sm prose-green max-w-none" />
                                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-green-200">
                                        {report.external_technician && (
                                            <div>
                                                <p className="text-xs text-gray-500">Dikerjakan Oleh</p>
                                                <p className="text-sm font-medium text-gray-900">{report.external_technician}</p>
                                            </div>
                                        )}
                                        {report.cost > 0 && (
                                            <div>
                                                <p className="text-xs text-gray-500">Biaya</p>
                                                <p className="text-sm font-bold text-gray-900">Rp {new Intl.NumberFormat('id-ID').format(report.cost)}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-teal-50 to-cyan-50 border-b border-gray-100">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <UserCheck className="w-4 h-4 text-teal-600" />
                                    Verifikasi & Persetujuan
                                </h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            <Building2 className="w-4 h-4" />
                                            Approve Ruangan
                                        </div>
                                        <div className="min-h-[80px] flex items-center justify-center">
                                            {report.room_approved_at ? (
                                                report.reporter?.signature_path ? (
                                                    <img src={`/storage/${report.reporter.signature_path}`} alt="TTD Pelapor" className="max-h-16 object-contain mix-blend-multiply" />
                                                ) : (
                                                    <span className="inline-flex items-center gap-2 text-green-600 font-bold bg-green-100 px-3 py-1.5 rounded-lg">
                                                        <Check className="w-4 h-4" />
                                                        DISETUJUI
                                                    </span>
                                                )
                                            ) : (
                                                isSelesai ? (
                                                    !isAdmin ? (
                                                        <button 
                                                            onClick={() => {
                                                                if(confirm('Apakah alat sudah berfungsi dengan baik? Tanda tangan Anda akan dibubuhkan.')){
                                                                    router.post(route('reports.approve', report.id), {}, {
                                                                        onError: (err) => { if(err.error) alert(err.error); }
                                                                    });
                                                                }
                                                            }}
                                                            className="inline-flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-500/30 hover:bg-green-700 transition-all duration-200 hover:shadow-xl"
                                                        >
                                                            <ThumbsUp className="w-4 h-4" />
                                                            Setujui & Tanda Tangani
                                                        </button>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 text-sm font-medium">
                                                            <Clock className="w-4 h-4 animate-pulse" />
                                                            Menunggu Verifikasi Ruangan
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Menunggu perbaikan selesai</span>
                                                )
                                            )}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="font-bold text-gray-800 text-sm">{report.reporter?.name}</p>
                                            <p className="text-xs text-gray-400">Unit: {report.reporter?.room?.name || 'Staf'}</p>
                                            {report.room_approved_at && (
                                                <p className="text-xs text-green-600 font-mono font-bold mt-1">
                                                    Disetujui: {formatDate(report.room_approved_at)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-center">
                                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                                            <UserCheck className="w-4 h-4" />
                                            Approve Admin
                                        </div>
                                        <div className="min-h-[80px] flex items-center justify-center">
                                            {report.status === 'selesai' ? (
                                                (() => {
                                                    const selesaiLog = report.progress_logs?.find(log => log.status_snapshot === 'selesai');
                                                    if (selesaiLog && selesaiLog.user?.signature_path) {
                                                        return <img src={`/storage/${selesaiLog.user.signature_path}`} alt="TTD Admin" className="max-h-16 object-contain mix-blend-multiply" />;
                                                    }
                                                    return (
                                                        <span className="inline-flex items-center gap-2 text-green-600 font-bold bg-green-100 px-3 py-1.5 rounded-lg">
                                                            <Check className="w-4 h-4" />
                                                            APPROVED
                                                        </span>
                                                    );
                                                })()
                                            ) : (
                                                <span className="inline-flex items-center gap-2 text-yellow-600 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200 text-sm font-medium">
                                                    <Clock className="w-4 h-4 animate-pulse" />
                                                    Menunggu Tindakan
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="font-bold text-gray-800 text-sm">
                                                {report.status === 'selesai' 
                                                    ? (report.progress_logs?.find(log => log.status_snapshot === 'selesai')?.user?.name || 'Admin IPSRS')
                                                    : 'Belum Diverifikasi'}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Status: <span className="uppercase font-bold">{report.status}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-600" />
                                    Riwayat Status
                                </h3>
                                {report.progress_logs?.length > 3 && (
                                    <button
                                        onClick={() => setShowAllLogs(!showAllLogs)}
                                        className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                    >
                                        {showAllLogs ? 'Sembunyikan' : `Lihat Semua (${report.progress_logs.length})`}
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                                    {displayLogs?.map((log) => (
                                        <div key={log.id} className="relative pl-6">
                                            <span className={`absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-white shadow-sm
                                                ${log.status_snapshot === 'menunggu' ? 'bg-red-500' : 
                                                  log.status_snapshot === 'diproses' ? 'bg-yellow-500' : 
                                                  log.status_snapshot === 'selesai' ? 'bg-green-500' : 'bg-gray-500'}`}
                                            ></span>
                                            <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                                                <h4 className="font-bold text-gray-900 capitalize flex items-center gap-2">
                                                    {getStatusBadge(log.status_snapshot)}
                                                </h4>
                                                <time className="text-xs font-mono text-gray-500 mt-1 sm:mt-0">
                                                    {formatDate(log.created_at)}
                                                </time>
                                            </div>
                                            <div 
                                                className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-2 prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: log.notes }}
                                            />
                                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                Diperbarui oleh: {log.user?.name || 'Sistem'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}