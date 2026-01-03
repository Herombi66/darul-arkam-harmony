import { useEffect, useMemo, useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getThreads, getThread, createThread, sendToThread, searchMessages, flagMessage, unflagMessage, archiveThread, unarchiveThread, getSocket, startTyping, stopTyping, type Thread, type Message as Msg } from '@/services/messages';
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

type Message = Msg

export default function TeacherMessages() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [composeRecipientRole, setComposeRecipientRole] = useState<'admin' | 'parent' | 'teacher' | 'student' | null>(null);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const unreadCount = messages.filter(m => !m.read_at && m.to_user_id === user?.id).length;
  const starredCount = 0;

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: <Badge variant="outline" className="bg-purple-100 text-purple-800">Admin</Badge>,
      parent: <Badge variant="outline" className="bg-blue-100 text-blue-800">Parent</Badge>,
      teacher: <Badge variant="outline" className="bg-green-100 text-green-800">Teacher</Badge>,
      student: <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Student</Badge>
    };
    return badges[role as keyof typeof badges];
  };

  const filteredMessages = useMemo(() => {
    if (!searchTerm) return messages;
    return messages.filter(msg =>
      (msg.subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (msg.content || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [messages, searchTerm]);

  useEffect(() => {
    if (!token) return;
    getThreads(token).then((rows) => { setThreads(rows); if (!selectedThreadId && rows.length) setSelectedThreadId(rows[0].id); }).catch((e) => toast({ title: 'Failed to load threads', description: e.message, variant: 'destructive' }));
  }, [token]);

  useEffect(() => {
    if (!token || !selectedThreadId) return;
    getThread(token, selectedThreadId).then((res) => setMessages(res.messages)).catch((e) => toast({ title: 'Failed to load thread', description: e.message, variant: 'destructive' }));
  }, [token, selectedThreadId]);

  useEffect(() => {
    const socket = getSocket();
    if (user?.id) socket.emit('joinUser', user.id);
    const msgHandler = (payload: { threadId: string; message: Message }) => {
      if (payload.threadId === selectedThreadId) setMessages((prev) => [...prev, payload.message]);
    };
    const typingHandler = (payload: { threadId: string; userId: string; typing: boolean }) => {
      if (payload.threadId === selectedThreadId && payload.userId !== user?.id) setIsTyping(payload.typing);
    };
    socket.on('message', msgHandler);
    socket.on('typing', typingHandler);
    return () => { socket.off('message', msgHandler); socket.off('typing', typingHandler); };
  }, [selectedThreadId, user?.id]);

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
                        <Select onValueChange={(v) => setComposeRecipientRole(v as any)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select recipient" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">School Administration</SelectItem>
                            <SelectItem value="parent">Parent</SelectItem>
                            <SelectItem value="teacher">Fellow Teacher</SelectItem>
                            <SelectItem value="student">Student</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Subject</label>
                        <Input placeholder="Enter message subject" value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Message</label>
                        <Textarea 
                          placeholder="Type your message here..."
                          rows={8}
                          value={composeBody}
                          onChange={(e) => { setComposeBody(e.target.value); if (selectedThreadId && user?.id) startTyping(selectedThreadId, user.id); }}
                          onBlur={() => { if (selectedThreadId && user?.id) stopTyping(selectedThreadId, user.id); }}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={async () => {
                          if (!token || !composeRecipientRole || !user?.id || !composeBody.trim()) return;
                          try {
                            const threadId = await createThread(token, composeSubject || null, [{ id: user.id, role: 'teacher' }, { id: `${composeRecipientRole}-demo`, role: composeRecipientRole }]);
                            setSelectedThreadId(threadId);
                            const sent = await sendToThread(token, threadId, composeSubject || null, composeBody.trim());
                            if (!Array.isArray(sent)) setMessages((prev) => [...prev, sent]);
                            setComposeBody('');
                            setIsComposeOpen(false);
                          } catch (e: any) { toast({ title: 'Send failed', description: e.message, variant: 'destructive' }) }
                        }}>
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
              {isTyping && <div className="text-xs text-muted-foreground">Recipient is typing…</div>}
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
                        !message.read_at ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => setSelectedMessage(message)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <Avatar>
                            <AvatarFallback>
                              M
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className={`font-medium ${!message.read_at ? 'text-primary' : ''}`}>
                                {message.subject || 'Conversation'}
                              </h4>
                              <Badge variant="outline" className="bg-green-100 text-green-800">Thread</Badge>
                            </div>
                            <h5 className={`text-sm mb-1 ${!message.read ? 'font-semibold' : ''}`}>
                              {message.subject}
                            </h5>
                            <p className="text-sm text-muted-foreground">{message.content}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {new Date(message.created_at).toLocaleTimeString()}
                              </div>
                              <span>{new Date(message.created_at).toLocaleDateString()}</span>
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
                        M
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{selectedMessage.subject || 'Conversation'}</h4>
                        <Badge variant="outline">Message</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p>{selectedMessage.content}</p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={async () => { if (!token) return; try { await archiveThread(token, selectedThreadId!); toast({ title: 'Archived' }); } catch (e:any) { toast({ title: 'Archive failed', description: e.message, variant: 'destructive' }) } }}>
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </Button>
                    <Button onClick={async () => { if (!token || !selectedThreadId) return; try { const sent = await sendToThread(token, selectedThreadId, selectedMessage.subject || null, 'Thanks for your message'); if (!Array.isArray(sent)) setMessages((prev) => [...prev, sent]); } catch (e:any) { toast({ title: 'Reply failed', description: e.message, variant: 'destructive' }) } }}>
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
