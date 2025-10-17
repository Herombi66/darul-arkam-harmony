import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  Calendar,
  BookOpen,
  Clock,
  Award,
  ArrowLeft,
  ChevronRight,
  Eye,
  MessageSquare
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Children() {
  const children = [
    {
      id: "STU/2024/001",
      name: "Ahmad Musa",
      class: "SS3 A",
      age: 17,
      avatar: "/placeholder-avatar.jpg",
      performance: {
        average: 88.5,
        subjects: 8,
        attendance: 95
      },
      recentActivity: "Completed Mathematics assignment",
      nextClass: "Physics - 2:00 PM Today",
      achievements: ["Best in Mathematics", "Perfect Attendance"]
    },
    {
      id: "STU/2024/045",
      name: "Aisha Musa",
      class: "JSS2 B",
      age: 14,
      avatar: "/placeholder-avatar.jpg",
      performance: {
        average: 92.3,
        subjects: 9,
        attendance: 98
      },
      recentActivity: "Submitted English essay",
      nextClass: "English Literature - 10:00 AM Tomorrow",
      achievements: ["Class Representative", "Excellent in Arts"]
    }
  ];

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 80) return "text-warning";
    return "text-destructive";
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 95) return "text-success";
    if (percentage >= 85) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="parent" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/parent">Parent Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>My Children</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Children</h1>
              <p className="text-muted-foreground">
                Monitor your children's academic progress and activities.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/parent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Children Overview Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Children</p>
                    <p className="text-2xl font-bold text-primary">{children.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Performance</p>
                    <p className="text-2xl font-bold text-primary">
                      {(children.reduce((sum, child) => sum + child.performance.average, 0) / children.length).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-accent rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Attendance</p>
                    <p className="text-2xl font-bold text-primary">
                      {(children.reduce((sum, child) => sum + child.performance.attendance, 0) / children.length).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Children List */}
          <div className="grid gap-6">
            {children.map((child, index) => (
              <Card key={index} className="border-0 shadow-elevation hover-lift">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                    {/* Child Avatar and Basic Info */}
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={child.avatar} alt={child.name} />
                        <AvatarFallback>
                          {child.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-primary">{child.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {child.class} • Age {child.age} • ID: {child.id}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{child.class}</Badge>
                          <span className={`text-sm font-medium ${getPerformanceColor(child.performance.average)}`}>
                            {child.performance.average}% Average
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Academic Performance</span>
                          <span className={`text-sm font-medium ${getPerformanceColor(child.performance.average)}`}>
                            {child.performance.average}%
                          </span>
                        </div>
                        <Progress value={child.performance.average} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Attendance Rate</span>
                          <span className={`text-sm font-medium ${getAttendanceColor(child.performance.attendance)}`}>
                            {child.performance.attendance}%
                          </span>
                        </div>
                        <Progress value={child.performance.attendance} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Subjects</span>
                          <span className="text-sm font-medium">{child.performance.subjects}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Active subjects</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <Button asChild>
                        <Link to={`/dashboard/parent/children/${child.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link to={`/dashboard/parent/messages?child=${child.id}`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Teacher
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-primary mb-2">Recent Activity</h4>
                        <p className="text-sm text-muted-foreground">{child.recentActivity}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-primary mb-2">Next Class</h4>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{child.nextClass}</span>
                        </div>
                      </div>
                    </div>

                    {child.achievements.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium text-primary mb-2 flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          Achievements
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {child.achievements.map((achievement, idx) => (
                            <Badge key={idx} variant="secondary">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}