<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'discount_percentage', 'max_uses', 'current_uses', 'valid_until', 'created_at'
    ];

    const UPDATED_AT = null;
}
