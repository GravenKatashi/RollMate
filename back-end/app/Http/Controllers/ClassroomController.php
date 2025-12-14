<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function store(Request $request) {
        $validated = $request->validate([
        'subject' => 'required|string|max:255',
        'code' => 'required|string|max:50|unique:classrooms',
    ]);

    $user = auth()->user();

    $fullName = $user->last_name . ', ' . $user->first_name . ' ' . $user->middle_initial . '.';

    $classroom = Classroom::create([
        'subject' => $validated['subject'],
        'code' => $validated['code'],
        'teacher_name' => ['full_name'],
    ]);

    return response()->json([
        'message' => 'Classroom created successfully',
        'classroom' => $classroom
    ], 201);
    }
    public function join(Request $request) {

    }

    public function getTeacherClassrooms(Request $request) {
        return Classroom::where('teacher_id', auth()->id())->get();
    }

    public function getStudentClassrooms(Request $request) {

    }
}
