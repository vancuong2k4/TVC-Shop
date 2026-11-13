<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AdminArchivalAppraisalController extends Controller
{
    /**
     * Get list of incoming buyback appraisal dossiers and resale inventory
     */
    public function getAppraisalDossiers()
    {
        $stats = [
            'pending_review' => 6,
            'approved_for_resale' => 18,
            'restoration_in_progress' => 4,
            'total_buyback_capital_deployed' => 380000000, // 380 triệu VNĐ
            'average_payout_rate' => '58.5%'
        ];

        $dossiers = [
            [
                'ticket_code' => 'BUYBACK-9F8A2B1C',
                'customer_name' => 'Nguyễn V. Cường',
                'phone' => '0912 345 678',
                'category_name' => 'Áo Măng-tô Cashmere Loro Piana',
                'product_title' => 'The Midnight Noir Trench Winter 2024 (Edition 01/10)',
                'serial_or_code' => 'ARC-NOIR-OVERCOAT-99',
                'purchase_year' => '2024',
                'declared_condition' => 'pristine',
                'original_price' => 28500000,
                'preliminary_valuation' => 19950000,
                'payout_preference' => 'store_credit',
                'appraisal_status' => 'PENDING_PHYSICAL_INSPECTION',
                'inspection_notes' => 'Vải Cashmere nguyên trạng 100%, khuy sừng chưa có vết trầy xước. Đang chờ xe chuyên dụng vận chuyển về xưởng Tràng Tiền.',
                'created_at' => '10:15 - 12/11/2026'
            ],
            [
                'ticket_code' => 'BUYBACK-4E7D1A9B',
                'customer_name' => 'Trần Đ. Long',
                'phone' => '0988 765 432',
                'category_name' => 'Bộ Tuxedo May Đo Super 180s',
                'product_title' => 'Savile Row Bespoke Evening Tuxedo with Silk Lapels',
                'serial_or_code' => 'SOV-TUX-2025-08',
                'purchase_year' => '2025',
                'declared_condition' => 'excellent',
                'original_price' => 36000000,
                'preliminary_valuation' => 19800000,
                'payout_preference' => 'bank_transfer',
                'appraisal_status' => 'APPROVED_FOR_RESALE',
                'inspection_notes' => 'Nghệ nhân Moreau đã hoàn tất hấp khử khuẩn hơi nước cao áp và tái ép ve áo lụa bóng. Đạt chuẩn niêm yết Hầm Kín Archive.',
                'created_at' => '16:40 - 11/11/2026'
            ],
            [
                'ticket_code' => 'BUYBACK-3C5B8A2D',
                'customer_name' => 'Lê H. Nam',
                'phone' => '0903 112 233',
                'category_name' => 'Cặp Xách & Phụ Kiện Titanium',
                'product_title' => 'The Monolith Matte Titanium Briefcase Edition 04',
                'serial_or_code' => 'ARC-TITAN-BRIEFCASE-04',
                'purchase_year' => '2024',
                'declared_condition' => 'restorable',
                'original_price' => 32000000,
                'preliminary_valuation' => 12800000,
                'payout_preference' => 'store_credit',
                'appraisal_status' => 'IN_RESTORATION',
                'inspection_notes' => 'Da bê mộc xước nhẹ ở đáy, đang dưỡng dầu sáp chồn Pháp. Ổ khóa số Thụy Sĩ hoạt động hoàn hảo.',
                'created_at' => '09:00 - 09/11/2026'
            ]
        ];

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'dossiers' => $dossiers
        ]);
    }

    /**
     * Update appraisal inspection status and adjust finalized payout
     */
    public function updateAppraisalVerdict(Request $request, $ticketCode)
    {
        $request->validate([
            'status' => 'required|string|in:PENDING_PHYSICAL_INSPECTION,APPROVED_FOR_RESALE,IN_RESTORATION,REJECTED,PAID_OUT',
            'final_valuation' => 'nullable|numeric|min:500000',
            'artisan_verifier' => 'nullable|string',
            'inspection_notes' => 'nullable|string'
        ]);

        return response()->json([
            'success' => true,
            'message' => "Hồ sơ thẩm định {$ticketCode} đã được cập nhật phán quyết thành công.",
            'updated_dossier' => [
                'ticket_code' => $ticketCode,
                'status' => $request->status,
                'final_valuation' => $request->final_valuation,
                'artisan_verifier' => $request->artisan_verifier ?: 'Maitre Jean-Luc Moreau',
                'inspection_notes' => $request->inspection_notes,
                'updated_at' => now()->toIso8601String()
            ]
        ]);
    }

    /**
     * Mint newly inspected item directly into the Secret Vault or Archival Catalog
     */
    public function mintToSecretVault(Request $request, $ticketCode)
    {
        $request->validate([
            'vault_title' => 'required|string|max:150',
            'vault_price' => 'required|numeric|min:1000000',
            'required_tier' => 'required|string|in:silver,gold,diamond',
            'vintage_year' => 'required|string',
            'condition_grade' => 'required|string'
        ]);

        $archivalCode = 'VLT-ARCH-' . strtoupper(substr(md5(uniqid()), 0, 6));

        return response()->json([
            'success' => true,
            'message' => "Tuyệt tác từ hồ sơ {$ticketCode} đã được đúc thành công vào Hầm Lưu Trữ Kín với mã {$archivalCode}.",
            'minted_vault_item' => [
                'archival_code' => $archivalCode,
                'title' => $request->vault_title,
                'price' => $request->vault_price,
                'tier' => $request->required_tier,
                'grade' => $request->condition_grade,
                'minted_at' => now()->toIso8601String(),
                'hash' => hash('sha256', $archivalCode . now()->timestamp)
            ]
        ]);
    }
}
