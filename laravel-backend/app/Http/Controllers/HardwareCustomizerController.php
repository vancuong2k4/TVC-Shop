<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HardwareCustomizerController extends Controller
{
    /**
     * Bảng danh mục phụ liệu kim khí cao cấp (Bespoke Hardware Options)
     */
    private $hardwareOptions = [
        'buttons' => [
            'category_name' => 'Khuy Cài Áo & Nút Măng Sét (Buttons & Cufflinks)',
            'options' => [
                [
                    'id' => 'btn_horn_natural',
                    'name' => 'Khuy Sừng Trâu Tự Nhiên Thụy Sĩ (Natural Buffalo Horn)',
                    'material' => 'Sừng trâu nước tự nhiên đánh bóng bán mờ',
                    'color_finish' => 'Obsidian Black / Hổ phách vân chìm',
                    'price' => 150000,
                    'preview_style' => 'classic_matte',
                    'icon_color' => '#18181b',
                    'description' => 'Mỗi chiếc khuy sở hữu đường vân sừng duy nhất không trùng lặp, chạm khắc chìm logo TVC ở mặt sau.'
                ],
                [
                    'id' => 'btn_brass_vintage',
                    'name' => 'Khuy Hợp Kim Đồng Thau Cổ Điển (Antiqued Brass)',
                    'material' => 'Đồng thau đúc nguyên khối xử lý oxy hóa nghệ thuật',
                    'color_finish' => 'Vintage Brushed Brass',
                    'price' => 220000,
                    'preview_style' => 'vintage_gold',
                    'icon_color' => '#d97706',
                    'description' => 'Mang vẻ đẹp hoài niệm của những xưởng may đo London thế kỷ 19, độ nặng đầm tay và không bị xỉn màu.'
                ],
                [
                    'id' => 'btn_mother_of_pearl',
                    'name' => 'Khuy Xà Cừ Biển Sâu Úc (Australian Mother of Pearl)',
                    'material' => 'Vỏ ngọc trai đại dương tự nhiên',
                    'color_finish' => 'Iridescent Pearl Sheen',
                    'price' => 280000,
                    'preview_style' => 'pearl_sheen',
                    'icon_color' => '#f4f4f5',
                    'description' => 'Độ bắt sáng bảy sắc cầu vồng lấp lánh nhẹ nhàng, lý tưởng cho các dòng áo sơ mi và tuxedo cao cấp.'
                ]
            ]
        ],
        'zippers' => [
            'category_name' => 'Khóa Kéo Kim Loại Chế Tác (Sculptural Zippers)',
            'options' => [
                [
                    'id' => 'zip_gunmetal_excella',
                    'name' => 'Khóa Kéo Răng Đánh Bóng Titan Gunmetal',
                    'material' => 'Hợp kim kẽm-titan xử lý bề mặt PVD',
                    'color_finish' => 'Smoky Gunmetal',
                    'price' => 180000,
                    'preview_style' => 'gunmetal',
                    'icon_color' => '#52525b',
                    'description' => 'Từng răng khóa được vát cạnh và mài bóng thủ công cho chuyển động êm ái tuyệt đối không vấp sợi vải.'
                ],
                [
                    'id' => 'zip_champagne_gold',
                    'name' => 'Khóa Kéo Mạ Vàng Champagne Mờ (Champagne Gold)',
                    'material' => 'Mạ vàng nhũ champagne mờ 18K',
                    'color_finish' => 'Matte Champagne Gold',
                    'price' => 250000,
                    'preview_style' => 'gold',
                    'icon_color' => '#fbbf24',
                    'description' => 'Ánh kim dịu mắt chuẩn Cold Luxury, tay kéo bản dẹt dày dặn dập nổi biểu tượng TVC Atelier.'
                ]
            ]
        ],
        'linings' => [
            'category_name' => 'Lớp Lót Trong Silk Jacquard (Inner Linings)',
            'options' => [
                [
                    'id' => 'lining_noir_monogram',
                    'name' => 'Lụa Cupro Dệt Jacquard Họa Tiết Monogram TVC',
                    'material' => '100% Sợi Cupro Bemberg thoáng khí và chống tích điện',
                    'color_finish' => 'Midnight Noir Jacquard',
                    'price' => 320000,
                    'preview_style' => 'pattern_noir',
                    'icon_color' => '#09090b',
                    'description' => 'Mát mịn như lụa tự nhiên, trượt êm ái khi mặc layer và thấm hút mồ hôi tối ưu.'
                ],
                [
                    'id' => 'lining_bordeaux_silk',
                    'name' => 'Lụa Tơ Tằm Màu Rượu Vang Đỏ Bordeaux',
                    'material' => 'Lụa Habotai dệt trơn truyền thống',
                    'color_finish' => 'Deep Bordeaux Wine',
                    'price' => 380000,
                    'preview_style' => 'pattern_bordeaux',
                    'icon_color' => '#881337',
                    'description' => 'Tạo điểm nhấn tương phản bất ngờ và bí ẩn mỗi khi cởi hoặc mở khuy áo khoác.'
                ]
            ]
        ]
    ];

    /**
     * Lấy cấu hình các tùy chọn phụ liệu kim khí & lớp lót
     */
    public function getCustomizerConfig()
    {
        return response()->json([
            'success' => true,
            'categories' => $this->hardwareOptions,
            'preview_base_outfit' => [
                'name' => 'The Tailored Obsidian Blazer (Base Canvas)',
                'base_price' => 2450000,
                'default_button' => 'btn_horn_natural',
                'default_zipper' => 'zip_gunmetal_excella',
                'default_lining' => 'lining_noir_monogram'
            ]
        ]);
    }

    /**
     * Lưu bản thiết kế tùy biến phụ liệu (Save Hardware Configuration)
     */
    public function saveCustomization(Request $request)
    {
        $request->validate([
            'selected_button_id' => 'required|string',
            'selected_zipper_id' => 'required|string',
            'selected_lining_id' => 'required|string',
            'custom_engraved_initials' => 'nullable|string|max:4'
        ]);

        $customConfigCode = 'HW-' . strtoupper(bin2hex(random_bytes(3)));

        // Tính tổng tiền phụ trội
        $extraPrice = 0;
        foreach ($this->hardwareOptions as $cat) {
            foreach ($cat['options'] as $opt) {
                if ($opt['id'] === $request->selected_button_id || 
                    $opt['id'] === $request->selected_zipper_id || 
                    $opt['id'] === $request->selected_lining_id) {
                    $extraPrice += $opt['price'];
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Bản phối phụ liệu kim khí Bespoke đã được lưu vào giỏ hàng!',
            'config_code' => $customConfigCode,
            'total_extra_price' => $extraPrice,
            'engraved_initials' => $request->custom_engraved_initials ? strtoupper($request->custom_engraved_initials) : null
        ]);
    }
}
