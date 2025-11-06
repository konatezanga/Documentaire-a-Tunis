<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\DocumentaryController;
use App\Http\Controllers\ScreeningController;
use App\Http\Controllers\JuryMemberController;
use App\Http\Controllers\RatingController;

// Routes d'authentification
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);

// Routes pour la gestion des utilisateurs (accessible uniquement aux admins)
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::post('/users', [AdminUserController::class, 'store']);
    Route::put('/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/users/{id}', [AdminUserController::class, 'destroy']);
});

// Routes pour les documentaires - Lecture pour tous les utilisateurs authentifiés
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/documentaries', [DocumentaryController::class, 'index']); //  Accessible à tous
});

// Écriture réservée aux inspection_manager
Route::middleware(['auth:sanctum', 'role:inspection_manager'])->group(function () {
    Route::post('/documentaries', [DocumentaryController::class, 'store']);
    // on va ajouter update/delete si nécessaire plus tard
});

// Routes pour les projections (accessible aux responsables de production)
Route::middleware(['auth:sanctum', 'role:production_manager'])->group(function () {
    Route::get('/screenings', [ScreeningController::class, 'index']);
    Route::post('/screenings', [ScreeningController::class, 'store']);
    Route::put('/screenings/{id}', [ScreeningController::class, 'update']);
    Route::delete('/screenings/{id}', [ScreeningController::class, 'destroy']);
});

// Routes pour les membres du jury
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/jury-members', [JuryMemberController::class, 'index']);
});

// Routes pour les notes (accessible au président du jury)
Route::middleware(['auth:sanctum', 'role:jury_president'])->group(function () {
    Route::get('/ratings', [RatingController::class, 'index']);
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::post('/ratings/bulk', [RatingController::class, 'storeMultiple']);
    Route::get('/ratings/screening/{screeningId}', [RatingController::class, 'forScreening']);
    Route::delete('/ratings/{rating}', [RatingController::class, 'destroy']);
});

// Route publique pour les projections publiées
Route::get('/screenings/published', [ScreeningController::class, 'published']);