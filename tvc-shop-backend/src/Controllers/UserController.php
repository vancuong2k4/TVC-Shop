<?php
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Utils/JWTHandler.php';

class UserController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
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

    public function getProfile() {
        $user_id = $this->getUserIdFromToken();
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }

        $profile = $this->user->getById($user_id);
        if ($profile) {
            http_response_code(200);
            echo json_encode($profile);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Không tìm thấy người dùng."]);
        }
    }

    public function updateProfile($data) {
        $user_id = $this->getUserIdFromToken();
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }

        if (empty($data->full_name)) {
            http_response_code(400);
            echo json_encode(["message" => "Họ và tên là bắt buộc."]);
            return;
        }

        if ($this->user->updateProfile($user_id, $data)) {
            http_response_code(200);
            echo json_encode(["message" => "Cập nhật hồ sơ thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi hệ thống, không thể cập nhật hồ sơ."]);
        }
    }
}
?>
