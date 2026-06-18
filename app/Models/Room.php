<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $fillable = ['name', 'code'];

    /**
     * Hubungan ke data User/Aktor di ruangan ini.
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Hubungan ke daftar Alat Kesehatan yang ada di ruangan ini.
     */
    public function equipments(): HasMany
    {
        return $this->hasMany(Equipment::class);
    }
}