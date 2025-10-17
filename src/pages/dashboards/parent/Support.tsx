import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowLeft,
  ChevronRight,
  Search,
  FileText,
  Users,
  CreditCard
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

export default function Support() {
  const [searchTerm, setSearchTerm] = useState('');
  const [supportForm, setSupportForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'normal'
  });

  const faqs = [
    {
      id: 1,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'You can update your profile information by navigating to the Profile section in your dashboard. Click on the "Edit Profile" button to modify your personal details, contact information, and preferences.'
    },
    {
      id: 2,
      category: 'payments',
      question: 'How do I make school fee payments?',
      answer: 'You can make payments through the Payments section. Click on "Make Payment" to access various payment options including online banking, card payments, and bank transfers. All transactions are secure and receipts are provided instantly.'
    },
    {
      id: 3,
      category: 'academic',
      question: 'How can I view my child\'s academic performance?',
      answer: 'Academic performance can be viewed in the Children section. Click on "View Details" for each child to see their grades, attendance records, assignments, and progress reports.'
    },
    {
      id: 4,
      category: 'communication',
      question: 'How do I contact my child\'s teacher?',
      answer: 'You can contact teachers through the Messages section. Select the appropriate child and click "Message Teacher" to send direct messages to class teachers and subject coordinators.'
    },
    {
      id: 5,
      category: 'events',
      question: 'How do I stay updated with school events?',
      answer: 'All school events are listed in the Events section. You can view upcoming events, add them to your calendar, and receive notifications about important dates and activities.'
    },
    {
      id: 6,
      category: 'technical',
      question: 'What should I do if I forget my password?',
      answer: 'Click on the "Forgot Password" link on the login page. Enter your registered email address and follow the instructions sent to reset your password. Contact support if you don\'t receive the email.'
    },
    {
      id: 7,
      category: 'payments',
      question: 'Can I get a refund for overpayments?',
      answer: 'Refunds for overpayments are processed within 5-7 business days. Contact the finance office through this support form or call our helpline for assistance with refund requests.'
    },
    {
      id: 8,
      category: 'account',
      question: 'How do I add or remove children from my account?',
      answer: 'To add or remove children, please contact the school administration office. They will verify the request and update your account accordingly. This cannot be done through the parent portal.'
    }
  ];

  const supportCategories = [
    { value: 'account', label: 'Account & Profile', icon: Users },
    { value: 'payments', label: 'Payments & Billing', icon: CreditCard },
    { value: 'academic', label: 'Academic Records', icon: FileText },
    { value: 'technical', label: 'Technical Support', icon: HelpCircle },
    { value: 'other', label: 'Other', icon: MessageSquare }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would submit the support ticket
    alert('Support ticket submitted successfully! We will get back to you within 24 hours.');
    setSupportForm({ category: '', subject: '', message: '', priority: 'normal' });
  };

  const getCategoryIcon = (category: string) => {
    const cat = supportCategories.find(c => c.value === category);
    return cat?.icon || HelpCircle;
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
                <BreadcrumbPage>Support</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Support Center</h1>
              <p className="text-muted-foreground">
                Find answers to common questions or contact our support team.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/parent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Quick Contact Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Support</p>
                    <p className="text-lg font-semibold text-primary">+234 801 234 5678</p>
                    <p className="text-xs text-muted-foreground">Mon-Fri, 8AM-5PM</p>
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
                    <p className="text-lg font-semibold text-primary">support@darularqam.edu.ng</p>
                    <p className="text-xs text-muted-foreground">24/7 response</p>
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
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-lg font-semibold text-primary">Within 24 hours</p>
                    <p className="text-xs text-muted-foreground">For urgent issues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* FAQ Section */}
            <Card className="border-0 shadow-elevation">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Frequently Asked Questions
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`item-${faq.id}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-start space-x-2">
                          {React.createElement(getCategoryIcon(faq.category), { className: "h-4 w-4 mt-1 text-muted-foreground" })}
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground pl-6">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                {filteredFaqs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No FAQs found matching your search.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Support Form */}
            <Card className="border-0 shadow-elevation">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={supportForm.category}
                      onValueChange={(value) => setSupportForm({...supportForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {supportCategories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center space-x-2">
                              {React.createElement(category.icon, { className: "h-4 w-4" })}
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={supportForm.priority}
                      onValueChange={(value) => setSupportForm({...supportForm, priority: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="normal">Normal - Standard support</SelectItem>
                        <SelectItem value="high">High - Urgent issue</SelectItem>
                        <SelectItem value="critical">Critical - System down</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your issue..."
                      value={supportForm.message}
                      onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                      rows={6}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Support Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}