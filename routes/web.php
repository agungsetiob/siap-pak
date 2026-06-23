<?php

use App\Http\Controllers\CalibrationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\MaintenanceScheduleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\TechnicianController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\QrController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/scan/{token}', [QrController::class, 'scan'])->name('qr.scan');
Route::get('/qr-image/{token}', [QrController::class, 'render'])->name('qr.render');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/{report}', [ReportController::class, 'show'])->name('reports.show');
    Route::post('/reports', [ReportController::class, 'store'])->name('reports.store');
    Route::get('/notifications/{id}/read', function ($id) {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return redirect($notification->data['url']);
    })->name('notifications.read');
    Route::post('/notifications/mark-read', function () {
        auth()->user()->unreadNotifications->markAsRead();

        return back();
    })->name('notifications.markRead');

    Route::get('/equipments', [EquipmentController::class, 'index'])->name('equipments.index');
    Route::get('/equipments/{equipment}', [EquipmentController::class, 'show'])
        ->name('equipments.show')
        ->where('equipment', '[0-9]+');

    Route::post('/profile/signature', [ProfileController::class, 'updateSignature'])->name('profile.signature.update');
    Route::post('/reports/{report}/approve', [ReportController::class, 'approve'])->name('reports.approve');
    Route::get('/reports/{report}/print', [ReportController::class, 'print'])->name('reports.print');
});

// ------------------------------------------------------------------
// AREA KHUSUS ADMIN
// ------------------------------------------------------------------
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
    Route::put('/reports/{report}/progress', [ReportController::class, 'updateProgress'])->name('reports.progress.update');

    Route::resource('equipments', EquipmentController::class)->except(['index', 'show', 'create', 'edit']);
    Route::get('/equipments/trashed', [EquipmentController::class, 'trashed'])->name('equipments.trashed');
    Route::post('/equipments/{id}/restore', [EquipmentController::class, 'restore'])->name('equipments.restore');
    Route::delete('/equipments/{id}/force', [EquipmentController::class, 'forceDelete'])->name('equipments.forceDelete');

    Route::post('/equipments/{equipment}/calibrations', [CalibrationController::class, 'store'])->name('calibrations.store');
    Route::put('/calibrations/{calibration}', [CalibrationController::class, 'update'])->name('calibrations.update');
    Route::delete('/calibrations/{calibration}', [CalibrationController::class, 'destroy'])->name('calibrations.destroy');
    Route::resource('rooms', RoomController::class)->except(['create', 'show', 'edit']);

    Route::get('/calibrations', [CalibrationController::class, 'index'])->name('calibrations.index');

    Route::post('/equipments/{equipment}/move', [EquipmentController::class, 'move'])->name('equipments.move');

    Route::post('/equipments/{equipment}/generate-qr', [QrController::class, 'generate'])->name('equipments.generateQr');
    Route::post('/equipments/batch-generate-qr', [QrController::class, 'batchGenerate'])->name('equipments.batchGenerateQr');
    Route::get('/equipments/print-qr-batch', [\App\Http\Controllers\QrController::class, 'printBatch'])->name('equipments.printBatchQr');

    Route::resource('vendors', VendorController::class)->except(['create', 'show', 'edit']);

    Route::resource('technicians', TechnicianController::class)->except(['create', 'show', 'edit']);
    
    Route::resource('maintenance-schedules', MaintenanceScheduleController::class)->except(['create', 'show', 'edit']);
    Route::put('/maintenance-schedules/{schedule}/status', [MaintenanceScheduleController::class, 'updateStatus'])->name('maintenance-schedules.updateStatus');
    Route::get('/equipments-template', [EquipmentController::class, 'downloadTemplate'])->name('equipments.template');
    Route::post('/equipments-import', [EquipmentController::class, 'importExcel'])->name('equipments.import');
});

require __DIR__.'/auth.php';
