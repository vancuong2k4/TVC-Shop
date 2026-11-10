<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SizeGuideController extends Controller
{
    /**
     * Bảng đo kích cỡ chuẩn hóa theo phân loại thời trang TVC-Shop
     */
    private $sizeGuides = [
        'tops' => [
            'category_name' => 'Áo Sơ Mi, Áo Thun & Dệt Kim',
            'measurement_unit' => 'cm',
            'tips' => 'Đo vòng ngực tại điểm nhô cao nhất của ngực, giữ thước dây ngang bằng.',
            'columns' => ['Size', 'Vòng Ngực', 'Vòng Eo', 'Chiều Rộng Vai', 'Chiều Dài Áo'],
            'rows' => [
                ['size' => 'S', 'chest' => '86 - 90', 'waist' => '68 - 72', 'shoulder' => '42', 'length' => '68'],
                ['size' => 'M', 'chest' => '91 - 95', 'waist' => '73 - 77', 'shoulder' => '44', 'length' => '70'],
                ['size' => 'L', 'chest' => '96 - 100', 'waist' => '78 - 82', 'shoulder' => '46', 'length' => '72'],
                ['size' => 'XL', 'chest' => '101 - 106', 'waist' => '83 - 88', 'shoulder' => '48', 'length' => '74']
            ]
        ],
        'blazers' => [
            'category_name' => 'Blazer & Áo Khoác May Đo (Tailoring)',
            'measurement_unit' => 'cm',
            'tips' => 'Phom dáng cấu trúc Cold Luxury tôn bờ vai sắc nét. Nếu bạn thích mặc layer áo len bên trong, hãy cân nhắc tăng 1 size.',
            'columns' => ['Size', 'Vòng Ngực', 'Vòng Eo', 'Chiều Rộng Vai', 'Dài Tay Áo'],
            'rows' => [
                ['size' => 'S', 'chest' => '88 - 92', 'waist' => '72 - 76', 'shoulder' => '43', 'sleeve' => '60'],
                ['size' => 'M', 'chest' => '93 - 97', 'waist' => '77 - 81', 'shoulder' => '45', 'sleeve' => '62'],
                ['size' => 'L', 'chest' => '98 - 103', 'waist' => '82 - 87', 'shoulder' => '47', 'sleeve' => '64'],
                ['size' => 'XL', 'chest' => '104 - 110', 'waist' => '88 - 94', 'shoulder' => '49', 'sleeve' => '65']
            ]
        ],
        'pants' => [
            'category_name' => 'Quần Tây & Quần Denim Cắt Cúp',
            'measurement_unit' => 'cm',
            'tips' => 'Đo vòng eo ngay vị trí thắt lưng tự nhiên, vòng hông tại điểm nở nang nhất.',
            'columns' => ['Size', 'Vòng Eo', 'Vòng Mông', 'Vòng Đùi', 'Chiều Dài Quần'],
            'rows' => [
                ['size' => '29 / S', 'waist' => '74 - 76', 'hip' => '90 - 93', 'thigh' => '54', 'length' => '98'],
                ['size' => '30 / M', 'waist' => '77 - 80', 'hip' => '94 - 97', 'thigh' => '56', 'length' => '100'],
                ['size' => '31 / L', 'waist' => '81 - 84', 'hip' => '98 - 101', 'thigh' => '58', 'length' => '102'],
                ['size' => '32 / XL', 'waist' => '85 - 89', 'hip' => '102 - 106', 'thigh' => '60', 'length' => '104']
            ]
        ],
        'dresses' => [
            'category_name' => 'Đầm Dự Tiệc & Slip Dress Lụa',
            'measurement_unit' => 'cm',
            'tips' => 'Đo 3 vòng ngực, eo, mông để chọn phom ôm trọn đường cong cơ thể hoàn hảo nhất.',
            'columns' => ['Size', 'Vòng Ngực', 'Vòng Eo', 'Vòng Mông', 'Chiều Dài Váy'],
            'rows' => [
                ['size' => 'XS', 'chest' => '80 - 83', 'waist' => '60 - 63', 'hip' => '86 - 89', 'length' => '115'],
                ['size' => 'S', 'chest' => '84 - 87', 'waist' => '64 - 67', 'hip' => '90 - 93', 'length' => '118'],
                ['size' => 'M', 'chest' => '88 - 92', 'waist' => '68 - 72', 'hip' => '94 - 98', 'length' => '120'],
                ['size' => 'L', 'chest' => '93 - 98', 'waist' => '73 - 78', 'hip' => '99 - 104', 'length' => '122']
            ]
        ]
    ];

    /**
     * Lấy toàn bộ bảng kích cỡ hoặc theo danh mục cụ thể
     */
    public function getSizeGuides(Request $request)
    {
        $categoryKey = $request->input('category');

        if ($categoryKey && isset($this->sizeGuides[$categoryKey])) {
            return response()->json([
                'success' => true,
                'data' => $this->sizeGuides[$categoryKey]
            ]);
        }

        return response()->json([
            'success' => true,
            'categories' => array_keys($this->sizeGuides),
            'data' => $this->sizeGuides
        ]);
    }
}
