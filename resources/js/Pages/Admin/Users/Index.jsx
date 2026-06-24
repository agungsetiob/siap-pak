import React, { useState, useRef, useEffect, useMemo, Fragment } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import FlashMessage from '@/Components/FlashMessage';
import { 
    Plus, Search, Users, User, 
    Shield, Home, Mail, Phone, CheckCircle, 
    XCircle, Grid, List, 
    ChevronDown, UserCheck, UserX, Building2,
    Key, Eye, EyeOff
} from 'lucide-react';

// Custom Searchable Dropdown Component (Menggantikan Headless UI)
const SearchableSelect = ({ options = [], value, onChange, label, placeholder, displayValue, required = false }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Menutup dropdown jika user klik di luar area
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = useMemo(() => {
        if (!search) return options;
        return options.filter((option) =>
            displayValue(option).toLowerCase().includes(search.toLowerCase())
        );
    }, [options, search, displayValue]);

    // Text yang ditampilkan di input ketika tertutup
    const displayString = value ? displayValue(value) : '';

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative mt-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400 z-10" />

                <input
                    type="text"
                    className="pl-10 pr-10 block w-full rounded-xl border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 text-sm cursor-pointer"
                    placeholder={placeholder}
                    value={isOpen ? search : displayString}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearch(''); // Kosongkan pencarian saat diklik agar tampil semua
                    }}
                    readOnly={!isOpen && !!value} // Cegah keyboard muncul di mobile jika hanya melihat
                />

                <ChevronDown className={`absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto py-1">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option, idx) => (
                                <div
                                    key={option.id || idx}
                                    className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors duration-150 border-b border-gray-50 last:border-0 ${value?.id === option.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                    onClick={() => {
                                        onChange(option);
                                        setSearch('');
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        {value?.id === option.id && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                                        {displayValue(option)}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-sm text-gray-400 text-center flex flex-col items-center">
                                <Search className="w-6 h-6 mb-2 opacity-20" />
                                Tidak ditemukan
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Index({ auth, users, rooms, flash, stats }) {
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('table');
    const [showPassword, setShowPassword] = useState(false);

    // State untuk Modal Konfirmasi Status
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToToggle, setUserToToggle] = useState(null);

    const { data, setData, post, reset, errors, processing, clearErrors } = useForm({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'ruangan',
        room_id: '',
    });

    const openModal = () => {
        clearErrors();
        reset();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => closeModal(),
        });
    };

    const promptToggleStatus = (user) => {
        setUserToToggle(user);
        setIsConfirmModalOpen(true);
    };

    const confirmToggleStatus = () => {
        if (userToToggle) {
            router.delete(route('users.destroy', userToToggle.id), {
                onSuccess: () => setIsConfirmModalOpen(false)
            });
        }
    };

    // Stats
    const { totalUsers, adminCount, ruanganCount, activeCount } = stats;

    const getRoleBadge = (role) => {
        if (role === 'admin') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Shield className="w-3.5 h-3.5" />
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider">
                <Home className="w-3.5 h-3.5" />
                Ruangan
            </span>
        );
    };

    const getStatusBadge = (isActive) => {
        if (isActive) {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Aktif
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                    <XCircle className="w-3 h-3" />
                    Nonaktif
                </span>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Manajemen Pengguna
                        </h2>
                    </div>
                </div>
            }
        >
            <Head title="Manajemen Pengguna" />

            <div className="py-2">
                <div className="max-w-8xl mx-auto sm:px-4 lg:px-4">
                    
                    <FlashMessage flash={flash} />

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6">
                            {/* --- Header & Search --- */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                                <div className="flex items-center gap-3 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-72">
                                        <form onSubmit={(e) => { e.preventDefault(); router.get(route('users.index'), { search }, { preserveState: true }); }} className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Search className="h-4 w-4 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Cari nama atau email..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
                                            />
                                        </form>
                                    </div>
                                    <button
                                        type="submit"
                                        onClick={(e) => { e.preventDefault(); router.get(route('users.index'), { search }, { preserveState: true }); }}
                                        className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        Cari
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                                    <button
                                        onClick={openModal}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 hover:shadow-xl"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden sm:inline">Tambah Akun</span>
                                    </button>
                                    <div className="flex bg-gray-100 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('table')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* --- Stats Cards --- */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">Total Pengguna</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{totalUsers}</p>
                                        </div>
                                        <div className="p-3 bg-blue-500/10 rounded-xl">
                                            <Users className="w-6 h-6 text-blue-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-purple-600 uppercase tracking-wider">Admin</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{adminCount}</p>
                                        </div>
                                        <div className="p-3 bg-purple-500/10 rounded-xl">
                                            <Shield className="w-6 h-6 text-purple-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Ruangan</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{ruanganCount}</p>
                                        </div>
                                        <div className="p-3 bg-green-500/10 rounded-xl">
                                            <Home className="w-6 h-6 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-medium text-teal-600 uppercase tracking-wider">Aktif</p>
                                            <p className="text-2xl font-bold text-gray-800 mt-1">{activeCount}</p>
                                        </div>
                                        <div className="p-3 bg-teal-500/10 rounded-xl">
                                            <UserCheck className="w-6 h-6 text-teal-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- Table / Grid View --- */}
                            {viewMode === 'table' ? (
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="text-xs text-gray-700 uppercase bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3.5 h-3.5" />
                                                        Nama / Pengguna
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3.5 h-3.5" />
                                                        Kontak
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Shield className="w-3.5 h-3.5" />
                                                        Role
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-3.5 h-3.5" />
                                                        Ruangan
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 font-semibold text-center">Status</th>
                                                <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((user, index) => (
                                                <tr
                                                    key={user.id}
                                                    className={`bg-white border-b hover:bg-blue-50/30 transition-all duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold
                                                                ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
                                                                {user.name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold text-gray-800">{user.name}</div>
                                                                <div className="text-xs text-gray-400">{user.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.phone_number ? (
                                                            <div className="flex items-center gap-1.5 text-sm">
                                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                                <span>{user.phone_number}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {getRoleBadge(user.role)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {user.role === 'admin' ? (
                                                            <span className="text-gray-400 text-xs">Semua Akses</span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                                                                <Building2 className="w-3 h-3" />
                                                                {user.room?.name || '-'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {getStatusBadge(user.is_active)}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {user.id !== auth.user.id ? (
                                                            <button
                                                                onClick={() => promptToggleStatus(user)}
                                                                className={`p-2 rounded-lg transition-all duration-200 ${
                                                                    user.is_active 
                                                                        ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                                                                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                                                }`}
                                                                title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                            >
                                                                {user.is_active ? (
                                                                    <UserX className="w-4 h-4" />
                                                                ) : (
                                                                    <UserCheck className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">(Anda)</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.data.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Users className="w-12 h-12 text-gray-300" />
                                                            <p className="text-gray-500 font-medium">Belum ada data pengguna</p>
                                                            <p className="text-gray-400 text-sm">Tambahkan akun pengguna baru</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {users.data.map((user) => (
                                        <div
                                            key={user.id}
                                            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 group"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg
                                                    ${user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-500 to-cyan-600'}`}>
                                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div className="flex gap-1">
                                                    {user.id !== auth.user.id && (
                                                        <button
                                                            onClick={() => promptToggleStatus(user)}
                                                            className={`p-1.5 rounded-lg transition-all duration-200 ${
                                                                user.is_active 
                                                                    ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50' 
                                                                    : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                                            }`}
                                                            title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                                                        >
                                                            {user.is_active ? (
                                                                <UserX className="w-4 h-4" />
                                                            ) : (
                                                                <UserCheck className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <h4 className="font-semibold text-gray-800">{user.name}</h4>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                            <div className="space-y-1.5 text-sm border-t border-gray-100 pt-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-500">Role</span>
                                                    {getRoleBadge(user.role)}
                                                </div>
                                                {user.phone_number && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                        <span>{user.phone_number}</span>
                                                    </div>
                                                )}
                                                {user.role === 'ruangan' && user.room && (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                                                        <span>{user.room.name}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between pt-1">
                                                    <span className="text-gray-500">Status</span>
                                                    {getStatusBadge(user.is_active)}
                                                </div>
                                                {user.id === auth.user.id && (
                                                    <div className="text-center text-xs text-blue-600 font-medium bg-blue-50 rounded-lg py-1 mt-2">
                                                        Akun Anda
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {users.data.length === 0 && (
                                        <div className="col-span-full text-center py-12">
                                            <div className="flex flex-col items-center gap-2">
                                                <Users className="w-12 h-12 text-gray-300" />
                                                <p className="text-gray-500 font-medium">Tidak ada data</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Pagination --- */}
                            <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-gray-600">
                                    Menampilkan <strong>{users.from || 0}</strong> sampai <strong>{users.to || 0}</strong> dari <strong>{users.total}</strong> data
                                </span>
                                <div className="flex flex-wrap gap-1">
                                    {users.links.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() => link.url && router.get(link.url)}
                                            disabled={!link.url}
                                            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 
                                                ${link.active ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" : 
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

            {/* --- MODAL TAMBAH AKUN --- */}
            <Modal show={isModalOpen} onClose={closeModal} maxWidth="md">
                <form onSubmit={submit} className="p-6">
                    <div className="flex items-center gap-3 border-b pb-4 mb-6">
                        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl text-white">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Daftarkan Akun Baru</h2>
                            <p className="text-sm text-gray-500">Isi data pengguna dengan lengkap</p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Nama Lengkap / Penanggung Jawab" required />
                            <div className="relative mt-1">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Cth: Dr. Ahmad"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email (Digunakan untuk Login)" required />
                            <div className="relative mt-1">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="user@rumahsakit.com"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="phone_number" value="No. WhatsApp (Awali 08...)" />
                            <div className="relative mt-1">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="phone_number"
                                    type="text"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    placeholder="08123456789"
                                />
                            </div>
                            <InputError message={errors.phone_number} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="role" value="Hak Akses" />
                            <div className="relative mt-1">
                                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    id="role"
                                    className="pl-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4 appearance-none"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                >
                                    <option value="ruangan">Perwakilan Ruangan / Unit</option>
                                    <option value="admin">Admin / Teknisi Internal</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {data.role === 'ruangan' && (
                            <div>
                                <SearchableSelect
                                    options={rooms}
                                    value={rooms.find(r => r.id === data.room_id) || null}
                                    onChange={(room) => setData('room_id', room ? room.id : '')}
                                    label="Pilih Ruangan / Unit"
                                    placeholder="Cari ruangan..."
                                    displayValue={(room) => room?.name || ""}
                                    required
                                />
                                <InputError message={errors.room_id} className="mt-2" />
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="password" value="Password Sementara" required />
                            <div className="relative mt-1">
                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <TextInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="pl-10 pr-10 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Minimal 8 karakter"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1.5">Password minimal 8 karakter</p>
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton type="button" onClick={closeModal} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
                            disabled={processing}
                        >
                            {processing ? 'Menyimpan...' : 'Buat Akun'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* --- MODAL KONFIRMASI STATUS --- */}
            <Modal show={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} maxWidth="sm">
                <div className="p-6">
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-100">
                        <div className={`p-2 rounded-xl text-white ${userToToggle?.is_active ? 'bg-gradient-to-br from-red-500 to-pink-500' : 'bg-gradient-to-br from-green-500 to-emerald-500'}`}>
                            {userToToggle?.is_active ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Konfirmasi Status</h2>
                        </div>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                        Apakah Anda yakin ingin <strong>{userToToggle?.is_active ? 'menonaktifkan' : 'mengaktifkan'}</strong> akun <strong>{userToToggle?.name}</strong>?
                        {userToToggle?.is_active && (
                            <span className="block mt-2 text-xs text-red-500">
                                Pengguna ini tidak akan bisa login ke dalam sistem lagi hingga akun diaktifkan kembali.
                            </span>
                        )}
                    </p>

                    <div className="mt-8 flex justify-end gap-3 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                        <SecondaryButton type="button" onClick={() => setIsConfirmModalOpen(false)} className="rounded-xl">
                            Batal
                        </SecondaryButton>
                        <PrimaryButton
                            type="button"
                            onClick={confirmToggleStatus}
                            className={`rounded-xl px-6 py-2.5 shadow-lg ${userToToggle?.is_active ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 shadow-red-500/20' : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-green-500/20'}`}
                        >
                            Ya, {userToToggle?.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

        </AuthenticatedLayout>
    );
}