<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    public function getReviews(Request $request)
    {
        $productId = $request->query('product_id');
        if (!$productId) {
            return response()->json(["message" => "Thiếu product_id."], 400);
        }

        $reviews = Review::with('user')->where('product_id', $productId)->orderBy('created_at', 'desc')->get();
        
        $totalRating = 0;
        foreach($reviews as $r) {
            $totalRating += $r->rating;
        }
        $avgRating = $reviews->count() > 0 ? round($totalRating / $reviews->count(), 1) : 0;

        $formattedReviews = $reviews->map(function ($r) {
            return [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'created_at' => $r->created_at,
                'full_name' => $r->user ? $r->user->full_name : 'Người dùng Ẩn danh'
            ];
        });

        return response()->json([
            "average_rating" => $avgRating,
            "total_reviews" => $reviews->count(),
            "reviews" => $formattedReviews
        ], 200);
    }

    public function addReview(Request $request)
    {
        $user = $request->user();
        
        $productId = $request->input('product_id');
        $rating = (int) $request->input('rating', 0);
        $comment = $request->input('comment', '');

        if (!$productId || $rating < 1 || $rating > 5) {
            return response()->json(["message" => "Dữ liệu đánh giá không hợp lệ (Số sao từ 1-5)."], 400);
        }

        // Kiểm tra xem đã mua hàng chưa
        $hasPurchased = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.user_id', $user->id)
            ->where('order_items.product_id', $productId)
            ->exists();

        if (!$hasPurchased) {
            return response()->json(["message" => "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng."], 403);
        }

        // Kiểm tra xem đã đánh giá chưa
        $hasReviewed = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if ($hasReviewed) {
            return response()->json(["message" => "Bạn đã đánh giá sản phẩm này rồi."], 400);
        }

        try {
            Review::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'rating' => $rating,
                'comment' => $comment
            ]);

            return response()->json(["message" => "Đánh giá của bạn đã được ghi nhận. Cảm ơn bạn!"], 201);
        } catch (\Exception $e) {
            return response()->json(["message" => "Lỗi hệ thống khi gửi đánh giá."], 500);
        }
    }
}
