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
    public function index()
    {
        $users = User::with('room')->latest()->paginate(10);
        
        $rooms = Room::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'rooms' => $rooms,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
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