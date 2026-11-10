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
  - `SocialProofController`: Cung cấp danh sách các giao dịch mua hàng thực tế gần đây (`/social-proof/recent-purchases`) với tên khách hàng ẩn danh, khu vực thành phố, tên sản phẩm và thời gian mua để hiển thị thông báo popup trực tiếp trên giao diện.
  - `UserController`: Quản lý hồ sơ cá nhân của người dùng (`/users/profile`).
  - `AddressController`: Quản lý Sổ địa chỉ giao hàng nhiều địa điểm (`/addresses`, `/addresses/{id}/default`), hỗ trợ nhãn địa chỉ (Nhà riêng, Văn phòng) và chọn địa chỉ nhận hàng mặc định.
  - `TrackingController`: Cung cấp API tra cứu hành trình vận chuyển thời gian thực (`/orders/{id}/tracking`) với các mốc thời gian chi tiết, vị trí kho bãi, mã vận đơn tự động và thời gian dự kiến giao hàng.
  - `FlashSaleController`: Quản lý phiên giảm giá chớp nhoáng theo chu kỳ ngày (`/flash-sale`), tính toán thời gian đếm ngược chính xác, tỷ lệ phần trăm chiết khấu và mức độ khan hiếm tồn kho.
  - `RestockNotificationController`: Quản lý đăng ký nhận thông báo qua email khi sản phẩm hoặc size/màu hết hàng được restock (`/restock/subscribe`).
  - `LuckyWheelController`: Cung cấp cấu hình 8 ô quà tặng (`/lucky-wheel/config`) và thuật toán quay thưởng theo trọng số (`/lucky-wheel/spin`), tự động phát hành mã Coupon độc nhất trong CSDL.
  - `GroupBuyController`: Quản lý danh sách các phòng mua chung theo nhóm (`/group-buys`, `/group-buys/{id}/join`), đối chiếu số lượng thành viên tối thiểu và áp dụng mức giá chiết khấu nhóm độc quyền.
  - `FaqController`: Cung cấp danh mục câu hỏi thường gặp động (`/faqs`) phân loại theo chủ đề (vận chuyển, đổi trả, thanh toán, kích cỡ, thành viên) và tiếp nhận thông tin yêu cầu hỗ trợ trực tiếp (`/faqs/inquiry`).
  - `SharedCartController`: Xử lý tạo liên kết chia sẻ giỏ hàng độc nhất (`/cart/share`) và tái tạo giỏ hàng cho người nhận qua mã chia sẻ (`/cart/shared/{code}`).
  - `OccasionController`: Cung cấp hướng dẫn phối đồ và tuyển chọn trang phục theo từng dịp (`/occasions`) (Công sở & Họp cấp cao, Dạ tiệc & Cocktail, Dạo phố cuối tuần, Nghỉ dưỡng biển).
  - `InvoiceController`: Xuất dữ liệu hóa đơn điện tử chính thức của đơn hàng (`/orders/{id}/invoice`), định dạng chuẩn thuế điện tử, chữ ký số và hỗ trợ xem/in ấn trực tiếp.
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
- **Hệ thống Khách Hàng Gần Đây Đã Mua (Social Proof Real-time Sales Popup)**: Tự động hiển thị popup góc màn hình với hiệu ứng mượt mà thông báo các giao dịch mua hàng thành công gần nhất, tạo độ uy tín cao và kích thích hành vi mua sắm.
- **Quản lý Sổ Địa Chỉ Giao Hàng Đa Điểm (Multi-Address Book)**: Cho phép khách hàng lưu nhiều địa chỉ nhận hàng (Nhà riêng, Văn phòng), thiết lập địa chỉ mặc định trong Profile và chọn nhanh 1-click tại trang Checkout mà không phải nhập lại.
- **Hệ thống Tra Cứu Hành Trình Đơn Hàng Thời Gian Thực (Live Logistics Order Tracking Timeline)**: Cung cấp mã vận đơn chi tiết, các mốc tiến trình đóng gói kiểm duyệt chất lượng, bàn giao xe chuyên dụng và thời gian dự kiến giao hàng qua modal trực quan.
- **Hệ thống Khảo Sát Gợi Ý Size Thông Minh (Smart Fit & Size Recommender)**: Cho phép khách hàng nhập chiều cao, cân nặng, giới tính và phom dáng mong muốn (Slim, Regular, Relaxed) để hệ thống tự động tính toán chỉ số BMI và đề xuất size trang phục chuẩn xác kèm 1-click áp dụng ngay tại trang chi tiết sản phẩm.
- **Hệ thống Flash Sale Countdown Banner Với Đồng Hồ Đếm Ngược Thời Gian Thực**: Tích hợp banner Flash Sale phong cách Midnight Noir trên trang chủ với đồng hồ đếm ngược từng giây đến nửa đêm, thanh tiến độ bán hàng (stock progression scarcity bar) và huy hiệu "Sắp cháy hàng".
- **Hệ thống Đăng Ký Nhận Thông Báo Khi Có Hàng / Đặt Hàng Trước (Back in Stock & Pre-order Alert)**: Cho phép khách hàng để lại email và số điện thoại theo từng phân loại size/màu sắc cụ thể để nhận thông báo ưu tiên ngay khi sản phẩm được bổ sung tồn kho.
- **Hệ thống Mini-game Vòng Quay May Mắn (Lucky Spin Voucher Wheel)**: Vòng quay may mắn Canvas đồ họa sắc nét với 8 ô giải thưởng, thuật toán quay thưởng theo trọng số (weighted random), tự động phát hành mã voucher giảm giá (SPIN-XXXXXX) vào cơ sở dữ liệu và nút bấm nổi 1-chạm toàn trang.
- **Hệ thống Mua Chung Theo Nhóm (Team Group Buy & Group Discount)**: Cho phép khách hàng gia nhập phòng mua chung của các thành viên khác hoặc mời thêm bạn bè để nhận mức giá ưu đãi tới 25-30%, đồng bộ trực tiếp vào giỏ hàng cá nhân.
- **Trung Tâm Trợ Giúp & Câu Hỏi Thường Gặp (Dynamic FAQs & Help Center)**: Cung cấp kho tri thức giải đáp các thắc mắc cốt lõi (vận chuyển, đổi trả, chọn size, thanh toán, hội viên VIP), tích hợp thanh tìm kiếm thời gian thực, bộ lọc danh mục và biểu mẫu gửi câu hỏi trực tiếp cho tư vấn viên.
- **Tùy Chọn Đóng Gói Hộp Quà Cold Luxury (Luxury Gift Wrapping & Greeting Card)**: Khách hàng tại trang thanh toán có thể chọn dịch vụ đóng hộp đen nguyên khối sang trọng (+50.000₫), giấy nến lụa, ruy băng và tùy chỉnh lời chúc in trên thiệp trao gửi người thân yêu.
- **Hệ thống Giỏ Hàng Chia Sẻ Đa Kênh (Shareable Cart Link & Collaborative Cart)**: Khách hàng có thể tạo nhanh liên kết chia sẻ giỏ hàng 1-chạm từ CartDrawer để gửi cho bạn bè hoặc người thân qua mạng xã hội, cho phép người nhận sao chép toàn bộ giỏ hàng và tiến hành thanh toán tức thì.
- **Hướng Dẫn Phối Đồ Theo Từng Dịp (Outfit by Occasion Curated Styling Guide)**: Trang chuyên đề định hình phong cách Cold Luxury theo 4 dịp đặc trưng (Công sở & Họp cấp cao, Dạ tiệc & Cocktail, Dạo phố cuối tuần, Nghỉ dưỡng biển) với sản phẩm tuyển chọn và câu chuyện phong cách riêng biệt.
- **Hệ thống Kiểm Duyệt & Phản Hồi Đánh Giá Chính Thức (Admin Review Moderation & Official Replies)**: Phân hệ Admin chuyên biệt (`/admin/reviews`) cho phép quản trị viên xem xét tất cả đánh giá của khách hàng, phản hồi chính thức từ thương hiệu TVC-Shop và xóa các đánh giá tiêu cực vi phạm tiêu chuẩn.
- **Hóa Đơn Điện Tử Bán Hàng In Ấn Trực Tuyến (Printable Electronic Order Invoice)**: Khách hàng tại trang đơn hàng có thể xem và in ngay hóa đơn điện tử chuẩn mực gồm mã hóa đơn, thông tin người mua, chi tiết đơn giá từng món, dấu xác nhận chữ ký điện tử TVC-Shop.
- **Hệ thống Bộ Sưu Tập Sản Phẩm Xem Gần Đây (Recently Viewed Products)**: Tự động lưu vết các sản phẩm khách hàng vừa duyệt vào LocalStorage qua `RecentlyViewedContext`, tích hợp thanh carousel xem lại nhanh ở chân trang chi tiết sản phẩm kèm xóa lịch sử 1-click.
- **Sàn Diễn Lookbook Video Reels Tương Tác Trực Tiếp (Shoppable Video Reels Editorial)**: Trang trình diễn video thời trang chuẩn Cold Luxury (`/lookbook`), video full-screen dọc với tương tác thả tim, sao chép liên kết chia sẻ, bật/tắt âm thanh, điều hướng playlist và thẻ mua sắm sản phẩm trực tiếp (Shoppable Tag) 1-click vào giỏ hàng.
- **Hệ Thống Đa Tiền Tệ Toàn Cầu (Multi-Currency Switcher VND / USD / EUR / JPY / GBP)**: Cung cấp API tỷ giá chuẩn hóa (`/currencies`, `/currencies/convert`), bộ chuyển đổi `CurrencySwitcher` trên Navbar và `CurrencyContext` đồng bộ giá toàn sàn và LocalStorage.
- **Bảng Thông Số Kích Cỡ May Đo Tương Tác (Atelier Interactive Size Guide)**: Cung cấp API bảng kích cỡ chuẩn hóa theo từng dòng sản phẩm (`/size-guides`), modal `SizeGuideModal` tích hợp tại ProductDetail với chuyển đổi đơn vị đo linh hoạt giữa Centimet (CM) và Inches.

## 7. Tính năng tiếp theo (Roadmap)
- Hệ thống Đặt Cọc Giữ Chỗ Hàng Hiếm (Pre-order Deposit & Reservation Management).
- Hệ thống Trải Nghiệm Mix & Match Trang Phục Ảo (Interactive Virtual Fitting & Outfit Canvas).
