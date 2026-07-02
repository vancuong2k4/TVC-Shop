<?php
class Wishlist {
    private $conn;
    private $table_name = "wishlists";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function toggle($user_id, $product_id) {
        // Kiểm tra xem đã có trong wishlist chưa
        $query = "SELECT id FROM " . $this->table_name . " WHERE user_id = :user_id AND product_id = :product_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            // Có rồi thì Xóa (Unlike)
            $queryDelete = "DELETE FROM " . $this->table_name . " WHERE user_id = :user_id AND product_id = :product_id";
            $stmtDel = $this->conn->prepare($queryDelete);
            $stmtDel->bindParam(":user_id", $user_id);
            $stmtDel->bindParam(":product_id", $product_id);
            if ($stmtDel->execute()) {
                return ["status" => "removed"];
            }
        } else {
            // Chưa có thì Thêm (Like)
            $queryAdd = "INSERT INTO " . $this->table_name . " (user_id, product_id) VALUES (:user_id, :product_id)";
            $stmtAdd = $this->conn->prepare($queryAdd);
            $stmtAdd->bindParam(":user_id", $user_id);
            $stmtAdd->bindParam(":product_id", $product_id);
            if ($stmtAdd->execute()) {
                return ["status" => "added"];
            }
        }
        return false;
    }

    public function getByUserId($user_id) {
        $query = "SELECT p.id, p.name, p.slug, p.price, p.discount_price, pi.image_url 
                  FROM " . $this->table_name . " w
                  JOIN products p ON w.product_id = p.id
                  LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                  WHERE w.user_id = :user_id
                  ORDER BY w.created_at DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
