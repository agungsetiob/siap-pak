<?php

namespace App\Services;

use App\Models\Equipment;
use App\Models\EquipmentMovement;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EquipmentService
{
    /**
     * Get equipments with filtering, pagination, and role-based room access.
     */
    public function getFilteredEquipments(Request $request, $user)
    {
        $query = Equipment::with(['room', 'latestCalibration']);

        if ($user->role === 'ruangan') {
            $query->where('room_id', $user->room_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('inventory_number', 'like', "%{$search}%");
            });
        }

        return $query->latest()->paginate(10)->withQueryString();
    }

    /**
     * Get available rooms based on user role.
     */
    public function getAvailableRooms($user)
    {
        if ($user->role === 'ruangan') {
            return [];
        }
        return Room::orderBy('name')->get(['id', 'name']);
    }

    /**
     * Store a new equipment.
     */
    public function storeEquipment(array $validated)
    {
        return Equipment::create($validated);
    }

    /**
     * Update an existing equipment.
     */
    public function updateEquipment(Equipment $equipment, array $validated)
    {
        $equipment->update($validated);
        return $equipment;
    }

    /**
     * Load relationships for show page.
     */
    public function loadShowRelations(Equipment $equipment)
    {
        $equipment->load([
            'room',
            'calibrations.report',
            'calibrations' => function ($q) {
                $q->latest('calibration_date');
            },
            'calibrations.admin',
            'reports' => function ($q) {
                $q->latest()->take(10);
            },
            'movements.fromRoom',
            'movements.toRoom',
            'movements.mover',
            'qr',
            'vendor',
        ]);

        return $equipment;
    }

    /**
     * Get trashed equipments with search.
     */
    public function getTrashedEquipments(Request $request)
    {
        $query = Equipment::onlyTrashed()->with('room');

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->latest('deleted_at')->paginate(10);
    }

    /**
     * Move equipment to another room.
     */
    public function moveEquipment(Equipment $equipment, int $toRoomId, ?string $notes)
    {
        DB::transaction(function () use ($equipment, $toRoomId, $notes) {
            EquipmentMovement::create([
                'equipment_id' => $equipment->id,
                'from_room_id' => $equipment->room_id,
                'to_room_id' => $toRoomId,
                'moved_by' => auth()->id(),
                'moved_at' => now(),
                'notes' => $notes,
            ]);

            $equipment->update(['room_id' => $toRoomId]);
        });
    }

    /**
     * Search equipment API (for select2 / autocomplete).
     */
    public function searchEquipments(Request $request, $user)
    {
        $query = Equipment::with('room');

        if ($user && $user->role === 'ruangan') {
            $query->where('room_id', $user->room_id);
        }

        if ($request->filled('q')) {
            $search = $request->q;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('inventory_number', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%");
            });
        }

        return $query->take(7)->get(['id', 'name', 'inventory_number', 'brand', 'room_id']);
    }
}