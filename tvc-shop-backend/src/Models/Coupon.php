<?php
class Coupon {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function validateCode($code) {
        $query = "SELECT * FROM coupons WHERE code = :code LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":code", $code);
        $stmt->execute();
        
        $coupon = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$coupon) {
            return ["valid" => false, "message" => "Mã giảm giá không tồn tại."];
        }
        
        // Check valid_until
        if (!empty($coupon['valid_until']) && strtotime($coupon['valid_until']) < time()) {
            return ["valid" => false, "message" => "Mã giảm giá đã hết hạn."];
        }
        
        // Check max_uses
        if (!empty($coupon['max_uses']) && $coupon['current_uses'] >= $coupon['max_uses']) {
            return ["valid" => false, "message" => "Mã giảm giá đã hết lượt sử dụng."];
        }
        
        return ["valid" => true, "data" => $coupon];
    }
}
?>
