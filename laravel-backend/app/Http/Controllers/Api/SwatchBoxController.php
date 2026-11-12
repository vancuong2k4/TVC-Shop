<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SwatchBoxController extends Controller
{
    /**
     * Get available fabric swatch sets & tactile box configurations
     */
    public function getSwatchCatalog()
    {
        $boxes = [
            'cashmere_wool' => [
                'box_id' => 'BOX-CASHMERE-NOIR',
                'title' => 'The Noble Cashmere & Worsted Wool Swatch Box',
                'origin' => 'Xưởng Dệt Biella & Piedmont, Ý',
                'description' => 'Bộ sưu tập 6 mẫu vải len Cashmere nguyên chất hai mặt (Double-faced Cashmere) và len may đo Super 180s mịn như lụa.',
                'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
                'swatches' => [
                    ['name' => 'Loro Piana 100% Cashmere Obsidian Noir', 'weight' => '480 g/m²', 'color' => '#0A0A0A', 'texture' => 'Mềm mịn như nhung, giữ ấm tuyệt đối'],
                    ['name' => 'Piacenza Alashan White Cashmere', 'weight' => '420 g/m²', 'color' => '#F8FAFC', 'texture' => 'Trắng ngà tự nhiên, không qua tẩy hóa chất'],
                    ['name' => 'Scabal Super 180s Navy Pin-Stripe', 'weight' => '280 g/m²', 'color' => '#0F172A', 'texture' => 'Vải dệt kim chìm, đứng phom sắc nét'],
                    ['name' => 'Dormeuil Royal Cashmere Camel', 'weight' => '450 g/m²', 'color' => '#78350F', 'texture' => 'Sắc nâu lạc đà vương giả, sợi tơ óng tự nhiên'],
                    ['name' => 'Holland & Sherry Charcoal Melange', 'weight' => '320 g/m²', 'color' => '#334155', 'texture' => 'Màu xám than chì cổ điển chuẩn Savile Row'],
                    ['name' => 'Vitale Barberis Canonico Flannel 160s', 'weight' => '340 g/m²', 'color' => '#1E293B', 'texture' => 'Dạ flanen xước nhẹ, co giãn tự nhiên']
                ],
                'deposit_fee' => 300000,
                'shipping_time' => 'Giao hỏa tốc trong 24 giờ tại Hà Nội & TP.HCM'
            ],
            'silk_linen' => [
                'box_id' => 'BOX-SILK-SUMMER',
                'title' => 'The Mediterranean Mulberry Silk & Artisanal Linen Swatch Box',
                'origin' => 'Xưởng Dệt Como (Ý) & Normandie (Pháp)',
                'description' => 'Tuyển chọn 6 mẫu tơ tằm Mulberry 28 momme dệt thoi và sợi lanh hữu cơ tự nhiên thoáng mát cho trang phục mùa hè và dạ tiệc.',
                'image' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
                'swatches' => [
                    ['name' => 'Como Mulberry Heavy Silk Satin Champagne', 'weight' => '120 g/m²', 'color' => '#FEF3C7', 'texture' => 'Độ rủ hoàn hảo, phản xạ ánh sáng óng ả'],
                    ['name' => 'Normandie Masters of Linen Chalk White', 'weight' => '210 g/m²', 'color' => '#F1F5F9', 'texture' => 'Vải lanh sợi dài không xơ vụn, thoáng khí'],
                    ['name' => 'French Silk Jacquard Monogram Noir', 'weight' => '140 g/m²', 'color' => '#18181B', 'texture' => 'Dệt hoa văn chìm tinh xảo làm lót áo khoác'],
                    ['name' => 'Raw Silk Shantung Emerald Noir', 'weight' => '160 g/m²', 'color' => '#064E3B', 'texture' => 'Vân tơ tằm thô độc bản, phong cách nghệ sĩ'],
                    ['name' => 'Linen-Silk Blend Sky Azure', 'weight' => '180 g/m²', 'color' => '#93C5FD', 'texture' => 'Sự kết hợp giữa độ đứng của lanh và mượt của lụa'],
                    ['name' => 'Habotai Silk Lining Slate Gray', 'weight' => '85 g/m²', 'color' => '#64748B', 'texture' => 'Lụa Habotai siêu nhẹ, êm ái trên làn da']
                ],
                'deposit_fee' => 300000,
                'shipping_time' => 'Giao hỏa tốc trong 24 giờ tại Hà Nội & TP.HCM'
            ]
        ];

        return response()->json([
            'success' => true,
            'swatch_boxes' => $boxes,
            'service_perks' => [
                'Hộp sơn mài mini lót nhung chứa các mẫu vải kích thước tiêu chuẩn 15cm x 15cm viền vắt sổ thủ công.',
                'Kèm kính lúp phóng đại quang học 10x và găng tay lụa trắng để Quý khách soi chi tiết vi sợi vải.',
                'Phí giữ chỗ 300.000₫ sẽ được hoàn trả 100% bằng voucher mua hàng ngay khi đặt may bất kỳ trang phục nào.'
            ]
        ]);
    }

    /**
     * Order a Swatch Box delivery to customer's home
     */
    public function orderBox(Request $request)
    {
        $request->validate([
            'box_id' => 'required|string',
            'customer_name' => 'required|string|max:100',
            'phone' => 'required|string',
            'delivery_address' => 'required|string',
            'appointment_date' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $orderCode = 'SWATCH-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Yêu cầu giao Hộp Thử Mẫu Vải Trực Tiếp Tại Gia đã được tiếp nhận thành công.',
            'order' => [
                'order_code' => $orderCode,
                'box_id' => $request->box_id,
                'recipient_name' => $request->customer_name,
                'phone' => $request->phone,
                'address' => $request->delivery_address,
                'appointment_date' => $request->appointment_date ?: 'Giao hỏa tốc 24 giờ',
                'deposit_amount' => 300000,
                'rebate_coupon_code' => 'REBATE-' . strtoupper(substr(md5($orderCode), 0, 6)),
                'status' => 'DISPATCH_PENDING_WHITE_GLOVE',
                'created_at' => now()->toIso8601String(),
                'hash' => hash('sha256', $orderCode . now()->timestamp)
            ]
        ]);
    }
}
