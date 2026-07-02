<?php
require_once __DIR__ . '/../Models/Order.php';
require_once __DIR__ . '/../Utils/JWTHandler.php';

class OrderController {
    private $db;
    private $order;

    public function __construct($db) {
        $this->db = $db;
        $this->order = new Order($db);
    }

    public function create($data) {
        // Bảo mật: Kiểm tra JWT Token trong Header
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(["message" => "Truy cập bị từ chối. Không tìm thấy Token xác thực."]);
            return;
        }

        $tokenParts = explode(" ", $authHeader);
        $token = isset($tokenParts[1]) ? $tokenParts[1] : '';
        
        $decoded = JWTHandler::decode($token);
        if (!$decoded) {
            http_response_code(401);
            echo json_encode(["message" => "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."]);
            return;
        }

        $user_id = $decoded['data']['id'];

        if (empty($data->items) || count($data->items) == 0) {
            http_response_code(400);
            echo json_encode(["message" => "Không thể thanh toán giỏ hàng trống."]);
            return;
        }

        // Tính lại tổng tiền ở Backend (Không tin tưởng hoàn toàn vào Frontend gửi lên)
        $total_amount = 0;
        foreach ($data->items as $item) {
            $total_amount += ($item->price * $item->quantity);
        }

        // Tạo đơn hàng
        $shipping_address = isset($data->shipping_address) ? $data->shipping_address : '';
        $payment_method = isset($data->payment_method) ? $data->payment_method : 'cod';

        $order_id = $this->order->create($user_id, $total_amount, $shipping_address, $payment_method, $data->items);

        if ($order_id) {
            http_response_code(201);
            echo json_encode([
                "message" => "Đặt hàng thành công!",
                "order_id" => $order_id
            ]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Lỗi hệ thống khi tạo đơn hàng. Vui lòng thử lại sau."]);
        }
    }

    public function getUserOrders() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (!$authHeader) {
            http_response_code(401);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }

        $tokenParts = explode(" ", $authHeader);
        $token = isset($tokenParts[1]) ? $tokenParts[1] : '';
        
        $decoded = JWTHandler::decode($token);
        if (!$decoded) {
            http_response_code(401);
            echo json_encode(["message" => "Token không hợp lệ."]);
            return;
        }

        $user_id = $decoded['data']['id'];
        $orders = $this->order->getByUserId($user_id);
        
        http_response_code(200);
        echo json_encode($orders);
    }
}
?>
