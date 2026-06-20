<?php

namespace Database\Factories;

use App\Models\Report;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Report>
 */
class ReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'ticket_number' => 'REP-'.$this->faker->date('Ymd').'-'.$this->faker->unique()->numerify('###'),
            'equipment_id' => $this->faker->numberBetween(1, 30),
            'reported_by' => $this->faker->numberBetween(1, 30),
            'type' => $this->faker->randomElement(['kerusakan', 'pemeliharaan', 'kalibrasi']),
            'description' => $this->faker->sentence(),
            'status' => $this->faker->randomElement(['menunggu', 'diproses', 'selesai', 'dibatalkan']),
            'estimated_completion' => $this->faker->dateTimeBetween('now', '+1 month'),
            'created_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
            'updated_at' => $this->faker->dateTimeBetween('-3 months', 'now'),
        ];
    }
}
