<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_id', 'title', 'slug', 'content', 'image_url', 'created_at'
    ];

    const UPDATED_AT = null;

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
