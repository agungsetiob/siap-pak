<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('report_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->constrained('reports')->cascadeOnDelete();
            $table->foreignId('updated_by')->constrained('users')->cascadeOnDelete(); // Admin yang melakukan update
            $table->enum('status_snapshot', ['menunggu', 'diproses', 'selesai', 'dibatalkan']);
            $table->text('notes')->nullable(); // Catatan perbaikan (misal: "Menunggu sparepart dari teknisi luar")
            $table->timestamps(); // Berlaku sebagai tanggal update progress
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('report_progress');
    }
};
