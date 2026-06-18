<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique(); // Format auto: REP-20260618-001
            $table->foreignId('equipment_id')->constrained('equipments')->cascadeOnDelete();
            $table->foreignId('reported_by')->constrained('users')->cascadeOnDelete(); // User/Ruangan yang melapor
            $table->enum('type', ['kerusakan', 'pemeliharaan', 'kalibrasi']);
            $table->text('description'); // Detail kendala
            $table->text('action_taken')->nullable(); // Tindakan yang akhirnya dilakukan oleh teknisi
            $table->string('external_technician')->nullable(); // Nama teknisi / Vendor luar yang mengerjakan
            $table->unsignedBigInteger('cost')->default(0); // Biaya perbaikan jika ada (menggunakan rupiah/integer)
            $table->enum('status', ['menunggu', 'diproses', 'selesai', 'dibatalkan'])->default('menunggu');
            $table->date('estimated_completion')->nullable(); // Estimasi selesai dari Admin
            $table->timestamp('resolved_at')->nullable(); // Realisasi waktu penyelesaian
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};