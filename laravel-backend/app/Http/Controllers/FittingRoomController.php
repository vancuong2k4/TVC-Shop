<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class FittingRoomController extends Controller
{
    /**
     * Danh mục phụ kiện và trang phục phân loại cho Studio Mix & Match
     */
    public function getFittingWardrobe()
    {
        $products = Product::where('status', 'active')
            ->select('id', 'name', 'price', 'discount_price', 'image', 'category_id')
            ->limit(24)
            ->get();

        // Mô hình phân tầng phối đồ ảo theo phom dáng người mẫu chuẩn Cold Luxury
        $categoriesMap = [
            'outerwear' => [
                'name' => 'Áo Khoác & Blazer (Outerwear)',
                'icon' => 'Sparkles'
            ],
            'tops' => [
                'name' => 'Áo Trong & Sơ Mi (Tops)',
                'icon' => 'Shirt'
            ],
            'bottoms' => [
                'name' => 'Quần Âu & Chân Váy (Bottoms)',
                'icon' => 'Scissors'
            ],
            'accessories' => [
                'name' => 'Túi Xách & Phụ Kiện (Accessories)',
                'icon' => 'ShoppingBag'
            ]
        ];

        // Mẫu preset outfit phối sẵn kinh điển
        $presets = [
            [
                'id' => 'preset_noir_executive',
                'name' => 'The Noir Executive',
                'description' => 'Khí chất quyền lực tối giản dành cho nữ lãnh đạo hiện đại',
                'outerwear_id' => 1,
                'top_id' => 2,
                'bottom_id' => 3,
                'style_score' => 98
            ],
            [
                'id' => 'preset_monochrome_evening',
                'name' => 'Monochrome Gala Evening',
                'description' => 'Chuyển động uyển chuyển giữa dạ tiệc cocktail và thảm đỏ',
                'outerwear_id' => 2,
                'top_id' => 3,
                'bottom_id' => 1,
                'style_score' => 96
            ],
            [
                'id' => 'preset_weekend_cashmere',
                'name' => 'Effortless Weekend Cashmere',
                'description' => 'Sự thư thái quý phái giữa tiết trời thu se lạnh',
                'outerwear_id' => 1,
                'top_id' => 3,
                'bottom_id' => 2,
                'style_score' => 94
            ]
        ];

        return response()->json([
            'success' => true,
            'wardrobe_items' => $products,
            'categories' => $categoriesMap,
            'preset_outfits' => $presets
        ]);
    }
}
