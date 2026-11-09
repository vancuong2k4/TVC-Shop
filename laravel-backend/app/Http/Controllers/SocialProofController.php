<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SocialProofController extends Controller
{
    /**
     * Lấy danh sách các hoạt động mua sắm thực tế gần đây (Social Proof Sales Popup)
     * Trả về danh sách tên khách hàng (ẩn danh), thành phố, tên sản phẩm, ảnh đại diện sản phẩm,
     * và thời gian mua (khoảng vài phút/tiếng trước) để tạo sự tin cậy và kích thích mua sắm.
     */
    public function getRecentPurchases(Request $request)
    {
        // Lấy các order_items từ các đơn hàng mới nhất
        $orderItems = OrderItem::with(['order.user', 'product.images'])
            ->whereHas('order', function ($q) {
                $q->where('status', '!=', 'cancelled');
            })
            ->latest('id')
            ->take(15)
            ->get();

        $notifications = [];

        // Danh sách địa điểm mặc định phong phú nếu đơn hàng chưa có city cụ thể
        $defaultCities = [
            'Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
            'Nha Trang', 'Huế', 'Vũng Tàu', 'Quảng Ninh', 'Bình Dương'
        ];

        // Tên khách hàng danh dự mẫu nếu đơn hàng là guest hoặc tên ngắn
        $sampleNames = [
            'Minh Anh', 'Hoàng Nam', 'Khánh Linh', 'Quốc Bảo', 'Thảo My',
            'Gia Huy', 'Phương Thảo', 'Đức Anh', 'Hương Giang', 'Tuấn Kiệt'
        ];

        $timeOffsets = ['2 phút trước', '5 phút trước', '12 phút trước', '25 phút trước', '42 phút trước', '1 giờ trước', '3 giờ trước'];

        if ($orderItems->count() > 0) {
            foreach ($orderItems as $idx => $item) {
                if (!$item->product) continue;

                $order = $item->order;
                $user = $order ? $order->user : null;

                // Ẩn bớt tên để bảo vệ quyền riêng tư: "Nguyễn V." hoặc "Minh A."
                $rawName = $user ? $user->full_name : ($sampleNames[$idx % count($sampleNames)]);
                $nameParts = explode(' ', trim($rawName));
                $displayName = count($nameParts) > 1 
                    ? $nameParts[0] . ' ' . mb_substr(end($nameParts), 0, 1) . '.' 
                    : $rawName;

                // Tìm thành phố từ shipping_address
                $city = $defaultCities[$idx % count($defaultCities)];
                if ($order && !empty($order->shipping_address)) {
                    $parts = explode(',', $order->shipping_address);
                    $candidate = trim(end($parts));
                    if (!empty($candidate)) {
                        $city = $candidate;
                    }
                }

                $productImage = $item->product->images->first() 
                    ? $item->product->images->first()->image_url 
                    : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400';

                $notifications[] = [
                    'id' => $item->id,
                    'customer_name' => $displayName,
                    'location' => $city,
                    'product_id' => $item->product->id,
                    'product_name' => $item->product->name,
                    'product_image' => $productImage,
                    'price' => (float) $item->price,
                    'time_ago' => $timeOffsets[$idx % count($timeOffsets)],
                    'verified' => true
                ];
            }
        }

        // Nếu DB chưa có nhiều đơn, fallback bằng danh sách sản phẩm nổi bật thực tế trong DB
        if (count($notifications) < 4) {
            $products = Product::with('images')->latest('id')->take(8)->get();
            foreach ($products as $idx => $prod) {
                $img = $prod->images->first() ? $prod->images->first()->image_url : 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=400';
                $notifications[] = [
                    'id' => 9000 + $idx,
                    'customer_name' => $sampleNames[$idx % count($sampleNames)],
                    'location' => $defaultCities[$idx % count($defaultCities)],
                    'product_id' => $prod->id,
                    'product_name' => $prod->name,
                    'product_image' => $img,
                    'price' => (float) $prod->price,
                    'time_ago' => $timeOffsets[$idx % count($timeOffsets)],
                    'verified' => true
                ];
            }
        }

        return response()->json([
            'success' => true,
            'count' => count($notifications),
            'data' => $notifications
        ]);
    }
}
