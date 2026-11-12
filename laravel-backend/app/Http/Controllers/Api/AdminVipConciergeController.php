<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;

class AdminVipConciergeController extends Controller
{
    /**
     * Get VIP Client Concierge Management Dashboard
     */
    public function getConciergeDashboard()
    {
        // VIP Tiers and clientele stats
        $summary = [
            'total_vip_clients' => 84,
            'diamond_sovereigns' => 12,
            'gold_heritages' => 28,
            'silver_ateliers' => 44,
            'active_bespoke_commissions' => 9,
            'total_vip_lifetime_spend' => 2450000000, // 2.45 tỷ VNĐ
            'average_vip_aov' => 38500000 // 38.5tr VNĐ
        ];

        // List of priority VIP appointments and bespoke tickets
        $appointments = [
            [
                'id' => 'APT-001',
                'client_name' => 'Nguyễn V. Cường',
                'tier' => 'diamond',
                'service' => 'Private Salon 1-1 & Thử Vải Cashmere Loro Piana',
                'salon_location' => 'Salon Tràng Tiền (Hà Nội)',
                'scheduled_at' => '14:30 - Ngày 18/11/2026',
                'dedicated_tailor' => 'Maitre Jean-Luc Moreau',
                'status' => 'CONFIRMED',
                'lifetime_spend' => 145000000,
                'special_preferences' => 'Yêu cầu chuẩn bị trà sen cổ truyền và nến hương Noir Kyara.'
            ],
            [
                'id' => 'APT-002',
                'client_name' => 'Trần Đ. Long',
                'tier' => 'gold',
                'service' => 'Lấy Số Đo May Đo Bộ Tuxedo Sợi Vàng 24K',
                'salon_location' => 'Salon Đồng Khởi (TP.HCM)',
                'scheduled_at' => '10:00 - Ngày 20/11/2026',
                'dedicated_tailor' => 'Nghệ nhân Vũ Trọng Cường',
                'status' => 'PENDING_CONFIRMATION',
                'lifetime_spend' => 82000000,
                'special_preferences' => 'Khắc laser tên người thừa kế lên thẻ kim loại titanium.'
            ],
            [
                'id' => 'APT-003',
                'client_name' => 'Lê H. Nam',
                'tier' => 'diamond',
                'service' => 'Bàn Giao Trực Tiếp Cặp Xách Titan & Ký Sổ Cái',
                'salon_location' => 'Private Suite Khách sạn Sofitel Metropole',
                'scheduled_at' => '16:00 - Ngày 22/11/2026',
                'dedicated_tailor' => 'White-Glove Logistics Lead',
                'status' => 'DISPATCHED',
                'lifetime_spend' => 195000000,
                'special_preferences' => 'Vận chuyển bằng xe chuyên dụng chống sốc.'
            ],
            [
                'id' => 'APT-004',
                'client_name' => 'Phạm Quỳnh Anh',
                'tier' => 'silver',
                'service' => 'Thử Đồ Mùa Hè Lanh Normandie & Đầm Lụa Como',
                'salon_location' => 'Salon Tràng Tiền (Hà Nội)',
                'scheduled_at' => '15:00 - Ngày 25/11/2026',
                'dedicated_tailor' => 'Stylist Cao Cấp Hoàng Mai',
                'status' => 'CONFIRMED',
                'lifetime_spend' => 36000000,
                'special_preferences' => 'Cần chuẩn bị sẵn 3 phối màu Light Spring.'
            ]
        ];

        return response()->json([
            'success' => true,
            'summary' => $summary,
            'appointments' => $appointments,
        ]);
    }

    /**
     * Update appointment status or assign tailor
     */
    public function updateAppointmentStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:CONFIRMED,PENDING_CONFIRMATION,DISPATCHED,COMPLETED,CANCELLED',
            'dedicated_tailor' => 'nullable|string',
            'concierge_notes' => 'nullable|string'
        ]);

        return response()->json([
            'success' => true,
            'message' => "Lịch hẹn VIP {$id} đã được cập nhật trạng thái {$request->status} thành công.",
            'updated_appointment' => [
                'id' => $id,
                'status' => $request->status,
                'dedicated_tailor' => $request->dedicated_tailor,
                'updated_at' => now()->toIso8601String()
            ]
        ]);
    }

    /**
     * Send bespoke digital greeting or exclusive secret vault invitation
     */
    public function sendVipInvitation(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string',
            'tier' => 'required|string',
            'invitation_type' => 'required|string|in:front_row_runway,secret_vault_release,private_tea_tasting',
            'custom_message' => 'required|string'
        ]);

        $inviteCode = 'INV-VIP-' . strtoupper(substr(md5(uniqid()), 0, 8));

        return response()->json([
            'success' => true,
            'message' => "Thư mời đặc quyền đã được gửi thành công tới khách hàng {$request->client_name}.",
            'invitation' => [
                'invite_code' => $inviteCode,
                'recipient' => $request->client_name,
                'tier' => $request->tier,
                'type' => $request->invitation_type,
                'sent_at' => now()->toIso8601String(),
                'hash' => hash('sha256', $inviteCode . now()->timestamp)
            ]
        ]);
    }
}
