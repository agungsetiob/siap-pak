<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Calibration extends Model
{
    protected $fillable = [
        'equipment_id',
        'report_id',
        'certificate_number',
        'certificate_file',
        'testing_institution',
        'calibration_date',
        'next_calibration_date',
        'result',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'calibration_date' => 'date',
            'next_calibration_date' => 'datetime',
        ];
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * Tiket laporan yang mendasari kalibrasi ini (jika ada).
     */
    public function report(): BelongsTo
    {
        return $this->belongsTo(Report::class);
    }

    /**
     * Admin yang menginput sertifikat kalibrasi ini.
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}