<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Banner;

class BannerController extends Controller
{
    // Public API: Lấy các banner đang active
    public function index(Request $request)
    {
        $query = Banner::where('is_active', true)->orderBy('order_index');
        if ($request->has('position')) {
            $query->where('position', $request->position);
        }
        return response()->json($query->get());
    }

    // Admin API: Lấy tất cả banner
    public function adminIndex()
    {
        return response()->json(Banner::orderBy('order_index')->get());
    }

    // Admin API: Tạo mới
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'link' => 'nullable|string',
            'position' => 'required|in:hero,promo',
            'is_active' => 'boolean',
            'order_index' => 'integer'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $validated['image_url'] = url('/storage/' . $path);
        }

        if (empty($validated['image_url'])) {
            return response()->json(['message' => 'Vui lòng cung cấp URL hoặc tải ảnh lên'], 400);
        }

        $banner = Banner::create($validated);
        return response()->json($banner, 201);
    }

    // Admin API: Cập nhật
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'link' => 'nullable|string',
            'position' => 'sometimes|in:hero,promo',
            'is_active' => 'boolean', // In form data this might come as string 'true'/'false' or '1'/'0', Laravel usually handles it if properly casted, but we'll manually cast below just in case.
            'order_index' => 'integer'
        ]);

        if (isset($validated['is_active'])) {
            $validated['is_active'] = filter_var($validated['is_active'], FILTER_VALIDATE_BOOLEAN);
        }

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $validated['image_url'] = url('/storage/' . $path);
        }

        $banner->update($validated);
        return response()->json($banner);
    }

    // Admin API: Xóa
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();
        return response()->json(['message' => 'Đã xóa banner thành công']);
    }
}
