<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EquipmentController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = Equipment::with(['room', 'latestCalibration']);

        if ($user->role === 'ruangan') {
            $query->where('room_id', $user->room_id);
            $rooms = []; 
        } else {
            $rooms = Room::orderBy('name')->get(['id', 'name']);
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('inventory_number', 'like', '%' . $request->search . '%');
            });
        }

        $equipments = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/Equipments/Index', [
            'equipments' => $equipments,
            'rooms' => $rooms,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'inventory_number' => 'required|string|unique:equipments,inventory_number',
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'condition' => 'required|in:baik,rusak_ringan,rusak_berat',
            'next_calibration_date' => 'nullable|date',
        ]);

        Equipment::create($validated);

        return redirect()->back()->with('success', 'Data alat kesehatan berhasil ditambahkan.');
    }

    public function update(Request $request, Equipment $equipment)
    {
        $validated = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'inventory_number' => 'required|string|unique:equipments,inventory_number,' . $equipment->id,
            'name' => 'required|string|max:255',
            'brand' => 'nullable|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'condition' => 'required|in:baik,rusak_ringan,rusak_berat',
            'next_calibration_date' => 'nullable|date',
        ]);

        $equipment->update($validated);

        return redirect()->back()->with('success', 'Data alat kesehatan berhasil diperbarui.');
    }

    public function destroy(Equipment $equipment)
    {
        $equipment->delete();

        return redirect()->back()->with('success', 'Data alat kesehatan berhasil dihapus.');
    }

    public function show(Equipment $equipment)
    {
        $user = auth()->user();

        if ($user->role === 'ruangan' && $equipment->room_id !== $user->room_id) {
            abort(403, 'Akses ditolak. Ini bukan inventaris ruangan Anda.');
        }

        $equipment->load([
            'room', 
            'calibrations' => function($q) { $q->latest('calibration_date'); },
            'reports' => function($q) { $q->latest()->take(5); }
        ]);

        return Inertia::render('Admin/Equipments/Show', [
            'equipment' => $equipment
        ]);
    }

    // Menampilkan daftar alat yang sudah dihapus
    public function trashed(Request $request)
    {
        $query = Equipment::onlyTrashed()->with('room');

        if ($request->filled('search')) {
            $searchTerm = trim($request->search);
            $query->where('name', 'like', '%' . $searchTerm . '%');
        }

        $equipments = $query->latest('deleted_at')->paginate(10);

        return Inertia::render('Admin/Equipments/Trashed', [
            'equipments' => $equipments,
        ]);
    }

    // Mengembalikan alat dari tong sampah
    public function restore($id)
    {
        $equipment = Equipment::onlyTrashed()->findOrFail($id);
        $equipment->restore();

        return redirect()->route('equipments.index')->with('success', 'Alat kesehatan berhasil dikembalikan (Restore).');
    }

    // Menghapus alat secara permanen (Optional)
    public function forceDelete($id)
    {
        $equipment = Equipment::onlyTrashed()->findOrFail($id);
        $equipment->forceDelete();

        return redirect()->back()->with('success', 'Alat dihapus secara permanen dari database.');
    }
}