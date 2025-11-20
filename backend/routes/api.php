<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PropertyController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
});

/*
|--------------------------------------------------------------------------
| Protected Routes (Require Authentication)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Authentication Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::post('/logout-all', [AuthController::class, 'logoutAll'])->name('auth.logout-all');
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
        Route::put('/profile', [AuthController::class, 'updateProfile'])->name('auth.update-profile');
        Route::put('/password', [AuthController::class, 'updatePassword'])->name('auth.update-password');
        Route::delete('/account', [AuthController::class, 'deleteAccount'])->name('auth.delete-account');
    });

    /*
    |--------------------------------------------------------------------------
    | User Route (Legacy - for compatibility)
    |--------------------------------------------------------------------------
    */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |--------------------------------------------------------------------------
    | Dashboard Routes
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard/stats', [DashboardController::class, 'stats'])->name('dashboard.stats');

    /*
    |--------------------------------------------------------------------------
    | Property Routes
    |--------------------------------------------------------------------------
    */
    Route::apiResource('properties', PropertyController::class);

    // Property Photos Routes
    Route::post('/properties/{property}/photos', [PropertyController::class, 'uploadPhotos'])->name('properties.photos.upload');
    Route::delete('/properties/{property}/photos/{photo}', [PropertyController::class, 'deletePhoto'])->name('properties.photos.delete');
    Route::put('/properties/{property}/photos/{photo}/main', [PropertyController::class, 'setMainPhoto'])->name('properties.photos.set-main');

    /*
    |--------------------------------------------------------------------------
    | Future API Routes
    |--------------------------------------------------------------------------
    | Add your other API routes here:
    | - Tenants
    | - Leases
    | - Rents
    | - Expenses
    | - Documents
    | - Notifications
    */
});
