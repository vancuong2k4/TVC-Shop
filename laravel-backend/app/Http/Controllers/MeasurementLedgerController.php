<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MeasurementLedgerController extends Controller
{
    /**
     * Dữ liệu hồ sơ số đo may đo Bespoke chuẩn mực
     */
    private $measurementCategories = [
        'upper_body' => [
            'name' => 'Phần Thân Trên (Upper Body)',
            'fields' => [
                ['key' => 'neck', 'label' => 'Vòng Cổ (Neck)', 'unit' => 'cm', 'default' => 38.5, 'range' => '34 - 48 cm'],
                ['key' => 'shoulder', 'label' => 'Rộng Vai (Shoulder Width)', 'unit' => 'cm', 'default' => 45.0, 'range' => '40 - 54 cm'],
                ['key' => 'chest', 'label' => 'Vòng Ngực (Chest Circumference)', 'unit' => 'cm', 'default' => 96.0, 'range' => '82 - 120 cm'],
                ['key' => 'sleeve_length', 'label' => 'Dài Tay Áo (Sleeve Length)', 'unit' => 'cm', 'default' => 62.5, 'range' => '55 - 72 cm'],
                ['key' => 'bicep', 'label' => 'Bắp Tay (Bicep)', 'unit' => 'cm', 'default' => 33.0, 'range' => '26 - 45 cm'],
                ['key' => 'wrist', 'label' => 'Cổ Tay (Wrist)', 'unit' => 'cm', 'default' => 17.5, 'range' => '14 - 22 cm']
            ]
        ],
        'core_body' => [
            'name' => 'Vòng Eo & Thắt Lưng (Core & Waist)',
            'fields' => [
                ['key' => 'waist', 'label' => 'Vòng Eo Tự Nhiên (Natural Waist)', 'unit' => 'cm', 'default' => 78.0, 'range' => '65 - 110 cm'],
                ['key' => 'trouser_waist', 'label' => 'Vòng Cạp Quần (Trouser Waistband)', 'unit' => 'cm', 'default' => 82.0, 'range' => '70 - 115 cm'],
                ['key' => 'back_length', 'label' => 'Chiều Dài Sống Lưng (Center Back)', 'unit' => 'cm', 'default' => 72.0, 'range' => '60 - 85 cm']
            ]
        ],
        'lower_body' => [
            'name' => 'Phần Thân Dưới & Quần (Lower Body)',
            'fields' => [
                ['key' => 'hips', 'label' => 'Vòng Mông (Seat / Hips)', 'unit' => 'cm', 'default' => 98.0, 'range' => '85 - 125 cm'],
                ['key' => 'thigh', 'label' => 'Vòng Đùi (Thigh Width)', 'unit' => 'cm', 'default' => 56.5, 'range' => '48 - 72 cm'],
                ['key' => 'inseam', 'label' => 'Chiều Dài Đáy Quần (Inseam Length)', 'unit' => 'cm', 'default' => 78.0, 'range' => '68 - 90 cm'],
                ['key' => 'outseam', 'label' => 'Dài Quần Từ Cạp (Outseam)', 'unit' => 'cm', 'default' => 102.0, 'range' => '90 - 118 cm'],
                ['key' => 'leg_opening', 'label' => 'Độ Rộng Gấu Quần (Leg Opening)', 'unit' => 'cm', 'default' => 18.5, 'range' => '15 - 25 cm']
            ]
        ]
    ];

    /**
     * Lấy cấu hình các trường số đo may đo
     */
    public function getLedgerSchema()
    {
        return response()->json([
            'success' => true,
            'categories' => $this->measurementCategories,
            'certified_tailors' => [
                'Master Tailor Hoàng Nam (Head Atelier)',
                'Savile Row Specialist Thảo My',
                'Bespoke Artisan Minh Trang'
            ],
            'sample_profile' => [
                'profile_id' => 'FIT-VIP-0042',
                'client_name' => 'Arthur V.C (VIP Diamond)',
                'height' => 178,
                'weight' => 71,
                'posture' => 'Erect & Square Shoulders (Vai vuông & Lưng thẳng)',
                'fit_preference' => 'Structured Slim Fit',
                'measurements' => [
                    'neck' => 39.0,
                    'shoulder' => 45.5,
                    'chest' => 97.0,
                    'sleeve_length' => 63.0,
                    'bicep' => 33.5,
                    'wrist' => 17.5,
                    'waist' => 79.0,
                    'trouser_waist' => 83.0,
                    'back_length' => 73.0,
                    'hips' => 98.5,
                    'thigh' => 57.0,
                    'inseam' => 79.0,
                    'outseam' => 103.0,
                    'leg_opening' => 18.5
                ],
                'last_calibrated' => '2026-10-28',
                'calibrated_by' => 'Master Tailor Hoàng Nam'
            ]
        ]);
    }

    /**
     * Cập nhật hoặc lưu hồ sơ số đo may đo của khách hàng
     */
    public function saveLedger(Request $request)
    {
        $request->validate([
            'client_name' => 'required|string|max:100',
            'height' => 'required|numeric|min:120|max:230',
            'weight' => 'required|numeric|min:35|max:180',
            'posture' => 'nullable|string|max:100',
            'fit_preference' => 'required|string',
            'measurements' => 'required|array'
        ]);

        $ledgerCode = 'FIT-' . strtoupper(bin2hex(random_bytes(3)));

        $savedProfile = [
            'ledger_code' => $ledgerCode,
            'client_name' => $request->client_name,
            'height' => $request->height,
            'weight' => $request->weight,
            'posture' => $request->posture ?: 'Chuẩn mực cân đối',
            'fit_preference' => $request->fit_preference,
            'measurements' => $request->measurements,
            'status' => 'calibrated_active',
            'updated_at' => now()->toIso8601String()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Hồ sơ số đo may đo cá nhân hóa đã được đồng bộ lên Sổ cái Thước đo TVC-Shop!',
            'data' => $savedProfile
        ]);
    }
}
