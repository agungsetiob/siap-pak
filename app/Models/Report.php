<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Report extends Model
{
    use HasFactory;
    protected $fillable = [
        'ticket_number',
        'equipment_id',
        'reported_by',
        'type',
        'description',
        'action_taken',
        'external_technician',
        'cost',
        'status',
        'estimated_completion',
        'resolved_at',
    ];

    protected function casts(): array
    {
        return [
            'estimated_completion' => 'date',
            'resolved_at' => 'datetime',
            'cost' => 'integer',
        ];
    }

    public function equipment(): BelongsTo
    {
        return $this->belongsTo(Equipment::class);
    }

    /**
     * User yang membuat laporan ini.
     */
    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    /**
     * Log perkembangan/status timeline dari laporan ini.
     */
    public function progressLogs(): HasMany
    {
        return $this->hasMany(ReportProgress::class)->oldest(); // Urutkan dari yang pertama ke terbaru
    }

    /**
     * Data sertifikasi kalibrasi jika laporan ini berupa tindakan kalibrasi.
     */
    public function calibrationData(): HasOne
    {
        return $this->hasOne(Calibration::class);
    }
}