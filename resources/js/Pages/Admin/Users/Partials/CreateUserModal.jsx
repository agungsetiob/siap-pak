import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SearchableSelect from '@/Components/SearchableSelect';
import { User, Mail, Phone, Shield, ChevronDown, Key, Eye, EyeOff } from 'lucide-react';

export default function CreateUserModal({
    show,
    onClose,
    onSubmit,
    data,
    setData,
    errors,
    processing,
    rooms
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <Modal show={show} onClose={onClose} maxWidth="lg">
            <form onSubmit={onSubmit} className="p-6">
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
                                autoComplete="username"
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
                                autoComplete="new-password"
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

                <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 gap-3">
                    <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-blue-500/20"
                        disabled={processing}
                    >
                        {processing ? 'Menyimpan...' : 'Buat Akun'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}