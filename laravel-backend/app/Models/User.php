<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'email',
        'password',
        'full_name',
        'phone',
        'role',
        'status',
        'address',
        'dob',
        'gender',
        'created_at',
        'google_id',
        'avatar'
    ];

    protected $hidden = [
        'password',
    ];

    public function wishlistProducts()
    {
        return $this->belongsToMany(Product::class, 'wishlists', 'user_id', 'product_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'user_id');
    }

    const UPDATED_AT = null;
}
