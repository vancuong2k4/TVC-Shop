<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GarmentCareController extends Controller
{
    /**
     * Hướng dẫn bảo quản chất liệu thượng hạng từ Atelier
     */
    private $careGuides = [
        'cashmere' => [
            'id' => 'cashmere',
            'fabric_name' => 'Len Cashmere & Lông Cừu Dệt Chặt',
            'temperature' => 'Tối đa 30°C hoặc giặt khô chuyên dụng (Dry Clean Only)',
            'detergent' => 'Dung dịch giặt len dịu nhẹ gốc thực vật, không chứa enzym tẩy mạnh',
            'drying' => 'Trải phẳng tự nhiên trên khăn bông trắng, tuyệt đối không vắt xoắn hoặc treo móc kim loại',
            'ironing' => 'Sử dụng bàn ủi hơi nước đứng ở khoảng cách 3-5cm, không ủi trực tiếp lên sợi len',
            'storage' => 'Bảo quản trong túi vải Canvas thoáng khí kèm viên gỗ tuyết tùng (Cedar Wood) chống ẩm mốc'
        ],
        'mulberry_silk' => [
            'id' => 'mulberry_silk',
            'fabric_name' => '100% Lụa Tơ Tằm Tự Nhiên (Mulberry Silk)',
            'temperature' => 'Nước mát dưới 20°C hoặc giặt hấp chuyên sâu',
            'detergent' => 'Dầu gội trẻ em hoặc sữa giặt chuyên biệt dành riêng cho tơ tằm',
            'drying' => 'Phơi trong bóng râm thoáng gió, tránh ánh nắng mặt trời trực tiếp làm giòn sợi lụa',
            'ironing' => 'Ủi ở mặt trái khi vải còn ẩm nhẹ với nhiệt độ thấp nhất dành riêng cho Silk',
            'storage' => 'Treo bằng móc bọc đệm lụa êm ái, tránh tiếp xúc với nước hoa hoặc keo xịt tóc'
        ],
        'tailored_wool' => [
            'id' => 'tailored_wool',
            'fabric_name' => 'Blazer May Đo & Áo Khoác Tuxedo Cấu Trúc',
            'temperature' => 'Chỉ giặt khô tại các cơ sở giặt ủi cao cấp chuẩn sinh học',
            'detergent' => 'Không sử dụng hóa chất dung môi clo',
            'drying' => 'Treo giữ phom dáng trên móc gỗ bản rộng thiết kế ôm cầu vai',
            'ironing' => 'Hấp hơi khử mùi sau mỗi lần mặc, dùng bàn chải lông ngựa tự nhiên chải nhẹ theo chiều sợi vải',
            'storage' => 'Bọc trong túi áo vest chuyên dụng TVC-Shop kèm gói hút ẩm sinh học'
        ]
    ];

    /**
     * Dịch vụ bảo dưỡng & làm mới trọn đời từ Atelier
     */
    private $services = [
        [
            'id' => 'service_steam_freshen',
            'name' => 'Làm Mới & Khử Khuẩn Sợi Vải Bằng Hơi Nước Áp Suất Cao',
            'turnaround_days' => 2,
            'price' => 0, // Miễn phí cho hội viên VIP
            'description' => 'Khôi phục độ phồng tự nhiên của len Cashmere và làm mềm lụa tơ tằm sau thời gian sử dụng.'
        ],
        [
            'id' => 'service_button_repair',
            'name' => 'Đính Lại Cúc Sừng Trâu Tự Nhiên & Gia Cố Đường May',
            'turnaround_days' => 3,
            'price' => 50000,
            'description' => 'Sử dụng chỉ lụa dập tay và phụ kiện sừng tự nhiên nguyên bản từ hãng.'
        ],
        [
            'id' => 'service_alteration_fit',
            'name' => 'Chỉnh Sửa Vòng Eo & Độ Dài Vạt Áo / Gấu Quần Chuẩn Phom',
            'turnaround_days' => 5,
            'price' => 120000,
            'description' => 'Nghệ nhân may đo trực tiếp căn chỉnh lại theo số đo mới của quý khách.'
        ]
    ];

    /**
     * Lấy hướng dẫn bảo quản và danh mục dịch vụ bảo dưỡng
     */
    public function getCarePortal()
    {
        return response()->json([
            'success' => true,
            'care_guides' => array_values($this->careGuides),
            'services' => $this->services
        ]);
    }

    /**
     * Tạo yêu cầu gửi bảo dưỡng trang phục (Garment Maintenance Request)
     */
    public function submitMaintenanceRequest(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email|max:100',
            'item_name' => 'required|string|max:150',
            'service_id' => 'required|string',
            'pickup_address' => 'required|string|max:255',
            'pickup_date' => 'required|date|after_or_equal:today',
            'notes' => 'nullable|string|max:500'
        ]);

        $ticketCode = 'CARE-' . strtoupper(Str::random(7));
        $selectedService = collect($this->services)->firstWhere('id', $request->service_id) ?? $this->services[0];

        $maintenanceTicket = [
            'ticket_code' => $ticketCode,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'item_name' => $request->item_name,
            'service_name' => $selectedService['name'],
            'price' => $selectedService['price'],
            'pickup_address' => $request->pickup_address,
            'pickup_date' => $request->pickup_date,
            'notes' => $request->notes,
            'status' => 'courier_dispatched', // courier_dispatched -> inspecting -> crafting -> delivered
            'created_at' => now()->toIso8601String()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Yêu cầu bảo dưỡng trang phục cao cấp đã được tiếp nhận thành công!',
            'data' => $maintenanceTicket
        ]);
    }
}
