<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Coupon;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    /**
     * Lấy thông tin điểm thưởng và phân hạng thành viên của người dùng
     */
    public function getLoyaltyProfile(Request $request)
    {
        $user = $request->user();

        // Tính tổng chi tiêu thực tế từ các đơn hàng thành công (không hủy)
        $orders = Order::where('user_id', $user->id)
            ->where('status', '!=', 'cancelled')
            ->orderBy('created_at', 'desc')
            ->get();

        $totalSpent = (float) $orders->sum('total_amount');
        $successfulOrdersCount = $orders->count();

        // 10.000 VND chi tiêu = 1 điểm thưởng
        $points = (int) floor($totalSpent / 10000);

        // Xác định hạng thành viên (Tier)
        $tier = 'Bronze';
        $tierDiscount = 0;
        $nextTier = 'Silver';
        $nextTierThreshold = 2000000; // 2 triệu
        $tierColor = '#CD7F32';

        if ($totalSpent >= 15000000) { // 15 triệu
            $tier = 'Diamond';
            $tierDiscount = 15;
            $nextTier = null;
            $nextTierThreshold = 15000000;
            $tierColor = '#3B82F6';
        } elseif ($totalSpent >= 7000000) { // 7 triệu
            $tier = 'Gold';
            $tierDiscount = 10;
            $nextTier = 'Diamond';
            $nextTierThreshold = 15000000;
            $tierColor = '#EAB308';
        } elseif ($totalSpent >= 2000000) { // 2 triệu
            $tier = 'Silver';
            $tierDiscount = 5;
            $nextTier = 'Gold';
            $nextTierThreshold = 7000000;
            $tierColor = '#94A3B8';
        }

        $progressToNextTier = 100;
        if ($nextTier) {
            $progressToNextTier = min(100, round(($totalSpent / $nextTierThreshold) * 100));
        }

        // Lịch sử cộng điểm từ các đơn hàng gần nhất
        $history = $orders->take(6)->map(function ($order) {
            $earned = (int) floor($order->total_amount / 10000);
            return [
                'id' => 'ord_' . $order->id,
                'title' => 'Tích điểm đơn hàng #' . $order->id,
                'points' => "+{$earned}",
                'amount' => $order->total_amount,
                'date' => $order->created_at ? $order->created_at->format('d/m/Y') : ''
            ];
        });

        // Các đặc quyền thành viên
        $benefits = [
            'Bronze' => ['Tích 1 điểm cho mỗi 10.000 ₫', 'Ưu đãi sinh nhật', 'Hỗ trợ khách hàng tiêu chuẩn'],
            'Silver' => ['Giảm 5% mọi đơn hàng', 'Ưu đãi sinh nhật độc quyền', 'Miễn phí giao hàng đơn từ 500k'],
            'Gold' => ['Giảm 10% mọi đơn hàng', 'Ưu tiên xử lý đóng gói', 'Đổi trả miễn phí 30 ngày', 'Quà tặng lookbook'],
            'Diamond' => ['Giảm 15% mọi đơn hàng', 'Tư vấn Stylist cá nhân 1-1', 'Giao hàng hỏa tốc miễn phí', 'Lời mời tham dự sự kiện ra mắt BST']
        ];

        return response()->json([
            'points' => $points,
            'total_spent' => $totalSpent,
            'successful_orders' => $successfulOrdersCount,
            'tier' => $tier,
            'tier_color' => $tierColor,
            'tier_discount' => $tierDiscount,
            'next_tier' => $nextTier,
            'next_tier_threshold' => $nextTierThreshold,
            'progress' => $progressToNextTier,
            'remaining_spent_needed' => $nextTier ? max(0, $nextTierThreshold - $totalSpent) : 0,
            'history' => $history,
            'benefits' => $benefits[$tier] ?? []
        ]);
    }
}
