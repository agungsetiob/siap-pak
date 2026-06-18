<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calibrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('equipment_id')->constrained('equipments')->cascadeOnDelete();
            // Optional: hubungkan ke report_id jika kalibrasi ini berawal dari tiket laporan/pemeliharaan
            $table->foreignId('report_id')->nullable()->constrained('reports')->nullOnDelete(); 
            
            $table->string('certificate_number')->unique()->nullable(); // Nomor Sertifikat Kalibrasi
            $table->string('certificate_file')->nullable(); // Alamat/Path file sertifikat (PDF)
            $table->string('testing_institution')->nullable(); // Lembaga penguji, contoh: BPFK, Vendor Swasta, dll.
            
            $table->date('calibration_date'); // Tanggal pelaksanaan kalibrasi
            $table->date('next_calibration_date'); // Tanggal kalibrasi berikutnya
            
            // Hasil akhir kalibrasi
            $table->enum('result', ['laik', 'tidak_laik', 'laik_dengan_catatan'])->default('laik');
            $table->text('notes')->nullable(); // Keterangan tambahan atau catatan hasil ukur
            
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete(); // Admin yang menginput data
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calibrations');
    }
};
