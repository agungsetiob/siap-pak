import React, { useState } from "react";
import { Modal, InputLabel, InputError, PrimaryButton, SecondaryButton } from "@/Components";
import SearchableSelect from "@/Components/SearchableSelect";
import { useForm } from "@inertiajs/react";
import { Move, Building2 } from "lucide-react";

export default function MoveRoomModal({ show, onClose, equipment, rooms }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    to_room_id: "",
    notes: "",
  });

  // State untuk SearchableSelect (selected room object)
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleRoomChange = (room) => {
    setSelectedRoom(room);
    setData("to_room_id", room?.id || "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("equipments.move", equipment.id), {
      onSuccess: () => {
        reset();
        setSelectedRoom(null);
        onClose();
      },
    });
  };

  // Filter rooms: exclude current room
  const roomOptions = rooms.filter((room) => room.id !== equipment.room_id);

  return (
    <Modal show={show} onClose={onClose} maxWidth="md">
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-center gap-3 border-b pb-4 mb-6">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl text-white">
            <Move className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Mutasi Alat ke Ruangan Lain</h2>
            <p className="text-sm text-gray-500">Pindahkan alat ke ruangan yang baru</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-500">Lokasi Saat Ini</span>
            <span className="font-semibold text-gray-900">
              {equipment.room?.name || "Belum ada ruangan"}
            </span>
          </div>

          <div>
            <SearchableSelect
              label="Pindah Ke Ruangan"
              options={roomOptions}
              value={selectedRoom}
              onChange={handleRoomChange}
              placeholder="Cari ruangan tujuan..."
              displayValue={(room) => room.name}
              required
            />
            <InputError message={errors.to_room_id} className="mt-2" />
          </div>

          <div>
            <InputLabel htmlFor="move_notes" value="Keterangan / Alasan Pindah" />
            <textarea
              id="move_notes"
              className="mt-1 block w-full rounded-xl border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 py-2.5 px-4"
              rows="3"
              value={data.notes}
              onChange={(e) => setData("notes", e.target.value)}
              placeholder="Contoh: Dipinjam sementara untuk ruang operasi..."
            />
            <InputError message={errors.notes} className="mt-2" />
          </div>
        </div>

        <div className="mt-8 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
          <SecondaryButton type="button" onClick={onClose} className="rounded-xl">
            Batal
          </SecondaryButton>
          <PrimaryButton
            type="submit"
            className="ml-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl px-6 py-2.5 shadow-lg shadow-orange-500/20"
            disabled={processing}
          >
            {processing ? "Memproses..." : "Pindahkan Alat"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}