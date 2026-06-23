<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index(Request $request)
    {
        $query = Vendor::query();

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('vendor_type', 'like', '%' . $request->search . '%');
        }

        $vendors = $query->latest()->paginate(10)->withQueryString();

        $totalVendors = Vendor::count();

        $vendorWithMostEquipments = Vendor::withCount('equipments')
            ->orderByDesc('equipments_count')
            ->first();

        $vendorWithHighestValue = Vendor::withSum('equipments', 'price')
            ->orderByDesc('equipments_sum_price')
            ->first();

        return Inertia::render('Admin/Vendors/Index', [
            'vendors' => $vendors,
            'filters' => $request->only(['search']),
            'stats' => [
                'total_vendors' => $totalVendors,
                'most_equipments' => $vendorWithMostEquipments,
                'highest_value' => $vendorWithHighestValue,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:vendors,name',
            'phone_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'vendor_type' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        Vendor::create($validated);

        return back()->with('success', 'Data vendor berhasil ditambahkan.');
    }

    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:vendors,name,' . $vendor->id,
            'phone_number' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'vendor_type' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $vendor->update($validated);

        return back()->with('success', 'Data vendor berhasil diperbarui.');
    }

    public function destroy(Vendor $vendor)
    {
        $vendor->delete();

        return back()->with('success', 'Data vendor berhasil dihapus.');
    }
}