<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function toggle(Request $request)
    {
        $productId = $request->input('product_id');
        
        if (!$productId) {
            return response()->json(['message' => 'Không tìm thấy ID sản phẩm.'], 400);
        }

        $user = $request->user();
        $result = $user->wishlistProducts()->toggle($productId);

        $action = count($result['attached']) > 0 ? 'added' : 'removed';

        return response()->json([
            'message' => 'Cập nhật thành công',
            'action' => $action
        ]);
    }

    public function getUserWishlist(Request $request)
    {
        $user = $request->user();
        
        // Cần nối thêm ảnh đại diện cho các sản phẩm
        $wishlists = $user->wishlistProducts()->with(['images' => function ($query) {
            $query->where('is_primary', 1);
        }])->get()->map(function ($product) {
            $primaryImage = $product->images->first();
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'discount_price' => $product->discount_price,
                'image_url' => $primaryImage ? $primaryImage->image_url : null
            ];
        });

        return response()->json($wishlists);
    }
}
