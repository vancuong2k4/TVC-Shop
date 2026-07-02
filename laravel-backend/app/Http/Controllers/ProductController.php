<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('primaryImage', 'category')->where('status', 'active');

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $products = $query->get();

        // Transform for frontend compatibility
        $products->transform(function ($product) {
            $product->image_url = $product->primaryImage ? $product->primaryImage->image_url : null;
            $product->image = $product->image_url;
            $product->category_name = $product->category ? $product->category->name : null;
            return $product;
        });

        return response()->json($products);
    }

    public function show($slug)
    {
        $product = Product::with(['images', 'variants', 'category'])->where('slug', $slug)->first();

        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        // Transform for frontend compatibility
        $product->image_url = $product->primaryImage ? $product->primaryImage->image_url : null;
        $product->image = $product->image_url;
        $product->category_name = $product->category ? $product->category->name : null;
        
        return response()->json($product);
    }
}
