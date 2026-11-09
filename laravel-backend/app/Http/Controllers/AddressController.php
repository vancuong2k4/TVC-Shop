<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AddressController extends Controller
{
    /**
     * Lấy danh sách sổ địa chỉ giao hàng của người dùng
     * Hỗ trợ lưu trữ nhiều địa chỉ dạng JSON hoặc mảng tùy biến trong cột address/metadata
     */
    public function getAddresses(Request $request)
    {
        $user = $request->user();

        // Kiểm tra xem user có lưu danh sách địa chỉ (addresses) không
        // Giả lập/trả về danh sách địa chỉ chuẩn hóa từ cột address chính và các địa chỉ phụ
        $savedList = [];

        // Nếu cột address có dữ liệu json
        if (!empty($user->address) && Str::startsWith($user->address, '[')) {
            $savedList = json_decode($user->address, true) ?: [];
        } elseif (!empty($user->address)) {
            // Chuyển địa chỉ mặc định đầu tiên thành một item trong sổ địa chỉ
            $savedList[] = [
                'id' => 'addr_primary',
                'recipient_name' => $user->full_name,
                'phone' => $user->phone ?: '',
                'address' => $user->address,
                'city' => 'Toàn quốc',
                'label' => 'Nhà riêng',
                'is_default' => true
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $savedList
        ]);
    }

    /**
     * Thêm địa chỉ mới vào Sổ địa chỉ giao hàng
     */
    public function addAddress(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'recipient_name' => 'required|string|max:100',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'label' => 'nullable|string|max:50',
            'is_default' => 'nullable|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Vui lòng điền đầy đủ và chính xác thông tin địa chỉ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = $request->user();
        $addresses = [];
        if (!empty($user->address) && Str::startsWith($user->address, '[')) {
            $addresses = json_decode($user->address, true) ?: [];
        } elseif (!empty($user->address)) {
            $addresses[] = [
                'id' => 'addr_' . uniqid(),
                'recipient_name' => $user->full_name,
                'phone' => $user->phone ?: '',
                'address' => $user->address,
                'city' => 'Toàn quốc',
                'label' => 'Nhà riêng',
                'is_default' => false
            ];
        }

        $isDefault = $request->boolean('is_default') || count($addresses) === 0;

        // Nếu đặt làm mặc định, hủy default của các địa chỉ cũ
        if ($isDefault) {
            foreach ($addresses as &$addr) {
                $addr['is_default'] = false;
            }
        }

        $newAddress = [
            'id' => 'addr_' . uniqid(),
            'recipient_name' => $request->recipient_name,
            'phone' => $request->phone,
            'address' => $request->address,
            'city' => $request->city,
            'label' => $request->label ?: 'Nhà riêng',
            'is_default' => $isDefault
        ];

        $addresses[] = $newAddress;

        $user->address = json_encode($addresses, JSON_UNESCAPED_UNICODE);
        $user->save();

        return response()->json([
            'message' => 'Đã thêm địa chỉ mới thành công.',
            'data' => $newAddress,
            'addresses' => $addresses
        ], 201);
    }

    /**
     * Xóa một địa chỉ khỏi Sổ địa chỉ
     */
    public function deleteAddress(Request $request, $id)
    {
        $user = $request->user();
        if (empty($user->address) || !Str::startsWith($user->address, '[')) {
            return response()->json(['message' => 'Không tìm thấy địa chỉ.'], 404);
        }

        $addresses = json_decode($user->address, true) ?: [];
        $filtered = array_filter($addresses, function ($item) use ($id) {
            return $item['id'] !== $id;
        });

        $filtered = array_values($filtered);

        // Nếu xóa địa chỉ mặc định, tự động gán địa chỉ đầu tiên làm mặc định
        if (count($filtered) > 0) {
            $hasDefault = false;
            foreach ($filtered as $addr) {
                if (!empty($addr['is_default'])) {
                    $hasDefault = true;
                    break;
                }
            }
            if (!$hasDefault) {
                $filtered[0]['is_default'] = true;
            }
        }

        $user->address = json_encode($filtered, JSON_UNESCAPED_UNICODE);
        $user->save();

        return response()->json([
            'message' => 'Đã xóa địa chỉ thành công.',
            'addresses' => $filtered
        ]);
    }

    /**
     * Đặt một địa chỉ làm mặc định
     */
    public function setDefaultAddress(Request $request, $id)
    {
        $user = $request->user();
        if (empty($user->address) || !Str::startsWith($user->address, '[')) {
            return response()->json(['message' => 'Không tìm thấy địa chỉ.'], 404);
        }

        $addresses = json_decode($user->address, true) ?: [];
        $found = false;

        foreach ($addresses as &$addr) {
            if ($addr['id'] === $id) {
                $addr['is_default'] = true;
                $found = true;
            } else {
                $addr['is_default'] = false;
            }
        }

        if (!$found) {
            return response()->json(['message' => 'Địa chỉ không tồn tại.'], 404);
        }

        $user->address = json_encode($addresses, JSON_UNESCAPED_UNICODE);
        $user->save();

        return response()->json([
            'message' => 'Đã thiết lập địa chỉ mặc định.',
            'addresses' => $addresses
        ]);
    }
}
