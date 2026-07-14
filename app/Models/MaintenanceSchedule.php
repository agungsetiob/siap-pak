<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaintenanceSchedule extends Model
{
    protected $fillable = [
        'equipment_id', 'technician_id', 'scheduled_date', 'status', 'notes',
        'checklist_results', 'maintenance_actions', 'action_other', 'result_status', 'follow_up_notes',
        'frequency', 'room_approved_at', 'approved_by', 'executed_by', 'executed_at'
    ];

    public function equipment()
    {
        return $this->belongsTo(Equipment::class);
    }

    public function technician()
    {
        return $this->belongsTo(Technician::class);
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function executor()
    {
        return $this->belongsTo(User::class, 'executed_by');
    }

    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'checklist_results' => 'array',
            'maintenance_actions' => 'array',
            'room_approved_at' => 'datetime',
        ];
    }
}