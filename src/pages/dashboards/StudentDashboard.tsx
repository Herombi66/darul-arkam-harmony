import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CreditCard,
  Clock,
  GraduationCap,
  CalendarDays,
  TrendingUp,
  Award,
  Mail,
  Phone,
  MapPin,
  Calendar
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);
  const { toast } = useToast();
  const [studentData, setStudentData] = useState({
    name: "Ahmad Musa",
    class: "SS3 A",
    rollNumber: "STU/2024/001",
    avatar: "/placeholder.svg",
    email: "ahmad.musa@darularkam.edu.ng",
    phone: "+234 801 234 5678",
    address: "123 Harmony Street, Lagos, Nigeria",
    dateOfBirth: "2008-05-15",
    gender: "Male",
    admissionDate: "2020-09-01",
    guardianName: "Hassan Musa",
    guardianPhone: "+234 802 345 6789",
    pendingAssignments: 3,
    averageScore: 88.5,
    classRank: 2,
    attendance: 95,
    pendingFees: 25000
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('student_profile');
      if (!raw) return;
      const p = JSON.parse(raw) as { photoUrl?: string; phone?: string; address?: string; guardianPhone?: string };
      setStudentData(prev => ({
        ...prev,
        avatar: p.photoUrl || prev.avatar,
        phone: p.phone || prev.phone,
        address: p.address || prev.address,
        guardianPhone: p.guardianPhone || prev.guardianPhone,
      }));
    } catch {}
  }, []);

  const quickActions = [
    {
      title: "View Assignments",
      description: "Check and submit pending assignments",
      icon: BookOpen,
      href: "/dashboard/student/academics/assignments",
      variant: "default" as const
    },
    {
      title: "Check Results",
      description: "View your academic performance",
      icon: GraduationCap,
      href: "/dashboard/student/academics/results",
      variant: "secondary" as const
    },
    {
      title: "Pay School Fees",
      description: "Make payments for school fees",
      icon: CreditCard,
      href: "/dashboard/student/payments/pay",
      variant: "accent" as const
    }
  ];

  const upcomingEvents = [
    { title: "Mid-term Examination", date: "2024-01-15", type: "exam" },
    { title: "Science Fair", date: "2024-01-20", type: "event" },
    { title: "Parent-Teacher Meeting", date: "2024-01-25", type: "meeting" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="responsive-div p-6 space-y-6">
          {/* Student Profile */}
          <Card className="border-0 shadow-elevation animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
                  <AvatarImage src={studentData.avatar} alt={studentData.name} className="object-cover" />
                  <AvatarFallback className="text-lg">{studentData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-primary">{studentData.name}</h1>
                  <p className="text-muted-foreground mb-2">
                    {studentData.class} • Roll No: {studentData.rollNumber}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                    <div className="flex items-start sm:items-center space-x-2 md:space-x-3 min-w-0">
                      <Mail className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
                      <span className="truncate sm:truncate md:whitespace-normal">{studentData.email}</span>
                    </div>
                    <div className="flex items-start sm:items-center space-x-2 md:space-x-3 min-w-0">
                      <Phone className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
                      <span className="truncate sm:truncate md:whitespace-normal">{studentData.phone}</span>
                    </div>
                    <div className="flex items-start sm:items-center space-x-2 md:space-x-3 min-w-0">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
                      <span className="truncate sm:truncate md:whitespace-normal">{studentData.address}</span>
                    </div>
                    <div className="flex items-start sm:items-center space-x-2 md:space-x-3 min-w-0">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground shrink-0" />
                      <span className="truncate sm:truncate md:whitespace-normal">DOB: {new Date(studentData.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Edit profile"
                  aria-busy={isNavigating}
                  aria-disabled={isNavigating}
                  disabled={isNavigating}
                  onClick={async () => {
                    try {
                      setIsNavigating(true);
                      navigate('/dashboard/student/profile');
                    } catch (err) {
                      const msg = err instanceof Error ? err.message : 'Unable to open profile';
                      toast({ title: 'Navigation error', description: msg, variant: 'destructive' });
                    } finally {
                      setIsNavigating(false);
                    }
                  }}
                >
                  {isNavigating ? 'Opening…' : 'Edit Profile'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Assignments</p>
                    <p className="text-2xl font-bold text-primary">{studentData.pendingAssignments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                    <p className="text-2xl font-bold text-primary">{studentData.averageScore}%</p>
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
                    <p className="text-sm text-muted-foreground">Class Rank</p>
                    <p className="text-2xl font-bold text-primary">#{studentData.classRank}</p>
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
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="text-2xl font-bold text-primary">{studentData.attendance}%</p>
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

              {/* Fee Payment Alert */}
              {studentData.pendingFees > 0 && (
                <Card className="border-warning bg-warning/5 border-0 shadow-elevation animate-bounce-in">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-warning rounded-full">
                          <CreditCard className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-warning-foreground">Outstanding School Fees</h3>
                          <p className="text-sm text-muted-foreground">
                            Amount: ₦{studentData.pendingFees.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Button asChild variant="warning">
                        <Link to="/dashboard/student/payments/pay">Pay Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Upcoming Events */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <CalendarDays className="h-5 w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/student/events">View All Events</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
