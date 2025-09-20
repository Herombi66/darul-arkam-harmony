import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Download,
  Calendar,
  PieChart,
  BarChart3,
  FileText,
  Receipt,
  Wallet
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface PaymentRecord {
  id: string;
  studentName: string;
  studentId: string;
  amount: number;
  paymentType: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  academicYear: string;
  term: string;
}

interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  outstandingPayments: number;
  monthlyRevenue: number[];
  paymentMethods: { method: string; amount: number; percentage: number }[];
}

export default function AdminFinance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('2024/2025');
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    outstandingPayments: 0,
    monthlyRevenue: [],
    paymentMethods: []
  });

  // Mock data
  useEffect(() => {
    const mockPayments: PaymentRecord[] = [
      {
        id: '1',
        studentName: 'Ahmad Muhammad',
        studentId: 'STD001',
        amount: 50000,
        paymentType: 'School Fees',
        paymentMethod: 'Paystack',
        status: 'completed',
        date: '2024-09-15',
        academicYear: '2024/2025',
        term: 'First Term'
      },
      {
        id: '2',
        studentName: 'Fatima Abubakar',
        studentId: 'STD002',
        amount: 45000,
        paymentType: 'School Fees',
        paymentMethod: 'Bank Transfer',
        status: 'completed',
        date: '2024-09-14',
        academicYear: '2024/2025',
        term: 'First Term'
      },
      {
        id: '3',
        studentName: 'Ibrahim Musa',
        studentId: 'STD003',
        amount: 50000,
        paymentType: 'School Fees',
        paymentMethod: 'Paystack',
        status: 'pending',
        date: '2024-09-20',
        academicYear: '2024/2025',
        term: 'First Term'
      }
    ];

    const mockSummary: FinancialSummary = {
      totalRevenue: 2450000,
      totalExpenses: 1850000,
      netIncome: 600000,
      outstandingPayments: 150000,
      monthlyRevenue: [450000, 520000, 480000, 550000, 460000, 480000],
      paymentMethods: [
        { method: 'Paystack', amount: 1850000, percentage: 75.5 },
        { method: 'Bank Transfer', amount: 450000, percentage: 18.4 },
        { method: 'Cash', amount: 150000, percentage: 6.1 }
      ]
    };

    setPayments(mockPayments);
    setSummary(mockSummary);
  }, []);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Financial Reports</h1>
              <p className="text-muted-foreground">View financial summaries and analytics</p>
            </div>
            <div className="flex gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2023/2024">2023/2024</SelectItem>
                  <SelectItem value="2022/2023">2022/2023</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Financial Overview Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-success">
                      {formatCurrency(summary.totalRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-destructive/10 rounded-full">
                    <TrendingDown className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-destructive">
                      {formatCurrency(summary.totalExpenses)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Income</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(summary.netIncome)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning/10 rounded-full">
                    <Wallet className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="text-2xl font-bold text-warning">
                      {formatCurrency(summary.outstandingPayments)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Chart Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Monthly Revenue Trend
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Methods Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5" />
                      Payment Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {summary.paymentMethods.map((method, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                            <span className="text-sm font-medium">{method.method}</span>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(method.amount)}</p>
                            <p className="text-xs text-muted-foreground">{method.percentage}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Payments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5" />
                    Recent Payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.slice(0, 5).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.studentName}</div>
                              <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>{payment.paymentType}</TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>All Payment Records</CardTitle>
                    <div className="flex gap-2">
                      <Select defaultValue="all">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Academic Year</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{payment.studentName}</div>
                              <div className="text-sm text-muted-foreground">{payment.studentId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>{payment.paymentType}</TableCell>
                          <TableCell>{payment.paymentMethod}</TableCell>
                          <TableCell>{payment.academicYear}</TableCell>
                          <TableCell>{payment.term}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(payment.status)}>
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Term</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">First Term</span>
                        <span className="font-medium">{formatCurrency(850000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Second Term</span>
                        <span className="font-medium">{formatCurrency(920000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Third Term</span>
                        <span className="font-medium">{formatCurrency(680000)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Staff Salaries</span>
                        <span className="font-medium">{formatCurrency(1200000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Facility Maintenance</span>
                        <span className="font-medium">{formatCurrency(350000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Educational Materials</span>
                        <span className="font-medium">{formatCurrency(200000)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Utilities</span>
                        <span className="font-medium">{formatCurrency(100000)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <FileText className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="font-medium mb-2">Financial Statement</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Complete financial overview for the selected period
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Receipt className="h-12 w-12 mx-auto text-success mb-4" />
                    <h3 className="font-medium mb-2">Payment Report</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Detailed report of all payment transactions
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-12 w-12 mx-auto text-warning mb-4" />
                    <h3 className="font-medium mb-2">Revenue Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      In-depth analysis of revenue streams and trends
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}