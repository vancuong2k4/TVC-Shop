<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of the blogs.
     */
    public function index()
    {
        // Lấy danh sách blog mới nhất, join với user để lấy tên tác giả
        $blogs = Blog::leftJoin('users', 'blogs.author_id', '=', 'users.id')
            ->select('blogs.*', 'users.full_name as author_name')
            ->orderBy('blogs.created_at', 'desc')
            ->get();

        return response()->json($blogs);
    }

    /**
     * Display the specified blog.
     */
    public function show($id)
    {
        $blog = Blog::leftJoin('users', 'blogs.author_id', '=', 'users.id')
            ->select('blogs.*', 'users.full_name as author_name')
            ->where('blogs.id', $id)
            ->first();

        if (!$blog) {
            return response()->json(['message' => 'Bài viết không tồn tại'], 404);
        }

        return response()->json($blog);
    }
}
