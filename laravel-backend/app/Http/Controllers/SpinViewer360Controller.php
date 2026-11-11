<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class SpinViewer360Controller extends Controller
{
    /**
     * Dữ liệu mô phỏng góc quay 360 độ (16 khung hình phân giải cao) cho trang phục chủ lực
     */
    private $spinProducts = [
        1 => [
            'product_id' => 1,
            'name' => 'The Obsidian Trench Coat (Runway 360°)',
            'total_frames' => 8,
            'frames' => [
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=700', // Front
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=700', // Front-Right
                'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=700', // Right Profile
                'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=700', // Back-Right
                'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=700', // Back View
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=700', // Back-Left
                'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=700', // Left Profile
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=700'  // Front Return
            ],
            'hotspots' => [
                ['frame' => 0, 'x' => 48, 'y' => 25, 'title' => 'Ve Áo Chữ V Sắc Nét', 'desc' => 'Được ép keo lụa định hình thủ công chống gãy gập.'],
                ['frame' => 2, 'x' => 52, 'y' => 60, 'title' => 'Túi Hộp Vát Cạnh Chìm', 'desc' => 'Đường may giấu chỉ tinh xảo không lộ mép ngoài.'],
                ['frame' => 4, 'x' => 50, 'y' => 45, 'title' => 'Xếp Ly Lưng Chữ A', 'desc' => 'Tạo độ bay tự nhiên khi di chuyển trong gió.']
            ]
        ],
        2 => [
            'product_id' => 2,
            'name' => 'Structured Tuxedo Blazer in Silk (360° Inspection)',
            'total_frames' => 6,
            'frames' => [
                'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=700',
                'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=700',
                'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=700',
                'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=700',
                'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=700',
                'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=700'
            ],
            'hotspots' => [
                ['frame' => 0, 'x' => 50, 'y' => 28, 'title' => 'Cầu Vai Đệm Ngựa Savile Row', 'desc' => 'Tạo phom dáng quyền lực tự nhiên.'],
                ['frame' => 3, 'x' => 48, 'y' => 70, 'title' => 'Đường Xẻ Lưng Đôi (Double Vent)', 'desc' => 'Thoải mái khi ngồi xe mà không nhăn áo.']
            ]
        ]
    ];

    /**
     * Lấy dữ liệu xoay 360 độ của sản phẩm
     */
    public function getSpinData(Request $request)
    {
        $productId = (int) $request->input('product_id', 1);

        $spinData = $this->spinProducts[$productId] ?? $this->spinProducts[1];

        return response()->json([
            'success' => true,
            'spin_data' => $spinData
        ]);
    }
}
