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
- `users`: Quản lý người dùng và phân quyền (admin/customer). Có hỗ trợ `google_id` và `avatar` cho đăng nhập Google OAuth.
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
  - `ToastContext`: Hệ thống thông báo toast nổi toàn cầu phong cách Cold Luxury.
  - `CompareContext`: Quản lý danh sách so sánh sản phẩm đối chiếu đa tiêu chí (tối đa 4 sản phẩm, lưu trữ localStorage).
- **UI Components Nổi bật**:
  - `Navbar` có hiệu ứng kính (Glassmorphism), thay đổi màu khi cuộn, tích hợp Instant Search modal (phím tắt `Ctrl + K` / `Cmd + K`) và chuông thông báo hoạt động (`NotificationDropdown`).
  - `SearchModal`: Hộp thoại tìm kiếm thời gian thực toàn cục (Instant Spotlight Search) gợi ý sản phẩm ngay khi gõ, lưu lịch sử tìm kiếm gần đây và từ khóa xu hướng.
  - `QuickViewModal`: Cửa sổ xem nhanh sản phẩm tức thì (Instant Quick View) với bộ sưu tập ảnh, chọn biến thể size/màu sắc, tăng giảm số lượng và thêm vào giỏ hàng ngay tại danh sách mà không cần rời trang.
  - `CompareModal` & `CompareFloatingBar`: Ma trận so sánh trực quan tối đa 4 sản phẩm cùng lúc (đối chiếu ảnh, mức giá, khuyến mãi, bảng size, màu sắc, đặc điểm và nút thêm nhanh vào giỏ hàng).
  - `Shop`: Trang cửa hàng tích hợp bộ lọc đa chiều (Category, Price Presets & Custom, Size, Color, Stock availability), tìm kiếm tức thì debounced, thanh gắn thẻ filter đang lọc (Active filter chips), chuyển đổi lưới hiển thị 3/4 cột, và phân trang mượt mà.
  - `CartDrawer` hiển thị giỏ hàng dạng trượt.
  - `ChatbotWidget` tích hợp Gemini AI, hiển thị góc dưới màn hình.
- **Phân hệ Admin (`/admin/*`)**:
  - Được bảo vệ bằng `AdminRoute` (chỉ user có `role === 'admin'` mới được vào).
  - Quản lý Sản phẩm, Đơn hàng, Coupon, Blogs (hỗ trợ upload ảnh nội bộ).
  - Quản lý Khách Hàng (User Management): Cho phép khóa tài khoản và thay đổi phân quyền.

## 5. Backend Architecture (`laravel-backend`)
- APIs được định nghĩa trong `routes/api.php`.
- Không sử dụng file Blade (chỉ thuần API).
- Sử dụng **Sanctum** để xác thực Token.
- **Controllers Chính**:
  - `AuthController`: Đăng nhập, đăng ký, đăng xuất.
  - `GoogleAuthController`: Quản lý luồng đăng nhập qua Google OAuth (sử dụng thư viện `laravel/socialite`).
  - `ProductController`: API danh sách sản phẩm hỗ trợ tìm kiếm toàn văn (`search`), lọc theo danh mục (`category`/`category_id`), khoảng giá (`min_price`, `max_price`), kích cỡ (`size`), màu sắc (`color`), tồn kho (`in_stock`), sắp xếp (`sort`) và phân trang (`paginate`). Cung cấp endpoint `/products/filter-options` trả về danh mục, kích thước, màu sắc và mức giá động từ CSDL.
  - `CategoryController`: API `/categories` trả về danh sách danh mục kèm số lượng sản phẩm kích hoạt (`products_count`).
  - `OrderController`: Đặt hàng, xem lịch sử.
  - `PaymentController`: Xử lý tích hợp cổng thanh toán trực tuyến: tạo URL thanh toán VNPay Sandbox với mã băm bảo mật SHA-512 (`createVnpayPayment`), tiếp nhận và xác thực callback từ VNPay (`vnpayCallback`), và hỗ trợ mô phỏng thanh toán trực tuyến tức thì (`simulateOnlinePayment`) cho thẻ quốc tế Visa/Mastercard và ví MoMo.
  - `NotificationController`: Quản lý thông báo người dùng (`/notifications`, `/notifications/read-all`), tự động đồng bộ trạng thái đơn hàng (Đang xử lý, Đang giao, Đã giao thành công, Đã hủy) kèm số lượng tin chưa đọc.
  - `SeoController`: Cung cấp API thẻ Meta động (`/seo/meta`) và trình tạo Sitemap XML tự động (`/seo/sitemap.xml`) phục vụ Googlebot và các công cụ tìm kiếm.
  - `LoyaltyController`: Quản lý hệ thống điểm thưởng khách hàng thân thiết (`/loyalty/profile`), tính toán cấp bậc thành viên (Bronze, Silver, Gold, Diamond), tiến độ % nâng hạng, và lịch sử tích lũy điểm theo đơn hàng.
  - `ReferralController`: Quản lý chương trình đại sứ giới thiệu bạn bè (`/referral/stats`) và hệ thống phát hành / tra cứu phiếu quà tặng điện tử E-Gift Cards (`/gift-cards/purchase`, `/gift-cards/check`). Tự động sinh mã voucher độc quyền cho người giới thiệu và người nhận quà.
  - `BlogController`: Trả dữ liệu Tạp chí (Lookbook) cho Frontend (công khai).
  - `WishlistController`, `CouponController`.
  - `ReviewController`: Quản lý đánh giá sản phẩm nâng cao; hỗ trợ lọc theo số sao (1-5 sao), lọc bài có hình ảnh thực tế, sắp xếp đánh giá, tính toán phân bổ xếp hạng (Rating distribution), và hỗ trợ tải lên nhiều hình ảnh feedback thực tế từ khách hàng đã mua sản phẩm.
  - `ChatbotController`: Xử lý logic gọi sang Google Gemini qua Header `x-goog-api-key`.
  - `AdminController`: Các API đặc quyền (tạo sản phẩm, sửa trạng thái đơn, v.v.). API `getDashboard` cung cấp dữ liệu phân tích số liệu động theo khoảng thời gian (`range`: 7 ngày, 30 ngày, 6 tháng, 1 năm), tính % tăng trưởng doanh thu/đơn hàng so với kỳ trước, giá trị đơn hàng trung bình (AOV), thống kê biểu đồ doanh thu dạng Area/Bar, tỷ lệ trạng thái đơn hàng, Top 5 sản phẩm bán chạy nhất kèm doanh thu từng món, và danh sách đơn hàng gần đây.

## 6. Các vấn đề kỹ thuật đã xử lý
- Lỗi `cURL error 60 (SSL certificate problem)` trên XAMPP local: Đã fix bằng cấu hình `['verify' => false]` trong HTTP client của Laravel.
- **Cập nhật Model Gemini**: API đã được nâng cấp lên dùng `gemini-flash-latest` vì Google khóa model cũ (`1.5-flash`) đối với các key tạo sau năm 2026. Code API gửi key thông qua Header.
- **Z-Index UI**: Navbar và Cart Drawer được quy định z-index chính xác (Navbar 50, Cart 50+, Chatbot cao nhất).
- **Infinite Loop ở AuthCallback**: Fix lỗi vòng lặp re-render ở `GoogleCallback.jsx` bằng cách ép tải lại trang bằng `window.location.href` thay vì `navigate` của React Router và bỏ dependency `login` trong `useEffect`.
- **Tương thích ngược dữ liệu API Products**: Bổ sung cờ `paginate=1` để phân tách phản hồi mảng phẳng (cho FeaturedProducts, BlogDetail, ProductDetail) và phản hồi phân trang (cho Shop), tránh lỗi vỡ mảng JS.
- **Xử lý luồng cổng thanh toán VNPay / MoMo**: Thiết lập cơ chế fallback linh hoạt và luồng điều hướng callback thông minh về trang Orders của Frontend kèm banner trạng thái trực quan.
- **Hệ thống đánh giá sản phẩm kèm ảnh thực tế**: Xử lý upload ảnh multipart form data, phân tích tỷ lệ phần trăm phân bổ số sao và tích hợp modal Lightbox phóng to ảnh chất lượng cao.
- **Hệ thống Thông Báo Hoạt Động Thời Gian Thực**: Tích hợp chuông thông báo (NotificationDropdown) trên thanh điều hướng Navbar với cơ chế polling tự động, kết hợp cùng hệ thống Toast nổi toàn cục (`ToastContext`).
- **Tối ưu hóa SEO & OpenGraph**: Sử dụng hook tùy chỉnh `useSEO` tự động tiêm các thẻ `og:image`, `og:title`, canonical link và dữ liệu có cấu trúc JSON-LD chuẩn Schema.org cho từng sản phẩm và bài viết tạp chí.
- **Hệ thống Điểm Thưởng & Khách Hàng Thân Thiết (Loyalty & VIP Tiers)**: Phân hạng người dùng dựa trên tổng giá trị chi tiêu thực tế (Bronze, Silver, Gold, Diamond), cấp thẻ thành viên kỹ thuật số cao cấp và hiển thị chi tiết tiến trình thăng hạng tại trang Hồ sơ.
- **Hệ thống Phiếu Quà Tặng Điện Tử (E-Gift Cards) & Đại Sứ Giới Thiệu (Referral Program)**: Người dùng có thể tùy biến tạo và gửi E-Gift Card kỹ thuật số với nhiều bao bì Cold Luxury, mệnh giá linh hoạt, và chia sẻ link / mã giới thiệu độc quyền để nhận 50.000đ tích lũy mua sắm cho mỗi bạn bè mua hàng thành công.

## 7. Tính năng tiếp theo (Roadmap)
- Hệ thống Khách Hàng Gần Đây Đã Mua (Social Proof / Real-time Sales Popup) kích thích mua sắm.
- Quản lý Sổ địa chỉ giao hàng nhiều địa điểm (Multi-Address Book) trong Profile.
