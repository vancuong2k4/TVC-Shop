<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReviewController extends Controller
{
    /**
     * Lấy danh sách đánh giá của sản phẩm kèm phân tích xếp hạng & bộ lọc sao
     */
    public function getReviews(Request $request)
    {
        $productId = $request->query('product_id');
        if (!$productId) {
            return response()->json(["message" => "Thiếu product_id."], 400);
        }

        $query = Review::with('user:id,full_name,avatar')->where('product_id', $productId);

        // Lọc theo số sao nếu có (1 - 5)
        if ($request->filled('rating') && in_array((int)$request->rating, [1, 2, 3, 4, 5])) {
            $query->where('rating', (int)$request->rating);
        }

        // Lọc những bài có hình ảnh feedback
        if ($request->boolean('has_image')) {
            $query->whereNotNull('images')->where('images', '!=', '[]')->where('images', '!=', '');
        }

        // Sắp xếp
        $sort = $request->input('sort', 'newest');
        if ($sort === 'highest') {
            $query->orderBy('rating', 'desc')->orderBy('created_at', 'desc');
        } elseif ($sort === 'lowest') {
            $query->orderBy('rating', 'asc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $reviews = $query->get();
        
        // Thống kê phân bổ sao trên toàn bộ đánh giá của sản phẩm
        $allReviews = Review::where('product_id', $productId)->get(['rating']);
        $totalReviewsCount = $allReviews->count();
        $totalRatingSum = $allReviews->sum('rating');
        $avgRating = $totalReviewsCount > 0 ? round($totalRatingSum / $totalReviewsCount, 1) : 0;

        $ratingDistribution = [
            5 => 0,
            4 => 0,
            3 => 0,
            2 => 0,
            1 => 0
        ];

        foreach ($allReviews as $r) {
            if (isset($ratingDistribution[$r->rating])) {
                $ratingDistribution[$r->rating]++;
            }
        }

        $formattedReviews = $reviews->map(function ($r) {
            $imagesList = [];
            if (!empty($r->images)) {
                $decoded = is_string($r->images) ? json_decode($r->images, true) : $r->images;
                if (is_array($decoded)) {
                    $imagesList = array_map(function ($img) {
                        return Str::startsWith($img, 'http') ? $img : asset('storage/' . $img);
                    }, $decoded);
                }
            }

            return [
                'id' => $r->id,
                'rating' => $r->rating,
                'comment' => $r->comment,
                'images' => $imagesList,
                'created_at' => $r->created_at,
                'full_name' => $r->user ? $r->user->full_name : 'Người dùng Ẩn danh',
                'user_avatar' => $r->user ? $r->user->avatar : null,
                'verified_purchase' => true
            ];
        });

        return response()->json([
            "average_rating" => $avgRating,
            "total_reviews" => $totalReviewsCount,
            "rating_distribution" => $ratingDistribution,
            "reviews" => $formattedReviews
        ], 200);
    }

    /**
     * Thêm đánh giá mới kèm tải lên nhiều ảnh feedback thực tế
     */
    public function addReview(Request $request)
    {
        $user = $request->user();
        
        $productId = $request->input('product_id');
        $rating = (int) $request->input('rating', 0);
        $comment = $request->input('comment', '');

        if (!$productId || $rating < 1 || $rating > 5) {
            return response()->json(["message" => "Dữ liệu đánh giá không hợp lệ (Số sao từ 1-5)."], 400);
        }

        // Kiểm tra xem khách hàng đã từng mua sản phẩm này chưa
        $hasPurchased = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.user_id', $user->id)
            ->where('order_items.product_id', $productId)
            ->exists();

        if (!$hasPurchased) {
            return response()->json(["message" => "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng."], 403);
        }

        // Kiểm tra xem đã từng đánh giá sản phẩm này chưa
        $hasReviewed = Review::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        if ($hasReviewed) {
            return response()->json(["message" => "Bạn đã đánh giá sản phẩm này rồi."], 400);
        }

        // Xử lý upload danh sách ảnh feedback thực tế (tối đa 4 ảnh)
        $uploadedImages = [];
        if ($request->hasFile('images')) {
            $files = $request->file('images');
            if (!is_array($files)) {
                $files = [$files];
            }

            foreach (array_slice($files, 0, 4) as $file) {
                if ($file->isValid()) {
                    $path = $file->store('reviews', 'public');
                    $uploadedImages[] = $path;
                }
            }
        }

        try {
            $review = Review::create([
                'user_id' => $user->id,
                'product_id' => $productId,
                'rating' => $rating,
                'comment' => $comment,
                'images' => $uploadedImages
            ]);

            return response()->json([
                "message" => "Đánh giá của bạn đã được ghi nhận. Cảm ơn bạn!",
                "review" => $review
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Lỗi hệ thống khi gửi đánh giá.",
                "error" => $e->getMessage()
            ], 500);
        }
    }
}
