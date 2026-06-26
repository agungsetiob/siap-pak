import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { PenTool, UploadCloud, CheckCircle2 } from 'lucide-react';
import { Transition } from '@headlessui/react';

export default function UpdateSignatureForm({ className = '' }) {
    const user = usePage().props.auth.user;

    const { setData, post, processing, errors, recentlySuccessful } = useForm({
        signature_file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.signature.update'), {
            forceFormData: true,
            onSuccess: () => {
                document.getElementById('signature_file').value = "";
                setData('signature_file', null);
            },
        });
    };

    return (
        <section className={`bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-green-100 ${className}`}>
            <header className="flex items-center gap-4 border-b border-gray-100 pb-5">
                <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                    <PenTool className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Tanda Tangan Elektronik</h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Upload foto tanda tangan Anda dengan background transparan untuk menyetujui laporan.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel value="Tanda Tangan Saat Ini" />
                    <div className="mt-2 p-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center min-h-[120px] transition-all hover:bg-gray-100">
                        {user.signature_path ? (
                            <img 
                                src={`/storage/${user.signature_path}`} 
                                alt="Tanda Tangan Saya" 
                                className="max-h-24 object-contain mix-blend-multiply drop-shadow-sm" 
                            />
                        ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <PenTool className="w-8 h-8 mb-2 opacity-20" />
                                <span className="text-sm font-medium">Belum ada tanda tangan</span>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="signature_file" value="Pilih File Gambar (PNG/JPG, Maks 1MB)" />
                    <div className="mt-2 flex items-center">
                        <label className="flex-1 cursor-pointer">
                            <input
                                id="signature_file"
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 transition-colors cursor-pointer border border-gray-200 rounded-xl"
                                onChange={(e) => setData('signature_file', e.target.files[0])}
                                required
                            />
                        </label>
                    </div>
                    <InputError message={errors.signature_file} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl px-6 py-2.5 shadow-lg shadow-teal-500/20 flex items-center gap-2"
                    >
                        <UploadCloud className="w-4 h-4" />
                        {processing ? 'Mengupload...' : 'Upload Tanda Tangan'}
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