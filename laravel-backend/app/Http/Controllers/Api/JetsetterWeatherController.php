<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JetsetterWeatherController extends Controller
{
    /**
     * Get luxury jetsetter destinations, live weather simulation & curated wardrobe capsules
     */
    public function getDestinations()
    {
        $destinations = [
            'paris' => [
                'city' => 'Paris',
                'country' => 'Pháp',
                'vibe' => 'Sự lãng mạn thanh lịch, nghệ thuật cổ điển và thời trang may đo cao cấp',
                'current_weather' => [
                    'temp_c' => 12,
                    'condition' => 'Mưa phùn nhẹ & Sương mờ (Light Drizzle)',
                    'humidity' => 78,
                    'wind_kmh' => 14,
                    'season_category' => 'cool_transitional'
                ],
                'curated_capsule' => [
                    'title' => 'The Seine River Autumn Trench Capsule',
                    'essential_pieces' => [
                        'Áo Măng-tô Cashmere Midnight Noir chống thấm nhẹ',
                        'Áo len cổ lọ dệt kim tơ tằm nguyên chất',
                        'Quần âu may đo ống suông len lông cừu Ý',
                        'Giày Chelsea Boot da bê mộc bóng mờ'
                    ],
                    'packing_advice' => 'Khí hậu Paris thu đông đòi hỏi các lớp trang phục mỏng nhẹ giữ nhiệt tốt kết hợp áo khoác dạ dáng dài để giữ trọn thần thái thanh lịch khi tản bộ dọc bờ sông Seine.'
                ]
            ],
            'st_moritz' => [
                'city' => 'St. Moritz',
                'country' => 'Thụy Sĩ',
                'vibe' => 'Kỳ nghỉ trượt tuyết đỉnh cao của giới thượng lưu bên dãy Alps',
                'current_weather' => [
                    'temp_c' => -4,
                    'condition' => 'Tuyết rơi nhẹ & Nắng trên đỉnh núi (Crisp Snow)',
                    'humidity' => 65,
                    'wind_kmh' => 18,
                    'season_category' => 'alpine_winter'
                ],
                'curated_capsule' => [
                    'title' => 'The Alpine Lodge Ultra-Warm Luxe Capsule',
                    'essential_pieces' => [
                        'Áo khoác phao lông vũ ngỗng trắng bọc vải lụa kỹ thuật số',
                        'Áo len vặn thừng Cashmere Loro Piana dày 8 sợi',
                        'Quần trượt tuyết dạ co giãn lót lông cừu Merino',
                        'Kính râm gọng Titanium chống chói quang học tuyết'
                    ],
                    'packing_advice' => 'Nhiệt độ âm đòi hỏi chất liệu len Cashmere hạng nhất cùng áo khoác bọc vải kỹ thuật chống tuyết, hoàn hảo cho tiệc Après-Ski tại các resort sang trọng.'
                ]
            ],
            'lake_como' => [
                'city' => 'Hồ Como (Lake Como)',
                'country' => 'Ý',
                'vibe' => 'Sự tĩnh lặng tuyệt đối của các điền trang ven hồ và du thuyền gỗ Riva',
                'current_weather' => [
                    'temp_c' => 20,
                    'condition' => 'Nắng dịu & Gió hồ thanh khiết (Breezy Serenity)',
                    'humidity' => 52,
                    'wind_kmh' => 8,
                    'season_category' => 'temperate_lake'
                ],
                'curated_capsule' => [
                    'title' => 'The Riva Yacht Quiet Luxury Capsule',
                    'essential_pieces' => [
                        'Áo Blazer Lanh Ý (Italian Linen) không cấu trúc đệm vai',
                        'Áo sơ-mi lụa Habotai cổ Cuba mở khuy hờ',
                        'Quần xếp ly cạp cao vải Tropical Wool mát lạnh',
                        'Giày Loafer da lộn màu be Tuscan không tất'
                    ],
                    'packing_advice' => 'Chuyến nghỉ dưỡng ven hồ tôn vinh bảng màu trung tính nhã nhặn, chất liệu lanh tự nhiên bay bổng tạo sự thoải mái tối thượng dưới ánh hoàng hôn nước Ý.'
                ]
            ],
            'tokyo' => [
                'city' => 'Tokyo (Ginza)',
                'country' => 'Nhật Bản',
                'vibe' => 'Giao lộ kiến trúc hiện đại vị lai và tinh hoa tối giản phương Đông',
                'current_weather' => [
                    'temp_c' => 16,
                    'condition' => 'Trời trong & Gió mát dịu (Clear & Crisp)',
                    'humidity' => 45,
                    'wind_kmh' => 11,
                    'season_category' => 'urban_modern'
                ],
                'curated_capsule' => [
                    'title' => 'The Ginza Architectural Minimalist Capsule',
                    'essential_pieces' => [
                        'Áo khoác dạ dáng hộp hình học bất đối xứng',
                        'Áo sơ-mi poplin cotton trắng tinh khiết',
                        'Quần culottes len cấu trúc đứng phom',
                        'Túi xách tài liệu da mộc khóa số cơ học'
                    ],
                    'packing_advice' => 'Phong cách tối giản điêu khắc với các đường cắt sắc sảo, tone màu đen monochrome và trắng nguyên bản giúp Quý khách hòa quyện hoàn hảo vào không gian kiến trúc Ginza.'
                ]
            ],
            'monaco' => [
                'city' => 'Monaco (Monte Carlo)',
                'country' => 'Monaco',
                'vibe' => 'Dạ tiệc hoàng gia, sòng bạc vương giả và du thuyền triệu đô bên vịnh biển',
                'current_weather' => [
                    'temp_c' => 22,
                    'condition' => 'Nắng hoàng kim Địa Trung Hải (Golden Coast)',
                    'humidity' => 58,
                    'wind_kmh' => 12,
                    'season_category' => 'riviera_sun'
                ],
                'curated_capsule' => [
                    'title' => 'The Grand Gala Monte Carlo Capsule',
                    'essential_pieces' => [
                        'Bộ Tuxedo may đo Savile Row viền ve áo lụa bóng',
                        'Đầm dạ hội lụa tơ tằm xẻ tà đính đá Swarovski',
                        'Cặp khuy măng-sét vàng 18K nạm kim cương Baguette',
                        'Giày khiêu vũ Opera Pump da bóng cao cấp'
                    ],
                    'packing_advice' => 'Trang phục dạ tiệc tại Monaco yêu cầu tính chuẩn mực may đo khắt khe nhất (Black Tie), đi kèm phụ kiện kim loại quý phản chiếu ánh đèn cung điện xa hoa.'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'destinations' => $destinations,
            'jetsetter_tips' => [
                'Sử dụng túi bọc trang phục bảo hộ bằng sợi cotton thoáng khí khi xếp đồ vào vali Rimowa nhôm nguyên khối.',
                'Luôn gấp áo măng-tô lộn ngược lớp lót ra ngoài để giữ gìn bề mặt vải Cashmere không bị cọ xát trong các chuyến bay đường dài.',
                'TVC Atelier cung cấp dịch vụ giao vali trang phục thẳng tới khách sạn 5 sao trước giờ Quý khách hạ cánh.'
            ]
        ]);
    }

    /**
     * Generate custom packing itinerary based on trip parameters
     */
    public function generatePackingList(Request $request)
    {
        $request->validate([
            'destination_key' => 'required|string',
            'trip_days' => 'required|integer|min:1|max:30',
            'trip_purpose' => 'required|string|in:gala,business,resort,casual_explore',
            'customer_name' => 'required|string',
            'email' => 'required|email',
        ]);

        $days = (int) $request->trip_days;
        $destKey = $request->destination_key;

        $itineraryCode = 'JET-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Lộ trình phối đồ vali Jetsetter đã được kiến tạo thành công.',
            'itinerary' => [
                'itinerary_code' => $itineraryCode,
                'destination' => ucfirst($destKey),
                'days' => $days,
                'purpose' => $request->trip_purpose,
                'recommended_outfits_count' => ceil($days * 1.5),
                'special_valet_service' => 'Miễn phí dịch vụ giặt hấp là phẳng tại khách sạn lưu trú',
                'created_at' => now()->toIso8601String(),
                'hash' => hash('sha256', $itineraryCode . now()->timestamp)
            ]
        ]);
    }
}
