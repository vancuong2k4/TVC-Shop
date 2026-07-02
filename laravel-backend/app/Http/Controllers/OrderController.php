<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();
        $items = $request->input('items');

        if (empty($items) || count($items) == 0) {
            return response()->json(["message" => "Không thể thanh toán giỏ hàng trống."], 400);
        }

        // Tính lại tổng tiền
        $totalAmount = 0;
        foreach ($items as $item) {
            $totalAmount += ($item['price'] * $item['quantity']);
        }

        $couponId = $request->input('coupon_id');
        if ($couponId) {
            $coupon = Coupon::find($couponId);
            if ($coupon) {
                $discount = $totalAmount * ($coupon->discount_percentage / 100);
                $totalAmount -= $discount;
            }
        }

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $user->id,
                'coupon_id' => $couponId,
                'total_amount' => $totalAmount,
                'shipping_address' => $request->input('shipping_address', ''),
                'payment_method' => $request->input('payment_method', 'cod'),
                'status' => 'pending'
            ]);

            foreach ($items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            if ($couponId) {
                $coupon = Coupon::find($couponId);
                if ($coupon) {
                    $coupon->increment('current_uses');
                }
            }

            DB::commit();

            return response()->json([
                "message" => "Đặt hàng thành công!",
                "order_id" => $order->id
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(["message" => "Lỗi hệ thống khi tạo đơn hàng. Vui lòng thử lại sau."], 503);
        }
    }

    public function getUserOrders(Request $request)
    {
        $user = $request->user();
        $orders = Order::with(['items.product.images' => function ($query) {
            $query->where('is_primary', 1);
        }])->where('user_id', $user->id)
          ->orderBy('created_at', 'desc')
          ->get();

        $formattedOrders = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'total_amount' => $order->total_amount,
                'status' => $order->status,
                'created_at' => $order->created_at,
                'items' => $order->items->map(function ($item) {
                    $primaryImage = $item->product ? $item->product->images->first() : null;
                    return [
                        'name' => $item->product ? $item->product->name : 'Sản phẩm không tồn tại',
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'image_url' => $primaryImage ? $primaryImage->image_url : null
                    ];
                })
            ];
        });

        return response()->json($formattedOrders);
    }
}
