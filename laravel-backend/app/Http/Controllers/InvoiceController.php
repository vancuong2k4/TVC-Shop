<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Carbon\Carbon;

class InvoiceController extends Controller
{
    /**
     * Xuất dữ liệu hóa đơn điện tử chính thức của đơn hàng (E-Invoice Data)
     */
    public function getInvoice(Request $request, $id)
    {
        $order = Order::with(['items.product', 'user'])->find($id);

        if (!$order) {
            return response()->json(['message' => 'Không tìm thấy đơn hàng #' . $id], 404);
        }

        $user = $request->user('sanctum');
        if ($user && $user->role !== 'admin' && $order->user_id !== $user->id) {
            return response()->json(['message' => 'Bạn không có quyền truy cập hóa đơn này.'], 403);
        }

        $invoiceNumber = 'INV-' . Carbon::parse($order->created_at)->format('Ymd') . '-' . str_pad($order->id, 5, '0', STR_PAD_LEFT);

        return response()->json([
            'success' => true,
            'invoice_number' => $invoiceNumber,
            'order_id' => $order->id,
            'issue_date' => Carbon::parse($order->created_at)->format('d/m/Y H:i'),
            'company_info' => [
                'name' => 'TVC-SHOP LUXURY FASHION VIETNAM',
                'tax_id' => '0109887766',
                'address' => 'Số 123 Phố Huế, Phường Hàng Bài, Quận Hoàn Kiếm, Hà Nội',
                'hotline' => '0326 570 425',
                'email' => 'billing@tvc-shop.vn',
                'website' => 'https://tvc-shop.vn'
            ],
            'customer_info' => [
                'name' => $order->user ? $order->user->full_name : 'Quý khách hàng',
                'email' => $order->user ? $order->user->email : 'customer@domain.com',
                'phone' => $order->user ? $order->user->phone : '',
                'shipping_address' => $order->shipping_address
            ],
            'payment_info' => [
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status ?: 'paid',
                'currency' => 'VND'
            ],
            'items' => $order->items->map(function ($item, $idx) {
                return [
                    'line_number' => $idx + 1,
                    'product_name' => $item->product ? $item->product->name : 'Sản phẩm thời trang TVC',
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->price,
                    'total_price' => (float) ($item->price * $item->quantity)
                ];
            }),
            'subtotal' => (float) $order->total_amount,
            'tax_vat' => 0, // VAT bao gồm trong giá
            'shipping_fee' => 0,
            'total_amount' => (float) $order->total_amount
        ]);
    }
}
