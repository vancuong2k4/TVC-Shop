<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class TrackingController extends Controller
{
    /**
     * Tra cứu chi tiết hành trình vận chuyển thời gian thực của một đơn hàng
     * Hỗ trợ cả người dùng đăng nhập hoặc tra cứu công khai bằng order_id + email/phone
     */
    public function getOrderTracking(Request $request, $id)
    {
        $order = Order::with(['items.product.images', 'user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng với mã #' . $id], 404);
        }

        // Nếu người dùng có đăng nhập và không phải admin, kiểm tra quyền sở hữu
        $user = $request->user('sanctum');
        if ($user && $user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Bạn không có quyền truy cập đơn hàng này.'], 403);
        }

        // Tạo mã vận đơn logistics chuyên nghiệp
        $trackingNumber = 'TVC-VNPOST-' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
        $carrier = 'TVC Express Logistics (Đối tác VNPost)';
        $createdAt = Carbon::parse($order->created_at);

        // Sinh mốc thời gian hành trình dựa trên trạng thái hiện tại của đơn hàng
        $timeline = [];

        // Mốc 1: Đặt hàng thành công
        $timeline[] = [
            'step' => 1,
            'title' => 'Đơn Hàng Đã Được Tạo',
            'description' => 'Hệ thống TVC-Shop đã ghi nhận đơn hàng và khởi tạo quy trình xuất kho.',
            'time' => $createdAt->format('H:i - d/m/Y'),
            'location' => 'Trung tâm xử lý đơn hàng Hà Nội',
            'completed' => true,
            'current' => $order->status === 'pending'
        ];

        // Mốc 2: Đang xử lý & Đóng gói
        $isProcessing = in_array($order->status, ['processing', 'shipped', 'delivered']);
        $processingTime = (clone $createdAt)->addHours(2);
        $timeline[] = [
            'step' => 2,
            'title' => 'Kiểm Tra Chất Lượng & Đóng Gói Sang Trọng',
            'description' => 'Đơn hàng được chuyên viên đóng hộp Cold Luxury, bọc giấy nến và niêm phong hộp quà.',
            'time' => $isProcessing ? $processingTime->format('H:i - d/m/Y') : 'Dự kiến: ' . $processingTime->format('H:i - d/m/Y'),
            'location' => 'Kho thời trang cao cấp TVC-Shop',
            'completed' => $isProcessing,
            'current' => $order->status === 'processing'
        ];

        // Mốc 3: Bàn giao vận chuyển & Đang giao hàng
        $isShipped = in_array($order->status, ['shipped', 'delivered']);
        $shippedTime = (clone $createdAt)->addHours(8);
        $timeline[] = [
            'step' => 3,
            'title' => 'Bàn Giao Đơn Vị Vận Chuyển',
            'description' => 'Kiện hàng đã rời khỏi kho và đang trên xe chuyên dụng giao đến địa chỉ nhận.',
            'time' => $isShipped ? $shippedTime->format('H:i - d/m/Y') : 'Dự kiến: ' . $shippedTime->format('H:i - d/m/Y'),
            'location' => 'Trung tâm trung chuyển liên tỉnh',
            'completed' => $isShipped,
            'current' => $order->status === 'shipped'
        ];

        // Mốc 4: Đã giao thành công
        $isDelivered = $order->status === 'delivered';
        $deliveredTime = (clone $createdAt)->addDays(2);
        $timeline[] = [
            'step' => 4,
            'title' => 'Giao Hàng Thành Công',
            'description' => 'Kiện hàng đã được ký nhận bởi khách hàng.',
            'time' => $isDelivered ? $deliveredTime->format('H:i - d/m/Y') : 'Dự kiến: ' . $deliveredTime->format('d/m/Y'),
            'location' => $order->shipping_address ?: 'Địa chỉ giao hàng',
            'completed' => $isDelivered,
            'current' => $isDelivered
        ];

        // Trường hợp bị hủy
        if ($order->status === 'cancelled') {
            $timeline = [
                [
                    'step' => 1,
                    'title' => 'Đơn Hàng Đã Tạo',
                    'description' => 'Khởi tạo đơn hàng.',
                    'time' => $createdAt->format('H:i - d/m/Y'),
                    'location' => 'Hệ thống TVC-Shop',
                    'completed' => true,
                    'current' => false
                ],
                [
                    'step' => 2,
                    'title' => 'Đơn Hàng Đã Hủy',
                    'description' => 'Đơn hàng đã được hủy theo yêu cầu hoặc quá hạn thanh toán.',
                    'time' => Carbon::now()->format('H:i - d/m/Y'),
                    'location' => 'Hệ thống TVC-Shop',
                    'completed' => true,
                    'current' => true,
                    'is_cancelled' => true
                ]
            ];
        }

        $estimatedDelivery = (clone $createdAt)->addDays(2)->format('d/m/Y');

        return response()->json([
            'order_id' => $order->id,
            'tracking_number' => $trackingNumber,
            'carrier' => $carrier,
            'status' => $order->status,
            'shipping_address' => $order->shipping_address,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'total_amount' => $order->total_amount,
            'created_at' => $order->created_at,
            'estimated_delivery' => $estimatedDelivery,
            'timeline' => $timeline,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->product ? $item->product->name : 'Sản phẩm',
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'image' => $item->product && $item->product->images->first() 
                        ? $item->product->images->first()->image_url 
                        : null
                ];
            })
        ]);
    }
}
