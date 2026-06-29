<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone_number' => $this->faker->phoneNumber(),
            'password' => Hash::make('default123'), // fallback
            'room_id' => $this->faker->numberBetween(1, 10),
            'is_active' => true,
        ];
    }

    public function admin(): Factory
    {
        return $this->state(fn () => [
            'role' => 'admin',
            'password' => Hash::make(env('ADMIN_PASS', 'admin123')),
            'room_id' => null,
        ]);
    }

    public function ruangan(): Factory
    {
        return $this->state(fn () => [
            'role' => 'ruangan',
            'password' => Hash::make(env('RUANGAN_PASS', 'ruangan123')),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
