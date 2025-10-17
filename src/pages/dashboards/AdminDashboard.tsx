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
  TrendingUp,
  Calendar,
  MessageSquare,
  HelpCircle,
  User,
  CreditCard,
  FileText
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
      title: "My Profile",
      description: "Update personal info & preferences",
      icon: User,
      href: "/dashboard/admin/profile",
      variant: "default" as const,
      priority: "high" as const
    },
    {
      title: "User Management",
      description: "Manage students, teachers & staff",
      icon: Users,
      href: "/dashboard/admin/users",
      variant: "secondary" as const,
      priority: "high" as const
    },
    {
      title: "Academic Overview",
      description: "Monitor courses & performance",
      icon: BookOpen,
      href: "/dashboard/admin/academics",
      variant: "accent" as const,
      priority: "high" as const
    },
    {
      title: "Financial Reports",
      description: "Revenue, fees & expenses",
      icon: CreditCard,
      href: "/dashboard/admin/finance",
      variant: "outline" as const,
      priority: "medium" as const
    },
    {
      title: "Event Management",
      description: "Schedule & manage school events",
      icon: Calendar,
      href: "/dashboard/admin/events",
      variant: "default" as const,
      priority: "medium" as const
    },
    {
      title: "Communications",
      description: "Messages & notifications",
      icon: MessageSquare,
      href: "/dashboard/admin/messages",
      variant: "secondary" as const,
      priority: "medium" as const
    }
  ];

  const essentialActions = quickActions.filter(action => action.priority === "high");
  const additionalActions = quickActions.filter(action => action.priority === "medium");

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
              {/* Essential Actions */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Essential Actions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Most frequently used administrative functions</p>
                </CardHeader>
                <CardContent className="grid md:grid-cols-1 lg:grid-cols-3 gap-4">
                  {essentialActions.map((action, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg hover-lift group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-primary">{action.title}</h3>
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

              {/* Additional Actions */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Additional Tools
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Secondary administrative functions</p>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {additionalActions.map((action, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/50 rounded-lg hover-lift group"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-gradient-primary rounded-lg group-hover:scale-110 transition-transform">
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-primary">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Button asChild variant={action.variant} size="sm" className="w-full">
                        <Link to={action.href}>Open</Link>
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
                  <Link to="/dashboard/admin/support">View Support Center</Link>
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