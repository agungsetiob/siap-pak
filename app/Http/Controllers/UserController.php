<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('room')->latest();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->paginate(10)->withQueryString();

        $totalUsers = User::count();
        $adminCount = User::where('role', 'admin')->count();
        $ruanganCount = User::where('role', 'ruangan')->count();
        $activeCount = User::where('is_active', true)->count();

        $rooms = Room::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'rooms' => $rooms,
            'filters' => $request->only('search'),
            'stats' => [
                'totalUsers' => $totalUsers,
                'adminCount' => $adminCount,
                'ruanganCount' => $ruanganCount,
                'activeCount' => $activeCount,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|min:5',
            'email' => 'required|string|lowercase|email|max:255|min:10|unique:' . User::class,
            'phone_number' => 'nullable|string|max:20',
            'password' => ['required', Rules\Password::defaults()],
            'role' => 'required|in:admin,ruangan',
            'room_id' => 'required_if:role,ruangan|exists:rooms,id|nullable',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'room_id' => $request->role === 'ruangan' ? $request->room_id : null,
        ]);

        return redirect()->back()->with('success', 'Akun pengguna berhasil ditambahkan.');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'Anda tidak bisa menonaktifkan akun Anda sendiri.']);
        }

        $user->update([
            'is_active' => !$user->is_active
        ]);

        $statusMessage = $user->is_active ? 'diaktifkan kembali' : 'dinonaktifkan';

        return back()->with('success', "Akun pengguna berhasil {$statusMessage}.");
    }
}