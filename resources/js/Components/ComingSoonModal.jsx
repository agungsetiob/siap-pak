import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import { Clock } from 'lucide-react';

export default function ComingSoonModal({ show, onClose, featureName }) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                        {featureName} Akan Segera Hadir
                    </h2>
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Fitur ini sedang dalam tahap pengembangan. Mohon doakan bisa segera tersedia dalam waktu dekat.
                </p>
                <div className="mt-6 flex justify-end">
                    <PrimaryButton onClick={onClose} className="rounded-xl">
                        Tutup
                    </PrimaryButton>
                </div>
            </div>
        </Modal>
    );
}
