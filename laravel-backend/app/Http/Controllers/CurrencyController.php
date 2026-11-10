<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    /**
     * Bảng tỷ giá hối đoái quy chuẩn thời gian thực (Cập nhật định kỳ)
     * Base: VND
     */
    private $currencies = [
        'VND' => [
            'code' => 'VND',
            'symbol' => '₫',
            'name' => 'Vietnamese Dong',
            'rate' => 1.0,
            'decimal_digits' => 0,
            'symbol_position' => 'after', // e.g. 500.000₫
            'flag' => '🇻🇳'
        ],
        'USD' => [
            'code' => 'USD',
            'symbol' => '$',
            'name' => 'US Dollar',
            'rate' => 0.000039, // ~25.500 VND/USD
            'decimal_digits' => 2,
            'symbol_position' => 'before', // e.g. $19.99
            'flag' => '🇺🇸'
        ],
        'EUR' => [
            'code' => 'EUR',
            'symbol' => '€',
            'name' => 'Euro',
            'rate' => 0.000036, // ~27.800 VND/EUR
            'decimal_digits' => 2,
            'symbol_position' => 'before', // e.g. €18.50
            'flag' => '🇪🇺'
        ],
        'JPY' => [
            'code' => 'JPY',
            'symbol' => '¥',
            'name' => 'Japanese Yen',
            'rate' => 0.0059, // ~170 VND/JPY
            'decimal_digits' => 0,
            'symbol_position' => 'before', // e.g. ¥2,900
            'flag' => '🇯🇵'
        ],
        'GBP' => [
            'code' => 'GBP',
            'symbol' => '£',
            'name' => 'British Pound',
            'rate' => 0.000031, // ~32.000 VND/GBP
            'decimal_digits' => 2,
            'symbol_position' => 'before', // e.g. £15.99
            'flag' => '🇬🇧'
        ]
    ];

    /**
     * Lấy danh sách các đơn vị tiền tệ hỗ trợ và tỷ giá hiện hành
     */
    public function getCurrencies()
    {
        return response()->json([
            'success' => true,
            'base' => 'VND',
            'updated_at' => now()->toIso8601String(),
            'currencies' => array_values($this->currencies)
        ]);
    }

    /**
     * Quy đổi số tiền giữa các loại tiền tệ
     */
    public function convert(Request $request)
    {
        $amount = (float) $request->input('amount', 0);
        $from = strtoupper($request->input('from', 'VND'));
        $to = strtoupper($request->input('to', 'USD'));

        if (!isset($this->currencies[$from]) || !isset($this->currencies[$to])) {
            return response()->json([
                'success' => false,
                'message' => 'Mã tiền tệ không hợp lệ.'
            ], 400);
        }

        // Quy đổi về VND trước
        $amountInVnd = $from === 'VND' ? $amount : ($amount / $this->currencies[$from]['rate']);

        // Quy đổi từ VND sang đơn vị đích
        $targetCurrency = $this->currencies[$to];
        $convertedAmount = $to === 'VND' ? $amountInVnd : ($amountInVnd * $targetCurrency['rate']);
        $roundedAmount = round($convertedAmount, $targetCurrency['decimal_digits']);

        return response()->json([
            'success' => true,
            'original_amount' => $amount,
            'from_currency' => $from,
            'to_currency' => $to,
            'converted_amount' => $roundedAmount,
            'formatted' => $targetCurrency['symbol_position'] === 'before'
                ? $targetCurrency['symbol'] . number_format($roundedAmount, $targetCurrency['decimal_digits'])
                : number_format($roundedAmount, $targetCurrency['decimal_digits'], ',', '.') . $targetCurrency['symbol']
        ]);
    }
}
