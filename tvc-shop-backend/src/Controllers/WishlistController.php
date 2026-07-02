<?php
require_once __DIR__ . '/../Models/Wishlist.php';
require_once __DIR__ . '/../Utils/JWTHandler.php';

class WishlistController {
    private $db;
    private $wishlist;

    public function __construct($db) {
        $this->db = $db;
        $this->wishlist = new Wishlist($db);
    }

    private function getUserIdFromToken() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (!$authHeader) return false;

        $tokenParts = explode(" ", $authHeader);
        $token = isset($tokenParts[1]) ? $tokenParts[1] : '';
        
        $decoded = JWTHandler::decode($token);
        if (!$decoded) return false;

        return $decoded['data']['id'];
    }

    public function toggle($data) {
        $user_id = $this->getUserIdFromToken();
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(["message" => "Vui lòng đăng nhập để sử dụng danh sách yêu thích."]);
            return;
        }

        if (empty($data->product_id)) {
            http_response_code(400);
            echo json_encode(["message" => "Không tìm thấy ID sản phẩm."]);
            return;
        }

        $result = $this->wishlist->toggle($user_id, $data->product_id);
        if ($result) {
            http_response_code(200);
            echo json_encode(["message" => "Cập nhật thành công", "action" => $result['status']]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi hệ thống."]);
        }
    }

    public function getUserWishlist() {
        $user_id = $this->getUserIdFromToken();
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(["message" => "Vui lòng đăng nhập để sử dụng danh sách yêu thích."]);
            return;
        }

        $items = $this->wishlist->getByUserId($user_id);
        http_response_code(200);
        echo json_encode($items);
    }
}
?>
