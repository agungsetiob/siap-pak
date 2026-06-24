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
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('specialization', 'like', '%' . $request->search . '%');
            });
        }

        return Inertia::render('Admin/Technicians/Index', [
            'technicians' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search']),
            'stats' => [
                'total' => Technician::count(),
                'active' => Technician::where('is_active', true)->count(),
                'inactive' => Technician::where('is_active', false)->count(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $v = $request->validate([
            'name' => 'required|string|max:255|min:5',
            'phone_number' => 'required|string|max:16|min:10|unique:technicians,phone_number',
            'specialization' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);
        Technician::create($v);
        return back()->with('success', 'Teknisi berhasil didaftarkan.');
    }

    public function update(Request $request, Technician $technician)
    {
        $v = $request->validate([
            'name' => 'required|string|max:255|min:5',
            'phone_number' => 'required|string|max:16|min:10|unique:technicians,phone_number,' . $technician->id,
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
