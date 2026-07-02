<?php
class Order {
    private $conn;
    private $table_name = "orders";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function create($user_id, $total_amount, $shipping_address, $payment_method, $items, $coupon_id = null) {
        try {
            // Bắt đầu transaction (Nếu 1 query lỗi, toàn bộ sẽ bị hủy để bảo vệ dữ liệu)
            $this->conn->beginTransaction();

            // 1. Lưu Order (Bảng orders)
            $query = "INSERT INTO " . $this->table_name . " 
                      (user_id, coupon_id, total_amount, shipping_address, payment_method, status) 
                      VALUES (:user_id, :coupon_id, :total_amount, :shipping_address, :payment_method, 'pending')";
            $stmt = $this->conn->prepare($query);

            $stmt->bindParam(":user_id", $user_id);
            $stmt->bindParam(":coupon_id", $coupon_id);
            $stmt->bindParam(":total_amount", $total_amount);
            $stmt->bindParam(":shipping_address", $shipping_address);
            $stmt->bindParam(":payment_method", $payment_method);
            
            if (!$stmt->execute()) {
                throw new Exception("Không thể tạo đơn hàng chính.");
            }

            // Lấy ID đơn hàng vừa tạo
            $order_id = $this->conn->lastInsertId();

            // 2. Lưu Order Items (Bảng order_items)
            $queryItem = "INSERT INTO order_items (order_id, product_id, quantity, price) 
                          VALUES (:order_id, :product_id, :quantity, :price)";
            $stmtItem = $this->conn->prepare($queryItem);

            foreach ($items as $item) {
                $stmtItem->bindParam(":order_id", $order_id);
                $stmtItem->bindParam(":product_id", $item->id);
                $stmtItem->bindParam(":quantity", $item->quantity);
                $stmtItem->bindParam(":price", $item->price);
                
                if (!$stmtItem->execute()) {
                    throw new Exception("Không thể lưu chi tiết sản phẩm.");
                }
            }

            // 3. Cập nhật lượt dùng mã giảm giá nếu có
            if ($coupon_id) {
                $couponQuery = "UPDATE coupons SET current_uses = current_uses + 1 WHERE id = :coupon_id";
                $couponStmt = $this->conn->prepare($couponQuery);
                $couponStmt->bindParam(":coupon_id", $coupon_id);
                $couponStmt->execute();
            }

            // Lưu thay đổi vào DB
            $this->conn->commit();
            return $order_id;

        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function getByUserId($user_id) {
        $query = "SELECT o.id, o.total_amount, o.status, o.created_at,
                         oi.quantity, oi.price, p.name, pi.image_url
                  FROM " . $this->table_name . " o
                  LEFT JOIN order_items oi ON o.id = oi.order_id
                  LEFT JOIN products p ON oi.product_id = p.id
                  LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                  WHERE o.user_id = :user_id
                  ORDER BY o.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Nhóm các Order Items theo từng Order ID
        $orders = [];
        foreach ($results as $row) {
            $order_id = $row['id'];
            if (!isset($orders[$order_id])) {
                $orders[$order_id] = [
                    'id' => $order_id,
                    'total_amount' => $row['total_amount'],
                    'status' => $row['status'],
                    'created_at' => $row['created_at'],
                    'items' => []
                ];
            }
            if ($row['name']) {
                $orders[$order_id]['items'][] = [
                    'name' => $row['name'],
                    'quantity' => $row['quantity'],
                    'price' => $row['price'],
                    'image_url' => $row['image_url']
                ];
            }
        }
        
        return array_values($orders);
    }
}
?>
