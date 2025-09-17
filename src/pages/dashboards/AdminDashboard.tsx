import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Shield,
  Activity,
  Database,
  UserCog,
  Bell,
  TrendingUp
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function AdminDashboard() {
  const adminData = {
    name: "Dr. Muhammad Sani",
    id: "ADM/2024/001",
    role: "System Administrator",
    totalUsers: 1456,
    totalStudents: 1248,
    totalTeachers: 89,
    totalSubjects: 24,
    systemUptime: "99.8%",
    activeSessionsToday: 342
  };

  const quickActions = [
    {
      title: "User Management",
      description: "Manage all system users and roles",
      icon: Users,
      href: "/dashboard/admin/users",
      variant: "default" as const
    },
    {
      title: "Subject Management",
      description: "Create and manage subjects",
      icon: BookOpen,
      href: "/dashboard/admin/subjects",
      variant: "secondary" as const
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      href: "/dashboard/admin/settings",
      variant: "accent" as const
    },
    {
      title: "Analytics Dashboard",
      description: "View detailed system analytics",
      icon: BarChart3,
      href: "/dashboard/admin/analytics",
      variant: "outline" as const
    }
  ];

  const systemStats = [
    { label: "Total Users", value: adminData.totalUsers, icon: Users, change: "+12" },
    { label: "Students", value: adminData.totalStudents, icon: Users, change: "+8" },
    { label: "Teachers", value: adminData.totalTeachers, icon: UserCog, change: "+2" },
    { label: "Subjects", value: adminData.totalSubjects, icon: BookOpen, change: "0" }
  ];

  const recentActivities = [
    { action: "New student enrolled", user: "Admission Officer", time: "5 minutes ago", type: "success" },
    { action: "Teacher updated grades", user: "Mrs. Fatima Ibrahim", time: "15 minutes ago", type: "info" },
    { action: "System backup completed", user: "System", time: "1 hour ago", type: "success" },
    { action: "Failed login attempt", user: "Unknown", time: "2 hours ago", type: "warning" },
    { action: "New payment received", user: "Finance Officer", time: "3 hours ago", type: "success" }
  ];

  const systemHealth = [
    { component: "Database", status: "Healthy", uptime: "99.9%" },
    { component: "Authentication", status: "Healthy", uptime: "99.8%" },
    { component: "File Storage", status: "Healthy", uptime: "99.7%" },
    { component: "Email Service", status: "Warning", uptime: "98.5%" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {adminData.name}!</h1>
            <p className="text-muted-foreground">
              {adminData.role} • ID: {adminData.id} • System Uptime: {adminData.systemUptime}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            {systemStats.map((stat, index) => (
              <Card key={index} className="hover-lift border-0 shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-2xl font-bold text-primary">{stat.value}</p>
                        {stat.change !== "0" && (
                          <span className={`text-xs ${
                            stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                          }`}>
                            {stat.change}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-muted/50 rounded-lg hover-lift"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gradient-primary rounded-lg">
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-primary">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Button asChild variant={action.variant} className="w-full">
                        <Link to={action.href}>Access</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Health */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {systemHealth.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          component.status === 'Healthy' ? 'bg-success' : 
                          component.status === 'Warning' ? 'bg-warning' : 'bg-destructive'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm">{component.component}</p>
                          <p className="text-xs text-muted-foreground">Uptime: {component.uptime}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        component.status === 'Healthy' ? 'bg-success/10 text-success' : 
                        component.status === 'Warning' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {component.status}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.type === 'success' ? 'bg-success' :
                          activity.type === 'warning' ? 'bg-warning' : 'bg-primary'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.user}</p>
                          <p className="text-xs text-primary font-medium mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/admin/activity-logs">View All Activities</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Overview */}
          <Card className="border-0 shadow-elevation animate-fade-in">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Today's Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{adminData.activeSessionsToday}</p>
                  <p className="text-sm text-muted-foreground">Active Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">15</p>
                  <p className="text-sm text-muted-foreground">New Registrations</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">89</p>
                  <p className="text-sm text-muted-foreground">Assignments Submitted</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-accent">₦2.4M</p>
                  <p className="text-sm text-muted-foreground">Fees Collected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}