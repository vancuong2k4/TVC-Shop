<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PreorderController extends Controller
{
    /**
     * Danh sách sản phẩm phiên bản giới hạn / Runway Capsule hỗ trợ Pre-order
     */
    private $preorderCampaigns = [
        [
            'id' => 'pre_runway_01',
            'product_id' => 1,
            'title' => 'The Obsidian Trench Coat (Runway Edition)',
            'collection' => 'Fall/Winter Haute Couture',
            'deposit_percentage' => 30, // Đặt cọc 30%
            'total_price' => 3200000,
            'deposit_amount' => 960000,
            'slots_total' => 50,
            'slots_reserved' => 37,
            'estimated_delivery' => 'Tháng 12, 2026',
            'release_date' => '2026-12-15',
            'status' => 'open', // open, closing_soon, sold_out
            'fabric_origin' => 'Len Cashmere dệt thủ công Biella, Ý',
            'artisan_hours' => 48,
            'perks' => [
                'Khắc tên viết tắt cá nhân (Monogram) miễn phí bên trong ve áo',
                'Tặng kèm túi bọc bảo quản vải Canvas phủ sáp chống ẩm',
                'Thư cảm ơn kèm chữ ký chứng nhận phiên bản giới hạn từ Giám đốc sáng tạo'
            ]
        ],
        [
            'id' => 'pre_runway_02',
            'product_id' => 2,
            'title' => 'Structured Tuxedo Blazer in Silk Satin',
            'collection' => 'Midnight Noir Private Salon',
            'deposit_percentage' => 30,
            'total_price' => 2450000,
            'deposit_amount' => 735000,
            'slots_total' => 40,
            'slots_reserved' => 31,
            'estimated_delivery' => 'Tháng 01, 2027',
            'release_date' => '2027-01-10',
            'status' => 'closing_soon',
            'fabric_origin' => 'Lụa tơ tằm dệt jacquard Lyon, Pháp',
            'artisan_hours' => 36,
            'perks' => [
                'Hàng khuy sừng trâu tự nhiên chạm khắc logo TVC',
                'Ưu tiên đặt chỗ hàng ghế đầu show diễn Thu Đông tiếp theo',
                'Hộp quà tặng bọc nhung nhám kèm nơ ruy băng lụa cao cấp'
            ]
        ],
        [
            'id' => 'pre_runway_03',
            'product_id' => 3,
            'title' => 'Ethereal Bias-Cut Silk Evening Gown',
            'collection' => 'Atelier Capsule Exclusive',
            'deposit_percentage' => 40,
            'total_price' => 2890000,
            'deposit_amount' => 1156000,
            'slots_total' => 25,
            'slots_reserved' => 22,
            'estimated_delivery' => 'Tháng 12, 2026',
            'release_date' => '2026-12-25',
            'status' => 'closing_soon',
            'fabric_origin' => '100% Silk Charmeuse 22 Momme cao cấp',
            'artisan_hours' => 42,
            'perks' => [
                'Tùy chỉnh số đo vòng eo & chiều dài vạt váy theo vóc dáng',
                'Phiếu ưu đãi 15% cho phụ kiện dạ tiệc đi kèm',
                'Bảo dưỡng làm mới lụa miễn phí trong vòng 12 tháng'
            ]
        ]
    ];

    /**
     * Lấy danh sách các chiến dịch Pre-order đang mở
     */
    public function getCampaigns()
    {
        // Gắn kèm thông tin chi tiết của product nếu có trong CSDL
        $campaignsWithProducts = array_map(function ($campaign) {
            $product = Product::find($campaign['product_id']);
            if ($product) {
                $campaign['product_details'] = [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->image ?? $product->image_url,
                    'description' => $product->description
                ];
            }
            return $campaign;
        }, $this->preorderCampaigns);

        return response()->json([
            'success' => true,
            'data' => $campaignsWithProducts
        ]);
    }

    /**
     * Tra cứu chi tiết một chiến dịch Pre-order cụ thể
     */
    public function getCampaignDetail($id)
    {
        $campaign = null;
        foreach ($this->preorderCampaigns as $c) {
            if ($c['id'] === $id) {
                $campaign = $c;
                break;
            }
        }

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Chiến dịch đặt trước không tồn tại.'
            ], 404);
        }

        $product = Product::find($campaign['product_id']);
        if ($product) {
            $campaign['product_details'] = [
                'id' => $product->id,
                'name' => $product->name,
                'image' => $product->image ?? $product->image_url,
                'description' => $product->description
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $campaign
        ]);
    }

    /**
     * Tạo đơn đặt cọc giữ chỗ (Pre-order Reservation)
     */
    public function createReservation(Request $request)
    {
        $request->validate([
            'campaign_id' => 'required|string',
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email|max:100',
            'size' => 'required|string|max:10',
            'color' => 'required|string|max:50',
            'custom_monogram' => 'nullable|string|max:10',
            'note' => 'nullable|string|max:500'
        ]);

        $campaign = null;
        foreach ($this->preorderCampaigns as $c) {
            if ($c['id'] === $request->campaign_id) {
                $campaign = $c;
                break;
            }
        }

        if (!$campaign) {
            return response()->json([
                'success' => false,
                'message' => 'Chiến dịch đặt cọc không hợp lệ.'
            ], 400);
        }

        if ($campaign['slots_reserved'] >= $campaign['slots_total']) {
            return response()->json([
                'success' => false,
                'message' => 'Suất đặt trước của phiên bản này đã hết.'
            ], 400);
        }

        // Sinh mã đặt cọc độc quyền
        $reservationCode = 'PRE-' . strtoupper(Str::random(8));

        $remainingAmount = $campaign['total_price'] - $campaign['deposit_amount'];

        $reservationData = [
            'reservation_code' => $reservationCode,
            'campaign_id' => $campaign['id'],
            'product_name' => $campaign['title'],
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'size' => $request->size,
            'color' => $request->color,
            'custom_monogram' => $request->custom_monogram ? strtoupper($request->custom_monogram) : null,
            'deposit_amount' => $campaign['deposit_amount'],
            'total_price' => $campaign['total_price'],
            'remaining_amount' => $remainingAmount,
            'estimated_delivery' => $campaign['estimated_delivery'],
            'status' => 'deposit_pending', // deposit_pending, confirmed, crafting, fulfilled
            'created_at' => now()->toIso8601String()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Đăng ký đặt cọc suất may đo độc quyền thành công!',
            'data' => $reservationData
        ]);
    }
}
