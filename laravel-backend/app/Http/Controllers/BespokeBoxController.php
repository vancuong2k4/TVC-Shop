<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BespokeBoxController extends Controller
{
    /**
     * Danh mục các ấn bản Hộp Gỗ Sơn Mài Quà Tặng Thủ Công
     */
    private $editions = [
        [
            'id' => 'box_noir_lacquer',
            'name' => 'The Obsidian Lacquer Gift Box',
            'material' => 'Gỗ óc chó Bắc Mỹ phủ 12 lớp sơn mài đen bóng gương (Piano Finish)',
            'lining' => 'Nhung dệt tơ tằm nguyên bản màu than chì',
            'price_box_only' => 350000,
            'card_type' => 'Thẻ kim loại titan đen mờ khắc laser tên người nhận',
            'image' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
            'included_perks' => [
                'Thiệp viết tay dát lá vàng 24K thủ công',
                'Khóa nam châm Neodymium ẩn tinh xảo',
                'Dây ruy băng lụa dệt thoi có vân dập nổi logo TVC-Shop'
            ]
        ],
        [
            'id' => 'box_walnut_gold',
            'name' => 'The Heritage Walnut & Brass Box',
            'material' => 'Gỗ óc chó tự nhiên chạm nổi họa tiết kiến trúc tối giản',
            'lining' => 'Nhung màu ngọc trai sang trọng',
            'price_box_only' => 450000,
            'card_type' => 'Thẻ hợp kim đồng nguyên khối chải xước thủ công',
            'image' => 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600',
            'included_perks' => [
                'Bản lề đồng thau phong cách vintage cao cấp',
                'Khắc thông điệp tri ân độc bản theo yêu cầu',
                'Túi xách giấy mỹ thuật đen mờ định lượng 350gsm đi kèm'
            ]
        ]
    ];

    /**
     * Lấy danh mục các ấn bản hộp quà tặng sơn mài
     */
    public function getEditions()
    {
        return response()->json([
            'success' => true,
            'editions' => $this->editions,
            'preset_gift_amounts' => [
                1000000,
                2000000,
                5000000,
                10000000
            ]
        ]);
    }

    /**
     * Đặt làm hộp quà tặng sơn mài vật lý thủ công
     */
    public function orderBox(Request $request)
    {
        $request->validate([
            'sender_name' => 'required|string|max:100',
            'sender_phone' => 'required|string|max:20',
            'recipient_name' => 'required|string|max:100',
            'recipient_phone' => 'required|string|max:20',
            'recipient_address' => 'required|string|max:255',
            'box_edition_id' => 'required|string',
            'gift_card_amount' => 'required|numeric|min:500000',
            'engraving_text' => 'nullable|string|max:50',
            'greeting_message' => 'nullable|string|max:500',
            'delivery_date' => 'required|date|after_or_equal:today'
        ]);

        $orderCode = 'BOX-' . strtoupper(Str::random(7));
        $selectedEdition = collect($this->editions)->firstWhere('id', $request->box_edition_id) ?? $this->editions[0];

        $totalAmount = $selectedEdition['price_box_only'] + $request->gift_card_amount;

        $boxOrder = [
            'order_code' => $orderCode,
            'sender_name' => $request->sender_name,
            'sender_phone' => $request->sender_phone,
            'recipient_name' => $request->recipient_name,
            'recipient_phone' => $request->recipient_phone,
            'recipient_address' => $request->recipient_address,
            'box_edition' => $selectedEdition['name'],
            'gift_card_amount' => $request->gift_card_amount,
            'box_price' => $selectedEdition['price_box_only'],
            'total_amount' => $totalAmount,
            'engraving_text' => $request->engraving_text ? strtoupper($request->engraving_text) : null,
            'greeting_message' => $request->greeting_message,
            'delivery_date' => $request->delivery_date,
            'status' => 'crafting', // crafting -> engraved -> packaged -> in_transit
            'created_at' => now()->toIso8601String()
        ];

        return response()->json([
            'success' => true,
            'message' => 'Đơn chế tác Hộp Quà Gỗ Sơn Mài Bespoke đã được gửi tới xưởng thủ công!',
            'data' => $boxOrder
        ]);
    }
}
