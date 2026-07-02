<?php
class Product {
    private $conn;
    private $table_name = "products";

    public function __construct($db) {
        $this->conn = $db;
    }

    // Lấy tất cả sản phẩm
    public function getAll($filters = []) {
        $query = "SELECT p.id, p.name, p.price, p.discount_price, p.status, pi.image_url 
                  FROM " . $this->table_name . " p
                  LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
                  WHERE p.status = 'active'";
                  
        $params = [];

        if (!empty($filters['search'])) {
            $query .= " AND (p.name LIKE :search OR p.description LIKE :search)";
            $params[':search'] = '%' . $filters['search'] . '%';
        }

        if (!empty($filters['category'])) {
            $query .= " AND p.category_id = :category";
            $params[':category'] = $filters['category'];
        }

        if (isset($filters['min_price']) && is_numeric($filters['min_price'])) {
            $query .= " AND (IFNULL(p.discount_price, p.price) >= :min_price)";
            $params[':min_price'] = $filters['min_price'];
        }

        if (isset($filters['max_price']) && is_numeric($filters['max_price'])) {
            $query .= " AND (IFNULL(p.discount_price, p.price) <= :max_price)";
            $params[':max_price'] = $filters['max_price'];
        }

        // Sorting
        $sort = isset($filters['sort']) ? $filters['sort'] : 'newest';
        switch ($sort) {
            case 'price_asc':
                $query .= " ORDER BY IFNULL(p.discount_price, p.price) ASC";
                break;
            case 'price_desc':
                $query .= " ORDER BY IFNULL(p.discount_price, p.price) DESC";
                break;
            case 'newest':
            default:
                $query .= " ORDER BY p.created_at DESC";
                break;
        }
                  
        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => &$val) {
            $stmt->bindParam($key, $val);
        }
        $stmt->execute();
        
        return $stmt;
    }
}
?>
