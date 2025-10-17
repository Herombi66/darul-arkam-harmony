import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Clock, CheckCircle, HelpCircle, Book, User } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useToast } from '@/hooks/use-toast';

export default function StudentSupport() {
  const { toast } = useToast();

  const tickets = [
    { id: 'TKT001', subject: 'Login Issue', category: 'Technical', status: 'open', date: '2024-01-20', priority: 'high' },
    { id: 'TKT002', subject: 'Grade Query', category: 'Academic', status: 'resolved', date: '2024-01-18', priority: 'medium' },
    { id: 'TKT003', subject: 'Fee Receipt', category: 'Financial', status: 'pending', date: '2024-01-15', priority: 'low' }
  ];

  const faqs = [
    { question: 'How do I reset my password?', answer: 'Go to login page and click "Forgot Password"' },
    { question: 'How to check my results?', answer: 'Navigate to Academics > Results section' },
    { question: 'How to pay school fees?', answer: 'Go to Payments > Pay Fees section' }
  ];

  const handleSubmit = () => {
    toast({
      title: "Ticket Created",
      description: "Your support ticket has been submitted successfully",
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Support</h1>
            <p className="text-muted-foreground">Get help and submit support tickets</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Create Support Ticket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Category</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Subject</Label>
                    <Input placeholder="Brief description of your issue" />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Provide detailed information about your issue..." rows={5} />
                  </div>

                  <Button className="w-full" onClick={handleSubmit}>
                    Submit Ticket
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">My Tickets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <div key={ticket.id} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="font-medium">{ticket.id}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ticket.status === 'open' ? 'bg-warning/20 text-warning' :
                              ticket.status === 'resolved' ? 'bg-success/20 text-success' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">{ticket.date}</span>
                        </div>
                        <p className="font-medium mb-1">{ticket.subject}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{ticket.category}</span>
                          <span>•</span>
                          <span className="capitalize">{ticket.priority} priority</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Book className="h-4 w-4 mr-2" />
                    User Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    FAQs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Contact Admin
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Ticket Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm">Open</span>
                    </div>
                    <span className="font-bold">1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Resolved</span>
                    </div>
                    <span className="font-bold">1</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Total</span>
                    </div>
                    <span className="font-bold">3</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">FAQs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm mb-1">{faq.question}</p>
                      <p className="text-xs text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
