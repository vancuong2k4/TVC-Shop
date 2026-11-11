<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class StylistQuizController extends Controller
{
    /**
     * Danh sách các câu hỏi khảo sát thẩm mỹ định hình phong cách
     */
    private $quizQuestions = [
        [
            'id' => 'q1',
            'question' => 'Đâu là bảng màu trang phục đại diện cho khí chất của bạn?',
            'description' => 'Màu sắc phản ánh tâm thế và thần thái nội tại của người mặc.',
            'options' => [
                [
                    'value' => 'noir',
                    'title' => 'Noir & Dark Elegance',
                    'subtitle' => 'Đen tuyền, than chì (Charcoal), xám tro và ánh satin bóng mờ',
                    'archetype' => 'architectural_noir'
                ],
                [
                    'value' => 'neutral',
                    'title' => 'Quiet Luxury & Warm Earth',
                    'subtitle' => 'Beige ấm, kem lụa, nâu caramel và trắng ngà (Ivory)',
                    'archetype' => 'quiet_luxury'
                ],
                [
                    'value' => 'contrast',
                    'title' => 'High-Contrast Monochrome',
                    'subtitle' => 'Tương phản đen - trắng nguyên bản sắc sảo, dứt khoát',
                    'archetype' => 'modern_minimalist'
                ],
                [
                    'value' => 'metallic',
                    'title' => 'Nightfall Velvet & Sheen',
                    'subtitle' => 'Xanh midnight sâu thẳm, nhung đen và điểm xuyết kim loại',
                    'archetype' => 'dramatic_evening'
                ]
            ]
        ],
        [
            'id' => 'q2',
            'question' => 'Phom dáng (Silhouette) nào khiến bạn cảm thấy tự tin và quyền lực nhất?',
            'description' => 'Đường cắt may định hình khí chất không gian xung quanh bạn.',
            'options' => [
                [
                    'value' => 'structured',
                    'title' => 'Cắt Cúp Cấu Trúc (Structured Tailoring)',
                    'subtitle' => 'Độn vai sắc nét, ve áo nhọn, eo thon gọn chuẩn mực may đo',
                    'archetype' => 'architectural_noir'
                ],
                [
                    'value' => 'fluid',
                    'title' => 'Mềm Mại Bay Bổng (Fluid & Bias-Cut)',
                    'subtitle' => 'Lụa tơ tằm buông rũ tự nhiên, chuyển động uyển chuyển theo từng bước chân',
                    'archetype' => 'quiet_luxury'
                ],
                [
                    'value' => 'oversized',
                    'title' => 'Phóng Khoáng Tối Giản (Relaxed Minimal)',
                    'subtitle' => 'Dáng suông thoải mái, tỉ lệ ngoại cỡ tinh tế đậm chất đương đại',
                    'archetype' => 'modern_minimalist'
                ],
                [
                    'value' => 'dramatic',
                    'title' => 'Điêu Khắc Dạ Yến (Sculptural Avant-Garde)',
                    'subtitle' => 'Nếp gấp xếp nếp nghệ thuật, đường xẻ cao tạo điểm nhấn hút mắt',
                    'archetype' => 'dramatic_evening'
                ]
            ]
        ],
        [
            'id' => 'q3',
            'question' => 'Không gian nào bạn thường xuyên xuất hiện và cần diện mạo ấn tượng nhất?',
            'description' => 'Trang phục cao cấp hòa hợp hoàn hảo với phong thái không gian.',
            'options' => [
                [
                    'value' => 'boardroom',
                    'title' => 'Phòng Họp Ban Giám Đốc & Hội Nghị Thượng Đỉnh',
                    'subtitle' => 'Yêu cầu phong thái đĩnh đạc, quyền lực và không thỏa hiệp',
                    'archetype' => 'architectural_noir'
                ],
                [
                    'value' => 'private_salon',
                    'title' => 'Private Club, Triển Lãm Nghệ Thuật & Tiệc Trà Thân Mật',
                    'subtitle' => 'Gu thẩm mỹ tinh tế, kín đáo nhưng nhận biết sự sang trọng qua chất vải',
                    'archetype' => 'quiet_luxury'
                ],
                [
                    'value' => 'weekend_stroll',
                    'title' => 'Dạo Phố Trung Tâm, Sân Bay Quốc Tế & Café Riêng Tư',
                    'subtitle' => 'Thư thái, đẳng cấp nhẹ nhàng không cần cố gắng (Effortless)',
                    'archetype' => 'modern_minimalist'
                ],
                [
                    'value' => 'gala_dinner',
                    'title' => 'Gala Dinner, Nhà Hát Lớn & Thảm Đỏ Dạ Tiệc',
                    'subtitle' => 'Lộng lẫy, tỏa sáng dưới ánh đèn chùm pha lê',
                    'archetype' => 'dramatic_evening'
                ]
            ]
        ],
        [
            'id' => 'q4',
            'question' => 'Chất liệu vải nào chạm vào xúc giác mang lại cho bạn cảm xúc đặc biệt?',
            'description' => 'Linh hồn của thời trang Cold Luxury nằm ở phẩm cấp chất liệu nguyên bản.',
            'options' => [
                [
                    'value' => 'cashmere',
                    'title' => 'Cashmere & Len Lông Cừu Dệt Chặt',
                    'subtitle' => 'Ấm áp, đứng dáng, giữ nếp phẳng phiu tuyệt đối',
                    'archetype' => 'architectural_noir'
                ],
                [
                    'value' => 'mulberry_silk',
                    'title' => '100% Lụa Tơ Tằm Tự Nhiên (Mulberry Silk)',
                    'subtitle' => 'Mịn mát như làn da thứ hai, độ bắt sáng ngọc trai tự nhiên',
                    'archetype' => 'quiet_luxury'
                ],
                [
                    'value' => 'raw_linen_cotton',
                    'title' => 'Cotton Pima & Denim Hữu Cơ Cao Cấp',
                    'subtitle' => 'Đanh sợi, thoáng mát, bền bỉ cùng thời gian',
                    'archetype' => 'modern_minimalist'
                ],
                [
                    'value' => 'velvet_satin',
                    'title' => 'Nhung Tơ Tằm & Silk Satin Dệt Dày',
                    'subtitle' => 'Bề mặt óng ánh huyền bí, đầm tay và sang trọng quý phái',
                    'archetype' => 'dramatic_evening'
                ]
            ]
        ]
    ];

    /**
     * Bảng hồ sơ phong cách (Style Archetypes)
     */
    private $archetypes = [
        'architectural_noir' => [
            'key' => 'architectural_noir',
            'name' => 'The Architectural Noir',
            'tagline' => 'Quyền Lực Cấu Trúc & Thần Thái Không Thỏa Hiệp',
            'description' => 'Bạn mang trong mình tinh thần độc lập, sắc bén và tư duy thẩm mỹ kiến trúc. Bạn chuộng những đường cắt dứt khoát, gam màu đen quyền lực và chất liệu đứng phom tôn trọn bờ vai sắc nét.',
            'signature_pieces' => 'Blazer độn vai cấu trúc, Quần tây xếp ly sắc cạnh, Trench coat len dáng dài',
            'color_palette' => ['#0a0a0a', '#27272a', '#52525b', '#ffffff'],
            'recommended_product_ids' => [1, 2]
        ],
        'quiet_luxury' => [
            'key' => 'quiet_luxury',
            'name' => 'The Quiet Luxury Purist',
            'tagline' => 'Sự Xa Xỉ Thầm Lặng & Đẳng Cấp Xúc Giác',
            'description' => 'Bạn tôn thờ vẻ đẹp không cần phô trương logo. Sự sang trọng của bạn toát lên từ lụa tơ tằm thượng hạng, màu sắc trung tính trang nhã và sự thoải mái vô song chạm vào từng giác quan.',
            'signature_pieces' => 'Slip dress lụa dệt chéo, Áo len dệt kim Cashmere, Áo sơ mi lụa tơ tằm cổ rũ',
            'color_palette' => ['#f4f4f5', '#d4d4d8', '#a1a1aa', '#18181b'],
            'recommended_product_ids' => [2, 3]
        ],
        'modern_minimalist' => [
            'key' => 'modern_minimalist',
            'name' => 'The Modern Minimalist',
            'tagline' => 'Tối Giản Đương Đại & Thần Thái Nhẹ Nhàng',
            'description' => 'Phong cách của bạn là sự cân bằng hoàn mỹ giữa tính thực dụng và nghệ thuật tối giản. Bạn yêu thích những phom dáng phóng khoáng, dễ phối đồ nhưng luôn giữ được chuẩn mực tinh tế.',
            'signature_pieces' => 'Quần âu ống suông, Áo thun cotton đanh sợi cao cấp, Áo khoác dạ ngắn',
            'color_palette' => ['#18181b', '#3f3f46', '#71717a', '#fafafa'],
            'recommended_product_ids' => [1, 3]
        ],
        'dramatic_evening' => [
            'key' => 'dramatic_evening',
            'name' => 'The Midnight Icon',
            'tagline' => 'Bí Ẩn Màn Đêm & Sức Hút Dạ Tiệc',
            'description' => 'Bạn là tâm điểm của những sự kiện thượng lưu. Với thần thái quyến rũ và ánh nhìn kiêu hãnh, bạn làm chủ mọi không gian với những thiết kế xẻ tà, đầm dạ hội đen tuyền và chất liệu bắt sáng huyền ảo.',
            'signature_pieces' => 'Đầm dạ tiệc cut-out lụa satin, Tuxedo nhung đen, Áo choàng cape dạ hội',
            'color_palette' => ['#000000', '#1c1917', '#44403c', '#fbbf24'],
            'recommended_product_ids' => [2, 3]
        ]
    ];

    /**
     * Lấy danh sách câu hỏi khảo sát phong cách
     */
    public function getQuestions()
    {
        return response()->json([
            'success' => true,
            'total_questions' => count($this->quizQuestions),
            'questions' => $this->quizQuestions
        ]);
    }

    /**
     * Phân tích câu trả lời và trả về hồ sơ phong cách cá nhân hóa cùng sản phẩm đề xuất
     */
    public function analyzeResults(Request $request)
    {
        $answers = $request->input('answers', []); // Mảng các giá trị chọn

        // Thuật toán đếm trọng số Archetype từ câu trả lời
        $scores = [
            'architectural_noir' => 0,
            'quiet_luxury' => 0,
            'modern_minimalist' => 0,
            'dramatic_evening' => 0
        ];

        // Lập bản đồ tra cứu archetype từ từng option
        $optionToArchetype = [];
        foreach ($this->quizQuestions as $q) {
            foreach ($q['options'] as $opt) {
                $optionToArchetype[$opt['value']] = $opt['archetype'];
            }
        }

        foreach ($answers as $ans) {
            if (isset($optionToArchetype[$ans])) {
                $arch = $optionToArchetype[$ans];
                $scores[$arch]++;
            }
        }

        // Tìm archetype có điểm cao nhất
        arsort($scores);
        $topArchetypeKey = key($scores) ?? 'architectural_noir';
        $archetype = $this->archetypes[$topArchetypeKey];

        // Lấy danh sách sản phẩm gợi ý tương ứng
        $recommendedProducts = Product::whereIn('id', $archetype['recommended_product_ids'])
            ->select('id', 'name', 'price', 'discount_price', 'image', 'category_id')
            ->get();

        // Nếu thiếu sản phẩm, fallback lấy thêm sản phẩm hot
        if ($recommendedProducts->isEmpty()) {
            $recommendedProducts = Product::where('status', 'active')->limit(3)->get();
        }

        return response()->json([
            'success' => true,
            'archetype' => $archetype,
            'scores' => $scores,
            'recommended_products' => $recommendedProducts,
            'styling_advice' => [
                'Do' => 'Tập trung vào chất lượng dệt vải, đường chỉ may phẳng phiu và sự vừa vặn tuyệt đối với cơ thể.',
                'Dont' => 'Tránh lạm dụng quá nhiều phụ kiện kim loại rườm rà hay logo kích thước lớn làm loãng sự thanh tao.'
            ]
        ]);
    }
}
