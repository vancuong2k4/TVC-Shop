<?php
require_once __DIR__ . '/../Models/Product.php';

class ProductController {
    private $db;
    private $product;

    public function __construct($db) {
        $this->db = $db;
        $this->product = new Product($db);
    }

    public function getAll() {
        $filters = [
            'search' => isset($_GET['search']) ? $_GET['search'] : null,
            'category' => isset($_GET['category']) ? $_GET['category'] : null,
            'min_price' => isset($_GET['min_price']) ? $_GET['min_price'] : null,
            'max_price' => isset($_GET['max_price']) ? $_GET['max_price'] : null,
            'sort' => isset($_GET['sort']) ? $_GET['sort'] : null,
        ];
        
        $stmt = $this->product->getAll($filters);
        $num = $stmt->rowCount();

        if($num > 0) {
            $products_arr = array();
            
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $discount = null;
                if($row['discount_price']) {
                    $discount = round((($row['price'] - $row['discount_price']) / $row['price']) * 100);
                }

                $product_item = array(
                    "id" => $row['id'],
                    "name" => $row['name'],
                    "price" => $row['discount_price'] ? $row['discount_price'] : $row['price'],
                    "originalPrice" => $row['discount_price'] ? $row['price'] : null,
                    "discount" => $discount,
                    "image" => $row['image_url'] ? $row['image_url'] : 'https://via.placeholder.com/400x500?text=No+Image',
                    "isNew" => true // Có thể tính bằng khoảng cách so với ngày tạo
                );
                array_push($products_arr, $product_item);
            }

            http_response_code(200);
            echo json_encode($products_arr);
        } else {
            http_response_code(200);
            echo json_encode(array()); // Trả về mảng rỗng nếu chưa có dữ liệu
        }
    }
}
?>
