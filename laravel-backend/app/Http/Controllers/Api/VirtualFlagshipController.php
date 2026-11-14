<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VirtualFlagshipController extends Controller
{
    /**
     * Get 3D Virtual Flagship room coordinates, sensory audioscapes, and interactive hotspots
     */
    public function getFlagshipSpaces()
    {
        $spaces = [
            'grand_rotunda' => [
                'id' => 'grand_rotunda',
                'name' => 'The Grand Noir Rotunda (Sảnh Vòm Di Sản)',
                'theme' => 'Không gian đá cẩm thạch đen Nero Marquina và trần kính vòm đón ánh sáng tự nhiên',
                'ambient_sound' => 'Tiếng đàn Cello trầm ấm độc bản & tiếng nước chảy tuần hoàn nhẹ',
                'image_panorama' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=1200&auto=format&fit=crop',
                'featured_mannequin' => 'The Sovereign 24K Gold-Thread Tuxedo',
                'interactive_hotspots' => [
                    [
                        'id' => 'spot-01',
                        'title' => 'Tác Phẩm Trung Tâm: Áo Tuxedo Dệt Chỉ Vàng 24K',
                        'description' => 'Kiệt tác được dệt từ len Scabal Super 180s pha vàng 24K nguyên chất của Anh Quốc.',
                        'pos_x' => '48%',
                        'pos_y' => '42%',
                        'action' => 'VIEW_PRODUCT_DETAIL',
                        'target_url' => '/secret-vault'
                    ],
                    [
                        'id' => 'spot-02',
                        'title' => 'Bàn Giám Định Khứu Giác Nước Hoa Haute Parfumerie',
                        'description' => 'Thử nghiệm 4 nốt hương Extrait de Parfum nguyên chất đựng trong lọ pha lê đen.',
                        'pos_x' => '22%',
                        'pos_y' => '65%',
                        'action' => 'TRY_SCENT_PROFILER',
                        'target_url' => '/scent-profiler'
                    ],
                    [
                        'id' => 'spot-03',
                        'title' => 'Kính Soi Thực Tế Ảo Kính Mắt & Kim Hoàn AR',
                        'description' => 'Ướm thử kính Titanium và vòng cổ kim cương tự nhiên Baguette.',
                        'pos_x' => '76%',
                        'pos_y' => '58%',
                        'action' => 'LAUNCH_AR_MIRROR',
                        'target_url' => '/virtual-mirror'
                    ]
                ]
            ],
            'private_salon' => [
                'id' => 'private_salon',
                'name' => 'The Private Salon & Fitting Suite (Phòng Thử Đồ Thượng Khách)',
                'theme' => 'Ốp gỗ óc chó hun khói kết hợp sofa da bê mộc phong cách Mid-Century French',
                'ambient_sound' => 'Hương trầm Noir Kyara hun khói thoảng trong không gian tĩnh mịch',
                'image_panorama' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop',
                'featured_mannequin' => 'The Midnight Noir Cashmere Trench',
                'interactive_hotspots' => [
                    [
                        'id' => 'spot-04',
                        'title' => 'Gương Thử Đồ Layering 3D & May Đo Thông Số',
                        'description' => 'Mô phỏng phối đa tầng và đồng bộ 14 thông số may đo giải phẫu học cá nhân.',
                        'pos_x' => '52%',
                        'pos_y' => '38%',
                        'action' => 'FITTING_ROOM_ACCESS',
                        'target_url' => '/fitting-room'
                    ],
                    [
                        'id' => 'spot-05',
                        'title' => 'Tủ Mẫu Vải Xúc Giác & Hộp Sơn Mài Mini',
                        'description' => 'Mẫu vải len Cashmere Loro Piana và lụa Como ủ lạnh tự nhiên.',
                        'pos_x' => '82%',
                        'pos_y' => '62%',
                        'action' => 'ORDER_SWATCH_BOX',
                        'target_url' => '/swatch-box'
                    ]
                ]
            ],
            'archival_vault' => [
                'id' => 'archival_vault',
                'name' => 'The Cryptographic Archival Vault (Hầm Lưu Trữ Tuyệt Tác Kín)',
                'theme' => 'Không gian kim loại nguyên khối chống đạn với tủ trưng bày khí trơ bảo tồn vải vĩnh cửu',
                'ambient_sound' => 'Tiếng khóa cơ học Thụy Sĩ tích tắc định kỳ',
                'image_panorama' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop',
                'featured_mannequin' => 'Archival Briefcase & Rare Capsule Editions',
                'interactive_hotspots' => [
                    [
                        'id' => 'spot-06',
                        'title' => 'Trụ Kính Bảo Tồn Cặp Xách Titan Hàng Không',
                        'description' => 'Phiên bản giới hạn nạm đá Sapphire chống trầy xước và bảo mật mã số cơ học.',
                        'pos_x' => '50%',
                        'pos_y' => '48%',
                        'action' => 'INSPECT_SECRET_VAULT',
                        'target_url' => '/secret-vault'
                    ],
                    [
                        'id' => 'spot-07',
                        'title' => 'Bàn Ký Văn Tự Chuyển Nhượng Quyền Sở Hữu',
                        'description' => 'Khắc dấu băm blockchain và chuyển giao di sản sang chủ nhân mới.',
                        'pos_x' => '25%',
                        'pos_y' => '55%',
                        'action' => 'TRANSFER_DEED',
                        'target_url' => '/ownership-transfer'
                    ]
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'spaces' => $spaces,
            'experience_guide' => [
                'Kéo chuột hoặc vuốt chạm để xoay góc nhìn toàn cảnh không gian Flagship.',
                'Bấm vào các điểm Hotspot sáng vàng để tương tác với các tác phẩm trưng bày.',
                'Chuyển đổi linh hoạt giữa Sảnh Vòm, Phòng Thử VIP và Hầm Lưu Trữ Kín.'
            ]
        ]);
    }

    /**
     * Request Private Virtual Concierge live walkthrough session (1-on-1 video call)
     */
    public function requestWalkthrough(Request $request)
    {
        $request->validate([
            'room_id' => 'required|string',
            'client_name' => 'required|string|max:100',
            'client_phone' => 'required|string',
            'preferred_time' => 'required|string',
            'notes' => 'nullable|string'
        ]);

        $sessionCode = 'WALK-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Lịch hẹn tham quan ảo 1-1 cùng Giám đốc trải nghiệm đã được xác lập.',
            'session' => [
                'session_code' => $sessionCode,
                'room' => $request->room_id,
                'client_name' => $request->client_name,
                'preferred_time' => $request->preferred_time,
                'concierge_lead' => 'Trưởng Quản Gia TVC Flagship',
                'access_link' => 'https://atelier.tvc-shop.com/virtual-room/' . $sessionCode,
                'created_at' => now()->toIso8601String(),
                'hash' => hash('sha256', $sessionCode . now()->timestamp)
            ]
        ]);
    }
}
