<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Mock data aggregated for the dashboard
        $stats = [
            'gpa' => 3.8,
            'attendance' => 92,
            'pending_assignments' => 3,
            'completed_courses' => 4,
        ];

        $quick_actions = [
            ['id' => 'courses', 'label' => 'My Courses', 'icon' => 'BookOpen', 'path' => '/dashboard/student/academics/subjects'],
            ['id' => 'assignments', 'label' => 'Assignments', 'icon' => 'FileText', 'path' => '/dashboard/student/academics/assignments'],
            ['id' => 'grades', 'label' => 'Grades', 'icon' => 'Trophy', 'path' => '/dashboard/student/academics/results'],
            ['id' => 'schedule', 'label' => 'Schedule', 'icon' => 'Calendar', 'path' => '/dashboard/student/events'],
        ];

        $upcoming_assignments = [
            [
                'id' => '1',
                'title' => 'Math Homework 1',
                'course' => 'Mathematics',
                'dueDate' => now()->addDays(2)->toIso8601String(),
                'status' => 'pending',
                'priority' => 'high'
            ],
            [
                'id' => '2',
                'title' => 'Science Project',
                'course' => 'Science',
                'dueDate' => now()->addDays(7)->toIso8601String(),
                'status' => 'pending',
                'priority' => 'medium'
            ],
            [
                'id' => '3',
                'title' => 'History Essay',
                'course' => 'History',
                'dueDate' => now()->addDays(1)->toIso8601String(),
                'status' => 'overdue',
                'priority' => 'high'
            ]
        ];

        $recent_grades = [
            ['subject' => 'Mathematics', 'grade' => 'A', 'score' => 92, 'date' => now()->subDays(2)->format('Y-m-d')],
            ['subject' => 'Physics', 'grade' => 'B+', 'score' => 88, 'date' => now()->subDays(5)->format('Y-m-d')],
            ['subject' => 'English', 'grade' => 'A-', 'score' => 90, 'date' => now()->subDays(10)->format('Y-m-d')],
        ];

        // Notifications or Messages
        $notifications = [
            ['id' => 1, 'message' => 'New assignment posted in Biology', 'time' => '2 hours ago', 'read' => false],
            ['id' => 2, 'message' => 'School fees due next week', 'time' => '1 day ago', 'read' => false],
        ];

        return response()->json([
            'user' => [
                'name' => 'Student User', // In real app, $request->user()->name
                'role' => 'Student',
                'avatar' => null,
            ],
            'stats' => $stats,
            'quick_actions' => $quick_actions,
            'upcoming_assignments' => $upcoming_assignments,
            'recent_grades' => $recent_grades,
            'notifications' => $notifications,
        ]);
    }
}
