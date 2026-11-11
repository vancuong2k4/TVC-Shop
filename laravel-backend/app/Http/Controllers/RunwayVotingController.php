<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RunwayVotingController extends Controller
{
    /**
     * Danh sách các bản phác thảo thiết kế Runway Capsule tương lai đang mở bình chọn
     */
    private $concepts = [
        [
            'id' => 'concept_01',
            'title' => 'The Sculptural Cape Blazer in Shadow Wool',
            'season' => 'Spring/Summer Haute Couture',
            'designer' => 'Hoàng Nam - Head Tailor',
            'votes_count' => 1420,
            'status' => 'voting_open',
            'silhouette' => 'Cape vạt bay cấu trúc xẻ tay nhọn, ve áo chữ V sâu',
            'fabric_proposed' => 'Len lông cừu Biella dệt trơn kết hợp lụa satin lót trong',
            'image' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
            'production_target_votes' => 1500, // Đạt mốc sẽ đưa vào sản xuất runway
            'feedback_comments' => [
                ['user' => 'Khánh Linh (VIP Gold)', 'comment' => 'Phom cape này kết hợp cùng quần tây ống rộng sẽ cực kỳ quyền lực cho thảm đỏ!'],
                ['user' => 'Tuấn Anh', 'comment' => 'Mong Atelier giữ nguyên hàng khuy sừng nguyên khối. Rất độc bản.']
            ]
        ],
        [
            'id' => 'concept_02',
            'title' => 'Asymmetric Midnight Draped Silk Slip Dress',
            'season' => 'Resort Evening Capsule',
            'designer' => 'Thảo My - Creative Director',
            'votes_count' => 980,
            'status' => 'voting_open',
            'silhouette' => 'Váy lụa rủ xẻ tà bất đối xứng, quai áo dây kim loại mảnh',
            'fabric_proposed' => '100% Lụa tơ tằm dệt jacquard hoa văn chìm Lyon',
            'image' => 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=600',
            'production_target_votes' => 1200,
            'feedback_comments' => [
                ['user' => 'Minh Hằng (VIP Diamond)', 'comment' => 'Màu xanh midnight rất sang, hy vọng sẽ có thêm phiên bản màu than chì!']
            ]
        ],
        [
            'id' => 'concept_03',
            'title' => 'Deconstructed Double-Breasted Cashmere Trench',
            'season' => 'Autumn Pre-Fall Edition',
            'designer' => 'TVC Design Collective',
            'votes_count' => 1650,
            'status' => 'approved_for_production',
            'silhouette' => 'Áo măng tô dáng dài tái cấu trúc, thắt lưng bản to khóa kim loại matte',
            'fabric_proposed' => 'Cashmere dệt đanh sợi chống nước nhẹ',
            'image' => 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=600',
            'production_target_votes' => 1500,
            'feedback_comments' => [
                ['user' => 'Quốc Bảo', 'comment' => 'Đã vượt mốc bình chọn! Hóng ngày mở suất Pre-order để đặt ngay size L.']
            ]
        ]
    ];

    /**
     * Lấy danh sách các concept thiết kế đang mở bình chọn
     */
    public function getConcepts()
    {
        return response()->json([
            'success' => true,
            'total_votes_season' => 4050,
            'concepts' => $this->concepts
        ]);
    }

    /**
     * Bầu chọn ủng hộ một concept thiết kế
     */
    public function castVote(Request $request)
    {
        $conceptId = $request->input('concept_id');
        $feedback = $request->input('feedback', '');

        $matchedConcept = null;
        foreach ($this->concepts as $c) {
            if ($c['id'] === $conceptId) {
                $matchedConcept = $c;
                break;
            }
        }

        if (!$matchedConcept) {
            return response()->json([
                'success' => false,
                'message' => 'Bản phác thảo thiết kế không tồn tại.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn quý khách đã bình chọn đưa thiết kế vào sản xuất Runway!',
            'concept_id' => $conceptId,
            'new_votes_count' => $matchedConcept['votes_count'] + 1,
            'feedback_recorded' => !empty($feedback)
        ]);
    }
}
