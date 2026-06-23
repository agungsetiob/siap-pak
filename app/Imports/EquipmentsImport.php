<?php

namespace App\Imports;

use App\Models\Equipment;
use App\Models\Room;
use App\Models\Vendor;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class EquipmentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // Skip jika No Inventaris kosong
        if (!isset($row['no_inventaris_unik']) || empty($row['no_inventaris_unik'])) {
            return null;
        }

        // 1. Cari atau buat Ruangan otomatis
        $roomName = $row['nama_ruangan_harus_passama'] ?? 'Gudang Utama';
        $room = Room::firstOrCreate(['name' => $roomName]);

        // 2. Cari atau buat Vendor otomatis (jika diisi)
        $vendorId = null;
        if (!empty($row['nama_vendor_opsional'])) {
            $vendor = Vendor::firstOrCreate(['name' => $row['nama_vendor_opsional']]);
            $vendorId = $vendor->id;
        }

        // 3. Format Tanggal (Excel kadang mengirim angka serial tanggal)
        $nextCalDate = null;
        if (!empty($row['tgl_kalibrasi_berikutnya_yyyy_mm_dd'])) {
            if (is_numeric($row['tgl_kalibrasi_berikutnya_yyyy_mm_dd'])) {
                $nextCalDate = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($row['tgl_kalibrasi_berikutnya_yyyy_mm_dd']);
            } else {
                $nextCalDate = date('Y-m-d', strtotime($row['tgl_kalibrasi_berikutnya_yyyy_mm_dd']));
            }
        }

        // 4. Update atau Create Alat (Berdasarkan Nomor Inventaris)
        return Equipment::updateOrCreate(
            ['inventory_number' => $row['no_inventaris_unik']], // Cari berdasarkan ini
            [
                'name' => $row['nama_alat'],
                'brand' => $row['merktipe'] ?? null,
                'serial_number' => $row['serial_number'] ?? null,
                'condition' => strtolower($row['kondisi_baikrusak_ringanrusak_berat'] ?? 'baik'),
                'price' => (int) ($row['harga_angka_saja'] ?? 0),
                'next_calibration_date' => $nextCalDate,
                'room_id' => $room->id,
                'vendor_id' => $vendorId,
            ]
        );
    }
}