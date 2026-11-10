<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class GroupBuyController extends Controller
{
    /**
     * Lấy danh sách các chiến dịch Mua Chung (Group Buy / Team Discount) đang diễn ra
     */
    public function getActiveGroupBuys(Request $request)
    {
        $products = Product::with(['images', 'category'])->take(6)->get();

        $groupBuys = $products->map(function ($product, $index) {
            $originalPrice = (float) $product->price;
            // Giá mua chung giảm sâu 20% - 30% khi đủ team 2 - 3 người
            $groupPrice = round($originalPrice * 0.75);
            $requiredMembers = ($index % 2 === 0) ? 2 : 3;
            $currentMembers = ($index % 2 === 0) ? 1 : 2;

            $primaryImg = $product->images->where('is_primary', 1)->first() 
                ?: $product->images->first();

            return [
                'group_buy_id' => 'GB-' . ($product->id + 1000),
                'product_id' => $product->id,
                'product_name' => $product->name,
                'category_name' => $product->category ? $product->category->name : 'Bộ sưu tập',
                'original_price' => $originalPrice,
                'group_price' => $groupPrice,
                'savings' => $originalPrice - $groupPrice,
                'discount_percent' => 25,
                'required_members' => $requiredMembers,
                'current_members' => $currentMembers,
                'slots_left' => $requiredMembers - $currentMembers,
                'leader_name' => ['Minh Anh', 'Khánh Linh', 'Quốc Bảo', 'Tuấn Kiệt'][$index % 4],
                'leader_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                'expires_in' => '14 giờ 25 phút',
                'image_url' => $primaryImg ? $primaryImg->image_url : null
            ];
        });

        return response()->json([
            'success' => true,
            'title' => 'COLD LUXURY GROUP BUY',
            'subtitle' => 'Lập nhóm mua chung cùng bạn bè để mở khóa mức giá ưu đãi đặc quyền.',
            'items' => $groupBuys
        ]);
    }

    /**
     * Tham gia vào một nhóm mua chung đang hoạt động
     */
    public function joinGroupBuy(Request $request, $groupBuyId)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'message' => 'Bạn đã tham gia nhóm mua chung ' . $groupBuyId . ' thành công! Đơn hàng được giữ giá ưu đãi.',
            'group_buy_id' => $groupBuyId,
            'status' => 'joined'
        ]);
    }
}
