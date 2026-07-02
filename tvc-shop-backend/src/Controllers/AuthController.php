<?php
require_once __DIR__ . '/../Models/User.php';
require_once __DIR__ . '/../Utils/JWTHandler.php';

class AuthController {
    private $db;
    private $user;

    public function __construct($db) {
        $this->db = $db;
        $this->user = new User($db);
    }

    public function register($data) {
        if(empty($data->email) || empty($data->password) || empty($data->full_name)) {
            http_response_code(400);
            echo json_encode(["message" => "Vui lòng điền đủ thông tin email, password và full_name."]);
            return;
        }

        if($this->user->emailExists($data->email)) {
            http_response_code(400);
            echo json_encode(["message" => "Email đã tồn tại trong hệ thống."]);
            return;
        }

        $phone = isset($data->phone) ? $data->phone : "";
        if($this->user->create($data->email, $data->password, $data->full_name, $phone)) {
            http_response_code(201);
            echo json_encode(["message" => "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể đăng ký. Lỗi hệ thống Database."]);
        }
    }

    public function login($data) {
        if(empty($data->email) || empty($data->password)) {
            http_response_code(400);
            echo json_encode(["message" => "Vui lòng nhập đầy đủ email và password."]);
            return;
        }

        $userInfo = $this->user->emailExists($data->email);

        // Kiểm tra mật khẩu
        if($userInfo && password_verify($data->password, $userInfo['password'])) {
            $payload = [
                "iss" => "tvc-shop",
                "aud" => "tvc-shop-users",
                "iat" => time(),
                "exp" => time() + (60 * 60 * 24), // Hết hạn sau 24h
                "data" => [
                    "id" => $userInfo['id'],
                    "email" => $userInfo['email'],
                    "full_name" => $userInfo['full_name'],
                    "role" => $userInfo['role']
                ]
            ];

            // Tạo Token JWT
            $jwt = JWTHandler::encode($payload);
            http_response_code(200);
            echo json_encode([
                "message" => "Đăng nhập thành công.",
                "token" => $jwt,
                "user" => [
                    "id" => $userInfo['id'],
                    "email" => $userInfo['email'],
                    "full_name" => $userInfo['full_name'],
                    "role" => $userInfo['role']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Email hoặc mật khẩu không chính xác."]);
        }
    }
}
?>
