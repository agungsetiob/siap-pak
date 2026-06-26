import React from "react";
import { Modal, SecondaryButton } from "@/Components";
import { QrCode, Printer, Download } from "lucide-react";
import { router } from "@inertiajs/react";

export default function QrCodeModal({ show, onClose, equipment }) {
  const handleGenerateQr = () => {
    router.post(
      route("equipments.generateQr", equipment.id),
      {},
      {
        onSuccess: () => {
          // reload page to show QR
          router.reload();
          onClose();
        },
      }
    );
  };

  return (
    <Modal show={show} onClose={onClose} maxWidth="sm">
      <div className="p-6 text-center">
        <div className="flex items-center gap-3 border-b pb-4 mb-4">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl text-white">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-900">QR Code Alat</h3>
            <p className="text-xs text-gray-500">{equipment.name}</p>
          </div>
        </div>

        {equipment.qr ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={route("qr.render", equipment.qr.qr_code)}
              alt={`QR Code ${equipment.name}`}
              className="w-48 h-48 object-contain border rounded-xl p-2 bg-white shadow-sm"
            />
            <div className="flex gap-3">
              <a
                href={route("qr.render", equipment.qr.qr_code)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-medium shadow-lg shadow-teal-500/20 transition-all duration-200"
              >
                <Printer className="w-4 h-4" />
                Cetak QR
              </a>
              <a
                href={route("qr.render", equipment.qr.qr_code)}
                download={`QR-${equipment.inventory_number}.png`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-lg shadow-blue-500/20 transition-all duration-200"
              >
                <Download className="w-4 h-4" />
                Unduh PNG
              </a>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <div className="flex flex-col items-center gap-3">
              <QrCode className="w-16 h-16 text-gray-300" />
              <p className="text-gray-500">Belum ada QR Code untuk alat ini</p>
              <button
                onClick={handleGenerateQr}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-medium"
              >
                Generate Sekarang
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100">
          <SecondaryButton onClick={onClose} className="rounded-xl">
            Tutup
          </SecondaryButton>
        </div>
      </div>
    </Modal>
  );
}