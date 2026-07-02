<?php
// Tắt hiển thị lỗi HTML để tránh vỡ JSON (Bật trong lúc dev)
error_reporting(E_ALL);
ini_set('display_errors', 0); 

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: OPTIONS,GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Lấy URI thực tế
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Base path của XAMPP
$base_path = '/e-commerce/tvc-shop-backend';
$route = str_replace($base_path, '', $request_uri);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../src/Controllers/AuthController.php';
require_once __DIR__ . '/../src/Controllers/ProductController.php';
require_once __DIR__ . '/../src/Controllers/OrderController.php';
require_once __DIR__ . '/../src/Controllers/WishlistController.php';
require_once __DIR__ . '/../src/Controllers/ReviewController.php';
require_once __DIR__ . '/../src/Controllers/AdminController.php';
require_once __DIR__ . '/../src/Controllers/CouponController.php';
require_once __DIR__ . '/../src/Controllers/UserController.php';
require_once __DIR__ . '/../src/Controllers/BlogController.php';

// Khởi tạo Database
$database = new Database();
$db = $database->getConnection();

if(!$db) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit();
}

// Lấy dữ liệu body JSON (dành cho POST, PUT)
$data = json_decode(file_get_contents("php://input"));

// Hỗ trợ method spoofing cho form upload và gộp dữ liệu
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['_method'])) {
        $_SERVER['REQUEST_METHOD'] = strtoupper($_POST['_method']);
    } elseif (isset($_GET['_method'])) {
        $_SERVER['REQUEST_METHOD'] = strtoupper($_GET['_method']);
    }
    
    // Nếu là multipart/form-data, $data sẽ là null do json_decode thất bại.
    // Chuyển $_POST thành Object để tương thích với code hiện tại.
    if (!$data && !empty($_POST)) {
        $data = (object) $_POST;
    }
}

// Router xử lý
switch ($route) {
    case '/api/auth/register':
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new AuthController($db);
            $controller->register($data);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/auth/login':
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new AuthController($db);
            $controller->login($data);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/products':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new ProductController($db);
            $controller->getAll();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/orders':
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new OrderController($db);
            $controller->create($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new OrderController($db);
            $controller->getUserOrders();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/wishlists':
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new WishlistController($db);
            $controller->toggle($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new WishlistController($db);
            $controller->getUserWishlist();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/reviews':
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new ReviewController($db);
            $controller->addReview($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new ReviewController($db);
            $controller->getReviews();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/coupons/validate':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new CouponController($db);
            $controller->validate();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/users/profile':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new UserController($db);
            $controller->getProfile();
        } else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $controller = new UserController($db);
            $controller->updateProfile($data);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case (preg_match('/^\/api\/blogs(\/[0-9]+)?$/', $route, $matches) ? true : false):
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new BlogController($db);
            if (isset($matches[1])) {
                $id = str_replace('/', '', $matches[1]);
                $controller->getById($id);
            } else {
                $controller->getAll();
            }
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    // --- ADMIN ROUTES ---
    case '/api/admin/dashboard':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new AdminController($db);
            $controller->getDashboard();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/admin/orders':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new AdminController($db);
            $controller->getOrders();
        } else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $controller = new AdminController($db);
            $controller->updateOrderStatus($data);
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/admin/products':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new AdminController($db);
            $controller->getProducts();
        } else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new AdminController($db);
            $controller->createProduct($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'PUT') {
            $controller = new AdminController($db);
            $controller->updateProduct($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $controller = new AdminController($db);
            $controller->deleteProduct();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/admin/coupons':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new AdminController($db);
            $controller->getCoupons();
        } else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new AdminController($db);
            $controller->createCoupon($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $controller = new AdminController($db);
            $controller->deleteCoupon();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    case '/api/admin/blogs':
        if ($_SERVER['REQUEST_METHOD'] == 'GET') {
            $controller = new AdminController($db);
            $controller->getBlogs();
        } else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            $controller = new AdminController($db);
            $controller->createBlog($data);
        } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
            $controller = new AdminController($db);
            $controller->deleteBlog();
        } else {
            http_response_code(405);
            echo json_encode(["message" => "Method Not Allowed"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(["message" => "API endpoint not found.", "route" => $route]);
        break;
}
?>
