<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VendorFactory extends Factory
{
    public function definition(): array
    {
        $vendorType = $this->faker->randomElement([
            'supplier',
            'teknisi',
            'institusi_kalibrasi',
        ]);

        return [
            'name' => $this->faker->company(),
            'phone_number' => $this->faker->phoneNumber(),
            'email' => $this->faker->optional()->companyEmail(),
            'address' => $this->faker->address(),
            'vendor_type' => $vendorType,
            'notes' => $this->faker->optional()->sentence(),
        ];
    }
}