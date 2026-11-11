<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScentProfilerController extends Controller
{
    /**
     * Get olfactory notes directory, fragrance families, and diagnostic questions
     */
    public function getScentCatalog()
    {
        $families = [
            'woody_smoky' => [
                'name' => 'Gỗ Trầm & Khói Lạnh (Woody & Smoky Cold)',
                'vibe' => 'Bí ẩn, thâm trầm, uy quyền và phong thái tĩnh lặng tuyệt đối',
                'description' => 'Những nốt hương sâu thẳm của Gỗ Đàn Hương Mysore, Trầm Hương Kyara hun khói và Rêu Sồi ướt sương đêm.',
                'signature_scent' => 'Noir Kyara Extrait de Parfum',
                'key_notes' => ['Gỗ trầm hương Kyara', 'Tuyết tùng Virginia', 'Hương trầm Olibanum', 'Bạch đậu khấu đen'],
                'best_paired_with' => 'Bộ Tuxedo Dạ Hội, Áo Măng-tô Cashmere Đen, Buổi gặp gỡ ngoại giao ban đêm',
                'sillage' => 'Nồng nàn, bền bỉ trên 14 giờ',
                'price' => 8900000
            ],
            'leather_amber' => [
                'name' => 'Da Thuộc & Hổ Phách Cổ Điển (Cuir & Amber Heritage)',
                'vibe' => 'Đẳng cấp Old Money, ấm nồng da bê thuộc thảo mộc và rượu Cognac',
                'description' => 'Sự hòa quyện giữa Da lộn Tuscan mềm mại, Đậu Tonka nướng và Nhựa cây Myrrh cổ xưa bên lò sưởi thư viện.',
                'signature_scent' => 'Cuir Impérial Millésime',
                'key_notes' => ['Da bê mộc Tuscan', 'Hổ phách Baltic', 'Lá thuốc lá Cuba', 'Vani Madagascar hữu cơ'],
                'best_paired_with' => 'Áo khoác dạ Tweed Scotland, Giày Oxford gọt tay, Tiệc xì gà và rượu vang',
                'sillage' => 'Ấm áp, quyến rũ trên 12 giờ',
                'price' => 7800000
            ],
            'iris_mineral' => [
                'name' => 'Diên Vĩ & Khoáng Thạch Lạnh (Iris & Mineral Ozone)',
                'vibe' => 'Tối giản thuần khiết, tinh khôi tựa đá cẩm thạch trắng và gió tuyết hồ Como',
                'description' => 'Bột rễ Diên Vĩ Florence quý hiếm ủ 3 năm, xạ hương trắng mềm mại và hạt tiêu hồng lấp lánh như sương mai.',
                'signature_scent' => 'Iris Pallida Pure Sillage',
                'key_notes' => ['Bột rễ Diên vĩ Florence', 'Xạ hương trắng Ambrette', 'Khoáng thạch hoa cương', 'Hạt tiêu hồng Bourbon'],
                'best_paired_with' => 'Sơ-mi lụa tơ tằm trắng, Bộ suit Tropical Wool xám khói, Buổi đàm phán ký kết ban ngày',
                'sillage' => 'Thanh khiết, lưu hương cận kề 10 giờ',
                'price' => 9500000
            ],
            'citrus_aromatic' => [
                'name' => 'Cam Bergamot & Thảo Mộc Địa Trung Hải (Verdant Citrus)',
                'vibe' => 'Phóng khoáng, tự do và ngập tràn năng lượng sống trên du thuyền Capri',
                'description' => 'Vỏ Cam Bergamot vùng Calabria ép lạnh, lá Xô Thơm Clary Sage và muối biển Địa Trung Hải trong vắt.',
                'signature_scent' => 'Riviera Sole di Capri',
                'key_notes' => ['Cam Bergamot Calabria', 'Cây Xô thơm Clary Sage', 'Hương Thảo Tuscany', 'Muối biển hoa tuyết'],
                'best_paired_with' => 'Bộ đồ Linen trắng ngà nghỉ dưỡng, Kính râm gọng đồi mồi, Du ngoạn biển hè',
                'sillage' => 'Sảng khoái, lan tỏa thanh lịch 8 giờ',
                'price' => 6400000
            ]
        ];

        $quizQuestions = [
            [
                'id' => 'atmosphere',
                'title' => 'Không gian nào khơi gợi nguồn cảm hứng và sự an yên sâu thẳm nhất trong bạn?',
                'options' => [
                    ['value' => 'woody_smoky', 'label' => 'Thánh đường cổ kính bằng gỗ bách phủ sương mù lúc hoàng hôn buông xuống', 'hint' => 'Thiên hướng nốt Gỗ & Khói thiêng'],
                    ['value' => 'leather_amber', 'label' => 'Thư viện gỗ sồi với ghế da Chesterfield êm ái, nhâm nhi ly rượu vang ấm', 'hint' => 'Thiên hướng Da thuộc & Hổ phách'],
                    ['value' => 'iris_mineral', 'label' => 'Bảo tàng nghệ thuật tối giản ngập tràn ánh sáng và các khối đá cẩm thạch', 'hint' => 'Thiên hướng Diên vĩ & Khoáng thạch'],
                    ['value' => 'citrus_aromatic', 'label' => 'Mũi thuyền buồm lướt trên làn sóng Địa Trung Hải đón cơn gió chanh cam tươi mát', 'hint' => 'Thiên hướng Thảo mộc & Cam chanh']
                ]
            ],
            [
                'id' => 'fabric_texture',
                'title' => 'Cảm giác chạm vào chất liệu vải nào khiến bạn cảm thấy tự tin và quyền lực nhất?',
                'options' => [
                    ['value' => 'woody_smoky', 'label' => 'Dạ Cashmere hai mặt đầm ấm, dày dặn và đứng phom', 'hint' => 'Đòi hỏi mùi hương có cấu trúc mạnh mẽ'],
                    ['value' => 'leather_amber', 'label' => 'Da bê mộc tự nhiên hoặc nhung kẻ phong trần mang hơi hướng di sản', 'hint' => 'Hài hòa với nốt hương ấm giàu chiều sâu'],
                    ['value' => 'iris_mineral', 'label' => 'Lụa tơ tằm Mulberry mềm mượt như nước và vải lanh dệt siêu mịn', 'hint' => 'Cộng hưởng cùng nốt hương phấn sạch sẽ'],
                    ['value' => 'citrus_aromatic', 'label' => 'Vải dệt thoi thoáng khí, cotton Ai Cập mỏng nhẹ mát mẻ', 'hint' => 'Tương thích với nốt hương tươi sáng']
                ]
            ],
            [
                'id' => 'presence_intensity',
                'title' => 'Bạn muốn mùi hương đại diện cho khí chất cá nhân tỏa ra như thế nào?',
                'options' => [
                    ['value' => 'woody_smoky', 'label' => 'Hương thơm đầy uy lực, tạo dấu ấn vương giả ngay khi bước vào căn phòng', 'hint' => 'Độ tỏa hương rộng (Extrait de Parfum)'],
                    ['value' => 'leather_amber', 'label' => 'Hương thơm ấm áp vương vấn, chỉ hiện hữu khi người khác đến gần trò chuyện', 'hint' => 'Độ tỏa hương vừa phải thanh lịch'],
                    ['value' => 'iris_mineral', 'label' => 'Mùi hương sạch sẽ tựa làn da thứ hai (Skin-scent), tinh tế kín đáo', 'hint' => 'Hương phấn khoáng thanh tao'],
                    ['value' => 'citrus_aromatic', 'label' => 'Làn gió tươi mát xua tan mệt mỏi, mang lại cảm giác dễ chịu cho mọi người', 'hint' => 'Độ bay bổng tự nhiên']
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'fragrance_families' => $families,
            'diagnostic_questions' => $quizQuestions
        ]);
    }

    /**
     * Diagnose fragrance profile and sample discovery set request
     */
    public function diagnoseScent(Request $request)
    {
        $request->validate([
            'answers' => 'required|array',
            'answers.atmosphere' => 'required|string',
            'answers.fabric_texture' => 'required|string',
            'answers.presence_intensity' => 'required|string',
        ]);

        $answers = $request->input('answers');
        $tallies = [];
        foreach ($answers as $val) {
            $tallies[$val] = ($tallies[$val] ?? 0) + 1;
        }

        arsort($tallies);
        $matchedFamilyKey = array_key_first($tallies) ?: 'woody_smoky';

        return response()->json([
            'success' => true,
            'matched_family' => $matchedFamilyKey,
            'match_confidence' => 96.5,
            'olfactory_passport_code' => 'SCENT-' . strtoupper(substr(md5(uniqid()), 0, 8)),
            'timestamp' => now()->toIso8601String()
        ]);
    }

    /**
     * Request discovery sample vial set (3 x 5ml)
     */
    public function orderSampleSet(Request $request)
    {
        $request->validate([
            'scent_family' => 'required|string',
            'customer_name' => 'required|string',
            'phone' => 'required|string',
            'address' => 'required|string',
        ]);

        $orderCode = 'VIAL-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Đơn yêu cầu Bộ Mẫu Thử Khứu Giác (3 x 5ml Discovery Set) đã được tiếp nhận.',
            'sample_order' => [
                'order_code' => $orderCode,
                'scent_family' => $request->scent_family,
                'package' => 'Discovery Set 3 ống thủy tinh 5ml đặt trong hộp sơn mài mini',
                'delivery_status' => 'DISPATCHING_WITHIN_24H',
                'price' => 450000,
                'rebate_coupon' => 'Nhận voucher hoàn lại 450.000₫ khi mua chai Full-size',
                'created_at' => now()->toIso8601String()
            ]
        ]);
    }
}
