<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\ReviewController;

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/coupons/validate', [CouponController::class, 'validateCoupon']);
Route::get('/reviews', [ReviewController::class, 'getReviews']);

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

use App\Http\Controllers\AdminController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/check', [AuthController::class, 'check']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Review Route
    Route::post('/reviews', [ReviewController::class, 'addReview']);

    // Wishlist Routes
    Route::get('/wishlists', [\App\Http\Controllers\WishlistController::class, 'getUserWishlist']);
    Route::post('/wishlists', [\App\Http\Controllers\WishlistController::class, 'toggle']);

    // Order Routes
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'getUserOrders']);
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'create']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'getDashboard']);
        Route::get('/admin/orders', [AdminController::class, 'getOrders']);
        Route::put('/admin/orders/{id}', [AdminController::class, 'updateOrderStatus']);
        Route::get('/admin/products', [AdminController::class, 'getAllProducts']);
        Route::post('/admin/products', [AdminController::class, 'createProduct']);
        Route::put('/admin/products/{id}', [AdminController::class, 'updateProduct']);
        Route::delete('/admin/products/{id}', [AdminController::class, 'deleteProduct']);
        Route::get('/admin/coupons', [AdminController::class, 'getCoupons']);
        Route::post('/admin/coupons', [AdminController::class, 'createCoupon']);
        Route::delete('/admin/coupons/{id}', [AdminController::class, 'deleteCoupon']);
        Route::get('/admin/blogs', [AdminController::class, 'getBlogs']);
        Route::post('/admin/blogs', [AdminController::class, 'createBlog']);
        Route::delete('/admin/blogs/{id}', [AdminController::class, 'deleteBlog']);
    });
});
