# TVC-Shop E-Commerce

Chào mừng bạn đến với mã nguồn của dự án TVC-Shop - một trang web thương mại điện tử chuyên bán các sản phẩm thời trang theo phong cách tối giản (Minimalist).

Dự án bao gồm 2 phần chính:
1. **Frontend**: Ứng dụng React (Vite, TailwindCSS)
2. **Backend**: Ứng dụng Laravel 8.x cung cấp RESTful APIs

---

## Hướng dẫn cài đặt và khởi chạy dự án

### Yêu cầu hệ thống
- **XAMPP** (chạy Apache và MySQL)
- **PHP** (phiên bản 8.0 trở lên)
- **Composer** (để quản lý thư viện PHP)
- **Node.js** (từ vẹn 18.x trở lên) & **npm**

### Bước 1: Khởi động Backend (Laravel)

1. Mở XAMPP Control Panel, khởi động **Apache** và **MySQL**.
2. Mở Terminal (PowerShell hoặc Git Bash) và di chuyển vào thư mục Backend:
   ```bash
   cd laravel-backend
   ```
3. Cài đặt các thư viện PHP:
   ```bash
   composer install
   ```
4. Cấu hình biến môi trường:
   - Copy file `.env.example` thành `.env`:
     ```bash
     cp .env.example .env
     ```
   - Mở file `.env` và kiểm tra các thông số Database (đảm bảo phù hợp với MySQL của bạn trong XAMPP).
   - Nếu bạn muốn dùng tính năng Chatbot AI, hãy thêm API Key của Google Gemini vào `.env`:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```
5. Cấp khóa ứng dụng (App Key) cho Laravel:
   ```bash
   php artisan key:generate
   ```
6. Chạy Migration và Seeders (Tạo Database và dữ liệu mẫu):
   - Chú ý: Hãy chắc chắn bạn đã tạo database trống có tên khớp với biến `DB_DATABASE` trong `.env` thông qua phpMyAdmin của XAMPP.
   ```bash
   php artisan migrate:fresh --seed
   ```
7. Không cần chạy `php artisan serve` nếu bạn đang dùng XAMPP. Bạn chỉ cần đảm bảo thư mục dự án được đặt trong `htdocs` và truy cập qua link `http://localhost/e-commerce/laravel-backend/public/api/...`. (Lưu ý: Đường dẫn API trong frontend đã được cài đặt sẵn khớp với cấu hình này).

### Bước 2: Khởi động Frontend (React)

1. Mở một cửa sổ Terminal mới và di chuyển vào thư mục Frontend:
   ```bash
   cd tvc-shop-frontend
   ```
2. Cài đặt các thư viện Node.js:
   ```bash
   npm install
   ```
3. Khởi chạy máy chủ phát triển (Dev Server):
   ```bash
   npm run dev
   ```
4. Mở trình duyệt và truy cập vào đường dẫn được hiển thị trên Terminal (thường là `http://localhost:5173`).

---

## Xử lý sự cố thường gặp (Troubleshooting)

- **Lỗi `cURL error 60` khi gọi chatbot**: Đây là lỗi chứng chỉ SSL của cURL trên môi trường XAMPP cục bộ. Hệ thống backend đã được cấu hình vượt qua bài kiểm tra này (`'verify' => false` trong HTTP Client). Nếu bạn đổi môi trường, lưu ý bật lại xác thực này.
- **Lỗi AI Bot báo không kết nối được**: Hãy kiểm tra chắc chắn API key của Gemini trong `.env` của thư mục backend là phiên bản mới, và backend đã nhận key chưa. Mặc định dự án đang sử dụng model `gemini-flash-latest`.

Chúc bạn trải nghiệm và phát triển TVC-Shop thành công!
