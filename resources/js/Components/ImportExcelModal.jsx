import { 
    PrimaryButton, SecondaryButton, Modal, InputLabel,
    InputError
} from '@/Components';
import { FileSpreadsheet, Download } from 'lucide-react';

export default function ImportExcelModal({
    show,
    onClose,
    onSubmit,
    processing,
    errors,
    setImportData,
}) {
    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={onSubmit} className="p-6">
                <div className="flex items-center gap-3 border-b pb-4 mb-6">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl text-white">
                        <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Import Data Alat (Excel)</h2>
                        <p className="text-sm text-gray-500">Upload file Excel untuk import data massal</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <p className="text-sm text-blue-800 mb-3 flex items-start gap-2">
                            <span className="font-bold mt-0.5">Langkah 1:</span>
                            <span>Download template Excel terlebih dahulu agar format kolom sesuai dengan sistem.</span>
                        </p>
                        <a
                            href={route('equipments.template')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all duration-200"
                        >
                            <Download className="w-4 h-4" />
                            Download Template Excel
                        </a>
                    </div>

                    <div>
                        <InputLabel htmlFor="import_file" value="Langkah 2: Upload File Excel yang sudah diisi" />
                        <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all duration-200">
                            <input
                                id="import_file"
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                                onChange={(e) => setImportData('import_file', e.target.files[0])}
                                required
                            />
                        </div>
                        <InputError message={errors.import_file} className="mt-2" />
                    </div>
                </div>

                <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
                    <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
                        Batal
                    </SecondaryButton>
                    <PrimaryButton
                        className="ml-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-6 py-2.5 shadow-lg shadow-green-500/20"
                        disabled={processing}
                    >
                        {processing ? 'Mengimport...' : 'Mulai Import'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
