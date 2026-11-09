<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Blog;
use App\Models\Category;
use Illuminate\Http\Request;

class SeoController extends Controller
{
    /**
     * Trả về thông tin thẻ Meta OpenGraph & Twitter Cards tối ưu cho từng trang
     */
    public function getMetaTags(Request $request)
    {
        $type = $request->query('type', 'home'); // home, product, blog, category, shop
        $id = $request->query('id');

        $baseUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $siteName = 'TVC-Shop | Minimalist Fashion & Cold Luxury Lookbook';
        $defaultImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop';
        $defaultDesc = 'Thương hiệu thời trang tối giản tôn vinh chất liệu cao cấp và phom dáng nguyên bản. Khám phá các bộ sưu tập mới nhất tại TVC-Shop.';

        $meta = [
            'title' => $siteName,
            'description' => $defaultDesc,
            'keywords' => 'thời trang tối giản, minimalist fashion, luxury fashion, tvc shop, lookbook, phong cách hiện đại',
            'og_title' => $siteName,
            'og_description' => $defaultDesc,
            'og_image' => $defaultImage,
            'og_url' => $baseUrl,
            'og_type' => 'website',
            'twitter_card' => 'summary_large_image',
            'canonical' => $baseUrl
        ];

        if ($type === 'product' && $id) {
            $product = Product::with(['primaryImage', 'category'])
                ->where('id', $id)
                ->orWhere('slug', $id)
                ->first();

            if ($product) {
                $imgUrl = $product->primaryImage ? $product->primaryImage->image_url : $defaultImage;
                $catName = $product->category ? $product->category->name : 'Thời trang';
                $title = "{$product->name} - {$catName} | TVC-Shop";
                $desc = $product->description ? \Illuminate\Support\Str::limit(strip_tags($product->description), 160) : "Khám phá {$product->name} thiết kế tinh xảo từ TVC-Shop.";

                $meta = [
                    'title' => $title,
                    'description' => $desc,
                    'keywords' => "{$product->name}, {$catName}, thời trang cao cấp, tvc shop",
                    'og_title' => $title,
                    'og_description' => $desc,
                    'og_image' => $imgUrl,
                    'og_url' => "{$baseUrl}/product/{$product->id}",
                    'og_type' => 'product',
                    'twitter_card' => 'summary_large_image',
                    'canonical' => "{$baseUrl}/product/{$product->id}",
                    'price' => $product->discount_price ?: $product->price,
                    'currency' => 'VND'
                ];
            }
        } elseif ($type === 'blog' && $id) {
            $blog = Blog::find($id);
            if ($blog) {
                $title = "{$blog->title} - Editorial Lookbook | TVC-Shop";
                $desc = $blog->content ? \Illuminate\Support\Str::limit(strip_tags($blog->content), 160) : "Đọc bài viết {$blog->title} tại Tạp chí thời trang TVC-Shop.";
                $imgUrl = $blog->image_url ?: $defaultImage;

                $meta = [
                    'title' => $title,
                    'description' => $desc,
                    'keywords' => "tạp chí thời trang, lookbook editorial, {$blog->title}, tvc shop",
                    'og_title' => $title,
                    'og_description' => $desc,
                    'og_image' => $imgUrl,
                    'og_url' => "{$baseUrl}/blog/{$blog->id}",
                    'og_type' => 'article',
                    'twitter_card' => 'summary_large_image',
                    'canonical' => "{$baseUrl}/blog/{$blog->id}"
                ];
            }
        } elseif ($type === 'shop') {
            $meta['title'] = 'Cửa Hàng Thời Trang Thiết Kế | TVC-Shop';
            $meta['description'] = 'Tuyển tập trang phục nam nữ tối giản, áo sơ mi, blazer, quần âu và phụ kiện chất lượng cao.';
            $meta['canonical'] = "{$baseUrl}/shop";
            $meta['og_url'] = "{$baseUrl}/shop";
        }

        return response()->json($meta);
    }

    /**
     * Tạo XML Sitemap động cho Google Search Console
     */
    public function generateSitemap()
    {
        $baseUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $products = Product::where('status', 'active')->get(['id', 'slug', 'created_at']);
        $blogs = Blog::all(['id', 'created_at']);
        $categories = Category::all(['id', 'slug']);

        $xml = '<?xml version="1.0" encoding="UTF-8"?>';
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        // Trang tĩnh
        $staticPages = ['/', '/shop', '/categories', '/blog'];
        foreach ($staticPages as $page) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . $page . '</loc>';
            $xml .= '<changefreq>daily</changefreq>';
            $xml .= '<priority>' . ($page === '/' ? '1.0' : '0.8') . '</priority>';
            $xml .= '</url>';
        }

        // Sản phẩm
        foreach ($products as $prod) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . '/product/' . $prod->id . '</loc>';
            $xml .= '<lastmod>' . ($prod->created_at ? $prod->created_at->format('Y-m-d') : date('Y-m-d')) . '</lastmod>';
            $xml .= '<changefreq>weekly</changefreq>';
            $xml .= '<priority>0.9</priority>';
            $xml .= '</url>';
        }

        // Tạp chí Blog
        foreach ($blogs as $b) {
            $xml .= '<url>';
            $xml .= '<loc>' . $baseUrl . '/blog/' . $b->id . '</loc>';
            $xml .= '<lastmod>' . ($b->created_at ? $b->created_at->format('Y-m-d') : date('Y-m-d')) . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.7</priority>';
            $xml .= '</url>';
        }

        $xml .= '</urlset>';

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
