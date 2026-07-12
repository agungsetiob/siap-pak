import { Head, useForm, Link } from '@inertiajs/react';
import { KeyRound, Smartphone, Mail, ArrowLeft } from 'lucide-react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Lupa Password - SIMEDI" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* Header with back button */}
                        <div className="p-4 border-b border-gray-100 flex items-center">
                            <Link href={route('login')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </Link>
                            <div className="flex-1 text-center">
                                <span className="text-sm font-semibold text-gray-600">Lupa Password</span>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="text-center mb-6">
                                <div className="mx-auto w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                                    <KeyRound className="w-7 h-7" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Lupa Password?</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Masukkan email Anda. Kami akan kirimkan link reset password via WhatsApp.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                    <Smartphone className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-green-800">
                                        {status.includes('email') 
                                            ? 'Tautan reset password telah berhasil dikirim ke nomor WhatsApp Anda!' 
                                            : status}
                                    </p>
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-gray-300 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                            isFocused={true}
                                            placeholder="email@rumahsakit.com"
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all duration-200 disabled:opacity-70"
                                    disabled={processing}
                                >
                                    {processing ? 'Memproses...' : 'Kirim Tautan via WhatsApp'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        &copy; {new Date().getFullYear()} RSUD dr. H. Andi Abdurrahman Noor
                    </p>
                </div>
            </div>
        </>
    );
}