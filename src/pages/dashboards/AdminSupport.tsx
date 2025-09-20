import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  HelpCircle,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  User,
  Search,
  Filter,
  Plus,
  Reply,
  Archive,
  Trash2,
  FileText,
  Phone,
  Mail,
  DollarSign
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'academic' | 'administrative' | 'financial' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  requester: {
    name: string;
    email: string;
    role: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  responses: TicketResponse[];
}

interface TicketResponse {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
  isInternal: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  views: number;
  helpful: number;
}

export default function AdminSupport() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [newResponse, setNewResponse] = useState('');
  const [isInternalResponse, setIsInternalResponse] = useState(false);

  // Mock data
  useEffect(() => {
    const mockTickets: SupportTicket[] = [
      {
        id: '1',
        title: 'Cannot access student portal',
        description: 'I am unable to log into the student portal. Getting error message "Invalid credentials" even though I\'m using the correct password.',
        category: 'technical',
        priority: 'high',
        status: 'in_progress',
        requester: {
          name: 'Ahmad Muhammad',
          email: 'student@darularqam.edu.ng',
          role: 'student'
        },
        assignedTo: {
          name: 'Dr. Muhammad Sani',
          email: 'admin@darularqam.edu.ng'
        },
        createdAt: '2024-09-19T10:30:00Z',
        updatedAt: '2024-09-20T09:15:00Z',
        responses: [
          {
            id: '1',
            content: 'Thank you for reporting this issue. I\'m investigating the login problem. Could you please confirm which browser you\'re using?',
            author: {
              name: 'Dr. Muhammad Sani',
              email: 'admin@darularqam.edu.ng'
            },
            createdAt: '2024-09-19T11:00:00Z',
            isInternal: false
          }
        ]
      },
      {
        id: '2',
        title: 'Request for grade correction',
        description: 'I believe there\'s an error in my child\'s mathematics grade for the first term. The recorded score doesn\'t match the assignment grades.',
        category: 'academic',
        priority: 'medium',
        status: 'open',
        requester: {
          name: 'Fatima Abubakar',
          email: 'parent@example.com',
          role: 'parent'
        },
        createdAt: '2024-09-18T14:20:00Z',
        updatedAt: '2024-09-18T14:20:00Z',
        responses: []
      },
      {
        id: '3',
        title: 'Payment confirmation not received',
        description: 'I made a school fees payment yesterday but haven\'t received any confirmation email or receipt.',
        category: 'financial',
        priority: 'medium',
        status: 'resolved',
        requester: {
          name: 'Ibrahim Musa',
          email: 'parent2@example.com',
          role: 'parent'
        },
        assignedTo: {
          name: 'Finance Officer',
          email: 'finance@darularqam.edu.ng'
        },
        createdAt: '2024-09-15T16:45:00Z',
        updatedAt: '2024-09-16T10:30:00Z',
        responses: [
          {
            id: '2',
            content: 'Your payment has been confirmed and processed. The confirmation email should arrive shortly. Please check your spam folder if you don\'t see it.',
            author: {
              name: 'Finance Officer',
              email: 'finance@darularqam.edu.ng'
            },
            createdAt: '2024-09-16T10:30:00Z',
            isInternal: false
          }
        ]
      }
    ];

    const mockFaqs: FAQ[] = [
      {
        id: '1',
        question: 'How do I reset my password?',
        answer: 'To reset your password, click on "Forgot Password" on the login page and follow the instructions sent to your email.',
        category: 'Technical',
        views: 245,
        helpful: 189
      },
      {
        id: '2',
        question: 'How to view my child\'s grades?',
        answer: 'Parents can view their children\'s grades by logging into the parent portal and navigating to the "Academic Records" section.',
        category: 'Academic',
        views: 156,
        helpful: 134
      }
    ];

    setTickets(mockTickets);
    setFaqs(mockFaqs);
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusChange = (ticketId: string, newStatus: SupportTicket['status']) => {
    setTickets(tickets.map(ticket =>
      ticket.id === ticketId ? { ...ticket, status: newStatus, updatedAt: new Date().toISOString() } : ticket
    ));
  };

  const handleAddResponse = () => {
    if (!selectedTicket || !newResponse.trim()) return;

    const response: TicketResponse = {
      id: Date.now().toString(),
      content: newResponse,
      author: {
        name: 'Dr. Muhammad Sani',
        email: 'admin@darularqam.edu.ng'
      },
      createdAt: new Date().toISOString(),
      isInternal: isInternalResponse
    };

    setTickets(tickets.map(ticket =>
      ticket.id === selectedTicket.id
        ? { ...ticket, responses: [...ticket.responses, response], updatedAt: new Date().toISOString() }
        : ticket
    ));

    setNewResponse('');
    setIsResponseDialogOpen(false);
    setIsInternalResponse(false);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'outline';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-destructive';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <AlertCircle className="h-4 w-4" />;
      case 'academic': return <FileText className="h-4 w-4" />;
      case 'administrative': return <User className="h-4 w-4" />;
      case 'financial': return <DollarSign className="h-4 w-4" />;
      default: return <HelpCircle className="h-4 w-4" />;
    }
  };

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedToday = tickets.filter(t => t.status === 'resolved' && new Date(t.updatedAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Support Center</h1>
              <p className="text-muted-foreground">Manage support tickets and helpdesk functionality</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create FAQ
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <HelpCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Open Tickets</p>
                    <p className="text-2xl font-bold text-primary">{openTickets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Resolved Today</p>
                    <p className="text-2xl font-bold text-success">{resolvedToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning/10 rounded-full">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Response Time</p>
                    <p className="text-2xl font-bold text-warning">2.4h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <MessageSquare className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tickets</p>
                    <p className="text-2xl font-bold text-accent">{tickets.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
              <TabsTrigger value="faq">FAQ Management</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="tickets" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Support Tickets</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search tickets..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="academic">Academic</SelectItem>
                          <SelectItem value="administrative">Administrative</SelectItem>
                          <SelectItem value="financial">Financial</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticket</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} onClick={() => setSelectedTicket(ticket)}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{ticket.title}</div>
                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {ticket.description}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {ticket.requester.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{ticket.requester.name}</div>
                                <div className="text-xs text-muted-foreground">{ticket.requester.role}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(ticket.category)}
                              <span className="text-sm capitalize">{ticket.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                              {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(ticket.status)}>
                              {ticket.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={ticket.status}
                                onValueChange={(value: SupportTicket['status']) => handleStatusChange(ticket.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTicket(ticket);
                                  setIsResponseDialogOpen(true);
                                }}
                              >
                                <Reply className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Ticket Detail Dialog */}
              {selectedTicket && (
                <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{selectedTicket.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Badge variant={getStatusBadgeVariant(selectedTicket.status)}>
                            {selectedTicket.status.replace('_', ' ')}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                            {selectedTicket.priority} priority
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {selectedTicket.category}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Created {new Date(selectedTicket.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Avatar>
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>
                              {selectedTicket.requester.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{selectedTicket.requester.name}</div>
                            <div className="text-sm text-muted-foreground">{selectedTicket.requester.email}</div>
                          </div>
                        </div>
                        <p className="text-sm">{selectedTicket.description}</p>
                      </div>

                      {/* Responses */}
                      <div className="space-y-4">
                        <h3 className="font-medium">Responses ({selectedTicket.responses.length})</h3>
                        {selectedTicket.responses.map((response) => (
                          <div key={response.id} className="border rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {response.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">{response.author.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(response.createdAt).toLocaleString()}
                                  {response.isInternal && ' (Internal)'}
                                </div>
                              </div>
                            </div>
                            <p className="text-sm">{response.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Response Dialog */}
              <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Response</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="response">Response</Label>
                      <Textarea
                        id="response"
                        value={newResponse}
                        onChange={(e) => setNewResponse(e.target.value)}
                        placeholder="Enter your response..."
                        rows={4}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="internal"
                        checked={isInternalResponse}
                        onChange={(e) => setIsInternalResponse(e.target.checked)}
                      />
                      <Label htmlFor="internal" className="text-sm">Internal note (not visible to requester)</Label>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsResponseDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddResponse}>
                        Add Response
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>FAQ Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Question</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead>Helpful</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {faqs.map((faq) => (
                        <TableRow key={faq.id}>
                          <TableCell>
                            <div className="font-medium">{faq.question}</div>
                            <div className="text-sm text-muted-foreground line-clamp-2">
                              {faq.answer}
                            </div>
                          </TableCell>
                          <TableCell>{faq.category}</TableCell>
                          <TableCell>{faq.views}</TableCell>
                          <TableCell>{faq.helpful}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
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
                    <CardTitle>Tickets by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {['technical', 'academic', 'administrative', 'financial', 'other'].map((category) => {
                        const count = tickets.filter(t => t.category === category).length;
                        return (
                          <div key={category} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(category)}
                              <span className="text-sm capitalize">{category}</span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">2.4h</div>
                        <p className="text-sm text-muted-foreground">Average response time</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-success">1.8h</div>
                        <p className="text-sm text-muted-foreground">This month</p>
                      </div>
                    </div>
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