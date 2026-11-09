<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Lấy danh sách thông báo hoạt động của người dùng
     */
    public function getNotifications(Request $request)
    {
        $user = $request->user();

        // Tạo danh sách thông báo động từ lịch sử đơn hàng và khuyến mãi của user
        $orders = Order::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        $notifications = [];

        foreach ($orders as $order) {
            $statusText = 'Đang xử lý';
            $type = 'order_processing';
            $iconType = 'clock';

            if ($order->status === 'delivered') {
                $statusText = 'Giao hàng thành công';
                $type = 'order_delivered';
                $iconType = 'check';
            } elseif ($order->status === 'shipped') {
                $statusText = 'Đang trên đường giao';
                $type = 'order_shipped';
                $iconType = 'truck';
            } elseif ($order->status === 'cancelled') {
                $statusText = 'Đã hủy';
                $type = 'order_cancelled';
                $iconType = 'x';
            }

            $notifications[] = [
                'id' => 'ord_' . $order->id . '_' . $order->status,
                'title' => 'Đơn hàng #' . $order->id . ' - ' . $statusText,
                'message' => 'Kiện hàng trị giá ' . number_format($order->total_amount, 0, ',', '.') . ' ₫ hiện đang ở trạng thái: ' . $statusText . '.',
                'type' => $type,
                'icon' => $iconType,
                'link' => '/orders',
                'is_read' => $order->status === 'delivered',
                'created_at' => $order->created_at ? $order->created_at->toISOString() : now()->toISOString()
            ];
        }

        // Bổ sung thông báo chào mừng & coupon ưu đãi
        $notifications[] = [
            'id' => 'welcome_tvc',
            'title' => 'Chào mừng bạn đến với TVC-Shop',
            'message' => 'Cảm ơn bạn đã đồng hành cùng thương hiệu thời trang tối giản TVC-Shop.',
            'type' => 'system',
            'icon' => 'sparkles',
            'link' => '/shop',
            'is_read' => true,
            'created_at' => $user->created_at ? $user->created_at->toISOString() : now()->toISOString()
        ];

        $unreadCount = count(array_filter($notifications, function ($n) {
            return !$n['is_read'];
        }));

        return response()->json([
            'unread_count' => $unreadCount,
            'notifications' => $notifications
        ]);
    }

    /**
     * Đánh dấu toàn bộ thông báo là đã đọc
     */
    public function markAllAsRead(Request $request)
    {
        return response()->json([
            'message' => 'Đã đánh dấu tất cả thông báo là đã đọc.',
            'unread_count' => 0
        ]);
    }
}
