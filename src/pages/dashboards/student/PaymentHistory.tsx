import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Search, Filter } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function PaymentHistory() {
  const payments = [
    { id: 'PAY001', date: '2024-01-15', description: 'Tuition Fee - Term 2', amount: 150000, status: 'completed', method: 'Card' },
    { id: 'PAY002', date: '2024-01-10', description: 'Library Fee', amount: 5000, status: 'completed', method: 'Wallet' },
    { id: 'PAY003', date: '2024-01-05', description: 'Sports Fee', amount: 3000, status: 'completed', method: 'Card' },
    { id: 'PAY004', date: '2023-12-20', description: 'Exam Fee', amount: 7000, status: 'completed', method: 'Card' },
    { id: 'PAY005', date: '2023-12-15', description: 'Laboratory Fee', amount: 10000, status: 'completed', method: 'Wallet' },
    { id: 'PAY006', date: '2023-11-28', description: 'Tuition Fee - Term 1', amount: 150000, status: 'completed', method: 'Card' }
  ];

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">Payment History</h1>
              <p className="text-muted-foreground">View all your payment transactions</p>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-primary">₦{totalPaid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold text-primary">{payments.length}</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">Last Payment</p>
                <p className="text-2xl font-bold text-primary">{payments[0].date}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">Transaction History</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 w-64" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell className="text-right">₦{payment.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <span className="px-2 py-1 rounded-full text-xs bg-success/20 text-success inline-flex items-center justify-center">
                          {payment.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
