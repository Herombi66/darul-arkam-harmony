import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ExamsOfficerDashboard() {
  const officerData = {
    name: "Mr. Ibrahim Aliyu",
    id: "EXM/2024/001",
    role: "Exams Officer",
    totalClasses: 24,
    pendingResults: 12,
    publishedResults: 18,
    recentUpdates: 5
  };

  const quickActions = [
    {
      title: "Generate Exam Cards",
      description: "Create exam cards for all classes",
      icon: FileText,
      href: "/dashboard/exams-officer/exam-cards",
      variant: "default" as const
    },
    {
      title: "Compile Results",
      description: "Auto-compile results from teachers",
      icon: TrendingUp,
      href: "/dashboard/exams-officer/result-compiler",
      variant: "secondary" as const
    },
    {
      title: "Publish Results",
      description: "Make results available to students",
      icon: CheckCircle,
      href: "/dashboard/exams-officer/students-result",
      variant: "accent" as const
    }
  ];

  const classesOverview = [
    { name: "JSS 1A", students: 35, resultsStatus: "Pending" },
    { name: "JSS 1B", students: 38, resultsStatus: "Completed" },
    { name: "JSS 2A", students: 40, resultsStatus: "Completed" },
    { name: "SS 3A", students: 28, resultsStatus: "Pending" }
  ];

  const recentUpdates = [
    { teacher: "Mrs. Fatima Ibrahim", subject: "Mathematics", class: "SS2 A", time: "2 hours ago" },
    { teacher: "Mr. Usman Kano", subject: "English", class: "JSS 3B", time: "4 hours ago" },
    { teacher: "Dr. Amina Hassan", subject: "Biology", class: "SS 1A", time: "6 hours ago" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="exams" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {officerData.name}!</h1>
            <p className="text-muted-foreground">
              {officerData.role} • ID: {officerData.id} • {officerData.recentUpdates} Recent Updates
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Classes</p>
                    <p className="text-2xl font-bold text-primary">{officerData.totalClasses}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Published Results</p>
                    <p className="text-2xl font-bold text-primary">{officerData.publishedResults}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation border-warning bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Results</p>
                    <p className="text-2xl font-bold text-warning-foreground">{officerData.pendingResults}</p>
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
                    <p className="text-sm text-muted-foreground">Recent Updates</p>
                    <p className="text-2xl font-bold text-primary">{officerData.recentUpdates}</p>
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

              {/* Classes Overview */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">Classes Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {classesOverview.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover-lift">
                      <div>
                        <h3 className="font-medium text-primary">{classItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{classItem.students} Students</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          classItem.resultsStatus === 'Completed' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {classItem.resultsStatus}
                        </span>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/dashboard/exams-officer/classes/${classItem.name.replace(' ', '-').toLowerCase()}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Updates */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{update.teacher}</p>
                          <p className="text-xs text-muted-foreground">{update.subject} - {update.class}</p>
                          <p className="text-xs text-primary font-medium mt-1">{update.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/exams-officer/messages">View All Updates</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}