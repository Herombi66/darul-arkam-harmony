import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { getThreads, getThread, sendMessage, markRead, getSocket, type Thread, type Message, getActiveUsers, setOnline, setOffline, type PresenceUser } from '@/services/messages';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function StudentMessages() {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messagesState, setMessagesState] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [threadsLoading, setThreadsLoading] = useState(false);
  const [threadsError, setThreadsError] = useState<string | null>(null);
  const [threadLoading, setThreadLoading] = useState(false);
  const [threadError, setThreadError] = useState<string | null>(null);
  const [activeTeachers, setActiveTeachers] = useState<PresenceUser[]>([])
  const [activeClassmates, setActiveClassmates] = useState<PresenceUser[]>([])
  const [unreadByThread, setUnreadByThread] = useState<Record<string, number>>({})

  const reloadThreads = async () => {
    if (!token) {
      setThreadsError('Authentication required');
      return;
    }
    try {
      setThreadsLoading(true);
      setThreadsError(null);
      const rows = await getThreads(token);
      setThreads(rows);
      if (!selectedThreadId && rows.length) setSelectedThreadId(rows[0].id);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load threads';
      setThreadsError(msg);
      console.error('Thread load error', e);
      toast({ title: 'Failed to load threads', description: msg, variant: 'destructive' });
    } finally {
      setThreadsLoading(false);
    }
  };

  useEffect(() => {
    reloadThreads();
  }, [token]);

  const reloadThread = async (id?: string) => {
    const tid = id ?? selectedThreadId;
    if (!token || !tid) return;
    try {
      setThreadLoading(true);
      setThreadError(null);
      const res = await getThread(token, tid);
      setMessagesState(res.messages);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load thread';
      setThreadError(msg);
      console.error('Thread load error', e);
      toast({ title: 'Failed to load thread', description: msg, variant: 'destructive' });
    } finally {
      setThreadLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !selectedThreadId) return;
    reloadThread(selectedThreadId);
  }, [token, selectedThreadId]);

  useEffect(() => {
    const socket = getSocket();
    if (user?.id) socket.emit('joinUser', user.id);
    if (token && user?.id && user?.role) setOnline(token, undefined).catch(() => {})
    const handler = (payload: { threadId: string; message: Message }) => {
      const isSelected = payload.threadId === selectedThreadId
      if (isSelected) {
        setMessagesState((prev) => [...prev, payload.message])
      } else {
        setUnreadByThread((prev) => ({ ...prev, [payload.threadId]: (prev[payload.threadId] || 0) + 1 }))
      }
      setThreads((prev) => {
        const idx = prev.findIndex(t => t.id === payload.threadId)
        if (idx === -1) return prev
        const updated = [...prev]
        const [item] = updated.splice(idx, 1)
        updated.unshift({ ...item, last_message_at: new Date().toISOString() })
        return updated
      })
    };
    socket.on('message', handler);
    const presenceHandler = (p: { userId: string; role?: string; classId?: string; is_online: boolean; last_seen?: string }) => {
      setActiveTeachers((prev) => p.role === 'teacher' ? updatePresenceList(prev, p) : prev)
      setActiveClassmates((prev) => p.role === 'student' ? updatePresenceList(prev, p) : prev)
    }
    socket.on('presence:update', presenceHandler)
    const statusHandler = (payload: { messageId: string; delivered?: boolean; read?: boolean }) => {
      setMessagesState((prev) => prev.map((m) => m.id === payload.messageId ? { ...m, delivered_at: payload.delivered ? new Date().toISOString() : m.delivered_at, read_at: payload.read ? new Date().toISOString() : m.read_at } : m))
    }
    socket.on('message:status', statusHandler)
    return () => { socket.off('message', handler); socket.off('presence:update', presenceHandler); if (token) setOffline(token).catch(() => {}) };
  }, [selectedThreadId, user?.id, token, user?.role]);

  useEffect(() => {
    if (!token || !user?.id) return;
    const unread = messagesState.filter((m) => m.to_user_id === user.id && !m.read_at);
    unread.forEach((m) => { markRead(token, m.id).catch(() => {}); });
  }, [messagesState, token, user?.id]);

  useEffect(() => {
    async function loadPresence() {
      if (!token) return
      try {
        const teachers = await getActiveUsers(token, 'teacher')
        setActiveTeachers(teachers)
        const classmates = await getActiveUsers(token, 'student')
        setActiveClassmates(classmates.filter(u => u.user_id !== user?.id))
      } catch { void 0 }
    }
    loadPresence()
  }, [token, user?.id])

  function updatePresenceList(prev: PresenceUser[], p: { userId: string; role?: string; classId?: string; is_online: boolean; last_seen?: string }) {
    const idx = prev.findIndex(u => u.user_id === p.userId)
    if (idx === -1 && p.is_online) return [{ user_id: p.userId, role: p.role || '', class_id: p.classId, is_online: true, last_seen: p.last_seen }, ...prev]
    if (idx === -1) return prev
    const copy = [...prev]
    copy[idx] = { ...copy[idx], is_online: p.is_online, last_seen: p.last_seen }
    if (!p.is_online) return copy.filter(u => u.user_id !== p.userId)
    return copy
  }

  const selectedThread = useMemo(() => threads.find((t) => t.id === selectedThreadId) || null, [threads, selectedThreadId]);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Card className="border-0 shadow-elevation h-[calc(100vh-6rem)]">
            <div className="grid lg:grid-cols-3 h-full">
              {/* Conversations List */}
              <div className="border-r">
                <CardHeader className="border-b">
                  <CardTitle className="text-primary">Messages</CardTitle>
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y" data-testid="threads-list">
                    {threadsLoading && (
                      <div className="p-4 space-y-2" data-testid="threads-loading">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="animate-pulse h-14 bg-muted/60" />
                        ))}
                      </div>
                    )}
                    {!threadsLoading && threadsError && (
                      <div className="p-4 space-y-3" data-testid="threads-error">
                        <p className="text-destructive text-sm md:text-base">{threadsError}</p>
                        <Button variant="outline" onClick={reloadThreads} data-testid="threads-retry">Retry</Button>
                      </div>
                    )}
                    {!threadsLoading && !threadsError && threads.length === 0 && (
                      <div className="p-6 text-muted-foreground" data-testid="threads-empty">
                        No conversations yet
                      </div>
                    )}
                    {!threadsLoading && !threadsError && threads.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => setSelectedThreadId(t.id)}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedThreadId === t.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={'/placeholder.svg'} />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium truncate">{t.subject || 'Conversation'}</p>
                              <span className="text-xs text-muted-foreground">{new Date(t.last_message_at).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-muted-foreground truncate">
                                {unreadByThread[t.id] ? `${unreadByThread[t.id]} unread` : ''}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>

              {/* Chat Area */}
              <div className="lg:col-span-2 flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={'/placeholder.svg'} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedThread?.subject || 'Conversation'}</p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-auto p-4">
                  {!selectedThreadId && (
                    <div className="h-full flex items-center justify-center" data-testid="no-thread-selected">
                      <div className="text-center text-muted-foreground">
                        <p className="font-medium">No conversation selected</p>
                        <p className="text-sm">Choose a conversation from the list</p>
                      </div>
                    </div>
                  )}
                  {selectedThreadId && threadLoading && (
                    <div className="space-y-3" data-testid="thread-loading">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse h-6 w-2/3 bg-muted/60" />
                      ))}
                    </div>
                  )}
                  {selectedThreadId && !threadLoading && threadError && (
                    <div className="space-y-3" data-testid="thread-error">
                      <p className="text-destructive text-sm md:text-base">{threadError}</p>
                      <Button variant="outline" onClick={() => reloadThread()} data-testid="thread-retry">Retry</Button>
                    </div>
                  )}
                  {selectedThreadId && !threadLoading && !threadError && (
                    <div className="space-y-4">
                      {messagesState.length === 0 && (
                        <div className="text-center text-muted-foreground">No messages yet</div>
                      )}
                      {messagesState.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.from_user_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              message.from_user_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className={`text-xs ${message.from_user_id === user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{new Date(message.created_at).toLocaleString()}</p>
                              {message.from_user_id === user?.id && (
                                <p className="text-xs opacity-80">
                                  {message.read_at ? 'Read' : message.delivered_at ? 'Delivered' : 'Sent'}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input placeholder="Type a message..." className="flex-1" value={input} onChange={(e) => setInput(e.target.value)} />
                      <Button size="icon" onClick={async () => {
                        if (!token || !selectedThreadId || !user?.id || !input.trim()) return;
                        try {
                          const thread = await getThread(token, selectedThreadId);
                          const other = thread.participants.find((p) => p.user_id !== user.id) || thread.participants[0];
                          const msg = await sendMessage(token, other.role, other.user_id, thread.thread.subject || null, input.trim());
                          setMessagesState((prev) => [...prev, msg]);
                          setInput('');
                        } catch (e: unknown) {
                          const msg = e instanceof Error ? e.message : 'Failed to send message'
                          toast({ title: 'Send failed', description: msg, variant: 'destructive' })
                        }
                      }}>
                        <Send className="h-4 w-4" />
                      </Button>
                  </div>
                </div>
              </div>
              {/* Active Users Panel */}
              <div className="hidden lg:block border-l">
                <CardHeader className="border-b">
                  <CardTitle className="text-primary">Active Users</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <p className="text-sm font-medium mb-2">Teachers</p>
                    <div className="space-y-2">
                      {activeTeachers.length === 0 && <p className="text-xs text-muted-foreground">No teachers online</p>}
                      {activeTeachers.map(u => (
                        <div key={u.user_id} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm">{u.user_id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Classmates</p>
                    <div className="space-y-2">
                      {activeClassmates.length === 0 && <p className="text-xs text-muted-foreground">No classmates online</p>}
                      {activeClassmates.map(u => (
                        <div key={u.user_id} className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <span className="text-sm">{u.user_id}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
