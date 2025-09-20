import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  Inbox,
  Archive,
  Trash2,
  Reply,
  ArrowLeft,
  ChevronRight,
  Mail,
  MailOpen,
  Clock,
  User
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

export default function Messages() {
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const messages = [
    {
      id: 1,
      sender: "Mr. Ahmed Hassan",
      senderRole: "Class Teacher (SS3 A)",
      subject: "Ahmad's Academic Performance Update",
      content: "Dear Mr. Musa,\n\nI hope this message finds you well. I wanted to update you on Ahmad's recent performance in class. He has shown significant improvement in Mathematics and has been actively participating in class discussions.\n\nHowever, I noticed he could benefit from additional practice in English comprehension. I recommend some extra reading at home.\n\nPlease let me know if you'd like to schedule a meeting to discuss this further.\n\nBest regards,\nMr. Ahmed Hassan",
      timestamp: "2024-01-20T10:30:00",
      isRead: false,
      priority: "normal",
      category: "academic"
    },
    {
      id: 2,
      sender: "Mrs. Fatima Abubakar",
      senderRole: "Class Teacher (JSS2 B)",
      subject: "Aisha's Participation in Science Fair",
      content: "Dear Parent,\n\nCongratulations! Aisha has been selected to participate in this year's Science Fair. Her project on 'Renewable Energy Sources' has been chosen as one of the top entries.\n\nThe Science Fair will be held on February 15th. We would appreciate your presence to support her.\n\nPlease confirm her participation by replying to this message.\n\nBest regards,\nMrs. Fatima Abubakar",
      timestamp: "2024-01-18T14:15:00",
      isRead: true,
      priority: "high",
      category: "achievement"
    },
    {
      id: 3,
      sender: "School Administration",
      senderRole: "Admin Office",
      subject: "Important: School Closure Notice",
      content: "Dear Parents,\n\nThis is to inform you that the school will be closed on January 25th due to the Parent-Teacher Meeting. Regular classes will resume on January 26th.\n\nThe Parent-Teacher Meeting will be held from 10:00 AM to 2:00 PM in the school auditorium.\n\nYour presence is highly appreciated.\n\nRegards,\nSchool Administration",
      timestamp: "2024-01-15T09:00:00",
      isRead: true,
      priority: "high",
      category: "announcement"
    },
    {
      id: 4,
      sender: "Mr. Ibrahim Musa",
      senderRole: "Sports Coordinator",
      subject: "Sports Day Registration",
      content: "Dear Mr. Musa,\n\nWe are excited to announce that Sports Day will be held on February 20th. Ahmad has shown interest in participating in the 100m dash and long jump events.\n\nPlease confirm his participation and let us know if he needs any special equipment.\n\nRegistration closes on February 1st.\n\nBest regards,\nMr. Ibrahim Musa",
      timestamp: "2024-01-12T16:45:00",
      isRead: false,
      priority: "normal",
      category: "sports"
    }
  ];

  const filteredMessages = messages.filter(message => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'read') return message.isRead;
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  const handleReply = () => {
    // In a real app, this would send the reply
    alert('Reply sent successfully!');
    setReplyText('');
  };

  const markAsRead = (id: number) => {
    // In a real app, this would update the message status
    console.log('Marking message as read:', id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'normal': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'achievement': return 'bg-green-100 text-green-800';
      case 'announcement': return 'bg-purple-100 text-purple-800';
      case 'sports': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                <BreadcrumbPage>Messages</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Messages</h1>
              <p className="text-muted-foreground">
                Communicate with teachers and school administration.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/parent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Message Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Inbox className="h-6 w-6 text-white" />
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
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <Mail className="h-6 w-6 text-white" />
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
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">This Week</p>
                    <p className="text-2xl font-bold text-primary">
                      {messages.filter(m => {
                        const messageDate = new Date(m.timestamp);
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return messageDate >= weekAgo;
                      }).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-success rounded-full">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sent</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Message List */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Inbox</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                      >
                        All
                      </Button>
                      <Button
                        variant={filter === 'unread' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('unread')}
                      >
                        Unread ({unreadCount})
                      </Button>
                      <Button
                        variant={filter === 'read' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('read')}
                      >
                        Read
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          selectedMessage === message.id
                            ? 'bg-primary/10 border border-primary/20'
                            : 'bg-muted/50 hover:bg-muted'
                        } ${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}
                        onClick={() => {
                          setSelectedMessage(message.id);
                          if (!message.isRead) markAsRead(message.id);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={`/placeholder-avatar-${message.id}.jpg`} />
                              <AvatarFallback>
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h3 className={`font-medium truncate ${!message.isRead ? 'text-primary' : 'text-foreground'}`}>
                                  {message.sender}
                                </h3>
                                <Badge variant="outline" className="text-xs">
                                  {message.senderRole}
                                </Badge>
                                <Badge className={`text-xs ${getCategoryColor(message.category)}`}>
                                  {message.category}
                                </Badge>
                              </div>
                              <p className={`text-sm truncate ${!message.isRead ? 'font-medium' : ''}`}>
                                {message.subject}
                              </p>
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {message.content.split('\n')[0]}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleDateString()}
                            </span>
                            {!message.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Detail */}
            <div className="lg:col-span-1">
              {selectedMessage ? (
                <Card className="border-0 shadow-elevation">
                  <CardHeader>
                    <CardTitle className="text-lg">Message Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const message = messages.find(m => m.id === selectedMessage);
                      if (!message) return null;

                      return (
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-primary">{message.subject}</h3>
                            <div className="flex items-center space-x-2 mt-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={`/placeholder-avatar-${message.id}.jpg`} />
                                <AvatarFallback>
                                  {message.sender.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{message.sender}</p>
                                <p className="text-xs text-muted-foreground">{message.senderRole}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(message.timestamp).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="bg-muted/50 p-3 rounded-lg">
                            <pre className="text-sm whitespace-pre-wrap">{message.content}</pre>
                          </div>

                          <div className="space-y-3">
                            <Textarea
                              placeholder="Type your reply..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={4}
                            />
                            <Button onClick={handleReply} className="w-full">
                              <Send className="h-4 w-4 mr-2" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-elevation">
                  <CardContent className="p-6 text-center">
                    <MailOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a message to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}