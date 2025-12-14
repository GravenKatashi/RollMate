<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Session;
use App\Models\Attendance;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    public function create(Request $request) {
        $validated = $request->validate([
            'classroom_id' => 'required|exists:classrooms,id',
            'topic' => 'required|string|max:255',
            'date' => 'required|date',
        ]);

        $classroom = Classroom::findOrFail($validated['classroom_id']);

        // Verify teacher owns the classroom
        if ($classroom->teacher_id !== auth()->id()) {
            return response()->json([
                'error' => 'Unauthorized. You can only create sessions for your own classrooms.'
            ], 403);
        }

        $session = Session::create([
            'classroom_id' => $validated['classroom_id'],
            'topic' => $validated['topic'],
            'date' => $validated['date'],
            'time_created' => now(),
            'is_open' => true,
        ]);

        // Create attendance records for all students in the classroom
        $students = $classroom->students;
        foreach ($students as $student) {
            Attendance::create([
                'class_session_id' => $session->id,
                'student_id' => $student->id,
                'status' => 'absent',
            ]);
        }

        return response()->json([
            'message' => 'Session created successfully',
            'session' => $session->load('attendances')
        ], 201);
    }

    public function close(Request $request, $id) {
        $session = Session::findOrFail($id);
        $classroom = $session->classroom;

        // Verify teacher owns the classroom
        if ($classroom->teacher_id !== auth()->id()) {
            return response()->json([
                'error' => 'Unauthorized. You can only close sessions for your own classrooms.'
            ], 403);
        }

        $session->update(['is_open' => false]);

        return response()->json([
            'message' => 'Session closed successfully',
            'session' => $session
        ], 200);
    }

    public function markPresent(Request $request, $id) {
        $session = Session::findOrFail($id);

        // Check if session is still open
        if (!$session->is_open) {
            return response()->json([
                'error' => 'This session is already closed'
            ], 400);
        }

        $user = auth()->user();

        // Verify student is enrolled in the classroom
        if (!$session->classroom->students()->where('student_id', $user->id)->exists()) {
            return response()->json([
                'error' => 'You are not enrolled in this classroom'
            ], 403);
        }

        // Update or create attendance record
        $attendance = Attendance::updateOrCreate(
            [
                'class_session_id' => $session->id,
                'student_id' => $user->id,
            ],
            [
                'status' => 'present',
                'time_present' => now()->format('H:i:s'),
            ]
        );

        return response()->json([
            'message' => 'Attendance marked successfully',
            'attendance' => $attendance
        ], 200);
    }

    public function getSessions(Request $request, $id) {
        $classroom = Classroom::findOrFail($id);
        $user = auth()->user();

        // Verify user has access (either teacher or student)
        $isTeacher = $classroom->teacher_id === $user->id;
        $isStudent = $classroom->students()->where('student_id', $user->id)->exists();

        if (!$isTeacher && !$isStudent) {
            return response()->json([
                'error' => 'Unauthorized. You do not have access to this classroom.'
            ], 403);
        }

        $sessions = Session::where('classroom_id', $id)
            ->with(['attendances.student'])
            ->orderBy('date', 'desc')
            ->orderBy('time_created', 'desc')
            ->get();

        return response()->json([
            'data' => $sessions
        ], 200);
    }
}
