<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ColorAnalysisController extends Controller
{
    /**
     * Get Color Analysis schema: undertone diagnostic questions & seasonal palettes
     */
    public function getAnalysisSchema()
    {
        $questions = [
            [
                'id' => 'vein_color',
                'title' => 'Màu sắc mạch máu dưới cổ tay dưới ánh sáng tự nhiên',
                'description' => 'Quan sát mặt trong cổ tay dưới ánh sáng ban ngày tự nhiên (không qua đèn vàng hoặc đèn led huỳnh quang).',
                'options' => [
                    ['value' => 'cool', 'label' => 'Mạch máu có màu xanh lam hoặc tím thẫm (Blue/Purple)', 'hint' => 'Dấu hiệu đặc trưng của Cool Undertone'],
                    ['value' => 'warm', 'label' => 'Mạch máu có màu xanh lá cây hoặc ô-liu (Green/Olive)', 'hint' => 'Dấu hiệu đặc trưng của Warm Undertone'],
                    ['value' => 'neutral', 'label' => 'Khó phân biệt, hòa trộn giữa xanh dương và xanh lục', 'hint' => 'Dấu hiệu của Neutral Undertone']
                ]
            ],
            [
                'id' => 'jewelry_preference',
                'title' => 'Phản ứng của làn da khi đeo trang sức kim loại',
                'description' => 'Chất liệu kim loại nào giúp gương mặt và làn da của bạn bừng sáng và tôn nét sang trọng nhất?',
                'options' => [
                    ['value' => 'cool', 'label' => 'Bạc nguyên chất (Silver), Vàng trắng (White Gold) hoặc Bạch kim (Platinum)', 'hint' => 'Ánh kim lạnh tôn vinh sắc thái trong trẻo'],
                    ['value' => 'warm', 'label' => 'Vàng vàng (Yellow Gold), Vàng đồng cổ hoặc Rose Gold', 'hint' => 'Ánh kim ấm tôn vinh chiều sâu sang trọng'],
                    ['value' => 'neutral', 'label' => 'Cả bạc sáng lẫn vàng 18K đều hài hòa và đẹp như nhau', 'hint' => 'Sắc tố cân bằng lưỡng tính']
                ]
            ],
            [
                'id' => 'sun_reaction',
                'title' => 'Phản ứng của làn da khi tiếp xúc với ánh nắng mặt trời gắt',
                'description' => 'Khi đi biển hoặc hoạt động ngoài trời nắng khoảng 30 phút mà không che chắn kỹ:',
                'options' => [
                    ['value' => 'cool', 'label' => 'Dễ bị ửng đỏ, bỏng rát, hiếm khi ngăm đen hoặc rám nắng rất chậm', 'hint' => 'Hàm lượng Melanin bề mặt thấp'],
                    ['value' => 'warm', 'label' => 'Nhanh chóng chuyển sang màu nâu mật ong, rám nắng đồng màu và hiếm khi cháy đỏ', 'hint' => 'Hàm lượng Pheomelanin/Eumelanin phong phú'],
                    ['value' => 'neutral', 'label' => 'Ban đầu ửng hồng nhẹ, sau đó dần chuyển thành làn da rám nắng ấm áp', 'hint' => 'Biên độ thích ứng sắc tố trung hòa']
                ]
            ],
            [
                'id' => 'white_shirt_contrast',
                'title' => 'Thử nghiệm đối chiếu sắc thái Áo Sơ-mi Trắng',
                'description' => 'Khi bạn áp một tấm vải sát khuôn mặt mộc, gam màu nào giúp gương mặt trông rạng rỡ và có thần thái nhất?',
                'options' => [
                    ['value' => 'cool', 'label' => 'Trắng tinh khiết nguyên bản (Pure Crisp White / Stark White)', 'hint' => 'Làm nổi bật đường nét sắc sảo'],
                    ['value' => 'warm', 'label' => 'Trắng ngà, Trắng kem hoặc Vani ấm (Off-White / Cream / Ivory)', 'hint' => 'Tạo hiệu ứng mềm mại và ấm áp tự nhiên'],
                    ['value' => 'neutral', 'label' => 'Cả hai sắc độ trắng đều không làm gương mặt bị tái hay xỉn màu', 'hint' => 'Phù hợp đa dạng dải sắc độ']
                ]
            ]
        ];

        $palettes = [
            'winter_noir' => [
                'code' => 'WINTER-NOIR',
                'season' => 'Deep Winter (Đông Huyền Bí)',
                'undertone' => 'Cool Undertone',
                'contrast' => 'High Contrast / Sắc nét tương phản cao',
                'tagline' => 'Sự uy nghi, tĩnh lặng và thanh thoát tối thượng của phong cách Cold Luxury',
                'hex_colors' => [
                    ['name' => 'Obsidian Black', 'hex' => '#0A0A0A', 'role' => 'Màu sắc chủ đạo / Bộ vest & Áo khoác dạ'],
                    ['name' => 'Stark Crisp White', 'hex' => '#F8FAFC', 'role' => 'Tương phản ve áo & Sơ-mi poplin'],
                    ['name' => 'Royal Midnight Navy', 'hex' => '#0F172A', 'role' => 'Tông màu quyền lực thay thế đen'],
                    ['name' => 'Deep Emerald Noir', 'hex' => '#064E3B', 'role' => 'Điểm nhấn trang phục dạ tiệc'],
                    ['name' => 'Frosted Platinum', 'hex' => '#CBD5E1', 'role' => 'Phụ kiện kim loại & Khăn lụa']
                ],
                'avoid_colors' => ['Vàng mù tạt (Mustard)', 'Cam đất (Terracotta)', 'Nâu camel ngả vàng', 'Xanh rêu ấm'],
                'style_guidelines' => 'Lựa chọn các thiết kế có đường cắt kỷ hà chuẩn xác (sharp tailoring), chất liệu đứng phom như Len may đo Super 180s hoặc Cashmere hai mặt, ưu tiên trang sức Platinum và khuy kim loại PVD đen mờ.',
                'recommended_categories' => ['Trench Coat Noir', 'Tuxedo', 'Mulberry Silk Shirt', 'Titanium Accessories']
            ],
            'autumn_heritage' => [
                'code' => 'AUTUMN-HERITAGE',
                'season' => 'Warm Autumn (Thu Di Sản)',
                'undertone' => 'Warm Undertone',
                'contrast' => 'Rich Muted Warmth / Trầm ấm vương giả',
                'tagline' => 'Hơi thở Old Money trầm lắng, gợi nhắc những thư viện gỗ sồi và điền trang Châu Âu',
                'hex_colors' => [
                    ['name' => 'Bespoke Camel Brown', 'hex' => '#78350F', 'role' => 'Áo choàng Cashmere & Giày Oxford'],
                    ['name' => 'Tuscan Olive Green', 'hex' => '#3F4F38', 'role' => 'Áo khoác dã ngoại & Len dệt kim'],
                    ['name' => 'Warm Terracotta Rust', 'hex' => '#9A3412', 'role' => 'Cà vạt lụa & Điểm nhấn khăn túi ngực'],
                    ['name' => 'Antique Cream Ivory', 'hex' => '#FEF3C7', 'role' => 'Sơ mi lụa tơ tằm dệt thủ công'],
                    ['name' => 'Espresso Chocolate', 'hex' => '#291811', 'role' => 'Quần âu may đo & Cặp da bê Full-grain']
                ],
                'avoid_colors' => ['Hồng neon', 'Xanh lam pastel lạnh', 'Xám xi-măng lạnh', 'Tím cà ngả xanh'],
                'style_guidelines' => 'Tôn vinh các chất liệu có kết cấu bề mặt giàu xúc giác như dạ Tweed Scotland, nhung kẻ Corduroy, da lộn Cashmere Suede, phối cùng khuy sừng trâu Thụy Sĩ và trang sức vàng Vintage 18K.',
                'recommended_categories' => ['Tweed Blazer', 'Cashmere Knitwear', 'Corduroy Trousers', 'Vintage Leather Goods']
            ],
            'summer_minimalist' => [
                'code' => 'SUMMER-MINIMALIST',
                'season' => 'Cool Summer (Hè Tối Giản)',
                'undertone' => 'Cool / Soft Undertone',
                'contrast' => 'Low to Medium Soft Contrast / Dịu êm thanh khiết',
                'tagline' => 'Phong thái Quiet Luxury nhẹ nhàng, thanh tao tựa buổi sáng sương mù bên hồ Como',
                'hex_colors' => [
                    ['name' => 'Slate Ash Gray', 'hex' => '#475569', 'role' => 'Bộ suit mùa hè & Blazer không cấu trúc'],
                    ['name' => 'Powder Sky Blue', 'hex' => '#93C5FD', 'role' => 'Sơ mi linen & Khăn lụa quàng cổ'],
                    ['name' => 'Dusty Mauve Taupe', 'hex' => '#71717A', 'role' => 'Áo polo dệt kim lụa'],
                    ['name' => 'Chalk Soft White', 'hex' => '#F1F5F9', 'role' => 'Quần âu lanh & Váy đầm suông'],
                    ['name' => 'Deep Mineral Charcoal', 'hex' => '#334155', 'role' => 'Áo măng-tô lửng & Phụ kiện da']
                ],
                'avoid_colors' => ['Cam rực rỡ', 'Vàng tươi gắt', 'Đỏ bầm quá ấm', 'Nâu sô-cô-la ngả vàng'],
                'style_guidelines' => 'Lý tưởng cho phong cách Quiet Luxury tối giản không phô trương. Sử dụng vải Lanh Ý (Italian Linen), lụa Habotai mỏng nhẹ, len mỏng Tropical Wool tông màu khói mờ ảo.',
                'recommended_categories' => ['Linen Overshirt', 'Tropical Wool Suits', 'Silk Habotai Dresses']
            ],
            'spring_luminary' => [
                'code' => 'SPRING-LUMINARY',
                'season' => 'Light Spring (Xuân Rạng Ngời)',
                'undertone' => 'Warm / Bright Undertone',
                'contrast' => 'Vibrant Warm Luminosity / Tươi sáng tràn đầy năng lượng',
                'tagline' => 'Khí chất thượng lưu hiện đại, phóng khoáng như ánh nắng trên du thuyền Địa Trung Hải',
                'hex_colors' => [
                    ['name' => 'Warm Honey Sand', 'hex' => '#D97706', 'role' => 'Áo khoác safari & Quần chinos cao cấp'],
                    ['name' => 'Warm Porcelain White', 'hex' => '#FFFBEB', 'role' => 'Sơ mi cổ Cuba & Đầm lụa xếp nếp'],
                    ['name' => 'Aquamarine Azure', 'hex' => '#0284C7', 'role' => 'Khăn quàng lụa & Điểm nhấn tay áo'],
                    ['name' => 'Soft Coral Blush', 'hex' => '#FB7185', 'role' => 'Trang phục dạ tiệc mùa hè'],
                    ['name' => 'Cognac Tan Leather', 'hex' => '#B45309', 'role' => 'Giày Loafer thủ công & Thắt lưng da Ý']
                ],
                'avoid_colors' => ['Đen tuyền quá u tối', 'Xám chuột buồn tẻ', 'Tím đậm ma mị'],
                'style_guidelines' => 'Kết hợp sự tươi sáng của bảng màu Địa Trung Hải với các đường cắt may đo chuẩn mực. Rất phù hợp với trang phục nghỉ dưỡng Resort Wear và dạ tiệc hoàng hôn trên du thuyền.',
                'recommended_categories' => ['Resort Linen Sets', 'Handmade Loafers', 'Silk Pocket Squares']
            ]
        ];

        return response()->json([
            'success' => true,
            'diagnostic_questions' => $questions,
            'seasonal_palettes' => $palettes
        ]);
    }

    /**
     * Compute diagnosed season based on user answers
     */
    public function diagnose(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.vein_color' => 'required|string',
            'answers.jewelry_preference' => 'required|string',
            'answers.sun_reaction' => 'required|string',
            'answers.white_shirt_contrast' => 'required|string',
        ]);

        $answers = $request->input('answers');
        $scores = ['cool' => 0, 'warm' => 0, 'neutral' => 0];

        foreach ($answers as $key => $val) {
            if (isset($scores[$val])) {
                $scores[$val]++;
            }
        }

        // Logic to determine seasonal palette
        $dominantUndertone = 'neutral';
        if ($scores['cool'] > $scores['warm'] && $scores['cool'] >= $scores['neutral']) {
            $dominantUndertone = 'cool';
        } elseif ($scores['warm'] > $scores['cool'] && $scores['warm'] >= $scores['neutral']) {
            $dominantUndertone = 'warm';
        }

        if ($dominantUndertone === 'cool') {
            $recommendedKey = ($answers['white_shirt_contrast'] === 'cool') ? 'winter_noir' : 'summer_minimalist';
        } elseif ($dominantUndertone === 'warm') {
            $recommendedKey = ($answers['sun_reaction'] === 'warm') ? 'autumn_heritage' : 'spring_luminary';
        } else {
            // Neutral prefers winter_noir or summer_minimalist based on white preference
            $recommendedKey = ($answers['white_shirt_contrast'] === 'cool') ? 'winter_noir' : 'autumn_heritage';
        }

        return response()->json([
            'success' => true,
            'dominant_undertone' => $dominantUndertone,
            'scores' => $scores,
            'recommended_palette_key' => $recommendedKey,
            'diagnostic_timestamp' => now()->toIso8601String(),
            'certificate_code' => 'COLOR-' . strtoupper(substr(md5(uniqid()), 0, 8))
        ]);
    }
}
