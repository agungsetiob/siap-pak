<?php

use App\Http\Controllers\CalibrationController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

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
    Route::delete('/calibrations/{calibration}', [CalibrationController::class, 'destroy'])->name('calibrations.destroy');
    Route::resource('rooms', RoomController::class)->except(['create', 'show', 'edit']);

    Route::get('/calibrations', [CalibrationController::class, 'index'])->name('calibrations.index');
});

require __DIR__ . '/auth.php';
