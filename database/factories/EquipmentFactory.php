<?php

namespace Database\Factories;

use App\Models\Equipment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Equipment>
 */
class EquipmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'room_id' => $this->faker->numberBetween(1, 10),
            'inventory_number' => strtoupper($this->faker->unique()->lexify('INV-????')),
            'name' => $this->faker->word(),
            'brand' => $this->faker->company(),
            'serial_number' => $this->faker->unique()->numerify('SN#####'),
            'condition' => $this->faker->randomElement(['baik', 'rusak_ringan', 'rusak_berat']),
            'next_calibration_date' => $this->faker->dateTimeBetween('+1 month', '+1 year'),
        ];
    }
}
