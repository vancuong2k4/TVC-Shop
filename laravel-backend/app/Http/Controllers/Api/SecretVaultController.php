<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SecretVaultController extends Controller
{
    /**
     * Get VIP Secret Vault catalog and tiered perks
     */
    public function getVaultData(Request $request)
    {
        $tiers = [
            'silver' => [
                'name' => 'Silver Atelier',
                'min_points' => 1000,
                'min_spend' => 15000000,
                'benefits' => [
                    'Ưu tiên giữ suất đặt trước Runway Capsule 24h trước khi mở bán đại chúng',
                    'Miễn phí dịch vụ bảo dưỡng & hấp thơm hương trầm trọn đời (2 lần/năm)',
                    'Bộ hộp quà tặng Cold Luxury tiêu chuẩn cho tất cả đơn hàng',
                ],
                'discount_percentage' => 5,
                'concierge_level' => 'Digital Concierge 24/7'
            ],
            'gold' => [
                'name' => 'Gold Heritage',
                'min_points' => 3000,
                'min_spend' => 45000000,
                'benefits' => [
                    'Mở khóa Hầm Lưu Trữ Tuyệt Tác Kín (Archival Vault Releases)',
                    'Khắc thêu Monogram dát vàng 24K miễn phí trên tất cả trang phục đặt may',
                    'Tặng vé mời hàng ghế đầu (Front Row) tại sàn diễn thường niên TVC Atelier',
                    'Ưu đãi đặc quyền 10% trọn đời trên toàn bộ danh mục sản phẩm',
                ],
                'discount_percentage' => 10,
                'concierge_level' => 'Dedicated Master Tailor & Personal Stylist'
            ],
            'diamond' => [
                'name' => 'Diamond Sovereign',
                'min_points' => 7000,
                'min_spend' => 100000000,
                'benefits' => [
                    'Quyền mua thiết kế One-of-a-Kind độc bản duy nhất 01 chiếc trên toàn cầu',
                    'Dịch vụ Chuyên cơ & Xe Limousine riêng đưa đón đến Private Salon Hà Nội / TP.HCM',
                    'Hộp quà sơn mài Bespoke thẻ kim loại Titanium nạp sẵn 5.000.000₫ mỗi dịp sinh nhật',
                    'Ưu đãi đặc quyền 15% trọn đời và đặc quyền yêu cầu xưởng may thiết kế riêng theo bản phác thảo cá nhân',
                ],
                'discount_percentage' => 15,
                'concierge_level' => 'Private Creative Director Consultation (1-on-1)'
            ],
        ];

        $vaultItems = [
            [
                'id' => 'vlt-001',
                'code' => 'ARC-NOIR-OVERCOAT-99',
                'title' => 'The Midnight Noir Archival Cashmere Trench',
                'required_tier' => 'gold',
                'year' => 'Winter Archive 2024 Edition',
                'stock_left' => 3,
                'total_produced' => 10,
                'price' => 28500000,
                'vault_price' => 24500000,
                'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1000&auto=format&fit=crop',
                'fabric' => '100% Loro Piana Double-faced Cashmere (Ý)',
                'hardware' => 'Cúc sừng trâu Thụy Sĩ gọt tay & Lót lụa Cupro hoa văn Monogram chìm',
                'description' => 'Mẫu măng-tô huyền thoại từng làm nên tên tuổi sàn diễn TVC Paris Thu Đông, được tái bản với số lượng cực hạn dành riêng cho thành viên Gold và Diamond.',
                'tags' => ['Archival Piece', 'Handcrafted', 'Loro Piana']
            ],
            [
                'id' => 'vlt-002',
                'code' => 'SOV-DIAMOND-SUIT-01',
                'title' => 'Sovereign 24K Gold-Thread Bespoke Tuxedo',
                'required_tier' => 'diamond',
                'year' => 'Atelier Haute Couture 2026',
                'stock_left' => 1,
                'total_produced' => 3,
                'price' => 52000000,
                'vault_price' => 45000000,
                'image' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000&auto=format&fit=crop',
                'fabric' => 'Scabal Super 180s Wool dệt sợi vàng 24K nguyên chất từ Anh Quốc',
                'hardware' => 'Nẹp ve áo lụa Satin Mulberry Como dệt tay, cúc bọc vàng nguyên khối',
                'description' => 'Đỉnh cao của nghệ thuật may đo thủ công Savile Row kết hợp chất liệu thượng đỉnh đan chỉ vàng 24K phản chiếu ánh sáng tự nhiên. Chỉ mở quyền mua cho cấp bậc Diamond Sovereign.',
                'tags' => ['One-of-a-Kind', 'Gold Thread', 'Savile Row']
            ],
            [
                'id' => 'vlt-003',
                'code' => 'SILV-SILK-BLOUSE-07',
                'title' => 'Sculptural Asymmetric Mulberry Silk Blouse',
                'required_tier' => 'silver',
                'year' => 'Pre-Fall Capsule Archive',
                'stock_left' => 5,
                'total_produced' => 25,
                'price' => 14200000,
                'vault_price' => 12500000,
                'image' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
                'fabric' => '100% Tơ tằm Mulberry 28 momme dệt thoi tại Ý',
                'hardware' => 'Khuy xà cừ trắng Akoya Nhật Bản 14mm',
                'description' => 'Thiết kế cổ đổ bất đối xứng mang phong cách tối giản điêu khắc, tôn vinh làn da và thần thái quý phái trong các buổi dạ tiệc kín đáo.',
                'tags' => ['Mulberry Silk', 'Akoya Shell', 'Minimalist Elegance']
            ],
            [
                'id' => 'vlt-004',
                'code' => 'ARC-TITAN-BRIEFCASE-04',
                'title' => 'The Monolith Matte Titanium Diplomatic Briefcase',
                'required_tier' => 'gold',
                'year' => 'Exclusive Hardware Archive',
                'stock_left' => 2,
                'total_produced' => 8,
                'price' => 36000000,
                'vault_price' => 31000000,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
                'fabric' => 'Da bê mộc Pháp Full-grain kết hợp khung hợp kim Titanium cấp hàng không vũ trụ',
                'hardware' => 'Ổ khóa mã số cơ học Thụy Sĩ nạm đá Sapphire chống trầy xước',
                'description' => 'Cặp xách tài liệu tối giản nguyên khối, bảo vệ tài liệu tuyệt mật và đồng hồ cơ của giới lãnh đạo tài chính với độ bền vĩnh cửu.',
                'tags' => ['Matte Titanium', 'Swiss Lock', 'Full-Grain Leather']
            ]
        ];

        // Determine user tier (mockable or from auth)
        $user = Auth::guard('sanctum')->user();
        $userTier = 'bronze';
        $userPoints = 450;
        $userSpend = 8500000;

        if ($user) {
            // Can calculate from user orders or set default luxury tier
            $userTier = $user->vip_tier ?? 'gold'; // default high tier demo or gold
            $userPoints = 3450;
            $userSpend = 52000000;
        }

        return response()->json([
            'success' => true,
            'user_status' => [
                'current_tier' => $userTier,
                'tier_name' => $tiers[$userTier]['name'] ?? 'Bronze Member',
                'points' => $userPoints,
                'total_spent' => $userSpend,
                'vault_access' => in_array($userTier, ['silver', 'gold', 'diamond']),
            ],
            'tiers_overview' => $tiers,
            'vault_items' => $vaultItems,
            'vault_rules' => [
                'Tất cả vật phẩm trong Hầm Bí Mật chỉ mở bán số lượng giới hạn và không bao giờ tái xuất bản thương mại.',
                'Thành viên phải xác thực mã định danh cá nhân và không được phép bán lại (chống đầu cơ).',
                'Mỗi thành viên chỉ được sở hữu tối đa 01 vật phẩm của mỗi mã lưu trữ.',
                'Sản phẩm được bảo hiểm vận chuyển bằng hòm chống sốc và bàn giao trực tiếp bởi chuyên viên TVC Atelier.'
            ]
        ]);
    }

    /**
     * Request access or acquire an archival vault item
     */
    public function acquireVaultItem(Request $request)
    {
        $request->validate([
            'item_id' => 'required|string',
            'custom_engraving' => 'nullable|string|max:40',
            'delivery_address' => 'required|string',
            'phone' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $orderCode = 'VAULT-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Lệnh mở khóa vật phẩm Hầm Bí Mật đã được tiếp nhận thành công. Quản gia Atelier sẽ liên hệ trực tiếp trong 30 phút.',
            'reservation_details' => [
                'vault_order_code' => $orderCode,
                'item_id' => $request->item_id,
                'engraving' => $request->custom_engraving ? strtoupper($request->custom_engraving) : 'STANDARD COUTURE SEAL',
                'status' => 'RESERVED_PENDING_CONCIERGE_CALL',
                'created_at' => now()->toIso8601String(),
                'security_hash' => hash('sha256', $orderCode . now()->timestamp),
            ]
        ]);
    }
}
