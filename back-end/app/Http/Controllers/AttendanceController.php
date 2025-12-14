<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Classroom;
use App\Models\Session;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function getClassAttendance($id) {
        $classroom = Classroom::findOrFail($id);
        $user = auth()->user();

        // Only teachers can view class attendance
        if ($classroom->teacher_id !== $user->id) {
            return response()->json([
                'error' => 'Unauthorized. Only teachers can view class attendance.'
            ], 403);
        }

        $sessions = Session::where('classroom_id', $id)
            ->with(['attendances.student'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'data' => $sessions
        ], 200);
    }

    public function getStudentAttendance($id) {
        $user = auth()->user();

        // Students can only view their own attendance
        if ($user->id != $id && $user->role !== 'teacher') {
            return response()->json([
                'error' => 'Unauthorized. You can only view your own attendance.'
            ], 403);
        }

        $attendances = Attendance::where('student_id', $id)
            ->with(['session.classroom'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $attendances
        ], 200);
    }

    public function update(Request $request, $id) {
        $validated = $request->validate([
            'status' => 'required|in:present,absent,late',
            'time_present' => 'nullable|date_format:H:i:s',
        ]);

        $attendance = Attendance::findOrFail($id);
        $session = $attendance->session;
        $classroom = $session->classroom;
        $user = auth()->user();

        // Only teachers can update attendance
        if ($classroom->teacher_id !== $user->id) {
            return response()->json([
                'error' => 'Unauthorized. Only teachers can update attendance.'
            ], 403);
        }

        $attendance->update([
            'status' => $validated['status'],
            'time_present' => $validated['time_present'] ?? (in_array($validated['status'], ['present', 'late']) ? now()->format('H:i:s') : null),
        ]);

        return response()->json([
            'message' => 'Attendance updated successfully',
            'attendance' => $attendance->load('student')
        ], 200);
    }

    public function markLate(Request $request, $id) {
        $validated = $request->validate([
            'time_present' => 'nullable|date_format:H:i:s',
        ]);

        $attendance = Attendance::findOrFail($id);
        $session = $attendance->session;
        $classroom = $session->classroom;
        $user = auth()->user();

        // Only teachers can mark students as late
        if ($classroom->teacher_id !== $user->id) {
            return response()->json([
                'error' => 'Unauthorized. Only teachers can mark students as late.'
            ], 403);
        }

        $attendance->update([
            'status' => 'late',
            'time_present' => $validated['time_present'] ?? now()->format('H:i:s'),
        ]);

        return response()->json([
            'message' => 'Student marked as late successfully',
            'attendance' => $attendance->load('student')
        ], 200);
    }
}
