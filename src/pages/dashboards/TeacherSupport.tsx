import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  HelpCircle,
  MessageSquare,
  FileText,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  date: string;
  description: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    subject: 'Unable to submit student grades',
    category: 'Technical',
    status: 'in-progress',
    priority: 'high',
    date: '2024-01-20',
    description: 'The grade submission form is not working properly'
  },
  {
    id: 'TKT-002',
    subject: 'Request for new classroom materials',
    category: 'Resources',
    status: 'open',
    priority: 'medium',
    date: '2024-01-18',
    description: 'Need new textbooks for Mathematics class'
  },
  {
    id: 'TKT-003',
    subject: 'Attendance system question',
    category: 'General',
    status: 'resolved',
    priority: 'low',
    date: '2024-01-15',
    description: 'How to mark attendance for multiple classes'
  }
];

const faqs = [
  {
    question: 'How do I submit student grades?',
    answer: 'Navigate to your subject page, click on the class, and use the grade submission form. Make sure to save your changes before exiting.'
  },
  {
    question: 'How can I request leave?',
    answer: 'Go to your profile, select "Leave Request" and fill out the form with your leave dates and reason. Your request will be reviewed by the administration.'
  },
  {
    question: 'How do I communicate with parents?',
    answer: 'Use the Messages section to send messages to parents. You can also schedule parent-teacher meetings through the Events calendar.'
  },
  {
    question: 'Where can I find teaching resources?',
    answer: 'Teaching resources are available in the Resources section. You can also request new materials through the Support system.'
  },
  {
    question: 'How do I mark attendance?',
    answer: 'Go to Attendance section, select your class and date, then mark students as present or absent. Remember to save the attendance record.'
  },
  {
    question: 'How can I update my profile information?',
    answer: 'Click on your profile in the sidebar, then select "Edit Profile" to update your contact information and other details.'
  }
];

export default function TeacherSupport() {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const badges = {
      open: <Badge className="bg-warning text-white"><Clock className="h-3 w-3 mr-1" />Open</Badge>,
      'in-progress': <Badge className="bg-blue-500 text-white"><AlertCircle className="h-3 w-3 mr-1" />In Progress</Badge>,
      resolved: <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" />Resolved</Badge>
    };
    return badges[status as keyof typeof badges];
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      low: <Badge variant="outline">Low</Badge>,
      medium: <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>,
      high: <Badge variant="outline" className="bg-red-100 text-red-800">High</Badge>
    };
    return badges[priority as keyof typeof badges];
  };

  const openTickets = tickets.filter(t => t.status !== 'resolved').length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Support Center</h1>
                <p className="text-muted-foreground">
                  Get help with technical issues and general inquiries
                </p>
              </div>
              <Button asChild variant="outline">
                <Link to="/dashboard/teacher">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Support</p>
                    <p className="font-semibold text-primary">+234 800 123 4567</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Support</p>
                    <p className="font-semibold text-primary">support@school.edu</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-accent rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Working Hours</p>
                    <p className="font-semibold text-primary">8 AM - 5 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* FAQs */}
            <Card className="border-0 shadow-elevation">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Create Ticket */}
            <Card className="border-0 shadow-elevation">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Can't find what you're looking for? Submit a support ticket and our team will get back to you as soon as possible.
                  </p>
                  <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Send className="h-4 w-4 mr-2" />
                        Submit Support Ticket
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create Support Ticket</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technical">Technical Issue</SelectItem>
                                <SelectItem value="resources">Resource Request</SelectItem>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Input placeholder="Brief description of your issue" />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea 
                            placeholder="Please provide detailed information about your issue or request..."
                            rows={6}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsNewTicketOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsNewTicketOpen(false)}>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Ticket
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Your Open Tickets</h4>
                      <Badge>{openTickets}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You have {openTickets} open support {openTickets === 1 ? 'ticket' : 'tickets'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Tickets */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                My Support Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium">{ticket.subject}</h4>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <span>Ticket ID: {ticket.id}</span>
                          <span>Category: {ticket.category}</span>
                          <span>Created: {ticket.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
