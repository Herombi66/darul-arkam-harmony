import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { ArrowLeft } from 'lucide-react';

export default function TeacherSubjects() {
  const teacherData = {
    name: "Mrs. Fatima Ibrahim",
    id: "TCH/2024/001",
    subjects: ["Mathematics", "Physics"],
    isFormMaster: true,
    formClass: "SS2 A",
    totalStudents: 45,
    pendingAssignments: 8,
    todayClasses: 4
  };

  const [subjects, setSubjects] = useState(teacherData.subjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading delay for consistency
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">My Teaching Subjects</h1>
                <p className="text-muted-foreground">
                  View and manage the subjects you are teaching
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/dashboard/teacher">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Teaching Subjects */}
          <Card className="border-0 shadow-elevation animate-fade-in">
            <CardHeader>
              <CardTitle className="text-primary">Teaching Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading subjects...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">Error: {error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subjects.map((subject, index) => (
                    <Link key={index} to={`/dashboard/teacher/subjects/${subject}`}>
                      <div className="p-6 bg-gradient-primary rounded-lg text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <h3 className="font-semibold text-lg">{subject}</h3>
                        <p className="text-sm opacity-90 mt-2">Click to view details and manage scores</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}