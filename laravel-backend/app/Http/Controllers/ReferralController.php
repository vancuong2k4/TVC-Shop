<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Order;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ReferralController extends Controller
{
    /**
     * Lấy thông tin mã giới thiệu cá nhân và tổng quan phần thưởng
     */
    public function getReferralStats(Request $request)
    {
        $user = $request->user();

        // Tạo mã giới thiệu độc nhất dựa trên user id và tên nếu cần
        // Format: TVC-REF-{USER_ID}-{HASH}
        $referralCode = 'TVCREF' . str_pad($user->id, 4, '0', STR_PAD_LEFT);

        // Tính số lượng đơn hàng và số bạn bè giới thiệu thành công (mô phỏng theo coupon usage hoặc user id)
        // Mỗi đơn hàng giới thiệu thành công mang lại 50.000đ tín dụng mua hàng
        // Kiểm tra xem đã có mã Coupon giới thiệu tương ứng trong bảng coupons chưa
        $coupon = Coupon::firstOrCreate(
            ['code' => $referralCode],
            [
                'discount_percentage' => 10, // Giảm 10% cho bạn bè khi nhập mã này
                'max_uses' => 100,
                'current_uses' => 0,
                'valid_until' => now()->addYear(),
                'created_at' => now(),
            ]
        );

        $successfulReferrals = $coupon->current_uses ?? 0;
        $rewardBonusPerFriend = 50000; // 50.000 VNĐ cho mỗi lần bạn bè áp dụng
        $totalEarnedCredit = $successfulReferrals * $rewardBonusPerFriend;

        // Lấy danh sách E-Gift Cards có sẵn trong hệ thống (các mệnh giá quà tặng)
        $giftCardTemplates = [
            [
                'id' => 'gc_200k',
                'name' => 'Cold Minimalist Bronze Card',
                'balance' => 200000,
                'code_prefix' => 'GIFT-200K-',
                'color_gradient' => 'from-zinc-900 to-zinc-700',
                'description' => 'Phiếu quà tặng điện tử trị giá 200.000 VNĐ áp dụng toàn bộ sản phẩm.'
            ],
            [
                'id' => 'gc_500k',
                'name' => 'Noir Elegance Silver Card',
                'balance' => 500000,
                'code_prefix' => 'GIFT-500K-',
                'color_gradient' => 'from-slate-900 via-neutral-800 to-slate-950',
                'description' => 'Phiếu quà tặng điện tử trị giá 500.000 VNĐ với bao bì số sang trọng.'
            ],
            [
                'id' => 'gc_1000k',
                'name' => 'Pure Monochrome Gold Card',
                'balance' => 1000000,
                'code_prefix' => 'GIFT-1000K-',
                'color_gradient' => 'from-stone-900 via-zinc-900 to-stone-950',
                'description' => 'Phiếu quà tặng điện tử cao cấp trị giá 1.000.000 VNĐ.'
            ],
            [
                'id' => 'gc_2000k',
                'name' => 'Haute Couture Diamond Card',
                'balance' => 2000000,
                'code_prefix' => 'GIFT-2000K-',
                'color_gradient' => 'from-neutral-950 via-zinc-800 to-neutral-900',
                'description' => 'Phiếu quà tặng VIP cao cấp trị giá 2.000.000 VNĐ gửi kèm thư chúc mừng cá nhân hóa.'
            ]
        ];

        return response()->json([
            'referral_code' => $referralCode,
            'referral_link' => config('app.url', 'http://localhost:5173') . '/register?ref=' . $referralCode,
            'friend_discount_percent' => 10,
            'reward_per_invite' => $rewardBonusPerFriend,
            'successful_invites' => $successfulReferrals,
            'total_earned_credits' => $totalEarnedCredit,
            'gift_card_templates' => $giftCardTemplates
        ]);
    }

    /**
     * Mua hoặc phát hành một E-Gift Card kỹ thuật số mới
     */
    public function purchaseGiftCard(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:50000',
            'recipient_name' => 'required|string|max:100',
            'recipient_email' => 'required|email|max:150',
            'sender_name' => 'required|string|max:100',
            'message' => 'nullable|string|max:300',
            'card_theme' => 'nullable|string'
        ]);

        $user = $request->user();
        $code = 'EGC-' . strtoupper(Str::random(4)) . '-' . strtoupper(Str::random(4));
        
        // Tạo mã coupon trong cơ sở dữ liệu với tỷ lệ chiết khấu tương ứng (hoặc mã voucher trừ trực tiếp)
        // Do hệ thống Coupon hiện tại lưu discount_percentage, ta quy đổi mức giảm hoặc tạo coupon 100% giới hạn
        // Để linh hoạt, ta tạo mã coupon độc nhất tương ứng với mã E-Gift Card
        // Tính tỷ lệ phần trăm tượng trưng hoặc lưu mã gift card
        $discountPercent = 20; // 20% off hoặc thiết lập mã quà tặng
        if ($request->amount >= 1000000) {
            $discountPercent = 30;
        }

        $coupon = Coupon::create([
            'code' => $code,
            'discount_percentage' => $discountPercent,
            'max_uses' => 1,
            'current_uses' => 0,
            'valid_until' => now()->addMonths(6),
            'created_at' => now(),
        ]);

        return response()->json([
            'message' => 'Tạo E-Gift Card thành công!',
            'gift_card' => [
                'code' => $code,
                'amount' => (int) $request->amount,
                'discount_percentage' => $discountPercent,
                'sender_name' => $request->sender_name,
                'recipient_name' => $request->recipient_name,
                'recipient_email' => $request->recipient_email,
                'message' => $request->message ?: 'Chúc bạn có những trải nghiệm thời trang tuyệt vời cùng TVC-Shop.',
                'card_theme' => $request->card_theme ?: 'noir',
                'valid_until' => now()->addMonths(6)->format('d/m/Y')
            ]
        ], 201);
    }

    /**
     * Kiểm tra và tra cứu thông tin mã E-Gift Card
     */
    public function checkGiftCard(Request $request)
    {
        $code = strtoupper(trim($request->query('code', '')));
        if (!$code) {
            return response()->json(['message' => 'Vui lòng cung cấp mã E-Gift Card.'], 400);
        }

        $coupon = Coupon::where('code', $code)->first();
        if (!$coupon) {
            return response()->json(['message' => 'Mã E-Gift Card không tồn tại trong hệ thống.'], 404);
        }

        if ($coupon->max_uses && $coupon->current_uses >= $coupon->max_uses) {
            return response()->json(['message' => 'Mã E-Gift Card đã được sử dụng hết.'], 400);
        }

        return response()->json([
            'valid' => true,
            'code' => $coupon->code,
            'discount_percentage' => $coupon->discount_percentage,
            'valid_until' => $coupon->valid_until
        ]);
    }
}
