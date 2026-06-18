<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rooms')->insert([
            [
                'name' => 'IGD',
                'code' => 'IGD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ICU',
                'code' => 'ICU',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Poli Gigi',
                'code' => 'PG',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
