# TVC-Shop - Project Workflow & Architecture

> **AI INSTRUCTION**: Đây là tài liệu nội bộ dành cho AI (như bạn) để nắm bắt bối cảnh dự án. Bất cứ khi nào bạn (AI) thêm một chức năng mới, thay đổi cấu trúc Database, hay thêm tính năng Frontend/Backend, bạn BẮT BUỘC phải cập nhật file này để các phiên làm việc sau không bị mất ngữ cảnh (context).

## 1. Tổng quan dự án
- **Tên dự án**: TVC-Shop
- **Mô hình**: Hệ thống thương mại điện tử cơ bản (B2C) bán các sản phẩm thời trang.
- **Phong cách thiết kế**: Minimalist (Tối giản), tone màu chủ đạo Trắng/Đen, font chữ Jost + Playfair Display.

## 2. Công nghệ sử dụng (Tech Stack)
- **Frontend**: React.js (Vite), Tailwind CSS, React Router DOM, Context API (Quản lý State).
- **Backend**: Laravel 8.x (PHP 8.x), cung cấp RESTful APIs.
- **Database**: MySQL.
- **AI Integration**: Google Gemini API (Model: `gemini-flash-latest`) dùng cho Chatbot hỗ trợ khách hàng.

## 3. Cấu trúc Database (Core Models)
- `users`: Quản lý người dùng và phân quyền (admin/customer).
- `categories`: Danh mục sản phẩm.
- `products`: Sản phẩm chính (gắn với categories).
- `product_images`: Quản lý nhiều ảnh cho một sản phẩm.
- `product_variants`: Biến thể sản phẩm (Kích thước, Màu sắc, Số lượng tồn kho).
- `orders` & `order_items`: Quản lý đơn hàng và chi tiết sản phẩm trong đơn.
- `reviews`: Đánh giá của người dùng về sản phẩm.
- `wishlists`: Sản phẩm yêu thích của khách hàng.
- `coupons`: Quản lý mã giảm giá.
- `blogs`: Quản lý bài viết tin tức/blog.

## 4. Frontend Architecture (`tvc-shop-frontend`)
- Dùng `Context API` để lưu trữ global state:
  - `AuthContext`: Quản lý trạng thái đăng nhập, token, thông tin user.
  - `CartContext`: Quản lý giỏ hàng cục bộ (localStorage).
  - `WishlistContext`: Quản lý danh sách yêu thích (đồng bộ với API).
- **UI Components Nổi bật**:
  - `Navbar` có hiệu ứng kính (Glassmorphism), thay đổi màu khi cuộn.
  - `CartDrawer` hiển thị giỏ hàng dạng trượt.
  - `ChatbotWidget` tích hợp Gemini AI, hiển thị góc dưới màn hình.
- **Phân hệ Admin (`/admin/*`)**:
  - Được bảo vệ bằng `AdminRoute` (chỉ user có `role === 'admin'` mới được vào).
  - Quản lý Sản phẩm, Đơn hàng, Coupon, Blogs. (Quản lý User đang phát triển).

## 5. Backend Architecture (`laravel-backend`)
- APIs được định nghĩa trong `routes/api.php`.
- Không sử dụng file Blade (chỉ thuần API).
- Sử dụng **Sanctum** để xác thực Token.
- **Controllers Chính**:
  - `AuthController`: Đăng nhập, đăng ký, đăng xuất.
  - `ProductController` / `CategoryController`: Hiển thị danh sách và chi tiết.
  - `OrderController`: Đặt hàng, xem lịch sử.
  - `WishlistController`, `ReviewController`, `CouponController`.
  - `ChatbotController`: Xử lý logic gọi sang Google Gemini qua Header `x-goog-api-key`.
  - `AdminController`: Các API đặc quyền (tạo sản phẩm, sửa trạng thái đơn, v.v.).

## 6. Các vấn đề kỹ thuật đã xử lý
- Lỗi `cURL error 60 (SSL certificate problem)` trên XAMPP local: Đã fix bằng cấu hình `['verify' => false]` trong HTTP client của Laravel.
- **Cập nhật Model Gemini**: API đã được nâng cấp lên dùng `gemini-flash-latest` vì Google khóa model cũ (`1.5-flash`) đối với các key tạo sau năm 2026. Code API gửi key thông qua Header.
- **Z-Index UI**: Navbar và Cart Drawer được quy định z-index chính xác (Navbar 50, Cart 50+, Chatbot cao nhất).

## 7. Tính năng tiếp theo (Roadmap)
- Hoàn thiện chức năng quản lý Users trong Admin.
- Tích hợp thanh toán online (nếu cần).
- Phân trang, lọc sản phẩm nâng cao ở giao diện Shop.
