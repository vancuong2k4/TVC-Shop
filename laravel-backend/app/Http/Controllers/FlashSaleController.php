<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;

class FlashSaleController extends Controller
{
    /**
     * Lấy danh sách sản phẩm Flash Sale & Giới hạn thời gian (Limited Time Offers)
     * Trả về thời gian kết thúc flash sale hiện tại (được tính toán đồng bộ theo chu kỳ 24h hoặc 48h),
     * tỷ lệ giảm giá sâu, số lượng đã bán (stock progression) và trạng thái khẩn cấp.
     */
    public function getActiveFlashSale(Request $request)
    {
        // Tính thời gian kết thúc của phiên Flash Sale hiện tại
        // Đếm ngược đến 23:59:59 của ngày hôm nay hoặc ngày mai
        $now = Carbon::now();
        $endTime = (clone $now)->endOfDay();
        $diffSeconds = $now->diffInSeconds($endTime);

        // Lấy các sản phẩm có discount_price hoặc áp dụng giảm giá ưu đãi
        $products = Product::with(['images', 'category'])
            ->whereNotNull('discount_price')
            ->where('discount_price', '>', 0)
            ->take(8)
            ->get();

        // Nếu sản phẩm có discount_price ít hơn 4, lấy thêm các sản phẩm hot và gán discount giả lập
        if ($products->count() < 4) {
            $moreProducts = Product::with(['images', 'category'])->take(8)->get();
            $products = $products->merge($moreProducts)->unique('id');
        }

        $flashSaleItems = $products->map(function ($product, $index) {
            $primaryImg = $product->images->where('is_primary', 1)->first() 
                ?: $product->images->first();

            $originalPrice = (float) $product->price;
            $salePrice = (float) ($product->discount_price ?: ($originalPrice * 0.75));
            $discountPercent = round((($originalPrice - $salePrice) / $originalPrice) * 100);

            // Mô phỏng số lượng đã bán theo % để hiển thị thanh tiến độ khan hiếm (scarcity bar)
            $soldPercent = min(92, 50 + ($index * 7));
            $stockRemaining = max(3, 20 - ($index * 2));

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'category_name' => $product->category ? $product->category->name : 'Thời trang cao cấp',
                'original_price' => $originalPrice,
                'flash_price' => $salePrice,
                'discount_percent' => $discountPercent,
                'sold_percent' => $soldPercent,
                'stock_remaining' => $stockRemaining,
                'image_url' => $primaryImg ? $primaryImg->image_url : null,
                'is_almost_sold_out' => $stockRemaining <= 5
            ];
        });

        return response()->json([
            'success' => true,
            'campaign_title' => 'MIDNIGHT NOIR FLASH SALE',
            'campaign_subtitle' => 'Ưu đãi độc quyền lên tới 40% cho các thiết kế tối giản giới hạn.',
            'end_timestamp' => $endTime->timestamp * 1000, // milliseconds for JS Date
            'remaining_seconds' => $diffSeconds,
            'items' => $flashSaleItems
        ]);
    }
}
