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
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\SeoController;

Route::get('/seo/meta', [SeoController::class, 'getMetaTags']);
Route::get('/seo/sitemap.xml', [SeoController::class, 'generateSitemap']);

Route::get('/products/filter-options', [ProductController::class, 'filterOptions']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/coupons/validate', [CouponController::class, 'validateCoupon']);
Route::get('/reviews', [ReviewController::class, 'getReviews']);
Route::get('/banners', [\App\Http\Controllers\BannerController::class, 'index']);
Route::get('/blogs', [\App\Http\Controllers\BlogController::class, 'index']);
Route::get('/blogs/{id}', [\App\Http\Controllers\BlogController::class, 'show']);
Route::get('/social-proof/recent-purchases', [\App\Http\Controllers\SocialProofController::class, 'getRecentPurchases']);
Route::get('/flash-sale', [\App\Http\Controllers\FlashSaleController::class, 'getActiveFlashSale']);
Route::post('/restock/subscribe', [\App\Http\Controllers\RestockNotificationController::class, 'subscribe']);

// Lucky Spin Voucher Wheel Routes
Route::get('/lucky-wheel/config', [\App\Http\Controllers\LuckyWheelController::class, 'getWheelConfig']);
Route::post('/lucky-wheel/spin', [\App\Http\Controllers\LuckyWheelController::class, 'spin']);

// Group Buy & Team Discount Routes
Route::get('/group-buys', [\App\Http\Controllers\GroupBuyController::class, 'getActiveGroupBuys']);

// FAQ & Help Center Routes
Route::get('/faqs', [\App\Http\Controllers\FaqController::class, 'getFaqs']);
Route::post('/faqs/inquiry', [\App\Http\Controllers\FaqController::class, 'submitInquiry']);

// Shareable Cart Routes
Route::post('/cart/share', [\App\Http\Controllers\SharedCartController::class, 'createSharedCart']);
Route::get('/cart/shared/{code}', [\App\Http\Controllers\SharedCartController::class, 'getSharedCart']);

// Occasion & Outfit Recommender Routes
Route::get('/occasions', [\App\Http\Controllers\OccasionController::class, 'getOccasions']);

// Shoppable Video Reels Routes
Route::get('/video-reels', [\App\Http\Controllers\VideoReelController::class, 'getReels']);

// Multi-Currency Exchange Rates & Conversion Routes
Route::get('/currencies', [\App\Http\Controllers\CurrencyController::class, 'getCurrencies']);
Route::get('/currencies/convert', [\App\Http\Controllers\CurrencyController::class, 'convert']);

// Size Guide & Measurement Routes
Route::get('/size-guides', [\App\Http\Controllers\SizeGuideController::class, 'getSizeGuides']);

// Pre-order & Reservation Campaigns Routes
Route::get('/pre-orders', [\App\Http\Controllers\PreorderController::class, 'getCampaigns']);
Route::get('/pre-orders/{id}', [\App\Http\Controllers\PreorderController::class, 'getCampaignDetail']);
Route::post('/pre-orders/reserve', [\App\Http\Controllers\PreorderController::class, 'createReservation']);

// Virtual Fitting Room & Outfit Canvas Routes
Route::get('/fitting-room/wardrobe', [\App\Http\Controllers\FittingRoomController::class, 'getFittingWardrobe']);

// AI Personal Stylist Quiz Routes
Route::get('/stylist-quiz/questions', [\App\Http\Controllers\StylistQuizController::class, 'getQuestions']);
Route::post('/stylist-quiz/analyze', [\App\Http\Controllers\StylistQuizController::class, 'analyzeResults']);

// Private Salon VIP 1-1 Appointment Booking Routes
Route::get('/private-salon/config', [\App\Http\Controllers\PrivateSalonController::class, 'getSalonConfig']);
Route::post('/private-salon/book', [\App\Http\Controllers\PrivateSalonController::class, 'bookAppointment']);

// Garment Care & Lifetime Maintenance Portal Routes
Route::get('/garment-care', [\App\Http\Controllers\GarmentCareController::class, 'getCarePortal']);
Route::post('/garment-care/request', [\App\Http\Controllers\GarmentCareController::class, 'submitMaintenanceRequest']);

// Bespoke Physical Lacquer Gift Box Routes
Route::get('/bespoke-box/editions', [\App\Http\Controllers\BespokeBoxController::class, 'getEditions']);
Route::post('/bespoke-box/order', [\App\Http\Controllers\BespokeBoxController::class, 'orderBox']);

// Digital Fabric Archive & Traceability Passport Routes
Route::get('/fabric-archive', [\App\Http\Controllers\FabricArchiveController::class, 'getArchive']);
Route::get('/fabric-archive/verify', [\App\Http\Controllers\FabricArchiveController::class, 'verifyPassport']);

// Atelier Design Co-Creation & Runway Community Voting Routes
Route::get('/runway-voting/concepts', [\App\Http\Controllers\RunwayVotingController::class, 'getConcepts']);
Route::post('/runway-voting/vote', [\App\Http\Controllers\RunwayVotingController::class, 'castVote']);

// Blockchain & Cryptographic Authenticity Certificate Routes
Route::get('/authenticity/showcase', [\App\Http\Controllers\AuthenticityCertificateController::class, 'getShowcase']);
Route::get('/authenticity/verify', [\App\Http\Controllers\AuthenticityCertificateController::class, 'verifyCertificate']);

// Community Style Lookbook Feed Routes
Route::get('/community-lookbook/feed', [\App\Http\Controllers\CommunityLookbookController::class, 'getFeed']);
Route::post('/community-lookbook/posts', [\App\Http\Controllers\CommunityLookbookController::class, 'createPost']);
Route::post('/community-lookbook/posts/{id}/like', [\App\Http\Controllers\CommunityLookbookController::class, 'likePost']);

// Bespoke 3D Hardware & Lining Customizer Routes
Route::get('/hardware-customizer/config', [\App\Http\Controllers\HardwareCustomizerController::class, 'getCustomizerConfig']);
Route::post('/hardware-customizer/save', [\App\Http\Controllers\HardwareCustomizerController::class, 'saveCustomization']);

// VIP Digital Measurement Profile & Fit Ledger Routes
Route::get('/measurement-ledger/schema', [\App\Http\Controllers\MeasurementLedgerController::class, 'getLedgerSchema']);
Route::post('/measurement-ledger/save', [\App\Http\Controllers\MeasurementLedgerController::class, 'saveLedger']);

// Interactive 360 Degree Product Spin Viewer Routes
Route::get('/spin-viewer/data', [\App\Http\Controllers\SpinViewer360Controller::class, 'getSpinData']);

// VIP Secret Vault & Archival Tiered Perks Routes
Route::get('/secret-vault/catalog', [\App\Http\Controllers\Api\SecretVaultController::class, 'getVaultData']);
Route::post('/secret-vault/acquire', [\App\Http\Controllers\Api\SecretVaultController::class, 'acquireVaultItem']);

// AI Seasonal Color Palette & Undertone Matcher Routes
Route::get('/color-analysis/schema', [\App\Http\Controllers\Api\ColorAnalysisController::class, 'getAnalysisSchema']);
Route::post('/color-analysis/diagnose', [\App\Http\Controllers\Api\ColorAnalysisController::class, 'diagnose']);

// Circular Buyback & Archival Resell Routes
Route::get('/circular-buyback/config', [\App\Http\Controllers\Api\CircularBuybackController::class, 'getConfig']);
Route::post('/circular-buyback/appraisal', [\App\Http\Controllers\Api\CircularBuybackController::class, 'submitAppraisal']);

// Digital Olfactory Scent Profiler & Fragrance Pairing Routes
Route::get('/scent-profiler/catalog', [\App\Http\Controllers\Api\ScentProfilerController::class, 'getScentCatalog']);
Route::post('/scent-profiler/diagnose', [\App\Http\Controllers\Api\ScentProfilerController::class, 'diagnoseScent']);
Route::post('/scent-profiler/sample-order', [\App\Http\Controllers\Api\ScentProfilerController::class, 'orderSampleSet']);

// Virtual Eyewear & Haute Joaillerie AR Mirror Routes
Route::get('/virtual-mirror/catalog', [\App\Http\Controllers\Api\VirtualMirrorController::class, 'getCatalog']);
Route::post('/virtual-mirror/snapshot', [\App\Http\Controllers\Api\VirtualMirrorController::class, 'saveSnapshot']);

// Global Weather & Jetsetter Wardrobe Packing Routes
Route::get('/jetsetter/destinations', [\App\Http\Controllers\Api\JetsetterWeatherController::class, 'getDestinations']);
Route::post('/jetsetter/packing-list', [\App\Http\Controllers\Api\JetsetterWeatherController::class, 'generatePackingList']);

// Payment Callbacks
Route::get('/payment/vnpay/callback', [PaymentController::class, 'vnpayCallback']);

// Chatbot Route (Mở cho tất cả mọi người, không cần đăng nhập)
Route::post('/chatbot/chat', [ChatbotController::class, 'chat']);

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::get('/auth/google', [\App\Http\Controllers\GoogleAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [\App\Http\Controllers\GoogleAuthController::class, 'handleGoogleCallback']);

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
    Route::get('/orders/{id}/tracking', [\App\Http\Controllers\TrackingController::class, 'getOrderTracking']);
    Route::get('/orders/{id}/invoice', [\App\Http\Controllers\InvoiceController::class, 'getInvoice']);

    // Payment Routes
    Route::post('/payment/vnpay/create', [PaymentController::class, 'createVnpayPayment']);
    Route::post('/payment/simulate', [PaymentController::class, 'simulateOnlinePayment']);

    // Notification Routes
    Route::get('/notifications', [NotificationController::class, 'getNotifications']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    // Loyalty Points & Membership Tier Routes
    Route::get('/loyalty/profile', [\App\Http\Controllers\LoyaltyController::class, 'getLoyaltyProfile']);

    // Referral & E-Gift Cards Routes
    Route::get('/referral/stats', [\App\Http\Controllers\ReferralController::class, 'getReferralStats']);
    Route::post('/gift-cards/purchase', [\App\Http\Controllers\ReferralController::class, 'purchaseGiftCard']);
    Route::get('/gift-cards/check', [\App\Http\Controllers\ReferralController::class, 'checkGiftCard']);

    // User Profile & Address Book Routes
    Route::get('/users/profile', [\App\Http\Controllers\UserController::class, 'getProfile']);
    Route::put('/users/profile', [\App\Http\Controllers\UserController::class, 'updateProfile']);
    Route::get('/addresses', [\App\Http\Controllers\AddressController::class, 'getAddresses']);
    Route::post('/addresses', [\App\Http\Controllers\AddressController::class, 'addAddress']);
    Route::delete('/addresses/{id}', [\App\Http\Controllers\AddressController::class, 'deleteAddress']);
    Route::put('/addresses/{id}/default', [\App\Http\Controllers\AddressController::class, 'setDefaultAddress']);

    // Group Buy Action
    Route::post('/group-buys/{id}/join', [\App\Http\Controllers\GroupBuyController::class, 'joinGroupBuy']);

    // Admin Routes
    Route::middleware('admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'getDashboard']);
        
        // User Routes
        Route::get('/admin/users', [AdminController::class, 'getUsers']);
        Route::put('/admin/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::put('/admin/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        
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

        // Banner Routes
        Route::get('/admin/banners', [\App\Http\Controllers\BannerController::class, 'adminIndex']);
        Route::post('/admin/banners', [\App\Http\Controllers\BannerController::class, 'store']);
        Route::put('/admin/banners/{id}', [\App\Http\Controllers\BannerController::class, 'update']);
        Route::delete('/admin/banners/{id}', [\App\Http\Controllers\BannerController::class, 'destroy']);

        // Review Moderation & Reply Routes
        Route::get('/admin/reviews', [ReviewController::class, 'adminGetReviews']);
        Route::post('/admin/reviews/{id}/reply', [ReviewController::class, 'adminReplyReview']);
        Route::delete('/admin/reviews/{id}', [ReviewController::class, 'adminDeleteReview']);
    });
});
