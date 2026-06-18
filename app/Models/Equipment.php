<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Equipment extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'equipments';

    protected $fillable = [
        'room_id',
        'inventory_number',
        'name',
        'brand',
        'serial_number',
        'condition',
        'next_calibration_date',
    ];

    protected function casts(): array
    {
        return [
            'next_calibration_date' => 'date',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }

    public function calibrations(): HasMany
    {
        return $this->hasMany(Calibration::class);
    }

    /**
     * Shortcut untuk mendapatkan data kalibrasi terakhir dari alat ini.
     */
    public function latestCalibration(): HasOne
    {
        return $this->hasOne(Calibration::class)->latestOfMany('calibration_date');
    }
}