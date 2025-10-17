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
  Inbox,
  Send,
  Bell,
  Plus,
  Search,
  Mail,
  MailOpen,
  Trash2,
  Archive,
  Star,
  Reply,
  Forward,
  Filter,
  Users
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface Message {
  id: string;
  subject: string;
  content: string;
  sender: {
    name: string;
    email: string;
    avatar?: string;
  };
  recipient: {
    name: string;
    email: string;
  } | null; // null for broadcast messages
  type: 'direct' | 'broadcast' | 'notification';
  priority: 'low' | 'medium' | 'high';
  status: 'unread' | 'read' | 'archived';
  timestamp: string;
  isStarred: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'low' | 'medium' | 'high';
  recipientCount: number;
  sentAt: string;
  status: 'sent' | 'scheduled' | 'failed';
}

export default function AdminMessages() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);
  const [isBroadcastDialogOpen, setIsBroadcastDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState({
    recipient: '',
    subject: '',
    content: '',
    priority: 'medium' as Message['priority']
  });
  const [newBroadcast, setNewBroadcast] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    priority: 'medium' as Notification['priority'],
    targetAudience: 'all'
  });

  // Mock data
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        subject: 'Request for School Transfer',
        content: 'Dear Admin, I would like to request a transfer for my child Ahmad from JSS1 to JSS2...',
        sender: {
          name: 'Fatima Abubakar',
          email: 'parent@example.com'
        },
        recipient: {
          name: 'Dr. Muhammad Sani',
          email: 'admin@darularqam.edu.ng'
        },
        type: 'direct',
        priority: 'medium',
        status: 'unread',
        timestamp: '2024-09-20T14:30:00Z',
        isStarred: false
      },
      {
        id: '2',
        subject: 'Monthly Attendance Report',
        content: 'Please find attached the monthly attendance report for September 2024...',
        sender: {
          name: 'Mrs. Fatima Ibrahim',
          email: 'teacher@darularqam.edu.ng'
        },
        recipient: {
          name: 'Dr. Muhammad Sani',
          email: 'admin@darularqam.edu.ng'
        },
        type: 'direct',
        priority: 'low',
        status: 'read',
        timestamp: '2024-09-19T09:15:00Z',
        isStarred: true
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'School Holiday Notice',
        message: 'School will be closed on Monday, September 23rd for Eid-el-Kabir celebrations.',
        type: 'info',
        priority: 'high',
        recipientCount: 245,
        sentAt: '2024-09-18T10:00:00Z',
        status: 'sent'
      },
      {
        id: '2',
        title: 'PTA Meeting Reminder',
        message: 'Parent-Teacher Association meeting scheduled for tomorrow at 4:00 PM.',
        type: 'warning',
        priority: 'medium',
        recipientCount: 150,
        sentAt: '2024-09-15T16:00:00Z',
        status: 'sent'
      }
    ];

    setMessages(mockMessages);
    setNotifications(mockNotifications);
  }, []);

  const handleSendMessage = () => {
    // TODO: Implement API call to send message
    console.log('Sending message:', newMessage);
    setIsComposeDialogOpen(false);
    setNewMessage({
      recipient: '',
      subject: '',
      content: '',
      priority: 'medium'
    });
  };

  const handleSendBroadcast = () => {
    // TODO: Implement API call to send broadcast
    console.log('Sending broadcast:', newBroadcast);
    setIsBroadcastDialogOpen(false);
    setNewBroadcast({
      title: '',
      message: '',
      type: 'info',
      priority: 'medium',
      targetAudience: 'all'
    });
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    ));
  };

  const handleStarMessage = (messageId: string) => {
    setMessages(messages.map(msg =>
      msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg
    ));
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'info': return 'default';
      case 'warning': return 'secondary';
      case 'success': return 'outline';
      case 'error': return 'destructive';
      default: return 'outline';
    }
  };

  const unreadCount = messages.filter(msg => msg.status === 'unread').length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Messages & Notifications</h1>
              <p className="text-muted-foreground">Manage inbox, sent items, and notifications</p>
            </div>
            <div className="flex gap-2">
              <Dialog open={isBroadcastDialogOpen} onOpenChange={setIsBroadcastDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Broadcast
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send Broadcast Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="broadcastTitle">Title</Label>
                      <Input
                        id="broadcastTitle"
                        value={newBroadcast.title}
                        onChange={(e) => setNewBroadcast({...newBroadcast, title: e.target.value})}
                        placeholder="Enter notification title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="broadcastMessage">Message</Label>
                      <Textarea
                        id="broadcastMessage"
                        value={newBroadcast.message}
                        onChange={(e) => setNewBroadcast({...newBroadcast, message: e.target.value})}
                        placeholder="Enter notification message"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="broadcastType">Type</Label>
                        <Select value={newBroadcast.type} onValueChange={(value: Notification['type']) => setNewBroadcast({...newBroadcast, type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="broadcastPriority">Priority</Label>
                        <Select value={newBroadcast.priority} onValueChange={(value: Notification['priority']) => setNewBroadcast({...newBroadcast, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
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
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Select value={newBroadcast.targetAudience} onValueChange={(value) => setNewBroadcast({...newBroadcast, targetAudience: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="students">Students Only</SelectItem>
                          <SelectItem value="teachers">Teachers Only</SelectItem>
                          <SelectItem value="parents">Parents Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsBroadcastDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendBroadcast}>
                        Send Broadcast
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Compose
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Compose Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="recipient">Recipient</Label>
                        <Input
                          id="recipient"
                          value={newMessage.recipient}
                          onChange={(e) => setNewMessage({...newMessage, recipient: e.target.value})}
                          placeholder="Enter recipient email"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={newMessage.priority} onValueChange={(value: Message['priority']) => setNewMessage({...newMessage, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
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
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={newMessage.subject}
                        onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                        placeholder="Enter message subject"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Message</Label>
                      <Textarea
                        id="content"
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                        placeholder="Enter your message"
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsComposeDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendMessage}>
                        Send Message
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Inbox className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Inbox</p>
                    <p className="text-2xl font-bold text-primary">{messages.length}</p>
                    {unreadCount > 0 && (
                      <p className="text-xs text-destructive">{unreadCount} unread</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success/10 rounded-full">
                    <Send className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sent</p>
                    <p className="text-2xl font-bold text-success">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning/10 rounded-full">
                    <Bell className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Notifications</p>
                    <p className="text-2xl font-bold text-warning">{notifications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <Star className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Starred</p>
                    <p className="text-2xl font-bold text-accent">
                      {messages.filter(m => m.isStarred).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="inbox" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Inbox {unreadCount > 0 && `(${unreadCount})`}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Sent
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Inbox Messages</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search messages..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sender</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {messages.map((message) => (
                        <TableRow
                          key={message.id}
                          className={message.status === 'unread' ? 'bg-muted/50' : ''}
                          onClick={() => setSelectedMessage(message)}
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {message.sender.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{message.sender.name}</div>
                                <div className="text-sm text-muted-foreground">{message.sender.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{message.subject}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {message.content}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium ${getPriorityColor(message.priority)}`}>
                              {message.priority.charAt(0).toUpperCase() + message.priority.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {new Date(message.timestamp).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={message.status === 'unread' ? 'default' : 'secondary'}>
                              {message.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStarMessage(message.id);
                                }}
                              >
                                <Star className={`h-4 w-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(message.id);
                                }}
                              >
                                {message.status === 'unread' ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteMessage(message.id);
                                }}
                              >
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

            <TabsContent value="sent" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Send className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Sent messages will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Sent At</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell>
                            <div className="font-medium">{notification.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {notification.message}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getTypeBadgeVariant(notification.type)}>
                              {notification.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{notification.recipientCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(notification.sentAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={notification.status === 'sent' ? 'default' : 'secondary'}>
                              {notification.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}