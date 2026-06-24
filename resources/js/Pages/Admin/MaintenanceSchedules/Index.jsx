import React, { useState, useRef, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router, Link } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { formatDate } from '@/Helpers/date';
import { 
    Calendar, User, Package, 
    Plus, Edit, Trash2, 
    CheckCircle, Clock, AlertCircle,
    Grid, List, Filter, ChevronDown,
    Building2, Hash, FileText, Activity
} from 'lucide-react';

export default function Index({ auth, schedules, equipments, technicians, filters, stats }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
    const [equipmentSearch, setEquipmentSearch] = useState('');
    const [isEquipmentDropdownOpen, setIsEquipmentDropdownOpen] = useState(false);
    const equipmentDropdownRef = useRef(null);

    const { data, setData, post, put, delete: destroy, reset, errors, processing, clearErrors } = useForm({
        id: '',
        equipment_id: '',
        technician_id: '',
        scheduled_date: '',
        status: 'menunggu',
        notes: '',
    });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (equipmentDropdownRef.current && !equipmentDropdownRef.current.contains(event.target)) {
                setIsEquipmentDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredEquipments = useMemo(() => {
        return equipments.filter(eq => 
            eq.name.toLowerCase().includes(equipmentSearch.toLowerCase()) || 
            eq.inventory_number.toLowerCase().includes(equipmentSearch.toLowerCase())
        );
    }, [equipments, equipmentSearch]);

    const selectedEquipment = useMemo(() => {
        return equipments.find(eq => eq.id == data.equipment_id);
    }, [equipments, data.equipment_id]);

    const openModal = (sched = null) => {
        clearErrors();
        setEquipmentSearch('');
        setIsEquipmentDropdownOpen(false);
        if (sched) {
            setIsEditing(true);
            setData({
                id: sched.id,
                equipment_id: sched.equipment_id,
                technician_id: sched.technician_id,
                scheduled_date: sched.scheduled_date ? sched.scheduled_date.substring(0,10) : '',
                status: sched.status,
                notes: sched.notes || '',
            });
        } else {
            setIsEditing(false);
            reset();
        }
        setIsModalOpen(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('maintenance-schedules.update', data.id), { onSuccess: () => setIsModalOpen(false) });
        } else {
            post(route('maintenance-schedules.store'), { onSuccess: () => setIsModalOpen(false) });
        }
    };

    const changeStatusDirectly = (id, newStatus) => {
        router.put(route('maintenance-schedules.updateStatus', id), { status: newStatus }, { preserveScroll: true });
    };

    const handleFilterChange = (e) => {
        const value = e.target.value;
        setStatusFilter(value);
        router.get(route('maintenance-schedules.index'), { status: value }, { preserveState: true });
    };

    const getStatusBadge = (status) => {
        const styles = {
            menunggu: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            selesai: 'bg-green-100 text-green-800 border-green-200',
            terlewat: 'bg-red-100 text-red-800 border-red-200',
        };
        const icons = {
            menunggu: <Clock className="w-3 h-3" />,
            selesai: <CheckCircle className="w-3 h-3" />,
            terlewat: <AlertCircle className="w-3 h-3" />,
        };
        const labels = {
            menunggu: 'Menunggu',
            selesai: 'Selesai',
            terlewat: 'Terlewat',
        };
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${styles[status] || styles.menunggu}`}>
                {icons[status] || icons.menunggu}
                {labels[status] || status}
            </span>
        );
    };

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            router.delete(route("maintenance-schedules.destroy", deleteId), {
                onSuccess: () => setIsDeleteModalOpen(false),
            });
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Jadwal Pemeliharaan Rutin
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Jadwal Pemeliharaan - SIMAK" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            {/* --- Header & Filter --- */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-64">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Filter className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <select 
                                            className="w-full pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 text-sm appearance-none"
                                            value={statusFilter}
                                            onChange={handleFilterChange}
                                        >
                                            <option value="">Semua Status</option>
                                            <option value="menunggu">🔄 Menunggu</option>
                                            <option value="selesai">✅ Selesai</option>
                                            <option value="terlewat">❌ Terlewat</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ChevronDown className="h-4 w-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                    <button 
                                        onClick={() => openModal()} 
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-medium shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">Atur Jadwal</span>
                                    </button>

                                    {/* View Toggle */}
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="Tampilan Tabel"
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                            title="Tampilan Grid"
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* --- Stats Cards --- */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Total Jadwal</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-purple-500/10 rounded-xl">
                                        <Calendar className="w-6 h-6 text-purple-600" />
                                    </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-100">
                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Menunggu</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pending}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                                        <Clock className="w-6 h-6 text-yellow-600" />
                                    </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Selesai</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.completed}</p>
                                    </div>
                                    <div className="p-3 bg-green-500/10 rounded-xl">
                                        <CheckCircle className="w-6 h-6 text-green-600" />
                                    </div>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 border border-red-100">
                                    <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-red-600 uppercase tracking-wider">Terlewat</p>
                                        <p className="text-2xl font-bold text-gray-800 mt-1">{stats.overdue}</p>
                                    </div>
                                    <div className="p-3 bg-red-500/10 rounded-xl">
                                        <AlertCircle className="w-6 h-6 text-red-600" />
                                    </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Tabel Data --- */}
                            {viewMode === 'table' ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        Tanggal
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-3.5 h-3.5" />
                                                        Alat Medis
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5" />
                                                        Teknisi
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                                <th className="px-6 py-4 font-semibold text-center">Ubah Status</th>
                                                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {schedules.data.map((sched, index) => (
                                                <tr
                                                    key={sched.id}
                                                    className={`bg-white border-b hover:bg-purple-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">
                                                            {formatDate(sched.scheduled_date)}
                                                        </div>
                                                        <div className="text-xs text-gray-400">
                                                            {new Date(sched.scheduled_date).toLocaleDateString('id-ID', { weekday: 'long' })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-semibold text-gray-800">{sched.equipment?.name}</div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                                                            <Hash className="w-3 h-3" />
                                                            <span className="font-mono">{sched.equipment?.inventory_number}</span>
                                                            <span className="w-px h-3 bg-gray-300"></span>
                                                            <Building2 className="w-3 h-3" />
                                                            <span>{sched.equipment?.room?.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                                                {sched.technician?.name?.charAt(0) || 'T'}
                                                            </div>
                                                            <span className="font-medium text-gray-800">{sched.technician?.name}</span>
                                                        </div>
                                                        {sched.technician?.specialization && (
                                                            <div className="text-xs text-gray-400 ml-8">
                                                                {sched.technician.specialization}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {getStatusBadge(sched.status)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <select 
                                                            className="text-xs rounded-xl border-gray-200 bg-gray-50 px-3 py-1.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
                                                            value={sched.status} 
                                                            onChange={e => changeStatusDirectly(sched.id, e.target.value)}
                                                        >
                                                            <option value="menunggu">Menunggu</option>
                                                            <option value="selesai">Selesai</option>
                                                            <option value="terlewat">Terlewat</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={() => openModal(sched)}
                                                                className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => openDeleteModal(sched.id)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                                title="Hapus"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {schedules.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Calendar className="w-12 h-12 text-gray-300" />
                                                            <p className="text-gray-500 font-medium">Tidak ada jadwal pemeliharaan</p>
                                                            <p className="text-gray-400 text-sm">Atur jadwal baru untuk memulai preventive maintenance</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                // Grid View
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {schedules.data.map((sched) => (
                                        <div
                                            key={sched.id}
                                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`p-2.5 rounded-xl ${
                                                    sched.status === 'selesai' ? 'bg-green-100 text-green-700' :
                                                    sched.status === 'terlewat' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    <Calendar className="w-5 h-5" />
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                                    <button
                                                        onClick={() => openModal(sched)}
                                                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(sched.id)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    <span className="font-bold text-gray-800">
                                                        {formatDate(sched.scheduled_date)}
                                                    </span>
                                                </div>
                                                <div className="mt-2">
                                                    <h4 className="font-semibold text-gray-800">{sched.equipment?.name}</h4>
                                                    <p className="text-xs text-gray-400 font-mono">
                                                        <Hash className="w-3 h-3 inline mr-1" />
                                                        {sched.equipment?.inventory_number}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                                                        {sched.technician?.name?.charAt(0) || 'T'}
                                                    </div>
                                                    <span className="text-gray-700 text-sm">{sched.technician?.name}</span>
                                                </div>
                                                {getStatusBadge(sched.status)}
                                            </div>
                                            {sched.notes && (
                                                <div className="mt-2 text-xs text-gray-400 flex items-start gap-1">
                                                    <FileText className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    <span className="line-clamp-1">{sched.notes}</span>
                                                </div>
                                            )}
                                            <div className="mt-2 flex gap-1">
                                                <select 
                                                    className="text-xs rounded-lg border-gray-200 bg-gray-50 px-2 py-1 w-full focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-200"
                                                    value={sched.status} 
                                                    onChange={e => changeStatusDirectly(sched.id, e.target.value)}
                                                >
                                                    <option value="menunggu">Menunggu</option>
                                                    <option value="selesai">Selesai</option>
                                                    <option value="terlewat">Terlewat</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                    {schedules.data.length === 0 && (
                                        <div className="col-span-full text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Calendar className="w-12 h-12 text-gray-300" />
                                                <p className="text-gray-500 font-medium">Tidak ada jadwal pemeliharaan</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Menampilkan <strong>{schedules.from || 0}</strong> sampai <strong>{schedules.to || 0}</strong> dari <strong>{schedules.total}</strong> data
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {schedules.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                                                ${link.active ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md" : 
                                                  "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"} 
                                                ${!link.url && "opacity-40 cursor-not-allowed"}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL FORM --- */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="lg">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Ubah Rencana Pemeliharaan' : 'Atur Rencana Pemeliharaan Rutin'}
                            </h2>
                            <p className="text-sm text-gray-500">
                                {isEditing ? 'Perbarui jadwal pemeliharaan' : 'Buat jadwal preventive maintenance baru'}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="md:col-span-2" ref={equipmentDropdownRef}>
                            <InputLabel htmlFor="equipment_id" value="Pilih Alat Kesehatan" required />
                            <div className="relative mt-1">
                                <Package className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />
                                
                                {/* Input Pencarian / Tampilan Terpilih */}
                                <input
                                    type="text"
                                    className="pl-10 pr-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 py-2.5 px-4 text-sm cursor-pointer"
                                    placeholder="Ketik nama alat atau nomor inventaris..."
                                    value={isEquipmentDropdownOpen ? equipmentSearch : (selectedEquipment ? `${selectedEquipment.name} [${selectedEquipment.inventory_number}]` : '')}
                                    onChange={(e) => {
                                        setEquipmentSearch(e.target.value);
                                        if (!isEquipmentDropdownOpen) setIsEquipmentDropdownOpen(true);
                                    }}
                                    onFocus={() => {
                                        setIsEquipmentDropdownOpen(true);
                                        setEquipmentSearch('');
                                    }}
                                    readOnly={!isEquipmentDropdownOpen && selectedEquipment}
                                />
                                
                                <ChevronDown className={`absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${isEquipmentDropdownOpen ? 'rotate-180' : ''}`} />

                                {/* Dropdown Options List */}
                                {isEquipmentDropdownOpen && (
                                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                                        {filteredEquipments.length > 0 ? (
                                            filteredEquipments.map(eq => (
                                                <div
                                                    key={eq.id}
                                                    className={`px-4 py-2.5 cursor-pointer hover:bg-purple-50 transition-colors duration-150 border-b border-gray-50 last:border-0 ${data.equipment_id === eq.id ? 'bg-purple-50 text-purple-700' : 'text-gray-700'}`}
                                                    onClick={() => {
                                                        setData('equipment_id', eq.id);
                                                        setEquipmentSearch('');
                                                        setIsEquipmentDropdownOpen(false);
                                                        clearErrors('equipment_id');
                                                    }}
                                                >
                                                    <div className="font-semibold text-sm">{eq.name}</div>
                                                    <div className="text-xs mt-0.5 flex items-center gap-1.5 opacity-70">
                                                        <Hash className="w-3 h-3" />
                                                        <span>{eq.inventory_number}</span>
                                                        <span className="w-px h-3 bg-gray-300"></span>
                                                        <Building2 className="w-3 h-3" />
                                                        <span>{eq.room?.name || 'Tanpa Ruangan'}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="px-4 py-6 text-sm text-gray-400 text-center flex flex-col items-center">
                                                <Package className="w-8 h-8 mb-2 opacity-20" />
                                                Alat tidak ditemukan
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <InputError message={errors.equipment_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="technician_id" value="Ditugaskan Kepada (Teknisi)" required />
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select 
                                    id="technician_id" 
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                    value={data.technician_id} 
                                    onChange={e => setData('technician_id', e.target.value)} 
                                    required
                                >
                                    <option value="">-- Pilih Teknisi --</option>
                                    {technicians.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.specialization || 'Umum'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <InputError message={errors.technician_id} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="scheduled_date" value="Tanggal Pelaksanaan" required />
                            <div className="relative mt-1">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput 
                                    id="scheduled_date" 
                                    type="date" 
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200" 
                                    value={data.scheduled_date} 
                                    onChange={e => setData('scheduled_date', e.target.value)} 
                                    required 
                                />
                            </div>
                            <InputError message={errors.scheduled_date} className="mt-2" />
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
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="menunggu">🔄 Menunggu</option>
                                        <option value="selesai">✅ Selesai</option>
                                        <option value="terlewat">❌ Terlewat</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <InputLabel htmlFor="notes" value="Instruksi Khusus / Catatan Tugas" />
                            <div className="relative mt-1">
                                <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <textarea 
                                    id="notes" 
                                    rows="2" 
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 py-2.5 px-4"
                                    value={data.notes} 
                                    onChange={e => setData('notes', e.target.value)} 
                                    placeholder="Contoh: Cek filter oli pompa vakum atau kalibrasi kelistrikan..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton onClick={() => setIsModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton 
                            disabled={processing} 
                            className="ml-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-purple-500/20"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Rencana'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Modal Konfirmasi Hapus */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center gap-3 pb-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl text-white">
                            <Trash2 className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Konfirmasi Hapus</h2>
                            <p className="text-sm text-gray-500">
                                Apakah Anda yakin ingin menghapus jadwal ini?
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="rounded-xl"
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={confirmDelete}
                            className="ml-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl px-6 py-2.5 shadow-lg shadow-red-500/20"
                        >
                            Hapus
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}