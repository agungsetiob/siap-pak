<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class EquipmentsTemplateExport implements FromArray, WithHeadings, ShouldAutoSize, WithStyles
{
    public function headings(): array
    {
        return [
            'Nama Alat',
            'No Inventaris (Unik)',
            'Merk/Tipe',
            'Serial Number',
            'Kondisi (baik/rusak_ringan/rusak_berat)',
            'Harga (Angka saja)',
            'Tgl Kalibrasi Berikutnya (YYYY-MM-DD)',
            'Nama Ruangan (Harus Pas/Sama)',
            'Nama Vendor (Opsional)'
        ];
    }

    public function array(): array
    {
        return [
            [
                'Defibrillator Philips',
                'INV-DEF-001',
                'Philips HeartStart',
                'SN-998877',
                'baik',
                '45000000',
                '2026-12-31',
                'IGD',
                'PT. Alkes Indo Prima'
            ]
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1    => ['font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']], 'fill' => ['fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID, 'startColor' => ['argb' => 'FF000000']]],
        ];
    }
}