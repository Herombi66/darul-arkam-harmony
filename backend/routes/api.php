<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/student/dashboard', [DashboardController::class, 'index']);
Route::get('/student/assignments', [AssignmentController::class, 'index']);
Route::get('/student/subjects', [SubjectController::class, 'index']);
Route::get('/student/results/current', [ResultController::class, 'current']);
Route::get('/student/results/previous', [ResultController::class, 'previous']);
