<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class VideoReelController extends Controller
{
    /**
     * Danh sách các video Lookbook Reels thời trang tương tác trực tiếp
     */
    private $reels = [
        [
            'id' => 'reel_01',
            'title' => 'Cold Luxury Fall/Winter Runway Look',
            'author' => 'TVC Editorial Studio',
            'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-black-dress-walking-on-a-runway-41221-large.mp4',
            'thumbnail' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
            'likes_count' => 1240,
            'views_count' => '18.5K',
            'description' => 'Khám phá sự giao thoa giữa phom dáng tối giản và chất liệu len dệt cao cấp.',
            'product_id' => 1
        ],
        [
            'id' => 'reel_02',
            'title' => 'Minimalist Tailoring & Power Blazer',
            'author' => 'Thảo My - Lead Stylist',
            'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-posing-for-a-fashion-photoshoot-41223-large.mp4',
            'thumbnail' => 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=600',
            'likes_count' => 985,
            'views_count' => '14.2K',
            'description' => 'Bí quyết diện blazer công sở vừa thanh lịch vừa tôn trọn vóc dáng quyền lực.',
            'product_id' => 2
        ],
        [
            'id' => 'reel_03',
            'title' => 'Silk Noir Slip Dress In Motion',
            'author' => 'Hoàng Nam - Creative Director',
            'video_url' => 'https://assets.mixkit.co/videos/preview/mixkit-model-posing-in-a-studio-setting-41224-large.mp4',
            'thumbnail' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=600',
            'likes_count' => 2150,
            'views_count' => '32.1K',
            'description' => 'Chuyển động uyển chuyển cùng chất liệu lụa tơ tằm thiên nhiên ánh satin.',
            'product_id' => 3
        ]
    ];

    /**
     * Lấy danh sách Lookbook Reels kèm thông tin sản phẩm tương tác (Shoppable Tag)
     */
    public function getReels(Request $request)
    {
        $products = Product::with(['images', 'category'])->take(5)->get()->keyBy('id');

        $shoppableReels = array_map(function ($reel) use ($products) {
            $prod = $products->get($reel['product_id']) ?: $products->first();
            $primaryImg = $prod && $prod->images->first() ? $prod->images->first()->image_url : null;

            return array_merge($reel, [
                'product' => $prod ? [
                    'id' => $prod->id,
                    'name' => $prod->name,
                    'price' => (float) ($prod->discount_price ?: $prod->price),
                    'original_price' => (float) $prod->price,
                    'image' => $primaryImg
                ] : null
            ]);
        }, $this->reels);

        return response()->json([
            'success' => true,
            'title' => 'TVC-SHOP SHOPPABLE VIDEO REELS',
            'reels' => $shoppableReels
        ]);
    }
}
