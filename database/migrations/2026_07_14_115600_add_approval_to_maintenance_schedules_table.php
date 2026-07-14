<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('maintenance_schedules', function (Blueprint $table) {
            $table->timestamp('room_approved_at')->nullable()->after('follow_up_notes');
            $table->timestamp('executed_at')->nullable()->after('technician_id');
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('room_approved_at');
            $table->foreignId('executed_by')->nullable()->constrained('users')->nullOnDelete()->after('technician_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('maintenance_schedules', function (Blueprint $table) {
            $table->dropColumn(['room_approved_at', 'approved_by', 'executed_by', 'executed_at']);
        });
    }
};
