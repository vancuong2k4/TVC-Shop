<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class OccasionController extends Controller
{
    /**
     * Danh sách các dịp phong cách thời trang (Occasions) được định hình theo phong cách Cold Luxury
     */
    private $occasions = [
        [
            'id' => 'workwear',
            'name' => 'Công Sở & Họp Cấp Cao',
            'tagline' => 'Power Dressing & Formal Elegance',
            'description' => 'Những thiết kế blazer thanh lịch, áo sơ mi tối giản và quần âu chuẩn mực cho các buổi đàm phán quan trọng.',
            'badge' => 'Executive Chic',
            'image_url' => 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=600',
            'suggested_keywords' => ['áo', 'blazer', 'vest', 'sơ mi', 'quần']
        ],
        [
            'id' => 'evening-gala',
            'name' => 'Dạ Tiệc & Cocktail Party',
            'tagline' => 'Midnight Noir & Subtle Glamour',
            'description' => 'Vẻ đẹp quyến rũ bí ẩn với đầm lụa, thiết kế cut-out tinh tế và tone màu đen huyền bí.',
            'badge' => 'High Glamour',
            'image_url' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
            'suggested_keywords' => ['đầm', 'váy', 'silk', 'đen', 'dạ hội']
        ],
        [
            'id' => 'weekend-brunch',
            'name' => 'Cuối Tuần & Cà Phê Dạo Phố',
            'tagline' => 'Effortless Minimal & Relaxed Fit',
            'description' => 'Trang phục casual phóng khoáng, chất vải cotton hữu cơ êm ái tôn lên nét tự tin nguyên bản.',
            'badge' => 'Off-Duty Chic',
            'image_url' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
            'suggested_keywords' => ['thun', 'quần', 'linen', 'áo', 'khoác']
        ],
        [
            'id' => 'vacation-resort',
            'name' => 'Nghỉ Dưỡng & Du Ngoạn Biển',
            'tagline' => 'Resort Escape & Breathable Linen',
            'description' => 'Các thiết kế thoáng mát, bay bổng từ chất liệu đũi, linen và lụa cao cấp đón gió biển.',
            'badge' => 'Resort Luxe',
            'image_url' => 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=600',
            'suggested_keywords' => ['đầm', 'váy', 'linen', 'sơ mi', 'trắng']
        ]
    ];

    /**
     * Lấy danh mục các dịp và sản phẩm gợi ý tương ứng
     */
    public function getOccasions(Request $request)
    {
        $selectedOccasionId = $request->query('occasion', 'workwear');

        $currentOccasion = collect($this->occasions)->firstWhere('id', $selectedOccasionId) 
            ?: $this->occasions[0];

        // Lấy sản phẩm phù hợp dựa theo keywords hoặc phân loại
        $products = Product::with(['images', 'category'])->take(8)->get();

        $formattedProducts = $products->map(function ($product) {
            $primaryImg = $product->images->where('is_primary', 1)->first() 
                ?: $product->images->first();

            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => (float) $product->price,
                'discount_price' => $product->discount_price ? (float) $product->discount_price : null,
                'category_name' => $product->category ? $product->category->name : '',
                'image_url' => $primaryImg ? $primaryImg->image_url : null
            ];
        });

        return response()->json([
            'success' => true,
            'occasions' => $this->occasions,
            'selected_occasion' => $currentOccasion,
            'products' => $formattedProducts
        ]);
    }
}
