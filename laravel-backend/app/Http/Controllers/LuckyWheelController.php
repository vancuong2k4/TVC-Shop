<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Str;

class LuckyWheelController extends Controller
{
    /**
     * Danh sách 8 phần thưởng trên Vòng Quay May Mắn TVC-Shop
     */
    private $prizes = [
        [
            'id' => 1,
            'label' => 'Giảm 10%',
            'type' => 'discount',
            'value' => 10,
            'color' => '#18181b', // Zinc 900
            'textColor' => '#ffffff',
            'probability' => 35
        ],
        [
            'id' => 2,
            'label' => 'Voucher 50K',
            'type' => 'fixed',
            'value' => 50000,
            'color' => '#27272a', // Zinc 800
            'textColor' => '#ffffff',
            'probability' => 25
        ],
        [
            'id' => 3,
            'label' => 'Freeship 100%',
            'type' => 'freeship',
            'value' => 100,
            'color' => '#09090b', // Zinc 950
            'textColor' => '#ffffff',
            'probability' => 15
        ],
        [
            'id' => 4,
            'label' => 'Chúc Bạn May Mắn',
            'type' => 'luck',
            'value' => 0,
            'color' => '#3f3f46', // Zinc 700
            'textColor' => '#ffffff',
            'probability' => 10
        ],
        [
            'id' => 5,
            'label' => 'Giảm 15%',
            'type' => 'discount',
            'value' => 15,
            'color' => '#18181b',
            'textColor' => '#ffffff',
            'probability' => 8
        ],
        [
            'id' => 6,
            'label' => 'Voucher 100K',
            'type' => 'fixed',
            'value' => 100000,
            'color' => '#27272a',
            'textColor' => '#ffffff',
            'probability' => 4
        ],
        [
            'id' => 7,
            'label' => 'Giảm 25% VIP',
            'type' => 'discount',
            'value' => 25,
            'color' => '#000000',
            'textColor' => '#fef08a', // Amber 200
            'probability' => 2
        ],
        [
            'id' => 8,
            'label' => 'Quà Tặng Phụ Kiện',
            'type' => 'gift',
            'value' => 0,
            'color' => '#3f3f46',
            'textColor' => '#ffffff',
            'probability' => 1
        ]
    ];

    /**
     * Lấy cấu hình các ô phần thưởng của Vòng Quay May Mắn
     */
    public function getWheelConfig()
    {
        return response()->json([
            'success' => true,
            'title' => 'LUCKY NOIR WHEEL',
            'subtitle' => 'Vòng quay may mắn dành riêng cho thành viên TVC-Shop',
            'prizes' => $this->prizes
        ]);
    }

    /**
     * Thực hiện quay thưởng và phát sinh mã coupon độc nhất tức thì
     */
    public function spin(Request $request)
    {
        // Thuật toán chọn giải theo trọng số (weighted random selection)
        $totalWeight = array_sum(array_column($this->prizes, 'probability'));
        $random = mt_rand(1, $totalWeight);
        $currentWeight = 0;
        $selectedPrize = null;
        $prizeIndex = 0;

        foreach ($this->prizes as $index => $prize) {
            $currentWeight += $prize['probability'];
            if ($random <= $currentWeight) {
                $selectedPrize = $prize;
                $prizeIndex = $index;
                break;
            }
        }

        if (!$selectedPrize) {
            $selectedPrize = $this->prizes[0];
            $prizeIndex = 0;
        }

        $generatedCode = null;

        // Nếu trúng mã giảm giá, sinh mã Coupon độc nhất trong bảng coupons
        if (in_array($selectedPrize['type'], ['discount', 'fixed', 'freeship'])) {
            $discountPercentage = 10;
            if ($selectedPrize['type'] === 'discount') {
                $discountPercentage = $selectedPrize['value'];
            } elseif ($selectedPrize['type'] === 'fixed' || $selectedPrize['type'] === 'freeship') {
                $discountPercentage = $selectedPrize['value'] >= 100000 ? 20 : 15;
            }

            $generatedCode = 'SPIN-' . strtoupper(Str::random(6));

            Coupon::create([
                'code' => $generatedCode,
                'discount_percentage' => $discountPercentage,
                'max_uses' => 1,
                'current_uses' => 0,
                'valid_until' => Carbon::now()->addDays(7),
                'created_at' => Carbon::now()
            ]);
        }

        return response()->json([
            'success' => true,
            'prize_index' => $prizeIndex,
            'prize' => $selectedPrize,
            'coupon_code' => $generatedCode,
            'expires_at' => Carbon::now()->addDays(7)->format('d/m/Y H:i'),
            'message' => $generatedCode 
                ? 'Chúc mừng bạn đã quay trúng ' . $selectedPrize['label'] . '! Mã ưu đãi: ' . $generatedCode
                : 'Chúc bạn may mắn lần sau cùng các bộ sưu tập mới tại TVC-Shop!'
        ]);
    }
}
