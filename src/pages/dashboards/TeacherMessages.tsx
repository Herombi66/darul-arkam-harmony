import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Mail,
  Send,
  Inbox,
  Archive,
  Star,
  Search,
  ArrowLeft,
  Clock,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  sender: string;
  senderRole: 'admin' | 'parent' | 'teacher' | 'student';
  subject: string;
  preview: string;
  content: string;
  date: string;
  time: string;
  read: boolean;
  starred: boolean;
  category: 'inbox' | 'sent' | 'archived';
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'Principal Office',
    senderRole: 'admin',
    subject: 'Staff Meeting Tomorrow',
    preview: 'Reminder about the staff meeting scheduled for tomorrow at 10 AM...',
    content: 'This is to remind all teaching staff about tomorrow\'s meeting at 10 AM in the staff room. Please ensure attendance.',
    date: '2024-01-20',
    time: '2:30 PM',
    read: false,
    starred: true,
    category: 'inbox'
  },
  {
    id: '2',
    sender: 'Mrs. Aisha Mohammed',
    senderRole: 'parent',
    subject: 'Question about my child\'s performance',
    preview: 'I would like to discuss my child\'s recent test scores...',
    content: 'Good afternoon. I noticed my child Ahmad scored lower than usual in the last Mathematics test. Could we schedule a meeting to discuss this?',
    date: '2024-01-19',
    time: '4:15 PM',
    read: false,
    starred: false,
    category: 'inbox'
  },
  {
    id: '3',
    sender: 'Mr. Usman Kano',
    senderRole: 'teacher',
    subject: 'Collaboration on Science Fair',
    preview: 'Would you be interested in collaborating for the upcoming science fair...',
    content: 'Hi colleague! I\'m organizing the science fair and would love your input on the Mathematics section. Can we meet this week?',
    date: '2024-01-18',
    time: '11:20 AM',
    read: true,
    starred: false,
    category: 'inbox'
  },
  {
    id: '4',
    sender: 'Fatima Ibrahim',
    senderRole: 'student',
    subject: 'Request for Extra Classes',
    preview: 'I\'m struggling with quadratic equations and would like extra help...',
    content: 'Dear Teacher, I find the quadratic equations topic challenging. Would it be possible to have extra classes after school?',
    date: '2024-01-17',
    time: '9:45 AM',
    read: true,
    starred: true,
    category: 'inbox'
  },
  {
    id: '5',
    sender: 'Exams Office',
    senderRole: 'admin',
    subject: 'Result Submission Deadline',
    preview: 'Final reminder: Results must be submitted by January 30th...',
    content: 'This is the final reminder that all end-of-term results must be submitted to the Exams Office by January 30th, 2024.',
    date: '2024-01-16',
    time: '3:00 PM',
    read: true,
    starred: false,
    category: 'inbox'
  }
];

export default function TeacherMessages() {
  const [messages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = messages.filter(m => !m.read && m.category === 'inbox').length;
  const starredCount = messages.filter(m => m.starred).length;

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: <Badge variant="outline" className="bg-purple-100 text-purple-800">Admin</Badge>,
      parent: <Badge variant="outline" className="bg-blue-100 text-blue-800">Parent</Badge>,
      teacher: <Badge variant="outline" className="bg-green-100 text-green-800">Teacher</Badge>,
      student: <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Student</Badge>
    };
    return badges[role as keyof typeof badges];
  };

  const filteredMessages = messages.filter(msg =>
    msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Messages</h1>
                <p className="text-muted-foreground">
                  Communicate with admin, parents, and colleagues
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Compose
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>New Message</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">School Administration</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="teacher">Fellow Teacher</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Enter message subject" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea 
                          placeholder="Type your message here..."
                          rows={8}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsComposeOpen(false)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button asChild variant="outline">
                  <Link to="/dashboard/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Messages</p>
                    <p className="text-2xl font-bold text-primary">{messages.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning rounded-full">
                    <Inbox className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unread</p>
                    <p className="text-2xl font-bold text-primary">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-accent rounded-full">
                    <Star className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Starred</p>
                    <p className="text-2xl font-bold text-primary">{starredCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success rounded-full">
                    <Archive className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Archived</p>
                    <p className="text-2xl font-bold text-primary">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-elevation">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Inbox</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
                  <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                  <TabsTrigger value="starred">Starred ({starredCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6 space-y-3">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                        !message.read ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar>
                            <AvatarFallback>
                              {message.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`font-medium ${!message.read ? 'text-primary' : ''}`}>
                                {message.sender}
                              </h4>
                              {getRoleBadge(message.senderRole)}
                              {message.starred && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}
                            </div>
                            <h5 className={`text-sm mb-1 ${!message.read ? 'font-semibold' : ''}`}>
                              {message.subject}
                            </h5>
                            <p className="text-sm text-muted-foreground">{message.preview}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {message.time}
                              </div>
                              <span>{message.date}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="unread">
                  <div className="text-center py-8 text-muted-foreground">
                    Filter: Unread messages
                  </div>
                </TabsContent>

                <TabsContent value="starred">
                  <div className="text-center py-8 text-muted-foreground">
                    Filter: Starred messages
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Message Dialog */}
          {selectedMessage && (
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{selectedMessage.subject}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedMessage.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{selectedMessage.sender}</h4>
                        {getRoleBadge(selectedMessage.senderRole)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.date} at {selectedMessage.time}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p>{selectedMessage.content}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button>
                      <Send className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </main>
    </div>
  );
}
