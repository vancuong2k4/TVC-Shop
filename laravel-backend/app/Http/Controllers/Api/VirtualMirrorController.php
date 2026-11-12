<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class VirtualMirrorController extends Controller
{
    /**
     * Get AR virtual mirror accessory catalog (Eyewear & Haute Joaillerie)
     */
    public function getCatalog()
    {
        $categories = [
            'eyewear' => 'Kính Mắt Điêu Khắc (Sculptural Eyewear)',
            'jewelry' => 'Trang Sức Kim Hoàn Thượng Hạng (Haute Joaillerie)'
        ];

        $items = [
            [
                'id' => 'ar-eye-01',
                'category' => 'eyewear',
                'name' => 'The Monolith Geometric Titanium Sunglasses',
                'material' => 'Titanium cấp hàng không mạ PVD đen mờ & Tròng kính phân cực Carl Zeiss chống tia UV 100%',
                'face_shape_fit' => 'Oval, Square, Heart (Phù hợp mặt trái xoan & mặt góc cạnh)',
                'price' => 14500000,
                'image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
                'overlay_svg' => 'sunglasses_geometric',
                'specs' => [
                    'Trọng lượng': '18 grams (Siêu nhẹ)',
                    'Khớp nối': 'Bản lề cơ học không ốc vít độc quyền',
                    'Nguồn gốc': 'Chế tác thủ công tại Sabae, Nhật Bản'
                ]
            ],
            [
                'id' => 'ar-eye-02',
                'category' => 'eyewear',
                'name' => 'Atelier Heritage Aviator Tortoiseshell',
                'material' => 'Acetate cellulose hữu cơ đồi mồi Ý kết hợp gọng vàng 18K chải xước thủ công',
                'face_shape_fit' => 'Round, Oval (Tôn vinh gương mặt tròn & cân đối)',
                'price' => 16800000,
                'image' => 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
                'overlay_svg' => 'sunglasses_aviator',
                'specs' => [
                    'Trọng lượng': '24 grams',
                    'Khớp nối': 'Bản lề 5 chấu mạ vàng',
                    'Nguồn gốc': 'Cadore, Ý'
                ]
            ],
            [
                'id' => 'ar-jewel-01',
                'category' => 'jewelry',
                'name' => 'Sovereign 18K White Gold Diamond Choker',
                'material' => 'Vàng trắng 18K nạm 48 viên kim cương tự nhiên VVS1 cắt giác Baguette',
                'face_shape_fit' => 'Mọi phom dáng cổ & xương quai xanh',
                'price' => 68000000,
                'image' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop',
                'overlay_svg' => 'necklace_choker',
                'specs' => [
                    'Kim cương': 'Tổng trọng lượng 3.2 carats VVS1/E-Color',
                    'Khóa': 'Khóa cơ học ẩn dấu triện Monogram TVC',
                    'Chứng nhận': 'GIA Certificate kèm theo'
                ]
            ],
            [
                'id' => 'ar-jewel-02',
                'category' => 'jewelry',
                'name' => 'Obsidian Sculptural Geometric Earrings',
                'material' => 'Đá Thạch Anh Đen Obsidian nạm khung Titan mạ PVD vàng hồng 18K',
                'face_shape_fit' => 'Tôn vinh góc nghiêng quai hàm sắc sảo',
                'price' => 22500000,
                'image' => 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop',
                'overlay_svg' => 'earrings_geometric',
                'specs' => [
                    'Chế tác': 'Cắt mài facet quang học phản chiếu góc cạnh',
                    'Trọng lượng': '8.5 grams / chiếc',
                    'Bảo chứng': 'Chứng thư đá quý thiên nhiên độc bản'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'categories' => $categories,
            'items' => $items,
            'ar_guide' => [
                'Cho phép truy cập webcam trực tiếp hoặc sử dụng hình ảnh chân dung mẫu chuẩn studio.',
                'Hệ thống tự động căn chỉnh tỷ lệ khung kính và trang sức khớp với kích thước khuôn mặt thực tế.',
                'Chụp và lưu ảnh chân dung phối phụ kiện kèm mã QR đặt hàng nhanh.'
            ]
        ]);
    }

    /**
     * Save an AR Snapshot fitting look
     */
    public function saveSnapshot(Request $request)
    {
        $request->validate([
            'item_id' => 'required|string',
            'client_notes' => 'nullable|string',
        ]);

        $snapshotCode = 'SNAP-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => 'Khoảnh khắc thử phụ kiện ảo đã được lưu trữ vào Hồ sơ Phong cách.',
            'snapshot' => [
                'snapshot_code' => $snapshotCode,
                'item_id' => $request->item_id,
                'timestamp' => now()->toIso8601String(),
                'hash' => hash('sha256', $snapshotCode . now()->timestamp)
            ]
        ]);
    }
}
