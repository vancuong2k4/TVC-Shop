<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Lấy thông tin tài khoản của user đang đăng nhập
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();
        return response()->json($user);
    }

    /**
     * Cập nhật thông tin cá nhân của user đang đăng nhập
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'full_name' => 'sometimes|required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'dob' => 'nullable|string',
            'gender' => 'nullable|string|in:male,female,other',
            'password' => 'nullable|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ.',
                'errors' => $validator->errors()
            ], 422);
        }

        $fields = $request->only(['full_name', 'phone', 'address', 'dob', 'gender']);
        
        if ($request->filled('password')) {
            $fields['password'] = password_hash($request->password, PASSWORD_DEFAULT);
        }

        $user->update($fields);

        return response()->json([
            'message' => 'Cập nhật thông tin thành công.',
            'user' => $user
        ]);
    }
}
