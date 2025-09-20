import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  ChevronRight,
  Plus,
  Receipt
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

export default function Payments() {
  const paymentStats = {
    totalPaid: 450000,
    pendingAmount: 50000,
    nextDueDate: "2024-02-01",
    currency: "NGN"
  };

  const paymentHistory = [
    {
      id: "PAY/2024/001",
      date: "2024-01-15",
      description: "School Fees - January 2024 (Ahmad Musa)",
      amount: 150000,
      status: "completed",
      method: "Bank Transfer",
      receipt: "REC/2024/001"
    },
    {
      id: "PAY/2024/002",
      date: "2024-01-15",
      description: "School Fees - January 2024 (Aisha Musa)",
      amount: 150000,
      status: "completed",
      method: "Online Payment",
      receipt: "REC/2024/002"
    },
    {
      id: "PAY/2024/003",
      date: "2024-01-20",
      description: "PTA Levy - Q1 2024",
      amount: 25000,
      status: "completed",
      method: "Cash",
      receipt: "REC/2024/003"
    },
    {
      id: "PAY/2024/004",
      date: "2024-02-01",
      description: "School Fees - February 2024 (Ahmad Musa)",
      amount: 150000,
      status: "pending",
      method: "Bank Transfer",
      receipt: null
    },
    {
      id: "PAY/2024/005",
      date: "2024-02-01",
      description: "School Fees - February 2024 (Aisha Musa)",
      amount: 150000,
      status: "pending",
      method: "Online Payment",
      receipt: null
    }
  ];

  const upcomingPayments = [
    {
      description: "School Fees - February 2024 (Ahmad Musa)",
      amount: 150000,
      dueDate: "2024-02-01",
      status: "due_soon"
    },
    {
      description: "School Fees - February 2024 (Aisha Musa)",
      amount: 150000,
      dueDate: "2024-02-01",
      status: "due_soon"
    },
    {
      description: "PTA Levy - Q2 2024",
      amount: 25000,
      dueDate: "2024-04-01",
      status: "upcoming"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return null;
    }
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
                <BreadcrumbPage>Payments</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Payments</h1>
              <p className="text-muted-foreground">
                Manage school fees and view payment history.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/parent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Payment Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-success rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold text-primary">
                      ₦{paymentStats.totalPaid.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation border-warning bg-warning/5">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Amount</p>
                    <p className="text-2xl font-bold text-warning-foreground">
                      ₦{paymentStats.pendingAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Next Due Date</p>
                    <p className="text-2xl font-bold text-primary">
                      {new Date(paymentStats.nextDueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" asChild>
                    <Link to="/dashboard/parent/payments/pay">
                      <Plus className="h-4 w-4 mr-2" />
                      Make Payment
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Receipt className="h-4 w-4 mr-2" />
                    Payment Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Payments */}
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle>Upcoming Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Due: {new Date(payment.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">₦{payment.amount.toLocaleString()}</p>
                          <Badge variant={payment.status === 'due_soon' ? 'destructive' : 'secondary'} className="text-xs">
                            {payment.status === 'due_soon' ? 'Due Soon' : 'Upcoming'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment History */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentHistory.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(payment.status)}
                              <span className="text-sm">{payment.description}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            ₦{payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(payment.status)}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {payment.method}
                          </TableCell>
                          <TableCell>
                            {payment.receipt && (
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}