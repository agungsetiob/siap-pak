import { PrimaryButton, SecondaryButton, Modal } from '@/Components';
import { Trash2 } from 'lucide-react';

export default function DeleteModal({ show, onClose, onConfirm, title, message }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-center gap-3 pb-3 mb-3">
                    <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl text-white">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        <p className="text-sm text-gray-500">{message}</p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end -mx-6 -mb-6 p-4 rounded-b-2xl">
                    <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={onConfirm}
                        className="ml-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-xl px-6 py-2.5 shadow-lg shadow-red-500/20"
                    >
                        Hapus
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
