import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

export default function ConfirmModal({ show, onClose, onConfirm, title, message }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <SecondaryButton onClick={onClose} className="rounded-xl">
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={onConfirm}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-6 py-2.5 shadow-lg shadow-green-500/20"
                    >
                        Ya, Setuju
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
