<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SharedCartController extends Controller
{
    /**
     * Tạo liên kết chia sẻ giỏ hàng (Shareable Cart Link)
     * Nhận mảng items và tạo ra mã share_code độc nhất
     */
    public function createSharedCart(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.id' => 'required',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.size' => 'nullable|string',
            'items.*.color' => 'nullable|string',
            'sender_name' => 'nullable|string|max:100'
        ]);

        $shareCode = 'CART-' . strtoupper(Str::random(8));
        
        // Lưu dữ liệu vào cache hoặc file tạm / session
        // Ở đây ta sử dụng Laravel Cache lưu 30 ngày
        $cartData = [
            'share_code' => $shareCode,
            'sender_name' => $request->input('sender_name', 'Một người bạn'),
            'created_at' => Carbon::now()->format('d/m/Y H:i'),
            'items' => $request->items
        ];

        cache()->put('shared_cart_' . $shareCode, $cartData, Carbon::now()->addDays(30));

        $shareUrl = url('/cart/shared/' . $shareCode);

        return response()->json([
            'success' => true,
            'share_code' => $shareCode,
            'share_url' => $shareUrl,
            'message' => 'Tạo liên kết chia sẻ giỏ hàng thành công!'
        ]);
    }

    /**
     * Lấy chi tiết các sản phẩm trong giỏ hàng được chia sẻ qua share_code
     */
    public function getSharedCart($shareCode)
    {
        $shareCode = strtoupper(trim($shareCode));
        $cartData = cache()->get('shared_cart_' . $shareCode);

        if (!$cartData) {
            return response()->json([
                'success' => false,
                'message' => 'Liên kết giỏ hàng không tồn tại hoặc đã hết hạn.'
            ], 404);
        }

        // Lấy thông tin chi tiết sản phẩm từ CSDL để cập nhật giá và tồn kho mới nhất
        $itemIds = array_column($cartData['items'], 'id');
        $products = Product::with(['images', 'category'])->whereIn('id', $itemIds)->get()->keyBy('id');

        $detailedItems = [];
        $totalAmount = 0;

        foreach ($cartData['items'] as $item) {
            $prod = $products->get($item['id']);
            if (!$prod) continue;

            $price = $prod->discount_price ?: $prod->price;
            $quantity = $item['quantity'];
            $itemTotal = $price * $quantity;
            $totalAmount += $itemTotal;

            $primaryImg = $prod->images->where('is_primary', 1)->first() 
                ?: $prod->images->first();

            $detailedItems[] = [
                'id' => $prod->id,
                'name' => $prod->name,
                'slug' => $prod->slug,
                'price' => (float) $price,
                'original_price' => (float) $prod->price,
                'quantity' => $quantity,
                'size' => $item['size'] ?? 'M',
                'color' => $item['color'] ?? 'Black',
                'image' => $primaryImg ? $primaryImg->image_url : null,
                'category_name' => $prod->category ? $prod->category->name : ''
            ];
        }

        return response()->json([
            'success' => true,
            'share_code' => $shareCode,
            'sender_name' => $cartData['sender_name'],
            'created_at' => $cartData['created_at'],
            'total_amount' => $totalAmount,
            'items_count' => count($detailedItems),
            'items' => $detailedItems
        ]);
    }
}
