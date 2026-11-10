<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FaqController extends Controller
{
    /**
     * Lấy danh sách các câu hỏi thường gặp (FAQs) được phân loại theo danh mục
     */
    public function getFaqs(Request $request)
    {
        $category = $request->query('category', 'all');

        $faqs = [
            [
                'id' => 1,
                'category' => 'shipping',
                'category_name' => 'Vận Chuyển & Giao Hàng',
                'question' => 'Thời gian giao hàng tiêu chuẩn của TVC-Shop mất bao lâu?',
                'answer' => 'Đối với khu vực nội thành Hà Nội và TP. Hồ Chí Minh, đơn hàng sẽ được giao trong vòng 24 - 48 giờ. Đối với các tỉnh thành khác trên toàn quốc, thời gian vận chuyển dự kiến từ 2 - 4 ngày làm việc thông qua đối tác VNPost Express chuyên dụng.'
            ],
            [
                'id' => 2,
                'category' => 'shipping',
                'category_name' => 'Vận Chuyển & Giao Hàng',
                'question' => 'Chính sách phí vận chuyển được tính như thế nào?',
                'answer' => 'TVC-Shop áp dụng chính sách MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC (Freeship) cho toàn bộ đơn hàng thanh toán trên hệ thống, không yêu cầu giá trị đơn hàng tối thiểu.'
            ],
            [
                'id' => 3,
                'category' => 'returns',
                'category_name' => 'Đổi Trả & Bảo Hành',
                'question' => 'Quy định và thời hạn đổi trả sản phẩm tại TVC-Shop?',
                'answer' => 'Khách hàng được quyền đổi size hoặc đổi mẫu trong vòng 07 ngày kể từ ngày nhận hàng thành công. Sản phẩm yêu cầu còn nguyên tem mác, chưa qua giặt tẩy, không có mùi lạ và còn nguyên hộp bao bì Cold Luxury.'
            ],
            [
                'id' => 4,
                'category' => 'returns',
                'category_name' => 'Đổi Trả & Bảo Hành',
                'question' => 'Nếu sản phẩm bị lỗi do sản xuất hoặc vận chuyển thì sao?',
                'answer' => 'TVC-Shop cam kết 1 đổi 1 ngay lập tức và chịu 100% chi phí vận chuyển 2 chiều đối với bất kỳ sản phẩm nào có lỗi đường chỉ, chất vải hoặc hư hại trong quá trình đóng gói và vận chuyển.'
            ],
            [
                'id' => 5,
                'category' => 'payment',
                'category_name' => 'Thanh Toán & Bảo Mật',
                'question' => 'Hệ thống hỗ trợ những phương thức thanh toán nào?',
                'answer' => 'Chúng tôi hỗ trợ 4 hình thức thanh toán an toàn: Thanh toán khi nhận hàng (COD), Cổng thanh toán bảo mật VNPAY-QR, Ví điện tử MoMo, và Thẻ thanh toán quốc tế Visa/Mastercard chuẩn 3D-Secure.'
            ],
            [
                'id' => 6,
                'category' => 'payment',
                'category_name' => 'Thanh Toán & Bảo Mật',
                'question' => 'Làm thế nào để sử dụng mã giảm giá hoặc phiếu quà tặng E-Gift Card?',
                'answer' => 'Tại trang Thanh Toán (Checkout), bạn chỉ cần nhập mã coupon, mã quà tặng EGC hoặc mã giới thiệu của bạn bè vào ô "Mã Giảm Giá / Thẻ Quà Tặng" và nhấn "Áp Dụng", hệ thống sẽ tự động trừ số tiền tương ứng vào tổng đơn.'
            ],
            [
                'id' => 7,
                'category' => 'product',
                'category_name' => 'Sản Phẩm & Chọn Size',
                'question' => 'Làm sao để biết kích cỡ trang phục có vừa với vóc dáng của tôi không?',
                'answer' => 'Tại mỗi trang chi tiết sản phẩm, bạn có thể click vào tính năng "Gợi ý chọn size (Smart Fit)" để nhập chiều cao, cân nặng và sở thích mặc (Slim, Regular, Relaxed). Thuật toán AI sẽ gợi ý size trang phục vừa vặn hoàn hảo nhất.'
            ],
            [
                'id' => 8,
                'category' => 'membership',
                'category_name' => 'Hội Viên & Điểm Thưởng',
                'question' => 'Chính sách tích lũy điểm thưởng và nâng hạng VIP ra sao?',
                'answer' => 'Với mỗi 10.000 VNĐ chi tiêu thành công, bạn sẽ nhận được 1 điểm thưởng. Khi đạt các mốc chi tiêu từ 2 triệu (Silver - giảm 5%), 7 triệu (Gold - giảm 10%) đến 15 triệu (Diamond - giảm 15%), bạn sẽ được thăng hạng VIP với các đặc quyền ưu tiên độc quyền.'
            ]
        ];

        if ($category !== 'all') {
            $faqs = array_values(array_filter($faqs, function ($item) use ($category) {
                return $item['category'] === $category;
            }));
        }

        $categories = [
            ['id' => 'all', 'name' => 'Tất Cả'],
            ['id' => 'shipping', 'name' => 'Vận Chuyển'],
            ['id' => 'returns', 'name' => 'Đổi Trả'],
            ['id' => 'payment', 'name' => 'Thanh Toán'],
            ['id' => 'product', 'name' => 'Chọn Size'],
            ['id' => 'membership', 'name' => 'Hội Viên VIP']
        ];

        return response()->json([
            'success' => true,
            'categories' => $categories,
            'data' => $faqs
        ]);
    }

    /**
     * Gửi câu hỏi hoặc liên hệ hỗ trợ trực tiếp từ khách hàng
     */
    public function submitInquiry(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:1000'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cảm ơn bạn! Đội ngũ tư vấn viên TVC-Shop đã tiếp nhận câu hỏi và sẽ phản hồi qua email ' . $request->email . ' trong vòng 2 giờ làm việc.'
        ], 200);
    }
}
