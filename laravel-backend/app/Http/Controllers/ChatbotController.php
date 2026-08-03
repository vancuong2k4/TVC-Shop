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
        // Giúp AI hiểu vai trò của mình và cách trả lời
        $systemPrompt = "Bạn là trợ lý ảo thời trang của cửa hàng TVC-Shop. " .
                        "Phong cách cửa hàng là thời trang tối giản (minimalist). " .
                        "Hãy trả lời khách hàng một cách lịch sự, thân thiện, ngắn gọn và hữu ích. " .
                        "Chỉ tư vấn các vấn đề liên quan đến thời trang, quần áo, kích cỡ, màu sắc. " .
                        "Không trả lời các câu hỏi nằm ngoài chủ đề (ví dụ: chính trị, code, toán học...).";

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
