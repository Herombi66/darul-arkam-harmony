import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  CreditCard,
  Smartphone,
  Building2,
  Calendar,
  AlertTriangle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function PaySchoolFees() {
  const feeStructure = {
    term1: {
      total: 150000,
      installment1: { amount: 75000, dueDate: '2024-09-15', status: 'paid' },
      installment2: { amount: 75000, dueDate: '2024-11-15', status: 'pending' }
    },
    term2: {
      total: 150000,
      installment1: { amount: 75000, dueDate: '2025-01-15', status: 'upcoming' },
      installment2: { amount: 75000, dueDate: '2025-03-15', status: 'upcoming' }
    },
    term3: {
      total: 150000,
      installment1: { amount: 75000, dueDate: '2025-05-15', status: 'upcoming' },
      installment2: { amount: 75000, dueDate: '2025-07-15', status: 'upcoming' }
    }
  };

  const paymentMethods = [
    {
      name: 'Online Banking',
      icon: Building2,
      description: 'Pay directly from your bank account',
      available: true
    },
    {
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, and Verve accepted',
      available: true
    },
    {
      name: 'Mobile Wallet',
      icon: Smartphone,
      description: 'Pay with mobile money (MTN, Airtel, Glo)',
      available: true
    }
  ];

  const faqs = [
    {
      question: 'What happens if I miss a payment deadline?',
      answer: 'Late payments incur a penalty of 5% of the outstanding amount per week. Continued non-payment may result in suspension of academic activities.'
    },
    {
      question: 'Can I pay the full term fee at once?',
      answer: 'Yes, you can pay the full term fee upfront to avoid installment deadlines and potential late fees.'
    },
    {
      question: 'Are there any discounts for early payment?',
      answer: 'Yes, payments made 30 days before the due date receive a 2% discount on the installment amount.'
    },
    {
      question: 'How do I get a receipt for my payment?',
      answer: 'Receipts are automatically generated and sent to your registered email address within 24 hours of successful payment.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'upcoming':
        return <Circle className="h-5 w-5 text-gray-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="default" className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Pending</Badge>;
      case 'upcoming':
        return <Badge variant="outline">Upcoming</Badge>;
      default:
        return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-primary">Pay School Fees</h1>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Proceed to Payment
            </Button>
          </div>

          {/* Fee Structure Overview */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Fee Structure & Payment Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(feeStructure).map(([term, data]) => (
                <div key={term} className="space-y-4">
                  <h3 className="text-lg font-semibold capitalize">{term.replace('term', 'Term ')}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Installment 1</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(data.installment1.status)}
                          {getStatusBadge(data.installment1.status)}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Amount: ₦{data.installment1.amount.toLocaleString()}</span>
                        <span>Due: {new Date(data.installment1.dueDate).toLocaleDateString()}</span>
                      </div>
                      <Progress value={data.installment1.status === 'paid' ? 100 : 0} className="h-2" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Installment 2</span>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(data.installment2.status)}
                          {getStatusBadge(data.installment2.status)}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Amount: ₦{data.installment2.amount.toLocaleString()}</span>
                        <span>Due: {new Date(data.installment2.dueDate).toLocaleDateString()}</span>
                      </div>
                      <Progress value={data.installment2.status === 'paid' ? 100 : 0} className="h-2" />
                    </div>
                  </div>
                  <Separator />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3 mb-2">
                      <method.icon className="h-6 w-6 text-primary" />
                      <h4 className="font-medium">{method.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Notices */}
          <Card className="border-warning bg-warning/5 border-0 shadow-elevation">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <AlertTriangle className="h-6 w-6 text-warning mt-1" />
                <div>
                  <h3 className="font-semibold text-warning-foreground mb-2">Important Payment Information</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• All payments are processed securely through our payment gateway</li>
                    <li>• Late payments: 5% penalty per week on outstanding amount</li>
                    <li>• Early payment discount: 2% off when paid 30 days before due date</li>
                    <li>• Payment confirmations are sent via email and SMS</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Finance Office</p>
                    <p className="text-sm text-muted-foreground">+234 801 234 5678</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p className="text-sm text-muted-foreground">finance@darularkam.edu.ng</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Our support team is available Monday to Friday, 8:00 AM - 5:00 PM WAT.
              </p>
            </CardContent>
          </Card>

          {/* Proceed to Payment Button */}
          <div className="flex justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-8">
              Proceed to Payment
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}