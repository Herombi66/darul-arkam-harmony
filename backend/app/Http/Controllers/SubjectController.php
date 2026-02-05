<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        // Mock data for subjects matching frontend structure
        $subjects = [
            [
                'id' => 1,
                'name' => 'Mathematics',
                'code' => 'MTH201',
                'teacher' => 'Mr. Ibrahim Hassan',
                'progress' => 85,
                'grade' => 'A',
                'lastTest' => '92%',
                'nextClass' => 'Tomorrow 8:00 AM',
                'assignments' => 2,
                'status' => 'excellent'
            ],
            [
                'id' => 2,
                'name' => 'Physics',
                'code' => 'PHY201',
                'teacher' => 'Mrs. Fatima Aliyu',
                'progress' => 78,
                'grade' => 'B+',
                'lastTest' => '78%',
                'nextClass' => 'Monday 10:00 AM',
                'assignments' => 1,
                'status' => 'good'
            ],
            [
                'id' => 3,
                'name' => 'Chemistry',
                'code' => 'CHM201',
                'teacher' => 'Dr. Mohammed Usman',
                'progress' => 72,
                'grade' => 'B',
                'lastTest' => '74%',
                'nextClass' => 'Tuesday 9:00 AM',
                'assignments' => 3,
                'status' => 'satisfactory'
            ],
            [
                'id' => 4,
                'name' => 'Biology',
                'code' => 'BIO201',
                'teacher' => 'Ms. Aisha Garba',
                'progress' => 88,
                'grade' => 'A',
                'lastTest' => '89%',
                'nextClass' => 'Wednesday 11:00 AM',
                'assignments' => 1,
                'status' => 'excellent'
            ],
            [
                'id' => 5,
                'name' => 'English Language',
                'code' => 'ENG201',
                'teacher' => 'Mr. John Okafor',
                'progress' => 76,
                'grade' => 'B+',
                'lastTest' => '81%',
                'nextClass' => 'Daily 2:00 PM',
                'assignments' => 2,
                'status' => 'good'
            ],
            [
                'id' => 6,
                'name' => 'Geography',
                'code' => 'GEO201',
                'teacher' => 'Mrs. Halima Bello',
                'progress' => 69,
                'grade' => 'B-',
                'lastTest' => '65%',
                'nextClass' => 'Thursday 3:00 PM',
                'assignments' => 1,
                'status' => 'needs_improvement'
            ]
        ];

        return response()->json(['data' => $subjects]);
    }
}
