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
    public function getDashboard(Request $request)
    {
        $timeRange = $request->input('range', '6_months'); // '7_days', '30_days', '6_months', '1_year'

        $now = \Carbon\Carbon::now();
        $startDate = $now->copy()->subMonths(6)->startOfMonth();
        $prevStartDate = $startDate->copy()->subMonths(6);
        $prevEndDate = $startDate->copy();

        if ($timeRange === '7_days') {
            $startDate = $now->copy()->subDays(6)->startOfDay();
            $prevStartDate = $startDate->copy()->subDays(7);
            $prevEndDate = $startDate->copy();
        } elseif ($timeRange === '30_days') {
            $startDate = $now->copy()->subDays(29)->startOfDay();
            $prevStartDate = $startDate->copy()->subDays(30);
            $prevEndDate = $startDate->copy();
        } elseif ($timeRange === '1_year') {
            $startDate = $now->copy()->subMonths(11)->startOfMonth();
            $prevStartDate = $startDate->copy()->subMonths(12);
            $prevEndDate = $startDate->copy();
        }

        // Doanh thu trong khoảng thời gian đã chọn (loại bỏ đơn hủy)
        $revenue = (float) Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $startDate)
            ->sum('total_amount');

        // Doanh thu chu kỳ trước để tính % tăng trưởng
        $prevRevenue = (float) Order::where('status', '!=', 'cancelled')
            ->whereBetween('created_at', [$prevStartDate, $prevEndDate])
            ->sum('total_amount');

        $revenueGrowth = $prevRevenue > 0 ? round((($revenue - $prevRevenue) / $prevRevenue) * 100, 1) : 0;

        // Số đơn hàng trong khoảng thời gian
        $totalOrders = Order::where('created_at', '>=', $startDate)->count();
        $prevOrders = Order::whereBetween('created_at', [$prevStartDate, $prevEndDate])->count();
        $ordersGrowth = $prevOrders > 0 ? round((($totalOrders - $prevOrders) / $prevOrders) * 100, 1) : 0;

        // Tổng người dùng & sản phẩm
        $totalUsers = User::where('role', 'customer')->count();
        $totalProducts = Product::count();

        // Giá trị đơn hàng trung bình (AOV - Average Order Value)
        $successfulOrdersCount = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $startDate)
            ->count();
        $aov = $successfulOrdersCount > 0 ? round($revenue / $successfulOrdersCount) : 0;

        // Dữ liệu biểu đồ Doanh thu & Đơn hàng theo thời gian
        $revenueData = [];
        if ($timeRange === '7_days' || $timeRange === '30_days') {
            $days = $timeRange === '7_days' ? 7 : 30;
            for ($i = $days - 1; $i >= 0; $i--) {
                $day = \Carbon\Carbon::now()->subDays($i);
                $dayStr = $day->format('d/m');
                $rev = Order::where('status', '!=', 'cancelled')
                    ->whereDate('created_at', $day->toDateString())
                    ->sum('total_amount');
                $ordCount = Order::whereDate('created_at', $day->toDateString())->count();
                $revenueData[] = [
                    'name' => $dayStr,
                    'revenue' => (float) $rev,
                    'orders' => $ordCount
                ];
            }
        } else {
            $months = $timeRange === '1_year' ? 12 : 6;
            for ($i = $months - 1; $i >= 0; $i--) {
                $monthDate = \Carbon\Carbon::now()->subMonths($i);
                $monthStr = $monthDate->format('m/Y');
                $rev = Order::where('status', '!=', 'cancelled')
                    ->whereYear('created_at', $monthDate->year)
                    ->whereMonth('created_at', $monthDate->month)
                    ->sum('total_amount');
                $ordCount = Order::whereYear('created_at', $monthDate->year)
                    ->whereMonth('created_at', $monthDate->month)
                    ->count();
                $revenueData[] = [
                    'name' => $monthStr,
                    'revenue' => (float) $rev,
                    'orders' => $ordCount
                ];
            }
        }

        // Thống kê Trạng thái Đơn hàng
        $orderStatusData = [
            ['name' => 'Chờ xử lý', 'status_key' => 'pending', 'value' => Order::where('created_at', '>=', $startDate)->where('status', 'pending')->count(), 'color' => '#d97706'], 
            ['name' => 'Đang xử lý', 'status_key' => 'processing', 'value' => Order::where('created_at', '>=', $startDate)->where('status', 'processing')->count(), 'color' => '#2563eb'], 
            ['name' => 'Đang giao', 'status_key' => 'shipped', 'value' => Order::where('created_at', '>=', $startDate)->where('status', 'shipped')->count(), 'color' => '#7c3aed'], 
            ['name' => 'Đã giao', 'status_key' => 'delivered', 'value' => Order::where('created_at', '>=', $startDate)->where('status', 'delivered')->count(), 'color' => '#16a34a'], 
            ['name' => 'Đã hủy', 'status_key' => 'cancelled', 'value' => Order::where('created_at', '>=', $startDate)->where('status', 'cancelled')->count(), 'color' => '#dc2626'], 
        ];

        // Top 5 sản phẩm bán chạy nhất (Best Sellers)
        $topProducts = \App\Models\OrderItem::select(
                'product_id',
                \Illuminate\Support\Facades\DB::raw('SUM(quantity) as total_sold'),
                \Illuminate\Support\Facades\DB::raw('SUM(price * quantity) as total_revenue')
            )
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.status', '!=', 'cancelled')
            ->where('orders.created_at', '>=', $startDate)
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->with(['product.primaryImage', 'product.category'])
            ->get()
            ->map(function ($item) {
                $product = $item->product;
                return [
                    'id' => $product ? $product->id : $item->product_id,
                    'name' => $product ? $product->name : 'Sản phẩm đã xóa',
                    'category' => $product && $product->category ? $product->category->name : 'Khác',
                    'image' => $product && $product->primaryImage ? $product->primaryImage->image_url : null,
                    'total_sold' => (int) $item->total_sold,
                    'total_revenue' => (float) $item->total_revenue
                ];
            });

        // 5 đơn hàng mới nhất (Recent Orders)
        $recentOrders = Order::with('user:id,full_name,email')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'customer_name' => $order->user ? $order->user->full_name : 'Khách vãng lai',
                    'customer_email' => $order->user ? $order->user->email : '',
                    'total_amount' => (float) $order->total_amount,
                    'status' => $order->status,
                    'created_at' => $order->created_at ? $order->created_at->format('d/m/Y H:i') : ''
                ];
            });

        return response()->json([
            'time_range' => $timeRange,
            'revenue' => $revenue,
            'revenue_growth' => $revenueGrowth,
            'total_orders' => $totalOrders,
            'orders_growth' => $ordersGrowth,
            'total_users' => $totalUsers,
            'total_products' => $totalProducts,
            'aov' => $aov,
            'revenue_chart' => $revenueData,
            'order_status_chart' => $orderStatusData,
            'top_products' => $topProducts,
            'recent_orders' => $recentOrders
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

    public function getUsers()
    {
        // Get all users, including their total orders and total spent amount
        $users = User::withCount('orders')
            ->orderBy('id', 'desc')
            ->get();
            
        // Assuming we need total_spent, we can calculate it or simply leave it as withCount for now
        return response()->json($users);
    }

    public function updateUserRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $request->validate([
            'role' => 'required|in:admin,customer'
        ]);

        // Prevent admin from demoting themselves
        if ($user->id === $request->user()->id && $request->role === 'customer') {
            return response()->json(['message' => 'Bạn không thể tự giáng cấp chính mình!'], 403);
        }

        $user->update(['role' => $request->role]);
        
        return response()->json(['message' => 'Cập nhật vai trò thành công', 'user' => $user]);
    }

    public function updateUserStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'status' => 'required|in:active,blocked'
        ]);

        // Prevent admin from blocking themselves or other admins
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Bạn không thể tự khóa tài khoản của mình!'], 403);
        }

        if ($user->role === 'admin') {
            return response()->json(['message' => 'Bạn không thể khóa tài khoản của Admin khác!'], 403);
        }

        $user->update(['status' => $request->status]);

        // If blocked, delete all access tokens to force logout
        if ($request->status === 'blocked') {
            $user->tokens()->delete();
        }

        return response()->json(['message' => 'Cập nhật trạng thái thành công', 'user' => $user]);
    }
}
