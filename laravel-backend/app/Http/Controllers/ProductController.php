<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\ProductVariant;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['primaryImage', 'images', 'category', 'variants'])
            ->where('status', 'active');

        // 1. Real-time Search by Name, Description, or Category
        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                  ->orWhere('description', 'LIKE', "%{$search}%")
                  ->orWhereHas('category', function ($catQ) use ($search) {
                      $catQ->where('name', 'LIKE', "%{$search}%");
                  });
            });
        }

        // 2. Category Filter (supports ID, array, comma-separated, or slug)
        if ($request->filled('category') || $request->filled('category_id')) {
            $cat = $request->input('category', $request->input('category_id'));
            if (is_array($cat)) {
                $query->whereIn('category_id', $cat);
            } elseif (str_contains($cat, ',')) {
                $query->whereIn('category_id', array_filter(explode(',', $cat)));
            } elseif (is_numeric($cat)) {
                $query->where('category_id', $cat);
            } else {
                $query->whereHas('category', function ($q) use ($cat) {
                    $q->where('slug', $cat)->orWhere('name', $cat);
                });
            }
        }

        // 3. Price Range Filter (using effective price: discount_price ?? price)
        if ($request->filled('min_price')) {
            $minPrice = (float) $request->min_price;
            $query->whereRaw('COALESCE(discount_price, price) >= ?', [$minPrice]);
        }

        if ($request->filled('max_price')) {
            $maxPrice = (float) $request->max_price;
            $query->whereRaw('COALESCE(discount_price, price) <= ?', [$maxPrice]);
        }

        // 4. Size Filter (Variants)
        if ($request->filled('size') || $request->filled('sizes')) {
            $sizes = $request->input('sizes', $request->input('size'));
            $sizesArray = is_array($sizes) ? $sizes : array_filter(explode(',', $sizes));
            if (!empty($sizesArray)) {
                $query->whereHas('variants', function ($q) use ($sizesArray) {
                    $q->whereIn('size', $sizesArray);
                });
            }
        }

        // 5. Color Filter (Variants)
        if ($request->filled('color') || $request->filled('colors')) {
            $colors = $request->input('colors', $request->input('color'));
            $colorsArray = is_array($colors) ? $colors : array_filter(explode(',', $colors));
            if (!empty($colorsArray)) {
                $query->whereHas('variants', function ($q) use ($colorsArray) {
                    $q->whereIn('color', $colorsArray);
                });
            }
        }

        // 6. In-stock Filter
        if ($request->boolean('in_stock')) {
            $query->whereHas('variants', function ($q) {
                $q->where('stock', '>', 0);
            });
        }

        // 7. Sorting
        $sort = $request->input('sort', 'newest');
        switch ($sort) {
            case 'price_asc':
                $query->orderByRaw('COALESCE(discount_price, price) ASC');
                break;
            case 'price_desc':
                $query->orderByRaw('COALESCE(discount_price, price) DESC');
                break;
            case 'name_asc':
                $query->orderBy('name', 'ASC');
                break;
            case 'name_desc':
                $query->orderBy('name', 'DESC');
                break;
            case 'oldest':
                $query->orderBy('id', 'ASC');
                break;
            case 'newest':
            default:
                $query->orderBy('id', 'DESC');
                break;
        }

        // Transformation helper
        $transformProduct = function ($product) {
            $product->image_url = $product->primaryImage 
                ? $product->primaryImage->image_url 
                : ($product->images->first() ? $product->images->first()->image_url : null);
            $product->image = $product->image_url;
            $product->category_name = $product->category ? $product->category->name : null;

            if ($product->discount_price && $product->price > $product->discount_price) {
                $product->originalPrice = $product->price;
                $product->discount = round((($product->price - $product->discount_price) / $product->price) * 100);
            } else {
                $product->originalPrice = $product->price;
                $product->discount = null;
            }

            // Available sizes and colors list for fast UI display
            $product->available_sizes = $product->variants->pluck('size')->filter()->unique()->values();
            $product->available_colors = $product->variants->pluck('color')->filter()->unique()->values();
            $product->total_stock = $product->variants->sum('stock');
            $product->is_in_stock = $product->variants->isEmpty() ? true : ($product->total_stock > 0);

            return $product;
        };

        // 8. Pagination vs List
        if ($request->boolean('paginate') || $request->has('page')) {
            $perPage = (int) $request->input('per_page', 9);
            $paginated = $query->paginate($perPage);
            $paginated->getCollection()->transform($transformProduct);
            return response()->json($paginated);
        }

        // If limit is specified (e.g. for search suggestions or featured items)
        if ($request->filled('limit')) {
            $query->limit((int) $request->limit);
        }

        $products = $query->get();
        $products->transform($transformProduct);

        return response()->json($products);
    }

    public function filterOptions()
    {
        $categories = Category::withCount(['products' => function ($q) {
            $q->where('status', 'active');
        }])->get(['id', 'name', 'slug']);

        $sizes = ProductVariant::whereNotNull('size')
            ->where('size', '!=', '')
            ->distinct()
            ->pluck('size')
            ->values();

        $colors = ProductVariant::whereNotNull('color')
            ->where('color', '!=', '')
            ->distinct()
            ->pluck('color')
            ->values();

        $minPrice = Product::where('status', 'active')->min('price') ?? 0;
        $maxPrice = Product::where('status', 'active')->max('price') ?? 5000000;

        return response()->json([
            'categories' => $categories,
            'sizes' => $sizes,
            'colors' => $colors,
            'price_range' => [
                'min' => (float) $minPrice,
                'max' => (float) $maxPrice,
            ]
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['images', 'variants', 'category'])
            ->where('slug', $slug)
            ->orWhere('id', $slug)
            ->first();

        if (!$product) {
            return response()->json(['message' => 'Sản phẩm không tồn tại'], 404);
        }

        // Transform for frontend compatibility
        $product->image_url = $product->primaryImage 
            ? $product->primaryImage->image_url 
            : ($product->images->first() ? $product->images->first()->image_url : null);
        $product->image = $product->image_url;
        $product->category_name = $product->category ? $product->category->name : null;

        if ($product->discount_price && $product->price > $product->discount_price) {
            $product->originalPrice = $product->price;
            $product->discount = round((($product->price - $product->discount_price) / $product->price) * 100);
        } else {
            $product->originalPrice = $product->price;
            $product->discount = null;
        }

        $product->available_sizes = $product->variants->pluck('size')->filter()->unique()->values();
        $product->available_colors = $product->variants->pluck('color')->filter()->unique()->values();
        
        return response()->json($product);
    }
}
