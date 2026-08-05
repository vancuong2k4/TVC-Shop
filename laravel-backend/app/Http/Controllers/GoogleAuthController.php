<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    /**
     * Redirect the user to the Google authentication page.
     */
    public function redirectToGoogle()
    {
        return response()->json([
            'url' => Socialite::driver('google')->stateless()->redirect()->getTargetUrl()
        ]);
    }

    /**
     * Obtain the user information from Google.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            // Check if user exists
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Create new user
                $user = User::create([
                    'full_name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'role' => 'customer',
                    'status' => 'active',
                    'password' => Hash::make(Str::random(16)) // Random password
                ]);
            } else {
                // Update google id and avatar if missing
                $user->update([
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }

            // Create Sanctum Token
            $token = $user->createToken('auth_token')->plainTextToken;
            
            // Generate user data to pass via URL
            $userData = json_encode([
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'role' => $user->role,
                'avatar' => $user->avatar
            ]);

            // Frontend redirect URL
            // Ensure frontend URL is set in env, default to localhost:5173
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            
            // Redirect back to frontend callback page with token
            return redirect()->away($frontendUrl . '/auth/google/callback?token=' . $token . '&user=' . urlencode($userData));
            
        } catch (\Exception $e) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect()->away($frontendUrl . '/login?error=google_auth_failed');
        }
    }
}
