<?php
require_once __DIR__ . '/../Models/Admin.php';
require_once __DIR__ . '/../Utils/JWTHandler.php';

class AdminController {
    private $db;
    private $admin;

    public function __construct($db) {
        $this->db = $db;
        $this->admin = new Admin($db);
    }

    private function checkAdmin() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (!$authHeader) return false;

        $tokenParts = explode(" ", $authHeader);
        $token = isset($tokenParts[1]) ? $tokenParts[1] : '';
        
        $decoded = JWTHandler::decode($token);
        if (!$decoded) return false;

        if (isset($decoded['data']['role']) && $decoded['data']['role'] === 'admin') {
            return true;
        }
        
        return false;
    }

    public function getDashboard() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối. Quyền Admin là bắt buộc."]);
            return;
        }

        $stats = $this->admin->getDashboardStats();
        http_response_code(200);
        echo json_encode($stats);
    }

    public function getOrders() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối. Quyền Admin là bắt buộc."]);
            return;
        }

        $orders = $this->admin->getAllOrders();
        http_response_code(200);
        echo json_encode($orders);
    }

    public function updateOrderStatus($data) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối. Quyền Admin là bắt buộc."]);
            return;
        }

        if (isset($data->order_id) && isset($data->status)) {
            if ($this->admin->updateOrderStatus($data->order_id, $data->status)) {
                http_response_code(200);
                echo json_encode(["message" => "Cập nhật trạng thái thành công."]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Lỗi khi cập nhật trạng thái."]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Dữ liệu gửi lên không hợp lệ."]);
        }
    }

    public function getProducts() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        $query = "SELECT p.*, pi.image_url 
                  FROM products p 
                  LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1 
                  ORDER BY p.created_at DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
        http_response_code(200);
        echo json_encode($products);
    }

    private function handleImageUpload() {
        if (isset($_FILES['image']) && $_FILES['image']['error'] == UPLOAD_ERR_OK) {
            $upload_dir = __DIR__ . '/../../public/uploads/products/';
            
            // Create directory if it doesn't exist
            if (!is_dir($upload_dir)) {
                mkdir($upload_dir, 0777, true);
            }

            $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
            $new_filename = uniqid('prod_') . '.' . $file_extension;
            $target_file = $upload_dir . $new_filename;

            // Validate file type
            $allowed_types = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
            if (!in_array(strtolower($file_extension), $allowed_types)) {
                return false;
            }

            if (move_uploaded_file($_FILES['image']['tmp_name'], $target_file)) {
                // Return relative URL that the frontend can use
                // Assuming XAMPP base path: /e-commerce/tvc-shop-backend/public/uploads/products/
                return 'http://localhost/e-commerce/tvc-shop-backend/public/uploads/products/' . $new_filename;
            }
        }
        return null;
    }

    public function createProduct($data) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        if (empty($data->name) || empty($data->price)) {
            http_response_code(400);
            echo json_encode(["message" => "Tên và Giá sản phẩm là bắt buộc."]);
            return;
        }

        $uploaded_image = $this->handleImageUpload();
        if ($uploaded_image) {
            $data->image_url = $uploaded_image;
        }

        if ($this->admin->createProduct($data)) {
            http_response_code(201);
            echo json_encode(["message" => "Đã thêm sản phẩm thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi thêm sản phẩm."]);
        }
    }

    public function updateProduct($data) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        if (empty($data->id) || empty($data->name) || empty($data->price)) {
            http_response_code(400);
            echo json_encode(["message" => "Thiếu thông tin bắt buộc."]);
            return;
        }

        $uploaded_image = $this->handleImageUpload();
        if ($uploaded_image) {
            $data->image_url = $uploaded_image;
        }

        if ($this->admin->updateProduct($data->id, $data)) {
            http_response_code(200);
            echo json_encode(["message" => "Đã cập nhật sản phẩm thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi cập nhật sản phẩm."]);
        }
    }

    public function deleteProduct() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "Thiếu ID sản phẩm."]);
            return;
        }
        if ($this->admin->deleteProduct($id)) {
            http_response_code(200);
            echo json_encode(["message" => "Đã xóa sản phẩm thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi xóa sản phẩm."]);
        }
    }

    // --- QUẢN LÝ MÃ GIẢM GIÁ ---
    public function getCoupons() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        $coupons = $this->admin->getCoupons();
        http_response_code(200);
        echo json_encode($coupons);
    }

    public function createCoupon($data) {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        if (empty($data->code) || empty($data->discount_percentage)) {
            http_response_code(400);
            echo json_encode(["message" => "Mã và phần trăm giảm giá là bắt buộc."]);
            return;
        }
        if ($this->admin->createCoupon($data)) {
            http_response_code(201);
            echo json_encode(["message" => "Đã tạo mã giảm giá thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi tạo mã giảm giá. Có thể mã đã tồn tại."]);
        }
    }

    public function deleteCoupon() {
        if (!$this->checkAdmin()) {
            http_response_code(403);
            echo json_encode(["message" => "Truy cập bị từ chối."]);
            return;
        }
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "Thiếu ID mã giảm giá."]);
            return;
        }
        if ($this->admin->deleteCoupon($id)) {
            http_response_code(200);
            echo json_encode(["message" => "Đã xóa mã giảm giá thành công."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi khi xóa mã giảm giá."]);
        }
    }
    // --- QUẢN LÝ BLOG (TẠP CHÍ) ---
    public function getBlogs() {
        if (!$this->isAdmin()) return;
        require_once __DIR__ . '/../Models/Blog.php';
        $blogModel = new Blog($this->db);
        $blogs = $blogModel->getAll();
        http_response_code(200);
        echo json_encode($blogs);
    }

    public function createBlog($data) {
        if (!$this->isAdmin()) return;
        require_once __DIR__ . '/../Models/Blog.php';
        $blogModel = new Blog($this->db);
        
        if (empty($data->title) || empty($data->content)) {
            http_response_code(400);
            echo json_encode(["message" => "Vui lòng nhập Tiêu đề và Nội dung bài viết."]);
            return;
        }

        // Tạo slug từ title
        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data->title)));
        $slug = $slug . '-' . time(); // Đảm bảo unique

        // Lấy admin id (người đang đăng nhập)
        $admin_id = $this->getAdminId();

        $image_url = isset($data->image_url) ? $data->image_url : null;

        if ($blogModel->create($admin_id, $data->title, $slug, $data->content, $image_url)) {
            http_response_code(201);
            echo json_encode(["message" => "Tạo bài viết thành công."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể tạo bài viết."]);
        }
    }

    public function deleteBlog() {
        if (!$this->isAdmin()) return;
        require_once __DIR__ . '/../Models/Blog.php';
        $blogModel = new Blog($this->db);
        
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        if (!$id) {
            http_response_code(400);
            echo json_encode(["message" => "Thiếu ID bài viết."]);
            return;
        }

        if ($blogModel->delete($id)) {
            http_response_code(200);
            echo json_encode(["message" => "Đã xóa bài viết."]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Không thể xóa bài viết."]);
        }
    }

    // Helper method to get the current admin's ID
    private function getAdminId() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (!$authHeader) return 1; // Fallback to 1
        
        $tokenParts = explode(" ", $authHeader);
        $token = isset($tokenParts[1]) ? $tokenParts[1] : '';
        
        $decoded = JWTHandler::decode($token);
        if (!$decoded) return 1;
        
        return $decoded['data']['id'];
    }
}
?>
