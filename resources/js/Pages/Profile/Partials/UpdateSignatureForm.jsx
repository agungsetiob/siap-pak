import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function UpdateSignatureForm({ className = '' }) {
    // Ambil data user yang sedang login dari global props Inertia
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors } = useForm({
        signature_file: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.signature.update'), {
            forceFormData: true,
            onSuccess: () => {
                alert('Tanda tangan berhasil diperbarui!');
                // Reset input file setelah berhasil
                document.getElementById('signature_file').value = "";
                setData('signature_file', null);
            },
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">Tanda Tangan Elektronik</h2>
                <p className="mt-1 text-sm text-gray-600">
                    Upload foto tanda tangan Anda di atas kertas putih bersih. Tanda tangan ini akan digunakan untuk menyetujui laporan dan dokumen internal.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel value="Tanda Tangan Saat Ini" />
                    <div className="mt-2 p-4 bg-gray-50 border rounded-md inline-block min-h-[100px] min-w-[200px] flex items-center justify-center">
                        {user.signature_path ? (
                            <img 
                                src={`/storage/${user.signature_path}`} 
                                alt="Tanda Tangan Saya" 
                                className="max-h-20 object-contain mix-blend-multiply" 
                            />
                        ) : (
                            <span className="text-xs text-gray-400 italic">Belum ada tanda tangan yang di-upload.</span>
                        )}
                    </div>
                </div>

                <div>
                    <InputLabel htmlFor="signature_file" value="Pilih File Gambar (PNG/JPG, Maks 1MB)" />
                    <input
                        id="signature_file"
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => setData('signature_file', e.target.files[0])}
                        required
                    />
                    <InputError message={errors.signature_file} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        {processing ? 'Mengupload...' : 'Simpan Tanda Tangan'}
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}