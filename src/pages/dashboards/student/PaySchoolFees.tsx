import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Wallet, Calendar, AlertCircle } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useToast } from '@/hooks/use-toast';

export default function PaySchoolFees() {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState('');

  const feeStructure = [
    { item: 'Tuition Fee', amount: 150000, status: 'pending' },
    // { item: 'Library Fee', amount: 5000, status: 'paid' },
    // { item: 'Laboratory Fee', amount: 10000, status: 'pending' },
    // { item: 'Sports Fee', amount: 3000, status: 'paid' },
    // { item: 'Exam Fee', amount: 7000, status: 'pending' }
  ];

  const totalPending = feeStructure
    .filter(fee => fee.status === 'pending')
    .reduce((sum, fee) => sum + fee.amount, 0);

  const handlePayment = () => {
    toast({
      title: "Payment Initiated",
      description: "Redirecting to payment gateway...",
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Pay School Fees</h1>
            <p className="text-muted-foreground">Make secure payments for school fees</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Fee Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {feeStructure.map((fee, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{fee.item}</p>
                          <p className="text-sm text-muted-foreground">₦{fee.amount.toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          fee.status === 'paid' 
                            ? 'bg-success/20 text-success' 
                            : 'bg-warning/20 text-warning'
                        }`}>
                          {fee.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={paymentMethod === 'card' ? 'default' : 'outline'}
                      className="h-20 flex-col"
                      onClick={() => setPaymentMethod('card')}
                    >
                      <CreditCard className="h-6 w-6 mb-2" />
                      Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'wallet' ? 'default' : 'outline'}
                      className="h-20 flex-col"
                      onClick={() => setPaymentMethod('wallet')}
                    >
                      <Wallet className="h-6 w-6 mb-2" />
                      Wallet
                    </Button>
                    <Button
                      variant={paymentMethod === 'installment' ? 'default' : 'outline'}
                      className="h-20 flex-col"
                      onClick={() => setPaymentMethod('installment')}
                    >
                      <Calendar className="h-6 w-6 mb-2" />
                      Installment
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Amount to Pay</Label>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>

                    {paymentMethod === 'card' && (
                      <>
                        <div>
                          <Label>Card Number</Label>
                          <Input placeholder="1234 5678 9012 3456" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Expiry Date</Label>
                            <Input placeholder="MM/YY" />
                          </div>
                          <div>
                            <Label>CVV</Label>
                            <Input placeholder="123" type="password" />
                          </div>
                        </div>
                      </>
                    )}

                    {paymentMethod === 'installment' && (
                      <div>
                        <Label>Installment Plan</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select plan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 Months</SelectItem>
                            <SelectItem value="3">3 Months</SelectItem>
                            <SelectItem value="6">6 Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-warning bg-warning/5 border-0 shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-warning-foreground">Outstanding Balance</h3>
                      <p className="text-2xl font-bold text-primary mt-2">
                        ₦{totalPending.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₦{(amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span>₦0</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>₦{(amount || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handlePayment}>
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
