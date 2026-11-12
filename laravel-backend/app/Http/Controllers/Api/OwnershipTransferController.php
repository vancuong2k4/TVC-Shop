<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class OwnershipTransferController extends Controller
{
    /**
     * Get active registered provenance deeds / transferable heirloom items
     */
    public function getTransferableAssets()
    {
        $assets = [
            [
                'deed_id' => 'DEED-VN-2024-0089',
                'serial_number' => 'TVC-RW-24-001',
                'title' => 'The Midnight Noir Archival Cashmere Trench (Edition 01/10)',
                'current_owner' => 'Nguyễn V. Cường (Diamond Sovereign Member)',
                'minted_date' => '15/10/2024',
                'blockchain_hash' => '0x8f3c7e4a9b2d1e0f6c5b8a7d3e2f1c0b9a8e7d6c5b4a3f2e1d0c9b8a7e6f5d4c',
                'authenticity_status' => 'VERIFIED_GENUINE',
                'appraised_value' => 38000000,
                'image' => 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&auto=format&fit=crop',
                'fabric' => '100% Loro Piana Double-faced Cashmere (Ý)',
                'transfer_history_count' => 1,
                'perks_transferable' => [
                    'Quyền bảo dưỡng & hấp thơm hương trầm trọn đời tại TVC Atelier',
                    'Đặc quyền sửa đổi kích thước may đo lại miễn phí 01 lần cho chủ nhân mới',
                    'Chứng thư số hóa bất biến trên sổ cái di sản TVC Ledger'
                ]
            ],
            [
                'deed_id' => 'DEED-VN-2025-0142',
                'serial_number' => 'SOV-DIAMOND-SUIT-01',
                'title' => 'Sovereign 24K Gold-Thread Bespoke Tuxedo (One-of-a-Kind)',
                'current_owner' => 'Trần Đ. Long (Heritage Collector)',
                'minted_date' => '02/03/2025',
                'blockchain_hash' => '0x3a7b1c9e8f2d4a6b5c0e7f8d1a2c3b4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c',
                'authenticity_status' => 'VERIFIED_GENUINE',
                'appraised_value' => 72000000,
                'image' => 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop',
                'fabric' => 'Scabal Super 180s Wool dệt sợi vàng 24K nguyên chất',
                'transfer_history_count' => 0,
                'perks_transferable' => [
                    'Vé mời tham dự hàng ghế đầu (Front Row) tại sàn diễn thời niên',
                    'Hộp đựng sơn mài nguyên khối khóa cơ học chống trộm'
                ]
            ],
            [
                'deed_id' => 'DEED-VN-2026-0004',
                'serial_number' => 'ARC-TITAN-BRIEFCASE-04',
                'title' => 'The Monolith Matte Titanium Diplomatic Briefcase',
                'current_owner' => 'Lê H. Nam (Gold Heritage Member)',
                'minted_date' => '10/01/2026',
                'blockchain_hash' => '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
                'authenticity_status' => 'VERIFIED_GENUINE',
                'appraised_value' => 42000000,
                'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
                'fabric' => 'Khung Titanium hàng không & Da bê mộc Pháp Full-grain',
                'transfer_history_count' => 0,
                'perks_transferable' => [
                    'Bảo hành cơ học ổ khóa Thụy Sĩ trọn đời',
                    'Khắc laser tên người thừa kế lên thẻ kim loại'
                ]
            ]
        ];

        return response()->json([
            'success' => true,
            'assets' => $assets,
            'protocol_rules' => [
                'Giao dịch chuyển nhượng văn tự sở hữu (Deed of Transfer) là không thể đảo ngược sau khi hai bên ký xác nhận.',
                'Chủ nhân mới sẽ kế thừa toàn bộ lịch sử di sản, quyền bảo dưỡng trọn đời và chứng chỉ kỹ thuật số.',
                'TVC Atelier đóng vai trò công chứng viên kỹ thuật số trung lập bảo chứng tính nguyên bản 100%.'
            ]
        ]);
    }

    /**
     * Initiate deed transfer to a new heir / collector
     */
    public function executeTransfer(Request $request)
    {
        $request->validate([
            'deed_id' => 'required|string',
            'current_owner_signature' => 'required|string',
            'recipient_name' => 'required|string|max:100',
            'recipient_phone' => 'required|string',
            'recipient_email' => 'required|email',
            'transfer_reason' => 'required|string|in:heirship_gift,private_resale,estate_legacy',
            'dedication_note' => 'nullable|string|max:250',
        ]);

        $transferCode = 'XFER-' . strtoupper(substr(md5(uniqid()), 0, 8));
        $newDeedId = 'DEED-VN-' . date('Y') . '-' . rand(1000, 9999);
        $newHash = hash('sha256', $transferCode . $request->deed_id . now()->timestamp);

        return response()->json([
            'success' => true,
            'message' => 'Văn tự chuyển nhượng quyền sở hữu di sản đã được ký kết và ghi danh thành công vào Sổ cái TVC Sovereign Ledger.',
            'transfer_certificate' => [
                'transfer_code' => $transferCode,
                'original_deed_id' => $request->deed_id,
                'new_deed_id' => $newDeedId,
                'new_owner_name' => $request->recipient_name,
                'recipient_email' => $request->recipient_email,
                'reason' => $request->transfer_reason,
                'dedication' => $request->dedication_note ? strtoupper($request->dedication_note) : 'LEGACY TRANSFERRED WITH HONOUR',
                'notary_status' => 'AUTHENTICATED_AND_MINTED',
                'notarized_at' => now()->toIso8601String(),
                'blockchain_tx' => $newHash
            ]
        ]);
    }
}
