<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // =============================
    // REGISTER
    // =============================
    public function register(Request $request)
    {
        $role = $request->input('role');

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed|min:8',
            'role' => ['required', Rule::in(['student','teacher'])],
            'school_affiliation' => $role === 'teacher' ? 'required|string|max:255' : 'nullable',
        ]);

        $user = User::create([
            'full_name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'school_affiliation' => $validated['school_affiliation'] ?? null,
            'recovery_email' => $validated['email'],
        ]);

        return response()->json([
            'message' => 'Registration successful',
            'user' => $user
        ], 201);
    }

    // =============================
    // LOGIN
    // =============================
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // create API token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
        'message' => 'Login successful',
        'access_token' => $token,
        'token_type' => 'Bearer',
        'user' => $user
        ]);
    }

    // =============================
    // PASSWORD RESET
    // =============================
    public function recover(Request $request)
    {
        $request->validate([
            'recovery_email' => 'required|email'
        ]);

        $user = User::where('recovery_email', $request->recovery_email)->first();

        if (!$user) {
            return response()->json(['error' => 'Recovery email not found'], 404);
        }

        return response()->json([
            'message' => 'Recovery email verified. You may now reset your password.',
            'user_id' => $user->id
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'password' => 'required|min:6|confirmed'
        ]);

        $user = User::find($validated['user_id']);
        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
