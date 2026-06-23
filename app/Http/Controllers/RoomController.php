<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::withCount('equipments')
            ->with(['equipments' => function ($q) {
                $q->select('id','room_id','price'); // ambil harga untuk hitung nilai
            }]);

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
            });
        }

        $rooms = $query->latest()->paginate(10)->withQueryString();

        $totalRooms = Room::count();
        $roomWithMostEquipments = Room::withCount('equipments')
            ->orderByDesc('equipments_count')
            ->first();

        $roomWithHighestValue = Room::withSum('equipments', 'price')
            ->orderByDesc('equipments_sum_price')
            ->first();

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search']),
            'stats' => [
                'total_rooms' => $totalRooms,
                'most_equipments' => $roomWithMostEquipments,
                'highest_value' => $roomWithHighestValue,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:rooms,code',
        ]);

        Room::create($validated);

        return redirect()->back()->with('success', 'Data ruangan berhasil ditambahkan.');
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:rooms,code,' . $room->id,
        ]);

        $room->update($validated);

        return redirect()->back()->with('success', 'Data ruangan berhasil diperbarui.');
    }

    public function destroy(Room $room)
    {
        if ($room->equipments()->count() > 0) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus ruangan yang masih memiliki alat kesehatan.');
        }

        $room->delete();

        return redirect()->back()->with('success', 'Data ruangan berhasil dihapus.');
    }
}