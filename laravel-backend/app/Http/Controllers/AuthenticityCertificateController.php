<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class AuthenticityCertificateController extends Controller
{
    /**
     * Danh mục các chứng nhận độc bản kỹ thuật số đã được bảo chứng trên sổ cái mật mã
     */
    private $certificates = [
        [
            'certificate_id' => 'TVC-AUTH-882190',
            'product_id' => 1,
            'product_name' => 'The Obsidian Trench Coat (Runway Edition)',
            'serial_number' => 'TVC-FW26-001/050',
            'edition_type' => 'Haute Couture Runway Archive',
            'artisan' => 'Master Tailor Hoàng Nam',
            'fabric_origin' => 'Biella, Italy (14.5 Micron Cashmere)',
            'crafting_hours' => 48,
            'blockchain_network' => 'Ethereum Sovereign L2 Ledger',
            'contract_address' => '0x71C...b92F',
            'token_standard' => 'ERC-721 Immutable Provenance',
            'cryptographic_hash' => 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            'issue_date' => '2026-11-01',
            'current_owner' => 'Arthur V.C (Verified VIP)',
            'transfer_history_count' => 1,
            'perks' => [
                'Bảo dưỡng và làm mới miễn phí trọn đời tại Atelier Tràng Tiền & Đồng Khởi',
                'Thẻ vào cổng VIP hàng ghế đầu tại Tuần lễ Thời trang TVC Xuân Hè 2027',
                'Quyền ưu tiên mua trước các phiên bản giới hạn tiếp theo 48 giờ'
            ]
        ],
        [
            'certificate_id' => 'TVC-AUTH-991204',
            'product_id' => 2,
            'product_name' => 'Structured Tuxedo Blazer in Silk Satin',
            'serial_number' => 'TVC-FW26-015/040',
            'edition_type' => 'Midnight Noir Private Salon',
            'artisan' => 'Artisan Atelier Thảo My',
            'fabric_origin' => 'Lyon, France (22 Momme Silk)',
            'crafting_hours' => 36,
            'blockchain_network' => 'Ethereum Sovereign L2 Ledger',
            'contract_address' => '0x94A...c11E',
            'token_standard' => 'ERC-721 Immutable Provenance',
            'cryptographic_hash' => '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
            'issue_date' => '2026-10-15',
            'current_owner' => 'Minh Hằng (Verified VIP)',
            'transfer_history_count' => 1,
            'perks' => [
                'Chứng thư số hóa chuyển nhượng chủ sở hữu an toàn qua mật mã',
                'Dịch vụ chỉnh sửa phom dáng Bespoke trọn đời'
            ]
        ]
    ];

    /**
     * Tra cứu và kiểm định chứng nhận độc bản (Cryptographic Authenticity Verification)
     */
    public function verifyCertificate(Request $request)
    {
        $query = strtoupper(trim($request->input('code', '')));

        if (!$query) {
            return response()->json([
                'success' => false,
                'message' => 'Vui lòng cung cấp mã chứng nhận (Ví dụ: TVC-AUTH-882190) hoặc số Serial sản phẩm.'
            ], 400);
        }

        $certificate = null;
        foreach ($this->certificates as $cert) {
            if ($cert['certificate_id'] === $query || strtoupper($cert['serial_number']) === $query) {
                $certificate = $cert;
                break;
            }
        }

        if (!$certificate) {
            return response()->json([
                'success' => false,
                'verified' => false,
                'message' => 'Không tìm thấy chứng thư độc bản tương ứng trên sổ cái kiểm định TVC-Shop.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'verified' => true,
            'certificate' => $certificate,
            'verified_at' => now()->toIso8601String(),
            'status_label' => 'GENUINE & AUTHENTICATED'
        ]);
    }

    /**
     * Lấy danh sách chứng chỉ mẫu phục vụ thư viện kiểm định
     */
    public function getShowcase()
    {
        return response()->json([
            'success' => true,
            'total_authenticated_pieces' => 90,
            'certificates' => $this->certificates
        ]);
    }
}
