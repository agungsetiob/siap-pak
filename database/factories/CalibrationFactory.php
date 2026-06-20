<?php

namespace Database\Factories;

use App\Models\Calibration;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Calibration>
 */
class CalibrationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'equipment_id' => $this->faker->numberBetween(1, 30),
            'report_id' => $this->faker->numberBetween(1, 30),
            'certificate_number' => strtoupper($this->faker->unique()->lexify('CERT-????')),
            'certificate_file' => null,
            'testing_institution' => $this->faker->company(),
            'calibration_date' => $this->faker->dateTimeBetween('-1 year', 'now'),
            'next_calibration_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'result' => $this->faker->randomElement(['laik', 'tidak_laik', 'laik_dengan_catatan']),
            'notes' => $this->faker->sentence(),
            'created_by' => $this->faker->numberBetween(1, 30),
        ];
    }
}
