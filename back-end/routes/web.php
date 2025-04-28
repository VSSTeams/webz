<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;


Route::get('/api/momo/callback', [CheckoutController::class, 'momoCallback'])->name('momo.callback');

Route::get('/', function () {
    return view('welcome');
});
