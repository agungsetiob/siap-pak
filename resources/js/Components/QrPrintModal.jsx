import { useState } from "react";
import { Printer } from "lucide-react";
import { PrimaryButton, SecondaryButton, Modal, SearchableSelect } from "@/Components";

export default function QrPrintModal({ isOpen, onClose, rooms, onSubmit }) {
  const [printRoomId, setPrintRoomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(printRoomId);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl text-white">
            <Printer className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            Cetak Label Stiker QR
          </h2>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Pilih ruangan untuk mencetak label QR. Halaman cetak akan terbuka di
          tab baru. Atau tidak perlu pilih ruangan untuk cetak semua QR
        </p>

        <SearchableSelect
          options={rooms}
          value={rooms.find((r) => r.id === printRoomId) || null}
          onChange={(room) => setPrintRoomId(room ? room.id : "")}
          label="Filter Ruangan (Opsional)"
          placeholder="Cari ruangan..."
          displayValue={(room) => room?.name || ""}
        />

        <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
          <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
            Batal
          </SecondaryButton>
          <PrimaryButton className="ml-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 rounded-xl px-6 py-2.5 shadow-lg shadow-teal-500/20">
            Buka Pratinjau Cetak
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}
