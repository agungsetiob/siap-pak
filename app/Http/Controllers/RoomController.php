<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $query = Room::withCount('equipments'); // Hitung jumlah alat di tiap ruangan

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        $rooms = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Rooms/Index', [
            'rooms' => $rooms,
            'filters' => $request->only(['search']),
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
        // Cegah penghapusan jika ruangan masih memiliki alat
        if ($room->equipments()->count() > 0) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus ruangan yang masih memiliki alat kesehatan.']);
        }

        $room->delete();

        return redirect()->back()->with('success', 'Data ruangan berhasil dihapus.');
    }
}