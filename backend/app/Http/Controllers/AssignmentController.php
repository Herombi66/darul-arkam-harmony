<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        // Mock data for assignments
        $assignments = [
            [
                'id' => '1',
                'title' => 'Math Homework 1',
                'description' => 'Solve problems 1-10 on page 42.',
                'course' => ['name' => 'Mathematics', 'courseCode' => 'MATH101'],
                'dueDate' => now()->addDays(2)->toIso8601String(),
                'maxScore' => 100,
                'priority' => 'high',
                'status' => 'pending',
            ],
            [
                'id' => '2',
                'title' => 'Science Project',
                'description' => 'Build a volcano model.',
                'course' => ['name' => 'Science', 'courseCode' => 'SCI202'],
                'dueDate' => now()->addDays(7)->toIso8601String(),
                'maxScore' => 50,
                'priority' => 'medium',
                'status' => 'pending',
            ],
        ];

        return response()->json(['data' => $assignments]);
    }
}
