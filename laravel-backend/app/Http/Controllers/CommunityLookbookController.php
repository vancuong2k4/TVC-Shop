<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class CommunityLookbookController extends Controller
{
    /**
     * Danh sách bảng tin phong cách (Community Lookbook Feed)
     */
    private $lookbookPosts = [
        [
            'id' => 'post_01',
            'author_name' => 'Lan Khuê (VIP Diamond)',
            'author_handle' => '@lankhue.atelier',
            'author_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            'image_url' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
            'caption' => 'Một ngày làm việc quyền lực cùng chiếc Structured Tuxedo Blazer đen tuyền. Phom vai cắt cúp sắc nét khiến bản thân luôn vững vàng trong mọi phiên đàm phán.',
            'location' => 'Keangnam Landmark 72, Hà Nội',
            'likes_count' => 842,
            'tagged_product_id' => 1,
            'tagged_product_name' => 'The Obsidian Trench Coat',
            'tagged_product_price' => 3200000,
            'created_at' => '2 giờ trước'
        ],
        [
            'id' => 'post_02',
            'author_name' => 'Trọng Hiếu',
            'author_handle' => '@hieu.noir',
            'author_avatar' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
            'image_url' => 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800',
            'caption' => 'Tối giản không bao giờ nhàm chán nếu bạn thấu hiểu về cấu trúc xơ sợi. Áo len Cashmere kết hợp cùng quần tây xếp ly - vẻ đẹp của Quiet Luxury.',
            'location' => 'Bitexco Financial Tower, TP.HCM',
            'likes_count' => 615,
            'tagged_product_id' => 2,
            'tagged_product_name' => 'Structured Tuxedo Blazer in Silk',
            'tagged_product_price' => 2450000,
            'created_at' => '5 giờ trước'
        ],
        [
            'id' => 'post_03',
            'author_name' => 'Helena Phương',
            'author_handle' => '@helena.lifestyle',
            'author_avatar' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
            'image_url' => 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
            'caption' => 'Dạ tiệc cuối tuần dưới ánh nến cùng Silk Noir Slip Dress. Cảm giác lụa mát lịm chạm vào da thịt thực sự là một trải nghiệm xúc giác xa xỉ.',
            'location' => 'The Reverie Saigon',
            'likes_count' => 1280,
            'tagged_product_id' => 3,
            'tagged_product_name' => 'Ethereal Bias-Cut Silk Evening Gown',
            'tagged_product_price' => 2890000,
            'created_at' => '1 ngày trước'
        ]
    ];

    /**
     * Lấy danh sách bài đăng phong cách cộng đồng
     */
    public function getFeed()
    {
        return response()->json([
            'success' => true,
            'total_posts' => count($this->lookbookPosts),
            'posts' => $this->lookbookPosts
        ]);
    }

    /**
     * Thả tim bài đăng lookbook cộng đồng
     */
    public function likePost($id)
    {
        return response()->json([
            'success' => true,
            'message' => 'Đã thả tim bài phối phong cách!'
        ]);
    }

    /**
     * Đăng tải bài phối phong cách cá nhân
     */
    public function createPost(Request $request)
    {
        $request->validate([
            'author_name' => 'required|string|max:100',
            'caption' => 'required|string|max:500',
            'location' => 'nullable|string|max:100',
            'tagged_product_id' => 'nullable|numeric'
        ]);

        $newPost = [
            'id' => 'post_' . uniqid(),
            'author_name' => $request->author_name,
            'author_handle' => '@' . strtolower(preg_replace('/\s+/', '', $request->author_name)),
            'author_avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            'image_url' => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
            'caption' => $request->caption,
            'location' => $request->location ?: 'TVC Flagship Atelier',
            'likes_count' => 1,
            'tagged_product_id' => $request->tagged_product_id ?: 1,
            'tagged_product_name' => 'The Obsidian Trench Coat',
            'tagged_product_price' => 3200000,
            'created_at' => 'Vừa xong'
        ];

        return response()->json([
            'success' => true,
            'message' => 'Bài phối đồ phong cách đã được đăng tải thành công lên Bảng tin Cộng đồng!',
            'post' => $newPost
        ]);
    }
}
