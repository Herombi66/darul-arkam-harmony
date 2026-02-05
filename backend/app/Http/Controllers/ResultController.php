<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ResultController extends Controller
{
    public function current(Request $request)
    {
        $results = [
            [
                'subject' => 'Mathematics',
                'ca1' => 25,
                'ca2' => 28,
                'ca3' => 26,
                'exam' => 75,
                'total' => 77,
                'grade' => 'B+',
                'remark' => 'Very Good'
            ],
            [
                'subject' => 'Physics',
                'ca1' => 24,
                'ca2' => 26,
                'ca3' => 25,
                'exam' => 72,
                'total' => 74,
                'grade' => 'B+',
                'remark' => 'Very Good'
            ],
            [
                'subject' => 'Chemistry',
                'ca1' => 22,
                'ca2' => 24,
                'ca3' => 23,
                'exam' => 68,
                'total' => 69,
                'grade' => 'B',
                'remark' => 'Good'
            ],
            [
                'subject' => 'Biology',
                'ca1' => 26,
                'ca2' => 27,
                'ca3' => 28,
                'exam' => 76,
                'total' => 79,
                'grade' => 'B+',
                'remark' => 'Very Good'
            ],
            [
                'subject' => 'English',
                'ca1' => 23,
                'ca2' => 25,
                'ca3' => 24,
                'exam' => 70,
                'total' => 71,
                'grade' => 'B',
                'remark' => 'Good'
            ],
            [
                'subject' => 'Geography',
                'ca1' => 21,
                'ca2' => 23,
                'ca3' => 22,
                'exam' => 65,
                'total' => 66,
                'grade' => 'B-',
                'remark' => 'Satisfactory'
            ]
        ];

        return response()->json(['data' => $results]);
    }

    public function previous(Request $request)
    {
        $results = [
            [
                'subject' => 'Mathematics',
                'ca1' => 22,
                'ca2' => 25,
                'ca3' => 24,
                'exam' => 70,
                'total' => 71,
                'grade' => 'B',
                'remark' => 'Good'
            ],
            [
                'subject' => 'Physics',
                'ca1' => 21,
                'ca2' => 23,
                'ca3' => 22,
                'exam' => 68,
                'total' => 67,
                'grade' => 'B-',
                'remark' => 'Satisfactory'
            ],
            [
                'subject' => 'Chemistry',
                'ca1' => 20,
                'ca2' => 22,
                'ca3' => 21,
                'exam' => 65,
                'total' => 64,
                'grade' => 'B-',
                'remark' => 'Satisfactory'
            ],
            [
                'subject' => 'Biology',
                'ca1' => 24,
                'ca2' => 25,
                'ca3' => 26,
                'exam' => 73,
                'total' => 75,
                'grade' => 'B+',
                'remark' => 'Very Good'
            ],
            [
                'subject' => 'English',
                'ca1' => 21,
                'ca2' => 23,
                'ca3' => 22,
                'exam' => 67,
                'total' => 67,
                'grade' => 'B-',
                'remark' => 'Satisfactory'
            ],
            [
                'subject' => 'Geography',
                'ca1' => 19,
                'ca2' => 21,
                'ca3' => 20,
                'exam' => 62,
                'total' => 61,
                'grade' => 'C',
                'remark' => 'Pass'
            ]
        ];

        return response()->json(['data' => $results]);
    }
}
