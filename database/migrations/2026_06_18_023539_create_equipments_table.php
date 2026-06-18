<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('room_id')->constrained('rooms')->cascadeOnDelete();
            $table->string('inventory_number')->unique(); // Nomor inventaris RS
            $table->string('name'); // Nama alat
            $table->string('brand')->nullable(); // Merk/Tipe
            $table->string('serial_number')->nullable(); // Nomor seri
            $table->enum('condition', ['baik', 'rusak_ringan', 'rusak_berat'])->default('baik');
            $table->date('next_calibration_date')->nullable(); // Digunakan untuk trigger notifikasi
            $table->timestamps();
            $table->softDeletes(); // Mencegah data hilang jika alat dihapus/afkir
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipments');
    }
};