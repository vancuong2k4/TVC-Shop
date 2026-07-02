<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    public function validateCoupon(Request $request)
    {
        $code = $request->query('code');
        
        if (!$code) {
            return response()->json(["message" => "Vui lòng nhập mã giảm giá."], 400);
        }

        $code = strtoupper(trim($code));
        $coupon = Coupon::where('code', $code)->first();

        if (!$coupon) {
            return response()->json(["message" => "Mã giảm giá không tồn tại."], 400);
        }

        // Check valid_until
        if (!empty($coupon->valid_until) && strtotime($coupon->valid_until) < time()) {
            return response()->json(["message" => "Mã giảm giá đã hết hạn."], 400);
        }

        // Check max_uses
        if (!empty($coupon->max_uses) && $coupon->current_uses >= $coupon->max_uses) {
            return response()->json(["message" => "Mã giảm giá đã hết lượt sử dụng."], 400);
        }

        return response()->json([
            "message" => "Áp dụng mã thành công.",
            "data" => [
                "id" => $coupon->id,
                "code" => $coupon->code,
                "discount_percentage" => $coupon->discount_percentage
            ]
        ], 200);
    }
}
