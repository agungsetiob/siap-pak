<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name',
        'email',
        'phone_number',
        'password',
        'role',
        'room_id',
        'is_active',
        'signature_path',])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Ruangan tempat user bertugas (null jika Admin).
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * Laporan kerusakan/perawatan yang dibuat oleh user ini.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'reported_by');
    }

    /**
     * Log perkembangan laporan yang diperbarui oleh user (Admin) ini.
     */
    public function progressUpdates(): HasMany
    {
        return $this->hasMany(ReportProgress::class, 'updated_by');
    }

    /**
     * Data kalibrasi yang diinput oleh user (Admin) ini.
     */
    public function calibrations(): HasMany
    {
        return $this->hasMany(Calibration::class, 'created_by');
    }
}
