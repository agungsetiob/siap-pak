<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use App\Models\EquipmentMovement;
use App\Models\Room;
use App\Models\Vendor;
use Illuminate\Http\Request;
use \Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Exports\EquipmentsTemplateExport;
use App\Imports\EquipmentsImport;
use Maatwebsite\Excel\Facades\Excel;

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
        $vendors = Vendor::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Equipments/Index', [
            'equipments' => $equipments,
            'rooms' => $rooms,
            'vendors' => $vendors,
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
            'price' => 'nullable|numeric|min:0',
            'vendor_id' => 'nullable|exists:vendors,id',
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
            'price' => 'nullable|numeric|min:0',
            'vendor_id' => 'nullable|exists:vendors,id',
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
            'calibrations.report',
            'calibrations' => function($q) { $q->latest('calibration_date'); },
            'calibrations.admin',
            'reports' => function($q) { $q->latest()->take(7); },
            'movements.fromRoom',
            'movements.toRoom',
            'movements.mover',
            'qr',
            'vendor',
        ]);

        $rooms = Room::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Equipments/Show', [
            'equipment' => $equipment,
            'rooms' => $rooms
        ]);
    }

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

    public function restore($id)
    {
        $equipment = Equipment::onlyTrashed()->findOrFail($id);
        $equipment->restore();

        return redirect()->route('equipments.index')->with('success', 'Alat kesehatan berhasil dikembalikan (Restore).');
    }

    public function forceDelete($id)
    {
        $equipment = Equipment::onlyTrashed()->findOrFail($id);
        $equipment->forceDelete();

        return redirect()->back()->with('success', 'Alat dihapus secara permanen dari database.');
    }

    public function move(Request $request, Equipment $equipment)
    {
        $request->validate([
            'to_room_id' => 'required|exists:rooms,id|different:' . $equipment->room_id,
            'notes' => 'nullable|string',
        ], [
            'to_room_id.different' => 'Ruangan tujuan tidak boleh sama dengan ruangan alat saat ini.'
        ]);

        DB::transaction(function () use ($request, $equipment) {
            EquipmentMovement::create([
                'equipment_id' => $equipment->id,
                'from_room_id' => $equipment->room_id,
                'to_room_id' => $request->to_room_id,
                'moved_by' => auth()->id(),
                'moved_at' => now(),
                'notes' => $request->notes,
            ]);

            $equipment->update([
                'room_id' => $request->to_room_id
            ]);
        });

        return back()->with('success', 'Alat kesehatan berhasil dipindahkan ke ruangan baru.');
    }

    public function downloadTemplate()
    {
        return Excel::download(new EquipmentsTemplateExport, 'Template_Import_Alat.xlsx');
    }

    // Fungsi Proses Import
    public function importExcel(Request $request)
    {
        $request->validate([
            'import_file' => 'required|mimes:xlsx,xls,csv|max:5120', // Maks 5MB
        ]);

        try {
            Excel::import(new EquipmentsImport, $request->file('import_file'));
            return back()->with('success', 'Data alat berhasil diimport dari Excel!');
        } catch (\Exception $e) {
            return back()->with(['error' => 'Gagal mengimport: ' . $e->getMessage()]);
        }
    }
}