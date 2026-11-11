<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PrivateSalonController extends Controller
{
    /**
     * Danh sách các Stylist cố vấn cấp cao & Chuyên gia may đo Bespoke
     */
    private $stylists = [
        [
            'id' => 'stylist_01',
            'name' => 'Thảo My',
            'role' => 'Head of Styling & Creative Director',
            'experience' => '10 năm tại Tuần lễ Thời trang Paris & Milan',
            'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
            'specialties' => ['Power Dressing', 'Runway Capsule', 'Dạ yến thảm đỏ']
        ],
        [
            'id' => 'stylist_02',
            'name' => 'Hoàng Nam',
            'role' => 'Master Tailor & Silhouette Specialist',
            'experience' => '12 năm nghệ nhân may đo Bespoke Savile Row',
            'avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
            'specialties' => ['Cấu trúc Tuxedo', 'Chất liệu Lụa & Len Cashmere', 'Kỹ thuật Monogram cá nhân']
        ],
        [
            'id' => 'stylist_03',
            'name' => 'Minh Trang',
            'role' => 'VIP Wardrobe Curator',
            'experience' => 'Cố vấn trang phục riêng cho các Doanh nhân & Nghệ sĩ',
            'avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
            'specialties' => ['Quiet Luxury Daily', 'Phối đồ Capsule theo mùa', 'Tủ đồ công sở cao cấp']
        ]
    ];

    /**
     * Danh sách các địa điểm Salon vật lý và hình thức Online
     */
    private $locations = [
        [
            'id' => 'salon_hanoi',
            'name' => 'TVC Private Salon - Tràng Tiền, Hà Nội',
            'address' => 'Số 15 Tràng Tiền, Hoàn Kiếm, Hà Nội',
            'type' => 'in_person',
            'amenities' => ['Phòng thử đồ riêng tư VIP', 'Rượu vang & Trà thảo mộc Pháp', 'Gương soi 360 độ ánh sáng tự nhiên']
        ],
        [
            'id' => 'salon_saigon',
            'name' => 'TVC Private Salon - Đồng Khởi, TP. Hồ Chí Minh',
            'address' => 'Số 68 Đồng Khởi, Quận 1, TP. Hồ Chí Minh',
            'type' => 'in_person',
            'amenities' => ['Phòng may đo nghệ nhân Bespoke', 'Bộ sưu tập vải mẫu nhập khẩu từ Ý & Pháp', 'Xe đưa đón riêng trong bán kính 10km']
        ],
        [
            'id' => 'salon_virtual',
            'name' => 'Private Video Concierge (Trực tuyến 1-1)',
            'address' => 'Phòng họp trực tuyến bảo mật chuẩn studio',
            'type' => 'virtual',
            'amenities' => ['Gửi hộp mẫu vải tận nhà trước buổi hẹn', 'Bản phác thảo phong cách 3D gửi qua email', 'Hỗ trợ khách hàng quốc tế qua Zoom HD']
        ]
    ];

    /**
     * Lấy dữ liệu cấu hình đặt lịch Private Salon
     */
    public function getSalonConfig()
    {
        return response()->json([
            'success' => true,
            'stylists' => $this->stylists,
            'locations' => $this->locations,
            'available_time_slots' => [
                '09:30 - 11:00',
                '11:30 - 13:00',
                '14:00 - 15:30',
                '16:00 - 17:30',
                '19:00 - 20:30'
            ]
        ]);
    }

    /**
     * Tạo yêu cầu đặt lịch tư vấn Private Salon VIP
     */
    public function bookAppointment(Request $request)
    {
        $request->validate([
            'customer_name' => 'required|string|max:100',
            'customer_phone' => 'required|string|max:20',
            'customer_email' => 'required|email|max:100',
            'stylist_id' => 'required|string',
            'location_id' => 'required|string',
            'appointment_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|string',
            'special_requests' => 'nullable|string|max:500'
        ]);

        $bookingCode = 'VIP-' . strtoupper(Str::random(7));

        $matchedStylist = collect($this->stylists)->firstWhere('id', $request->stylist_id) ?? $this->stylists[0];
        $matchedLocation = collect($this->locations)->firstWhere('id', $request->location_id) ?? $this->locations[0];

        $appointment = [
            'booking_code' => $bookingCode,
            'customer_name' => $request->customer_name,
            'customer_phone' => $request->customer_phone,
            'customer_email' => $request->customer_email,
            'stylist' => [
                'name' => $matchedStylist['name'],
                'role' => $matchedStylist['role'],
                'avatar' => $matchedStylist['avatar']
            ],
            'location' => [
                'name' => $matchedLocation['name'],
                'address' => $matchedLocation['address'],
                'type' => $matchedLocation['type']
            ],
            'appointment_date' => $request->appointment_date,
            'time_slot' => $request->time_slot,
            'special_requests' => $request->special_requests,
            'status' => 'confirmed',
            'created_at' => now()->toIso8601String()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Lịch hẹn tư vấn Private Salon 1-1 của bạn đã được xác nhận thành công!',
            'data' => $appointment
        ]);
    }
}
