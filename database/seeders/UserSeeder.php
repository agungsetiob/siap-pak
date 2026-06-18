<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Ahmad Admin',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'room_id' => null, // bisa diisi sesuai kebutuhan
            'email_verified_at' => now(),
            'password' => Hash::make(env('SUPERADMIN_PASS', 'password123')),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('users')->insert([
            'name' => 'Petugas Ruangan',
            'email' => 'ruangan@example.com',
            'role' => 'ruangan',
            'room_id' => 1, // misalnya ruangan dengan id 1
            'email_verified_at' => now(),
            'password' => Hash::make('ruangan123'),
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
