<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class RunwayForecastController extends Controller
{
    /**
     * Get global couture trend forecasting dossiers and master atelier cartography
     */
    public function getForecastData()
    {
        $seasons = [
            'fw_2026' => [
                'code' => 'FW-2026-ARCHITECTURAL',
                'title' => 'Fall/Winter 2026: The Sovereign Monolith',
                'aesthetic_movement' => 'Architectural Brutalism meets Quiet Aristocracy',
                'color_forecast' => [
                    ['name' => 'Obsidian Charcoal', 'hex' => '#0F172A', 'trend_score' => 98],
                    ['name' => 'Piedmont Truffle Brown', 'hex' => '#451A03', 'trend_score' => 94],
                    ['name' => 'Frosted Alabaster', 'hex' => '#F1F5F9', 'trend_score' => 91],
                    ['name' => 'Deep Emerald Noir', 'hex' => '#064E3B', 'trend_score' => 88]
                ],
                'key_silhouettes' => [
                    'Ve áo khoác cực đại mở rộng (Monumental Peak Lapels)',
                    'Áo măng-tô hạ vai cấu trúc kén tằm (Cocoon Architectural Overcoats)',
                    'Quần âu may đo ống đứng lưng cao cạp đôi (Double-Pleated High-Rise Trousers)'
                ],
                'material_innovations' => 'Cashmere dệt thoi pha sợi carbon tàng hình giữ nhiệt siêu nhẹ, tơ tằm Mulberry phủ nano chống thấm sương mù.',
                'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop'
            ],
            'ss_2027' => [
                'code' => 'SS-2027-MEDITERRANEAN',
                'title' => 'Spring/Summer 2027: L’Ombre et La Lumière',
                'aesthetic_movement' => 'Ethereal Minimalism & Riviera Riviera Drapery',
                'color_forecast' => [
                    ['name' => 'Capri Sea Mist Azure', 'hex' => '#93C5FD', 'trend_score' => 96],
                    ['name' => 'Tuscan Linen Champagne', 'hex' => '#FEF3C7', 'trend_score' => 93],
                    ['name' => 'Basalt Slate Gray', 'hex' => '#475569', 'trend_score' => 89],
                    ['name' => 'Raw Silk Ivory', 'hex' => '#FFFBEB', 'trend_score' => 87]
                ],
                'key_silhouettes' => [
                    'Áo khoác Safari lanh dệt tay cúc sừng trâu (Artisanal Linen Safari Jackets)',
                    'Đầm lụa cổ đổ bất đối xứng phong cách Hy Lạp cổ điển',
                    'Bộ suit Tropical Wool không đệm vai thoáng khí tối đa'
                ],
                'material_innovations' => 'Sợi lanh Normandie hữu cơ thu hoạch thủ công kết hợp tơ tằm Habotai Como ủ lạnh tự nhiên.',
                'image' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'
            ]
        ];

        $globalAteliers = [
            [
                'id' => 'paris-atelier',
                'city' => 'Paris',
                'country' => 'Pháp',
                'specialty' => 'Haute Couture Draping & Thêu Kim Tuyến Cung Đình',
                'head_artisan' => 'Maitre Jean-Luc Moreau (38 năm kinh nghiệm Lesage)',
                'lat' => 48.8566,
                'lng' => 2.3522,
                'current_capacity' => '8 đơn may đo / tháng'
            ],
            [
                'id' => 'savile-row',
                'city' => 'London (Savile Row)',
                'country' => 'Anh Quốc',
                'specialty' => 'Bespoke Tailoring Cấu Trúc Áo Vest Hoàng Gia 3 Mảnh',
                'head_artisan' => 'Sir Alistair Sterling (Savile Row Bespoke Master)',
                'lat' => 51.5113,
                'lng' => -0.1402,
                'current_capacity' => '6 đơn may đo / tháng'
            ],
            [
                'id' => 'biella-italy',
                'city' => 'Biella & Como',
                'country' => 'Ý',
                'specialty' => 'Kỹ Nghệ Dệt Thoi Cashmere & Tơ Tằm Thượng Hạng',
                'head_artisan' => 'Signore Lorenzo Ferri (Piedmont Master Weaver)',
                'lat' => 45.5629,
                'lng' => 8.0583,
                'current_capacity' => 'Cung cấp vải độc quyền toàn cầu'
            ],
            [
                'id' => 'tokyo-ginza',
                'city' => 'Tokyo (Ginza)',
                'country' => 'Nhật Bản',
                'specialty' => 'Đường Cắt Kỷ Hà & May Đo Tối Giản Vị Lai',
                'head_artisan' => 'Sensei Kenji Takahashi (Ginza Tailoring Guild)',
                'lat' => 35.6719,
                'lng' => 139.7648,
                'current_capacity' => '10 đơn may đo / tháng'
            ],
            [
                'id' => 'hanoi-flagship',
                'city' => 'Hà Nội (Tràng Tiền)',
                'country' => 'Việt Nam',
                'specialty' => 'Private Salon 1-1, Thêu Monogram Dát Vàng & Nghệ Thuật Sơn Mài',
                'head_artisan' => 'Nghệ nhân ưu tú Vũ Trọng Cường',
                'lat' => 21.0254,
                'lng' => 105.8544,
                'current_capacity' => '12 lịch hẹn VIP / tuần'
            ]
        ];

        return response()->json([
            'success' => true,
            'seasons' => $seasons,
            'global_ateliers' => $globalAteliers,
            'trend_index' => [
                'quiet_luxury_growth' => '+42.5%',
                'sustainable_traceable_demand' => '+68.0%',
                'bespoke_craftsmanship_interest' => '+54.2%'
            ]
        ]);
    }

    /**
     * Request pre-allocation / design briefing for upcoming runway season
     */
    public function requestRunwayBriefing(Request $request)
    {
        $request->validate([
            'season_code' => 'required|string',
            'atelier_id' => 'required|string',
            'client_name' => 'required|string|max:100',
            'client_phone' => 'required|string',
            'client_email' => 'required|email',
            'aesthetic_notes' => 'nullable|string',
        ]);

        $dossierCode = 'FCAST-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Hồ sơ giữ chỗ bản phác thảo Runway trước sàn diễn đã được ghi danh thành công.',
            'briefing_dossier' => [
                'dossier_code' => $dossierCode,
                'season_code' => $request->season_code,
                'allocated_atelier' => $request->atelier_id,
                'client_name' => $request->client_name,
                'priority_queue' => 'TIER_1_EARLY_ACCESS',
                'scheduled_review' => 'Trước 14 ngày mở màn Tuần lễ Thời trang Quốc tế',
                'created_at' => now()->toIso8601String(),
                'hash' => hash('sha256', $dossierCode . now()->timestamp)
            ]
        ]);
    }
}
