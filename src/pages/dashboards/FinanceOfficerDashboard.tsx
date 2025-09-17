import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Users,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function FinanceOfficerDashboard() {
  const officerData = {
    name: "Mr. Sani Garba",
    id: "FIN/2024/001",
    role: "Finance Officer",
    totalFeesCollected: 15750000,
    pendingPayments: 2340000,
    monthlyExpenses: 4250000,
    outstandingStudents: 187
  };

  const quickActions = [
    {
      title: "View Payments",
      description: "Monitor fee collections and payments",
      icon: DollarSign,
      href: "/dashboard/finance-officer/payments",
      variant: "default" as const
    },
    {
      title: "Generate Reports",
      description: "Create financial reports",
      icon: FileText,
      href: "/dashboard/finance-officer/financial-reports",
      variant: "secondary" as const
    },
    {
      title: "Manage Expenses",
      description: "Track and manage school expenses",
      icon: TrendingDown,
      href: "/dashboard/finance-officer/expenses",
      variant: "accent" as const
    }
  ];

  const termlyFees = [
    { term: "First Term", collected: 6200000, pending: 800000, percentage: 88.5 },
    { term: "Second Term", collected: 5850000, pending: 950000, percentage: 86.0 },
    { term: "Third Term", collected: 3700000, pending: 590000, percentage: 86.2 }
  ];

  const expenseCategories = [
    { category: "Staff Salaries", amount: 2800000, percentage: 65.9 },
    { category: "Utilities", amount: 850000, percentage: 20.0 },
    { category: "Maintenance", amount: 400000, percentage: 9.4 },
    { category: "Miscellaneous", amount: 200000, percentage: 4.7 }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="finance" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {officerData.name}!</h1>
            <p className="text-muted-foreground">
              {officerData.role} • ID: {officerData.id} • {officerData.outstandingStudents} Outstanding Payments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fees Collected</p>
                    <p className="text-2xl font-bold text-primary">₦{(officerData.totalFeesCollected / 1000000).toFixed(1)}M</p>
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
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                    <p className="text-2xl font-bold text-warning-foreground">₦{(officerData.pendingPayments / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <TrendingDown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Expenses</p>
                    <p className="text-2xl font-bold text-primary">₦{(officerData.monthlyExpenses / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-accent rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding Students</p>
                    <p className="text-2xl font-bold text-primary">{officerData.outstandingStudents}</p>
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

              {/* Termly Fees Overview */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">School Fees by Term</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {termlyFees.map((term, index) => (
                    <div key={index} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-primary">{term.term}</h3>
                        <span className="text-sm font-medium text-success">{term.percentage}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-2">
                        <span>Collected: ₦{(term.collected / 1000000).toFixed(1)}M</span>
                        <span>Pending: ₦{(term.pending / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full" 
                          style={{ width: `${term.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Expense Breakdown */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <TrendingDown className="h-5 w-5 mr-2" />
                  Monthly Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseCategories.map((expense, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{expense.category}</span>
                        <span className="text-muted-foreground">{expense.percentage}%</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>₦{(expense.amount / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-gradient-secondary h-2 rounded-full" 
                          style={{ width: `${expense.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/finance-officer/expenses">View Detailed Expenses</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}