<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    /**
     * Xử lý tin nhắn chat từ người dùng và gọi API Google Gemini
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function chat(Request $request)
    {
        // 1. Lấy nội dung tin nhắn từ người dùng
        $userMessage = $request->input('message');

        if (!$userMessage) {
            return response()->json(['message' => 'Vui lòng nhập tin nhắn.'], 400);
        }

        // 2. Lấy API Key từ cấu hình (.env)
        $apiKey = trim(env('GEMINI_API_KEY'));

        if (!$apiKey) {
            // Cảnh báo nếu chưa cấu hình API Key
            return response()->json(['message' => 'Hệ thống chưa được cấu hình API Key.'], 500);
        }

        // 3. Xây dựng ngữ cảnh (System Prompt) cho AI
        // Giúp AI hiểu vai trò của mình và cách trả lời chuẩn Cold Luxury
        $systemPrompt = "Bạn là Private Concierge - Cố vấn phong cách thời trang cao cấp độc quyền của TVC-Shop. " .
                        "Phong cách cửa hàng là Cold Luxury & Minimalist thời thượng (Trắng/Đen/Than chì, chất liệu Cashmere Ý, Lụa Lyon Pháp, Denim Okayama Nhật). " .
                        "TVC-Shop có các dịch vụ độc bản: Phòng thử đồ ảo 3D (/fitting-room), Khảo sát phong cách AI Stylist (/stylist-quiz), " .
                        "Đặt lịch Private Salon VIP 1-1 (/private-salon), Đặt trước bộ sưu tập Runway (/pre-orders), Hộp quà sơn mài Bespoke (/bespoke-box), " .
                        "Hộ chiếu vải kỹ thuật số (/fabric-archive), và Tùy biến may đo phụ liệu kim khí 3D (/customizer). " .
                        "Hãy xưng hô quý phái, lịch thiệp, tôn trọng khách hàng, giọng điệu chuyên nghiệp của quản gia thời trang thượng lưu. " .
                        "Chỉ tư vấn về trang phục, bảo quản vải, chọn size, phối đồ và các dịch vụ xa xỉ của TVC-Shop.";

        // 4. Chuẩn bị dữ liệu (Payload) gửi lên Google Gemini
        $payload = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        // Kết hợp hướng dẫn hệ thống và câu hỏi của người dùng
                        ['text' => $systemPrompt . "\n\nCâu hỏi của khách hàng: " . $userMessage]
                    ]
                ]
            ]
        ];

        try {
            // 5. Gửi HTTP POST request đến Google Gemini API
            // (Thêm 'verify' => false để sửa lỗi SSL cURL error 60 thường gặp trên XAMPP local)
            $response = Http::withOptions(['verify' => false])->withHeaders([
                'Content-Type' => 'application/json',
                'x-goog-api-key' => $apiKey
            ])->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent", $payload);

            // 6. Kiểm tra nếu gọi API thành công
            if ($response->successful()) {
                $data = $response->json();
                
                // Trích xuất câu trả lời của AI từ cấu trúc JSON phức tạp của Gemini
                $aiReply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Xin lỗi, tôi không thể trả lời lúc này.';
                
                return response()->json(['reply' => $aiReply]);
            } else {
                // Xử lý lỗi nếu Google API từ chối hoặc lỗi
                $errorData = $response->json();
                \Illuminate\Support\Facades\Log::error('Gemini API Error: ' . $response->body());
                return response()->json([
                    'message' => 'Lỗi kết nối tới AI.',
                    'details' => $errorData
                ], 500);
            }
        } catch (\Exception $e) {
            // Bắt các lỗi liên quan đến mạng hoặc server
            \Illuminate\Support\Facades\Log::error('Gemini Exception: ' . $e->getMessage());
            return response()->json([
                'message' => 'Lỗi hệ thống.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
