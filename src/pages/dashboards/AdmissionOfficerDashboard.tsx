import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  FileText, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  BookOpen,
  Mail
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function AdmissionOfficerDashboard() {
  const officerData = {
    name: "Mrs. Hauwa Abdullahi",
    id: "ADM/2024/001",
    role: "Admission Officer",
    pendingApplications: 15,
    processedApplications: 85,
    totalStudents: 1248,
    newEnrollments: 23
  };

  const quickActions = [
    {
      title: "Review Applications",
      description: "Process new admission applications",
      icon: FileText,
      href: "/dashboard/admission-officer/new-applications",
      variant: "default" as const
    },
    {
      title: "Send Admission Letters",
      description: "Generate and send admission letters",
      icon: Mail,
      href: "/dashboard/admission-officer/admissions",
      variant: "secondary" as const
    },
    {
      title: "Create Student Accounts",
      description: "Setup login credentials for new students",
      icon: UserPlus,
      href: "/dashboard/admission-officer/student-account",
      variant: "accent" as const
    }
  ];

  const applicationSummary = [
    { class: "JSS 1", pending: 8, approved: 25, rejected: 3 },
    { class: "JSS 2", pending: 3, approved: 12, rejected: 1 },
    { class: "JSS 3", pending: 2, approved: 18, rejected: 2 },
    { class: "SS 1", pending: 2, approved: 20, rejected: 1 }
  ];

  const recentApplications = [
    { name: "Amina Suleiman", class: "JSS 1", date: "2024-01-15", status: "Pending" },
    { name: "Ibrahim Yusuf", class: "SS 1", date: "2024-01-14", status: "Approved" },
    { name: "Fatima Ahmad", class: "JSS 2", date: "2024-01-13", status: "Pending" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admission" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {officerData.name}!</h1>
            <p className="text-muted-foreground">
              {officerData.role} • ID: {officerData.id} • {officerData.pendingApplications} Pending Applications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-elevation border-warning bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Applications</p>
                    <p className="text-2xl font-bold text-warning-foreground">{officerData.pendingApplications}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Processed Applications</p>
                    <p className="text-2xl font-bold text-primary">{officerData.processedApplications}</p>
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
                    <p className="text-2xl font-bold text-primary">{officerData.totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success rounded-full">
                    <UserPlus className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">New Enrollments</p>
                    <p className="text-2xl font-bold text-primary">{officerData.newEnrollments}</p>
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

              {/* Application Summary by Class */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">Applications by Class</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {applicationSummary.map((summary, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-primary">{summary.class}</h3>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-warning">Pending: {summary.pending}</span>
                          <span className="text-success">Approved: {summary.approved}</span>
                          <span className="text-destructive">Rejected: {summary.rejected}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/dashboard/admission-officer/new-applications?class=${summary.class}`}>
                            View Applications
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/dashboard/admission-officer/enrollments?class=${summary.class}`}>
                            Enroll Students
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Recent Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentApplications.map((application, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{application.name}</p>
                          <p className="text-xs text-muted-foreground">{application.class}</p>
                          <p className="text-xs text-muted-foreground">{application.date}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === 'Approved' 
                            ? 'bg-success/10 text-success' 
                            : application.status === 'Pending'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {application.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/admission-officer/new-applications">View All Applications</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}