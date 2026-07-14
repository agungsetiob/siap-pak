<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Room;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rooms')->insert([
            [
                'name' => 'Instalasi Gawat Darurat',
                'code' => 'IGD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Intensif Care Unit',
                'code' => 'ICU',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
        Room::factory()->count(30)->create();
    }
}
