<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['admin', 'ruangan'])->default('ruangan')->after('email');
            $table->foreignId('room_id')->nullable()->constrained('rooms')->nullOnDelete()->after('role');
            // Jika role == 'admin', room_id bisa bernilai null
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['room_id']);
            $table->dropColumn(['role', 'room_id']);
        });
    }
};