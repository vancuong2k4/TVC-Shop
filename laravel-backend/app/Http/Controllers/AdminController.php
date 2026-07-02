<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Order;
use App\Models\User;
use App\Models\Coupon;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function getDashboard()
    {
        $revenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');
        $totalOrders = Order::count();
        $totalUsers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();

        return response()->json([
            'revenue' => $revenue,
            'total_orders' => $totalOrders,
            'total_users' => $totalUsers,
            'total_products' => $totalProducts
        ]);
    }

    public function getOrders()
    {
        $orders = Order::with('user:id,full_name,email')->orderBy('created_at', 'desc')->get();
        // Transform the orders to flatten user details to match old response
        $orders->transform(function ($order) {
            $order->full_name = $order->user ? $order->user->full_name : null;
            $order->email = $order->user ? $order->user->email : null;
            return $order;
        });
        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);
        return response()->json(['message' => 'Cập nhật trạng thái đơn hàng thành công']);
    }

    public function getAllProducts()
    {
        $products = Product::with('primaryImage', 'category')->orderBy('id', 'desc')->get();
        
        $products->transform(function ($product) {
            $product->image_url = $product->primaryImage ? $product->primaryImage->image_url : null;
            $product->image = $product->image_url;
            $product->category_name = $product->category ? $product->category->name : null;
            return $product;
        });

        return response()->json($products);
    }

    public function createProduct(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric'
        ]);

        $product = Product::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'category_id' => $request->category_id,
            'status' => $request->status ?? 'active',
            'created_at' => now()
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = url('storage/' . $path);

            ProductImage::create([
                'product_id' => $product->id,
                'image_url' => $imageUrl,
                'is_primary' => 1
            ]);
        }

        return response()->json(['message' => 'Đã thêm sản phẩm thành công.'], 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric'
        ]);

        $product->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'price' => $request->price,
            'discount_price' => $request->discount_price,
            'category_id' => $request->category_id,
            'status' => $request->status ?? 'active'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $imageUrl = url('storage/' . $path);

            $primaryImage = $product->primaryImage;
            if ($primaryImage) {
                $primaryImage->update(['image_url' => $imageUrl]);
            } else {
                ProductImage::create([
                    'product_id' => $product->id,
                    'image_url' => $imageUrl,
                    'is_primary' => 1
                ]);
            }
        }

        return response()->json(['message' => 'Đã cập nhật sản phẩm thành công.']);
    }

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => 'Đã xóa sản phẩm thành công.']);
    }

    public function getCoupons()
    {
        $coupons = Coupon::orderBy('id', 'desc')->get();
        return response()->json($coupons);
    }

    public function createCoupon(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:coupons,code',
            'discount_percentage' => 'required|numeric',
            'max_uses' => 'required|integer',
            'valid_until' => 'required|date'
        ]);

        Coupon::create([
            'code' => $request->code,
            'discount_percentage' => $request->discount_percentage,
            'max_uses' => $request->max_uses,
            'current_uses' => 0,
            'valid_until' => $request->valid_until,
            'created_at' => now()
        ]);

        return response()->json(['message' => 'Tạo mã giảm giá thành công'], 201);
    }

    public function deleteCoupon($id)
    {
        $coupon = Coupon::findOrFail($id);
        $coupon->delete();
        return response()->json(['message' => 'Đã xóa mã giảm giá']);
    }

    public function getBlogs()
    {
        $blogs = Blog::with('author:id,full_name')->orderBy('created_at', 'desc')->get();
        $blogs->transform(function ($blog) {
            $blog->author_name = $blog->author ? $blog->author->full_name : null;
            return $blog;
        });
        return response()->json($blogs);
    }

    public function createBlog(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'content' => 'required|string',
            'image' => 'nullable|image'
        ]);

        $imageUrl = null;
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('blogs', 'public');
            $imageUrl = url('storage/' . $path);
        }

        Blog::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'content' => $request->content,
            'image_url' => $imageUrl,
            'author_id' => $request->user()->id,
            'created_at' => now()
        ]);

        return response()->json(['message' => 'Tạo bài viết thành công'], 201);
    }

    public function deleteBlog($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();
        return response()->json(['message' => 'Đã xóa bài viết']);
    }
}
