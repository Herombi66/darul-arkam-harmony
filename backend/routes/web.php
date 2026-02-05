<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/healthz', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/status', function () {
    return response()->json(['status' => 'ok', 'message' => 'Service is running']);
});

Route::get('/api/health', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/api/healthz', function () {
    return response()->json(['status' => 'ok']);
});

Route::get('/api/status', function () {
    return response()->json(['status' => 'ok', 'message' => 'Service is running']);
});
