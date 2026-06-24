import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Lock, Key, CheckCircle2 } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-indigo-100 ${className}`}>
            <header className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                    <Lock className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Perbarui Password
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Pastikan akun Anda menggunakan password yang panjang dan acak agar tetap aman.
                    </p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Password Saat Ini" />
                    <div className="relative mt-1">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type="password"
                            className="pl-10 block w-full rounded-xl border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                            autoComplete="current-password"
                        />
                    </div>
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password Baru" />
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type="password"
                            className="pl-10 block w-full rounded-xl border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                            autoComplete="new-password"
                        />
                    </div>
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" />
                    <div className="relative mt-1">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type="password"
                            className="pl-10 block w-full rounded-xl border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                            autoComplete="new-password"
                        />
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-purple-500/20"
                    >
                        Simpan Password
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-out duration-300"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-2"
                    >
                        <p className="text-sm font-medium text-green-600 flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}