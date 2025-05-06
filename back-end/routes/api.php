<?php


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\CartDetailController;

Route::apiResource('users', UserController::class);
Route::apiResource('products', ProductController::class);
Route::apiResource('categories', CategoryController::class);
Route::apiResource('carts', CartController::class);
Route::apiResource('carts_detail', CartDetailController::class);
Route::delete('/carts', [CartController::class, 'destroyByUser'])->middleware('auth:sanctum');
Route::post('/checkout', [CheckoutController::class, 'store'])->middleware('auth:sanctum'); // Example with Sanctum authentication
Route::post('/login', [AuthController::class, 'login']);
Route::post('/login/google', [AuthController::class, 'loginWithGoogle']); // Thêm route cho đăng nhập Google

// api.php
Route::get('/orders/{id}', [CheckoutController::class, 'show'])->middleware('auth:sanctum');

// Thêm route GET /login để tránh lỗi Route [login] not defined
Route::get('/login', function () {
    return response()->json(['message' => 'Please login'], 401);
})->name('login');

// Route xử lý callback từ MoMo (không áp dụng middleware auth:sanctum)
// Route::get('/api/momo/callback', [CheckoutController::class, 'momoCallback'])->name('momo.callback');

// Các route khác
Route::get('/checkout/success', function () {
    return view('checkout.success'); // Tạo view này nếu cần
});
Route::get('/checkout/failure', function () {
    return view('checkout.failure'); // Tạo view này nếu cần
});

Route::get('/featured-products', [ProductController::class, 'getFeaturedProducts']);

Route::get('/orders', [CheckoutController::class, 'index'])->middleware('auth:sanctum');
