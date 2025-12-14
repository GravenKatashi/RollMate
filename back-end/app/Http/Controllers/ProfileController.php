<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function getProfile()
    {
        $user = auth()->user();
        return response()->json([
            'data' => $user
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'middle_initial' => 'nullable|string|max:1',
            'last_name' => 'sometimes|required|string|max:255',
            'age' => 'sometimes|required|integer|min:1',
            'gender' => 'sometimes|required|string|in:Male,Female,Other',
            'date_of_birth' => 'sometimes|required|date',
            'school_affiliation' => 'nullable|string|max:255',
            'recovery_email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|nullable|string|min:8|confirmed',
            'password_confirmation' => 'required_with:password',
        ]);

        // Update user fields
        if (isset($validated['first_name'])) {
            $user->first_name = $validated['first_name'];
        }
        if (isset($validated['middle_initial'])) {
            $user->middle_initial = $validated['middle_initial'];
        }
        if (isset($validated['last_name'])) {
            $user->last_name = $validated['last_name'];
        }
        if (isset($validated['age'])) {
            $user->age = $validated['age'];
        }
        if (isset($validated['gender'])) {
            $user->gender = $validated['gender'];
        }
        if (isset($validated['date_of_birth'])) {
            $user->date_of_birth = $validated['date_of_birth'];
        }
        if (isset($validated['school_affiliation'])) {
            $user->school_affiliation = $validated['school_affiliation'];
        }
        if (isset($validated['recovery_email'])) {
            $user->recovery_email = $validated['recovery_email'];
        }
        if (isset($validated['password']) && !empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user
        ], 200);
    }

    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'profile_picture' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = auth()->user();

        // Delete old profile picture if exists
        if ($user->profile_picture && Storage::disk('public')->exists($user->profile_picture)) {
            Storage::disk('public')->delete($user->profile_picture);
        }

        // Store new profile picture
        $path = $request->file('profile_picture')->store('profile_pictures', 'public');
        $user->profile_picture = $path;
        $user->save();

        return response()->json([
            'message' => 'Profile picture uploaded successfully',
            'profile_picture' => $path,
            'profile_picture_url' => Storage::url($path),
            'user' => $user->fresh()
        ], 200);
    }
}
