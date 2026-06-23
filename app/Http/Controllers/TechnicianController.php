<?php

namespace App\Http\Controllers;

use App\Models\Technician;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TechnicianController extends Controller
{
    public function index(Request $request)
    {
        $query = Technician::query();
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('specialization', 'like', '%' . $request->search . '%');
        }

        return Inertia::render('Admin/Technicians/Index', [
            'technicians' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:50',
            'specialization' => 'nullable|string|max:100',
            'is_active' => 'required|boolean',
        ]);
        Technician::create($v);
        return back()->with('success', 'Teknisi berhasil didaftarkan.');
    }

    public function update(Request $request, Technician $technician)
    {
        $v = $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:50',
            'specialization' => 'nullable|string|max:100',
            'is_active' => 'required|boolean',
        ]);
        $technician->update($v);
        return back()->with('success', 'Data teknisi berhasil diperbarui.');
    }

    public function destroy(Technician $technician)
    {
        $technician->delete();
        return back()->with('success', 'Data teknisi berhasil dihapus.');
    }
}
