import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Clock,
  GraduationCap,
  CalendarDays,
  TrendingUp,
  Award,
  UserCheck
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function TeacherDashboard() {
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

  const quickActions = [
    {
      title: "Mark Attendance",
      description: "Mark today's class attendance",
      icon: UserCheck,
      href: "/dashboard/teacher/attendance",
      variant: "default" as const
    },
    {
      title: "Grade Assignments",
      description: "Review and grade submitted assignments",
      icon: BookOpen,
      href: "/dashboard/teacher/assignments",
      variant: "secondary" as const
    },
    {
      title: "Record Scores",
      description: "Update student CA and exam scores",
      icon: TrendingUp,
      href: "/dashboard/teacher/academics/record-keeping",
      variant: "accent" as const
    }
  ];

  const todaySchedule = [
    { subject: "Mathematics", class: "SS2 A", time: "8:00 AM" },
    { subject: "Physics", class: "SS3 B", time: "10:00 AM" },
    { subject: "Mathematics", class: "SS1 C", time: "1:00 PM" },
    { subject: "Physics", class: "SS2 A", time: "3:00 PM" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {teacherData.name}!</h1>
            <p className="text-muted-foreground">
              ID: {teacherData.id} • {teacherData.isFormMaster ? `Form Master - ${teacherData.formClass}` : 'Subject Teacher'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subjects Teaching</p>
                    <p className="text-2xl font-bold text-primary">{subjects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-primary">{teacherData.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-accent rounded-full">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Assignments</p>
                    <p className="text-2xl font-bold text-primary">{teacherData.pendingAssignments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Today's Classes</p>
                    <p className="text-2xl font-bold text-primary">{teacherData.todayClasses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover-lift"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gradient-primary rounded-lg">
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-primary">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Button asChild variant={action.variant}>
                        <Link to={action.href}>Go</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

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
                    <div className="grid grid-cols-2 gap-4">
                      {subjects.map((subject, index) => (
                        <Link key={index} to={`/dashboard/teacher/subjects/${subject}`}>
                          <div className="p-4 bg-gradient-primary rounded-lg text-white hover:opacity-90 transition-opacity cursor-pointer">
                            <h3 className="font-semibold">{subject}</h3>
                            <p className="text-sm opacity-90">Multiple Classes</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{schedule.subject}</p>
                        <p className="text-xs text-muted-foreground">{schedule.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-primary">{schedule.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/teacher/classes">View All Classes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}