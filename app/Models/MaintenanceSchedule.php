<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceSchedule extends Model
{
    protected $fillable = [
        'equipment_id', 'technician_id', 'scheduled_date', 'status', 'notes',
        'checklist_results', 'maintenance_actions', 'action_other', 'result_status', 'follow_up_notes',
        'frequency'
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'checklist_results' => 'array',
            'maintenance_actions' => 'array',
        ];
    }
}