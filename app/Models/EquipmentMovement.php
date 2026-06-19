<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EquipmentMovement extends Model
{
    protected $fillable = [
        'equipment_id', 'from_room_id', 'to_room_id', 'moved_by', 'moved_at', 'notes',
    ];

    protected $casts = [
        'moved_at' => 'datetime',
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function fromRoom()
    {
        return $this->belongsTo(Room::class, 'from_room_id');
    }

    public function toRoom()
    {
        return $this->belongsTo(Room::class, 'to_room_id');
    }

    public function mover()
    {
        return $this->belongsTo(User::class, 'moved_by');
    }
}
