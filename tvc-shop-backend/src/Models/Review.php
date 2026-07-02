<?php
class Review {
    private $conn;
    private $table_name = "reviews";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function hasPurchased($user_id, $product_id) {
        $query = "SELECT o.id 
                  FROM orders o 
                  JOIN order_items oi ON o.id = oi.order_id 
                  WHERE o.user_id = :user_id AND oi.product_id = :product_id 
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function hasReviewed($user_id, $product_id) {
        $query = "SELECT id FROM " . $this->table_name . " WHERE user_id = :user_id AND product_id = :product_id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function addReview($user_id, $product_id, $rating, $comment) {
        $query = "INSERT INTO " . $this->table_name . " (user_id, product_id, rating, comment) VALUES (:user_id, :product_id, :rating, :comment)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->bindParam(":rating", $rating);
        $stmt->bindParam(":comment", $comment);
        return $stmt->execute();
    }

    public function getByProductId($product_id) {
        $query = "SELECT r.id, r.rating, r.comment, r.created_at, u.full_name 
                  FROM " . $this->table_name . " r 
                  JOIN users u ON r.user_id = u.id 
                  WHERE r.product_id = :product_id 
                  ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":product_id", $product_id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
