<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CircularBuybackController extends Controller
{
    /**
     * Get criteria, condition tiers, and valuation estimator metrics
     */
    public function getConfig()
    {
        $tiers = [
            'pristine' => [
                'name' => 'Pristine / Like New (Như Mới)',
                'description' => 'Trang phục còn nguyên tem thẻ hoặc chỉ mặc 1-2 lần trong các dịp trang trọng, không có bất kỳ dấu vết sử dụng nào.',
                'valuation_percentage' => 70, // 70% of original value in store credit or 55% in cash
                'cash_percentage' => 55,
                'requirements' => [
                    'Còn hóa đơn hoặc chứng thư kỹ thuật số TVC-Shop',
                    'Vải và phom dáng nguyên vẹn 100%',
                    'Khuy sừng và khóa kéo nguyên bản'
                ]
            ],
            'excellent' => [
                'name' => 'Excellent Vintage (Tuyệt Hảo)',
                'description' => 'Trang phục được bảo quản định kỳ chuẩn xưởng may, vải có độ mềm tự nhiên, không sờn rách hay mất khuy.',
                'valuation_percentage' => 55,
                'cash_percentage' => 40,
                'requirements' => [
                    'Đã qua bảo dưỡng và giặt hấp hơi nước chuyên dụng',
                    'Không có vết ố hoặc xước bề mặt vải',
                    'Lớp lót Cupro/Silk bên trong nguyên vẹn'
                ]
            ],
            'restorable' => [
                'name' => 'Restorable Atelier (Cần Tái Tạo)',
                'description' => 'Trang phục vintage có giá trị lưu trữ cao nhưng cần nghệ nhân đính lại khuy, là ép định hình hoặc thay thế lót.',
                'valuation_percentage' => 40,
                'cash_percentage' => 25,
                'requirements' => [
                    'Chất liệu chính (Dạ, Cashmere, Tơ tằm) không bị mục rách lớn',
                    'Có thể phục chế đạt chuẩn trưng bày Archive'
                ]
            ]
        ];

        $eligibleCategories = [
            [
                'id' => 'overcoat_cashmere',
                'name' => 'Áo Măng-tô & Trench Coat Cashmere',
                'base_avg_price' => 22000000,
                'resell_demand' => 'Rất cao (98%)'
            ],
            [
                'id' => 'bespoke_tuxedo',
                'name' => 'Bộ Tuxedo & Vest May Đo Super 150s - 180s',
                'base_avg_price' => 32000000,
                'resell_demand' => 'Cao (92%)'
            ],
            [
                'id' => 'silk_blouse_dress',
                'name' => 'Đầm Dạ Tiệc & Sơ Mi Tơ Tằm Mulberry',
                'base_avg_price' => 12500000,
                'resell_demand' => 'Ổn định (85%)'
            ],
            [
                'id' => 'leather_accessory',
                'name' => 'Cặp Xách & Phụ Kiện Kim Khí Titanium',
                'base_avg_price' => 18000000,
                'resell_demand' => 'Rất cao (95%)'
            ]
        ];

        $stats = [
            'total_items_recycled' => 418,
            'co2_saved_kg' => 12450,
            'water_saved_liters' => 840000,
            'active_archival_listings' => 24
        ];

        return response()->json([
            'success' => true,
            'condition_tiers' => $tiers,
            'eligible_categories' => $eligibleCategories,
            'circular_sustainability_stats' => $stats
        ]);
    }

    /**
     * Submit an appraisal / buyback request
     */
    public function submitAppraisal(Request $request)
    {
        $request->validate([
            'category_id' => 'required|string',
            'product_title' => 'required|string|max:150',
            'serial_or_code' => 'nullable|string|max:50',
            'purchase_year' => 'required|string',
            'condition' => 'required|string|in:pristine,excellent,restorable',
            'original_price' => 'required|numeric|min:1000000',
            'payout_preference' => 'required|string|in:store_credit,bank_transfer',
            'customer_name' => 'required|string|max:100',
            'phone' => 'required|string',
            'address' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $originalPrice = (float) $request->original_price;
        $condition = $request->condition;
        $preference = $request->payout_preference;

        // Estimate rates
        $rate = 0.55;
        if ($condition === 'pristine') {
            $rate = ($preference === 'store_credit') ? 0.70 : 0.55;
        } elseif ($condition === 'excellent') {
            $rate = ($preference === 'store_credit') ? 0.55 : 0.40;
        } else {
            $rate = ($preference === 'store_credit') ? 0.40 : 0.25;
        }

        $estimatedValuation = round($originalPrice * $rate);
        $ticketCode = 'BUYBACK-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Hồ sơ thẩm định thu mua tuần hoàn đã được tiếp nhận thành công.',
            'dossier' => [
                'ticket_code' => $ticketCode,
                'category_id' => $request->category_id,
                'product_title' => $request->product_title,
                'estimated_payout' => $estimatedValuation,
                'payout_type' => $preference === 'store_credit' ? 'Atelier Store Credit (+15% Bonus)' : 'Direct Bank Payout',
                'status' => 'PENDING_COURIER_PICKUP',
                'pickup_courier' => 'TVC White-Glove Logistics Concierge',
                'created_at' => now()->toIso8601String(),
                'hash_verification' => hash('sha256', $ticketCode . now()->timestamp)
            ]
        ]);
    }
}
