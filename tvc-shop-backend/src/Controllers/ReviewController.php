<?php
require_once __DIR__ . '/../Models/Review.php';
require_once __DIR__ . '/../Utils/JWTHandler.php';

class ReviewController {
    private $db;
    private $review;

    public function __construct($db) {
        $this->db = $db;
        $this->review = new Review($db);
    }

    private function getUserIdFromToken() {
        $headers = apache_request_headers();
        $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
        if (!$authHeader) return false;

        $tokenParts = explode(" ", $authHeader);
        $token = isset($tokenParts[1]) ? $tokenParts[1] : '';
        
        $decoded = JWTHandler::decode($token);
        if (!$decoded) return false;

        return $decoded['data']['id'];
    }

    public function getReviews() {
        $product_id = isset($_GET['product_id']) ? $_GET['product_id'] : null;
        if (!$product_id) {
            http_response_code(400);
            echo json_encode(["message" => "Thiếu product_id."]);
            return;
        }

        $reviews = $this->review->getByProductId($product_id);
        
        // Tính điểm trung bình (Tùy chọn)
        $totalRating = 0;
        foreach($reviews as $r) {
            $totalRating += $r['rating'];
        }
        $avgRating = count($reviews) > 0 ? round($totalRating / count($reviews), 1) : 0;

        http_response_code(200);
        echo json_encode([
            "average_rating" => $avgRating,
            "total_reviews" => count($reviews),
            "reviews" => $reviews
        ]);
    }

    public function addReview($data) {
        $user_id = $this->getUserIdFromToken();
        if (!$user_id) {
            http_response_code(401);
            echo json_encode(["message" => "Vui lòng đăng nhập để đánh giá."]);
            return;
        }

        $product_id = isset($data->product_id) ? $data->product_id : null;
        $rating = isset($data->rating) ? (int)$data->rating : 0;
        $comment = isset($data->comment) ? $data->comment : '';

        if (!$product_id || $rating < 1 || $rating > 5) {
            http_response_code(400);
            echo json_encode(["message" => "Dữ liệu đánh giá không hợp lệ (Số sao từ 1-5)."]);
            return;
        }

        // LUẬT 1: Đã mua chưa?
        if (!$this->review->hasPurchased($user_id, $product_id)) {
            http_response_code(403); // Forbidden
            echo json_encode(["message" => "Bạn chỉ có thể đánh giá sản phẩm sau khi đã mua hàng."]);
            return;
        }

        // LUẬT 2: Đã đánh giá chưa? (1 user / 1 review / 1 product)
        if ($this->review->hasReviewed($user_id, $product_id)) {
            http_response_code(400);
            echo json_encode(["message" => "Bạn đã đánh giá sản phẩm này rồi."]);
            return;
        }

        if ($this->review->addReview($user_id, $product_id, $rating, $comment)) {
            http_response_code(201);
            echo json_encode(["message" => "Đánh giá của bạn đã được ghi nhận. Cảm ơn bạn!"]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Lỗi hệ thống khi gửi đánh giá."]);
        }
    }
}
?>
