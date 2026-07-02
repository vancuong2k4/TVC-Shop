<?php
class Admin {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getDashboardStats() {
        $stats = [];
        
        $stmt = $this->conn->query("SELECT SUM(total_amount) as revenue FROM orders WHERE status != 'cancelled'");
        $stats['revenue'] = $stmt->fetch(PDO::FETCH_ASSOC)['revenue'] ?? 0;

        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM orders");
        $stats['total_orders'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");
        $stats['total_users'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

        $stmt = $this->conn->query("SELECT COUNT(*) as count FROM products");
        $stats['total_products'] = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

        return $stats;
    }

    public function getAllOrders() {
        $query = "SELECT o.*, u.full_name, u.email 
                  FROM orders o 
                  JOIN users u ON o.user_id = u.id 
                  ORDER BY o.created_at DESC";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateOrderStatus($order_id, $status) {
        $query = "UPDATE orders SET status = :status WHERE id = :order_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":order_id", $order_id);
        return $stmt->execute();
    }

    public function createProduct($data) {
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->name)));
        // Sinh số ngẫu nhiên vào cuối slug để đảm bảo unique (giả lập đơn giản)
        $slug .= '-' . rand(1000, 9999);

        $query = "INSERT INTO products (name, slug, description, price, discount_price, category_id, status) 
                  VALUES (:name, :slug, :description, :price, :discount_price, :category_id, :status)";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":name", $data->name);
        $stmt->bindParam(":slug", $slug);
        
        // Handle optional description
        $description = !empty($data->description) ? $data->description : '';
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":price", $data->price);
        
        $discount_price = !empty($data->discount_price) ? $data->discount_price : null;
        $category_id = !empty($data->category_id) ? $data->category_id : null;
        $status = !empty($data->status) ? $data->status : 'active';

        $stmt->bindParam(":discount_price", $discount_price);
        $stmt->bindParam(":category_id", $category_id);
        $stmt->bindParam(":status", $status);
        
        if ($stmt->execute()) {
            $product_id = $this->conn->lastInsertId();
            
            if (!empty($data->image_url)) {
                $imgQuery = "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (:product_id, :image_url, 1)";
                $imgStmt = $this->conn->prepare($imgQuery);
                $imgStmt->bindParam(":product_id", $product_id);
                $imgStmt->bindParam(":image_url", $data->image_url);
                $imgStmt->execute();
            }
            return true;
        }
        return false;
    }

    public function updateProduct($id, $data) {
        $query = "UPDATE products SET name = :name, description = :description, price = :price, 
                  discount_price = :discount_price, status = :status WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":name", $data->name);
        
        $description = !empty($data->description) ? $data->description : '';
        $stmt->bindParam(":description", $description);
        $stmt->bindParam(":price", $data->price);
        
        $discount_price = !empty($data->discount_price) ? $data->discount_price : null;
        $status = !empty($data->status) ? $data->status : 'active';
        
        $stmt->bindParam(":discount_price", $discount_price);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id", $id);
        
        if ($stmt->execute()) {
            if (!empty($data->image_url)) {
                $checkQuery = "SELECT id FROM product_images WHERE product_id = :id AND is_primary = 1";
                $checkStmt = $this->conn->prepare($checkQuery);
                $checkStmt->bindParam(":id", $id);
                $checkStmt->execute();
                
                if ($checkStmt->rowCount() > 0) {
                    $imgQuery = "UPDATE product_images SET image_url = :image_url WHERE product_id = :id AND is_primary = 1";
                } else {
                    $imgQuery = "INSERT INTO product_images (product_id, image_url, is_primary) VALUES (:id, :image_url, 1)";
                }
                
                $imgStmt = $this->conn->prepare($imgQuery);
                $imgStmt->bindParam(":id", $id);
                $imgStmt->bindParam(":image_url", $data->image_url);
                $imgStmt->execute();
            }
            return true;
        }
        return false;
    }

    public function deleteProduct($id) {
        $query = "DELETE FROM products WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }

    // --- QUẢN LÝ MÃ GIẢM GIÁ ---
    public function getCoupons() {
        $query = "SELECT * FROM coupons ORDER BY created_at DESC";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createCoupon($data) {
        $query = "INSERT INTO coupons (code, discount_percentage, max_uses, valid_until) 
                  VALUES (:code, :discount_percentage, :max_uses, :valid_until)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":code", $data->code);
        $stmt->bindParam(":discount_percentage", $data->discount_percentage);
        
        $max_uses = !empty($data->max_uses) ? $data->max_uses : null;
        $valid_until = !empty($data->valid_until) ? $data->valid_until : null;
        
        $stmt->bindParam(":max_uses", $max_uses);
        $stmt->bindParam(":valid_until", $valid_until);
        
        return $stmt->execute();
    }

    public function deleteCoupon($id) {
        $query = "DELETE FROM coupons WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $id);
        return $stmt->execute();
    }
}
?>
