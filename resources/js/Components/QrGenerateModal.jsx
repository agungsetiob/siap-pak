import { QrCode } from "lucide-react";
import { Modal, PrimaryButton, SecondaryButton,
    SearchableSelect, InputLabel, InputError
} from "@/Components";

export default function QrGenerateModal({
  isOpen,
  onClose,
  rooms,
  qrData,
  setQrData,
  qrErrors,
  qrProcessing,
  onSubmit,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Generate QR Code Massal</h2>
            <p className="text-sm text-gray-500">Buat QR untuk alat yang belum memiliki</p>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Sistem hanya akan membuatkan QR Code untuk alat yang <strong>belum memiliki QR Code</strong>. 
          Alat yang sudah punya tidak akan ditimpa.
        </p>

        <div className="space-y-4">
          <div>
            <InputLabel htmlFor="mode" value="Target Generate" />
            <select
              id="mode"
              className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
              value={qrData.mode}
              onChange={(e) => setQrData("mode", e.target.value)}
            >
              <option value="all_missing">Semua Alat yang Belum Punya QR</option>
              <option value="by_room">Pilih Berdasarkan Ruangan</option>
            </select>
          </div>

          {qrData.mode === "by_room" && (
            <div>
              <SearchableSelect
                options={rooms}
                value={rooms.find((r) => r.id === qrData.room_id) || null}
                onChange={(room) => setQrData("room_id", room ? room.id : "")}
                label="Pilih Ruangan"
                placeholder="Cari ruangan..."
                displayValue={(room) => room?.name || ""}
                required
              />
              <InputError message={qrErrors.room_id} className="mt-2" />
            </div>
          )}
          <InputError message={qrErrors.error} className="mt-2" />
        </div>

        <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
          <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
            Batal
          </SecondaryButton>
          <PrimaryButton
            className="ml-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl px-6 py-2.5 shadow-lg shadow-purple-500/20"
            disabled={qrProcessing}
          >
            {qrProcessing ? "Memproses..." : "Mulai Generate"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
