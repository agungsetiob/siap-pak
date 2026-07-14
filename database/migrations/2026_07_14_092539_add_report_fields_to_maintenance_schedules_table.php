<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('maintenance_schedules', function (Blueprint $table) {
            // Menyimpan 12 poin checklist
            $table->json('checklist_results')->nullable()->after('status'); 
            // Menyimpan array checkbox tindakan
            $table->json('maintenance_actions')->nullable()->after('checklist_results'); 
            $table->string('action_other')->nullable()->after('maintenance_actions');
            // Menyimpan Hasil
            $table->enum('result_status', ['layak', 'layak_dengan_catatan', 'tidak_layak'])->nullable()->after('action_other');
            // Menyimpan Tindak Lanjut
            $table->text('follow_up_notes')->nullable()->after('result_status');
        });
    }

    public function down(): void
    {
        Schema::table('maintenance_schedules', function (Blueprint $table) {
            $table->dropColumn(['checklist_results', 'maintenance_actions', 'action_other', 'result_status', 'follow_up_notes']);
        });
    }
};
