<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentQr extends Model
{    
    protected $fillable = [
        'equipment_id', 'qr_code', 'generated_at'
    ];

    protected $casts = [
        'generated_at' => 'datetime',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }
}
