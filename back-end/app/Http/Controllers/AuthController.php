<?php

namespace App\Http\Controllers;

use Google\Client;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        if ($request->has('idToken')) {
            return $this->loginWithGoogle($request);
        }

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid login credentials'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only(['id', 'name', 'email', 'phone', 'role']),
        ]);
    }

    public function loginWithGoogle(Request $request)
    {
        $request->validate([
            'idToken' => 'required|string',
        ]);

        $client = new Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = null;

        try {
            /** @var \Google\Auth\AccessToken\IdToken|null $ticket */
            $ticket = $client->verifyIdToken($request->input('idToken'));
            if ($ticket) {
                $payload = $ticket->getPayload();
            } else {
                return response()->json(['message' => 'Invalid Google ID token'], 401);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid Google ID token'], 401);
        }

        if (!$payload) {
            return response()->json(['message' => 'Invalid Google ID token payload'], 401);
        }

        $email = $payload['email'];
        $name = $payload['name'];
        $googleId = $payload['sub'];

        $user = User::where('google_id', $googleId)->first();

        $user = User::firstOrCreate([
            'email' => $email,
            'google_id' => $googleId,
        ], [
            'name' => $name,
            'password' => Hash::make(uniqid()),
        ]);

        $user->tokens()->delete();
        $token = $user->createToken('google_auth_token')->plainTextToken;

        if (!$token) {
            return response()->json(['message' => 'Failed to create token'], 401);
        }

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->only(['id', 'name', 'email', 'phone', 'role']),
        ]);
    }

    // Thêm phương thức showLogin để xử lý GET /login
    public function showLogin(Request $request)
    {
        return response()->json(['message' => 'Please login'], 401);
    }
}
