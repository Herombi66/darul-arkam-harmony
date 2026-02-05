import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Calendar,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ParentDashboard() {
  const parentData = {
    name: "Mr. Abdullahi Musa",
    id: "PAR/2024/001",
    children: [
      { name: "Ahmad Musa", class: "SS3 A", rollNumber: "STU/2024/001", average: 88.5 },
      { name: "Aisha Musa", class: "JSS2 B", rollNumber: "STU/2024/045", average: 92.3 }
    ],
    pendingPayments: 50000,
    totalChildren: 2
  };

  const quickActions = [
    {
      title: "Pay School Fees",
      description: "Make payments for your children",
      icon: CreditCard,
      href: "/dashboard/parent/payments",
      variant: "default" as const
    },
    {
      title: "View Performance",
      description: "Check children's academic progress",
      icon: TrendingUp,
      href: "/dashboard/parent/children",
      variant: "secondary" as const
    },
    {
      title: "Message Teachers",
      description: "Communicate with class teachers",
      icon: MessageSquare,
      href: "/dashboard/parent/messages",
      variant: "accent" as const
    }
  ];

  const upcomingEvents = [
    { title: "Parent-Teacher Meeting", date: "2024-01-25", type: "meeting" },
    { title: "Ahmad's Birthday", date: "2024-01-28", type: "birthday" },
    { title: "End of Term Exam", date: "2024-02-05", type: "exam" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="parent" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {parentData.name}!</h1>
            <p className="text-muted-foreground">
              Parent ID: {parentData.id} • {parentData.totalChildren} {parentData.totalChildren === 1 ? 'Child' : 'Children'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Children</p>
                    <p className="text-2xl font-bold text-primary">{parentData.totalChildren}</p>
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
                    <p className="text-sm text-muted-foreground">Average Performance</p>
                    <p className="text-2xl font-bold text-primary">
                      {(parentData.children.reduce((sum, child) => sum + child.average, 0) / parentData.children.length).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {parentData.pendingPayments > 0 && (
              <Card className="hover-lift border-0 shadow-elevation border-warning bg-warning/5">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-warning rounded-full">
                      <AlertCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Payments</p>
                      <p className="text-2xl font-bold text-warning-foreground">₦{parentData.pendingPayments.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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

              {/* Children Overview */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">My Children</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {parentData.children.map((child, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg hover-lift">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-primary">{child.name}</h3>
                          <p className="text-sm text-muted-foreground">{child.class} • {child.rollNumber}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium text-primary">{child.average}%</span>
                          </div>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/dashboard/parent/children/${child.rollNumber}`}>View Details</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        event.type === 'birthday' ? 'bg-accent' : 
                        event.type === 'exam' ? 'bg-warning' : 'bg-primary'
                      }`}></div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/parent/events">View All Events</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}