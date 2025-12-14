<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassroomController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ProfileController;


// -------------------- AUTH --------------------
// Rate limit auth endpoints to prevent brute force attacks
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/recover', [AuthController::class, 'recover']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

// -------------------- PROTECTED ROUTES --------------------
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Classrooms
    Route::post('/classrooms', [ClassroomController::class, 'store']);
    Route::post('/classrooms/join', [ClassroomController::class, 'join']);
    Route::get('/classrooms/teacher', [ClassroomController::class, 'getTeacherClassrooms']);
    Route::get('/classrooms/student', [ClassroomController::class, 'getStudentClassrooms']);

    // Sessions
    Route::post('/class_sessions/create', [SessionController::class, 'create']);
    Route::post('/class_sessions/{id}/close', [SessionController::class, 'close']);
    Route::post('/class_sessions/{id}/present', [SessionController::class, 'markPresent']);
    Route::get('/classrooms/{id}/sessions', [SessionController::class, 'getSessions']);

    // Attendance
    Route::get('/attendance/classroom/{id}', [AttendanceController::class, 'getClassAttendance']);
    Route::get('/attendance/student/{id}', [AttendanceController::class, 'getStudentAttendance']);
    Route::put('/attendance/{id}', [AttendanceController::class, 'update']);
    Route::post('/attendance/{id}/late', [AttendanceController::class, 'markLate']);

    // Profile
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/picture', [ProfileController::class, 'uploadProfilePicture']);
});
