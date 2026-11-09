<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Tạo URL thanh toán VNPay
     */
    public function createVnpayPayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'bank_code' => 'nullable|string'
        ]);

        $order = Order::findOrFail($request->order_id);

        if ($order->payment_status === 'paid') {
            return response()->json([
                'message' => 'Đơn hàng này đã được thanh toán trước đó.'
            ], 400);
        }

        // Cấu hình VNPay Sandbox
        $vnp_TmnCode = env('VNPAY_TMN_CODE', '2QXUI4J4'); // Mã test sandbox VNPay mặc định
        $vnp_HashSecret = env('VNPAY_HASH_SECRET', 'RAKDVVFDYMAPGMDQOZKLXGQYCVWEXMAQ'); // Chuỗi bí mật test
        $vnp_Url = env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html');
        $vnp_ReturnUrl = $request->input('return_url', url('/api/payment/vnpay/callback'));

        $vnp_TxnRef = $order->id . '_' . time(); // Mã tham chiếu giao dịch
        $vnp_OrderInfo = "Thanh toan don hang TVC-Shop #" . $order->id;
        $vnp_OrderType = "billpayment";
        $vnp_Amount = (int) $order->total_amount * 100; // VNPay tính bằng đồng và nhân 100
        $vnp_Locale = 'vn';
        $vnp_IpAddr = $request->ip() ?: '127.0.0.1';

        $inputData = [
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_ReturnUrl,
            "vnp_TxnRef" => $vnp_TxnRef
        ];

        if ($request->filled('bank_code')) {
            $inputData['vnp_BankCode'] = $request->bank_code;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret);
        $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;

        return response()->json([
            'payment_url' => $vnp_Url,
            'txn_ref' => $vnp_TxnRef,
            'order_id' => $order->id
        ]);
    }

    /**
     * Xử lý Callback khi VNPay trả về kết quả
     */
    public function vnpayCallback(Request $request)
    {
        $vnp_HashSecret = env('VNPAY_HASH_SECRET', 'RAKDVVFDYMAPGMDQOZKLXGQYCVWEXMAQ');
        $inputData = [];
        
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }
        
        $vnp_SecureHash = $inputData['vnp_SecureHash'] ?? '';
        unset($inputData['vnp_SecureHash']);
        unset($inputData['vnp_SecureHashType']);
        
        ksort($inputData);
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);

        // Tách lấy ID đơn hàng từ txnRef (vd: "15_1699999999")
        $txnRef = $inputData['vnp_TxnRef'] ?? '';
        $orderId = explode('_', $txnRef)[0];
        $order = Order::find($orderId);

        $isSuccess = ($secureHash === $vnp_SecureHash && ($inputData['vnp_ResponseCode'] ?? '') === '00');

        if ($order) {
            if ($isSuccess) {
                $order->update([
                    'payment_status' => 'paid',
                    'payment_method' => 'vnpay',
                    'status' => 'processing'
                ]);
            }
        }

        // Redirect người dùng về trang thông báo đơn hàng của Frontend
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $redirectUrl = $frontendUrl . '/orders?payment_status=' . ($isSuccess ? 'success' : 'failed') . '&order_id=' . $orderId;

        return redirect()->away($redirectUrl);
    }

    /**
     * Mô phỏng thanh toán trực tuyến tức thì (Thẻ Quốc Tế / Ví Điện Tử MoMo Sandbox)
     */
    public function simulateOnlinePayment(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'method' => 'required|in:vnpay,momo,credit_card'
        ]);

        $order = Order::findOrFail($request->order_id);

        $order->update([
            'payment_method' => $request->method,
            'payment_status' => 'paid',
            'status' => 'processing'
        ]);

        return response()->json([
            'message' => 'Thanh toán đơn hàng thành công!',
            'order' => $order
        ]);
    }
}
