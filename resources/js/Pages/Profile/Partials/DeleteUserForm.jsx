import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { UserX, AlertTriangle, Key } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const { data, setData, delete: destroy, processing, reset, errors, clearErrors } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-red-100 ${className}`}>
            <header className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <UserX className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Hapus Akun
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Setelah dihapus, semua data dan informasi akan hilang secara permanen.
                    </p>
                </div>
            </header>

            <div className="mt-6">
                <DangerButton 
                    onClick={confirmUserDeletion}
                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl px-6 py-2.5 shadow-lg shadow-red-500/20"
                >
                    Hapus Akun Saya
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal} maxWidth="md">
                <form onSubmit={deleteUser} className="p-6">
                    <div className="flex items-center gap-3 mb-4 text-red-600">
                        <div className="p-2 bg-red-100 rounded-full">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Konfirmasi Penghapusan
                        </h2>
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed">
                        Tindakan ini tidak dapat dibatalkan. Semua resource dan data akan terhapus secara permanen. Silakan masukkan password Anda untuk mengonfirmasi bahwa Anda benar-benar ingin menghapus akun ini.
                    </p>

                    <div className="mt-6">
                        <InputLabel htmlFor="password" value="Password" className="sr-only" />
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-10 block w-full rounded-xl border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                                isFocused
                                placeholder="Masukkan password Anda..."
                            />
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 gap-3">
                        <SecondaryButton onClick={closeModal} className="rounded-xl">
                            Batal
                        </SecondaryButton>

                        <DangerButton 
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl shadow-lg shadow-red-500/20" 
                            disabled={processing}
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Akun'}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}