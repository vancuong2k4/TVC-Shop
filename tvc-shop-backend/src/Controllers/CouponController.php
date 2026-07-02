<?php
require_once __DIR__ . '/../Models/Coupon.php';

class CouponController {
    private $coupon;

    public function __construct($db) {
        $this->coupon = new Coupon($db);
    }

    public function validate() {
        $code = isset($_GET['code']) ? strtoupper(trim($_GET['code'])) : null;
        
        if (!$code) {
            http_response_code(400);
            echo json_encode(["message" => "Vui lòng nhập mã giảm giá."]);
            return;
        }

        $result = $this->coupon->validateCode($code);
        
        if ($result['valid']) {
            http_response_code(200);
            echo json_encode([
                "message" => "Áp dụng mã thành công.",
                "data" => [
                    "id" => $result['data']['id'],
                    "code" => $result['data']['code'],
                    "discount_percentage" => $result['data']['discount_percentage']
                ]
            ]);
        } else {
            http_response_code(400);
            echo json_encode(["message" => $result['message']]);
        }
    }
}
?>
