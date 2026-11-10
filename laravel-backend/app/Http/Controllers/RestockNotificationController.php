<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class RestockNotificationController extends Controller
{
    /**
     * Đăng ký nhận thông báo khi sản phẩm có hàng lại hoặc nhận thông tin mở bán sớm (Pre-order / Back In Stock)
     */
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:20',
            'size' => 'nullable|string|max:20',
            'color' => 'nullable|string|max:50'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Vui lòng cung cấp email hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::find($request->product_id);

        // Lưu thông tin đăng ký hoặc gửi email xác nhận tức thì (giả lập lưu trữ thông báo chờ restock)
        return response()->json([
            'success' => true,
            'message' => 'Đăng ký thành công! TVC-Shop sẽ gửi email thông báo tới ' . $request->email . ' ngay khi sản phẩm ' . $product->name . ' (Size: ' . ($request->size ?: 'Tiêu chuẩn') . ') có hàng.',
            'subscription' => [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'email' => $request->email,
                'size' => $request->size,
                'color' => $request->color,
                'subscribed_at' => Carbon::now()->format('d/m/Y H:i')
            ]
        ], 200);
    }
}
