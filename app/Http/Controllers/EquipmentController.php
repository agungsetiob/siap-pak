<?php

namespace App\Http\Controllers;

use App\Http\Requests\EquipmentRequest;
use App\Services\EquipmentService;
use App\Models\Equipment;
use App\Models\Room;
use App\Models\Vendor;
use App\Exports\EquipmentsTemplateExport;
use App\Imports\EquipmentsImport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class EquipmentController extends Controller
{
    protected EquipmentService $service;

    public function __construct(EquipmentService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $user = auth()->user();

        return Inertia::render('Admin/Equipments/Index', [
            'equipments' => $this->service->getFilteredEquipments($request, $user),
            'rooms'      => $this->service->getAvailableRooms($user),
            'vendors'    => Vendor::orderBy('name')->get(['id', 'name']),
            'filters'    => $request->only(['search']),
        ]);
    }

    public function store(EquipmentRequest $request)
    {
        $this->service->storeEquipment($request->validated());
        return redirect()->back()->with('success', 'Data alat kesehatan berhasil ditambahkan.');
    }

    public function update(EquipmentRequest $request, Equipment $equipment)
    {
        $this->service->updateEquipment($equipment, $request->validated());
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

        $equipment = $this->service->loadShowRelations($equipment);

        return Inertia::render('Admin/Equipments/Show', [
            'equipment' => $equipment,
            'rooms'     => Room::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function trashed(Request $request)
    {
        return Inertia::render('Admin/Equipments/Trashed', [
            'equipments' => $this->service->getTrashedEquipments($request),
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

        $this->service->moveEquipment($equipment, $request->to_room_id, $request->notes);

        return back()->with('success', 'Alat kesehatan berhasil dipindahkan ke ruangan baru.');
    }

    public function downloadTemplate()
    {
        return Excel::download(new EquipmentsTemplateExport, 'Template_Import_Alat.xlsx');
    }

    public function importExcel(Request $request)
    {
        $request->validate([
            'import_file' => 'required|mimes:xlsx,xls,csv|max:5120',
        ]);

        try {
            Excel::import(new EquipmentsImport, $request->file('import_file'));
            return back()->with('success', 'Data alat berhasil diimport dari Excel!');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengimport: ' . $e->getMessage());
        }
    }

    public function searchAPI(Request $request)
    {
        $equipments = $this->service->searchEquipments($request, $request->user());
        return response()->json($equipments);
    }
}