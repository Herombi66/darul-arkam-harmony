import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Users,
  Search,
  Plus,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { io, Socket } from 'socket.io-client';

type View = 'dms' | 'teachers_forum' | 'parents_forum' | 'students_forum';

const mockDms = [
  { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', avatar: 'https://github.com/shadcn.png' },
  { id: '2', name: 'Jane Smith', lastMessage: 'Can we meet tomorrow?', avatar: 'https://github.com/shadcn.png' },
];

const mockTeachersChannels = [
  { id: '1', name: 'General-Staff' },
  { id: '2', name: 'Curriculum-Discussions' },
];

const mockParentsChannels = [
  { id: '1', name: 'General-Parents' },
  { id: '2', name: 'PTA-Announcements' },
];

const mockStudentsChannels = [
  { id: '1', name: 'General-Students' },
  { id: '2', name: 'Homework-Help' },
];

const mockMessagesData = {
  dms: {
    '1': [
      { id: '1', sender: 'John Doe', message: 'Hey, how are you?', time: '10:30 AM' },
      { id: '2', sender: 'You', message: 'I am good, thanks!', time: '10:31 AM' },
    ],
    '2': [
       { id: '1', sender: 'Jane Smith', message: 'Can we meet tomorrow?', time: '11:00 AM' },
    ]
  },
  teachers_forum: {
    '1': [
      { id: '1', sender: 'Admin', message: 'Welcome to the general staff channel!', time: '9:00 AM' },
    ],
    '2': [],
  },
  parents_forum: {
    '1': [],
    '2': [],
  },
  students_forum: {
    '1': [],
    '2': [],
  }
};

interface ChatMessage {
    id: string;
    sender: string;
    message: string;
    time: string;
}

export default function AdminMessages() {
  const [view, setView] = useState<View>('dms');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [newMessage, setNewMessage] = useState('');
  const { user } = useAuth();
  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5001");
    socket.current = newSocket;

    newSocket.on('connect', () => {
      console.log('Socket connected for messaging');
    });

    newSocket.on('forum_message', (message: ChatMessage) => {
      setMessages(prev => ({
        ...prev,
        [activeId!]: [...(prev[activeId!] || []), message]
      }));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeId]);

  useEffect(() => {
    if (socket.current && activeId) {
      if (view === 'teachers_forum') {
        socket.current.emit('join_forum', { forum: 'teachers_forum', channel: activeId });
      } else if (view === 'parents_forum') {
        socket.current.emit('join_forum', { forum: 'parents_forum', channel: activeId });
      } else if (view === 'students_forum') {
        socket.current.emit('join_forum', { forum: 'students_forum', channel: activeId });
      }
    }

    if (activeId) {
        setMessages(prev => ({ ...prev, [activeId]: mockMessagesData[view][activeId] || [] }));
    }

    return () => {
      if (socket.current && activeId) {
        if (view === 'teachers_forum') {
          socket.current.emit('leave_forum', { forum: 'teachers_forum', channel: activeId });
        } else if (view === 'parents_forum') {
          socket.current.emit('leave_forum', { forum: 'parents_forum', channel: activeId });
        } else if (view === 'students_forum') {
          socket.current.emit('leave_forum', { forum: 'students_forum', channel: activeId });
        }
      }
    };
  }, [view, activeId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !socket.current || !activeId) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: user?.name || 'You',
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (view === 'dms') {
      // Logic to send DM
    } else {
      socket.current.emit('send_forum_message', {
        forum: view,
        channel: activeId,
        message,
      });
    }
    
    setMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), message]
    }));

    setNewMessage('');
  };

  const renderDirectory = () => {
    switch (view) {
      case 'dms':
        return mockDms.map((dm) => (
          <div
            key={dm.id}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer",
              activeId === dm.id ? "bg-muted" : "hover:bg-muted/50"
            )}
            onClick={() => setActiveId(dm.id)}
          >
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={dm.avatar} alt={dm.name} />
              <AvatarFallback>{dm.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{dm.name}</p>
              <p className="text-sm text-muted-foreground truncate">{dm.lastMessage}</p>
            </div>
          </div>
        ));
      case 'teachers_forum':
        return mockTeachersChannels.map((channel) => (
          <div
            key={channel.id}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer",
              activeId === channel.id ? "bg-muted" : "hover:bg-muted/50"
            )}
            onClick={() => setActiveId(channel.id)}
          >
            <span className="mr-2 text-muted-foreground">#</span>
            <p className="font-semibold">{channel.name}</p>
          </div>
        ));
      case 'parents_forum':
        return mockParentsChannels.map((channel) => (
          <div
            key={channel.id}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer",
              activeId === channel.id ? "bg-muted" : "hover:bg-muted/50"
            )}
            onClick={() => setActiveId(channel.id)}
          >
            <span className="mr-2 text-muted-foreground">#</span>
            <p className="font-semibold">{channel.name}</p>
          </div>
        ));
      case 'students_forum':
        return mockStudentsChannels.map((channel) => (
          <div
            key={channel.id}
            className={cn(
              "flex items-center p-3 rounded-lg cursor-pointer",
              activeId === channel.id ? "bg-muted" : "hover:bg-muted/50"
            )}
            onClick={() => setActiveId(channel.id)}
          >
            <span className="mr-2 text-muted-foreground">#</span>
            <p className="font-semibold">{channel.name}</p>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen bg-background">
      {/* Sidebar */}
      <div className="border-r bg-card text-card-foreground flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              {view === 'dms' && 'Direct Messages'}
              {view === 'teachers_forum' && 'Teachers Forum'}
              {view === 'parents_forum' && 'Parents Forum'}
              {view === 'students_forum' && 'Students Forum'}
            </h2>
            <Button variant="ghost" size="icon">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-10" />
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          {renderDirectory()}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col">
        {activeId ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {view === 'dms' ? mockDms.find(dm => dm.id === activeId)?.name : `# ${mockTeachersChannels.find(ch => ch.id === activeId)?.name || mockParentsChannels.find(ch => ch.id === activeId)?.name || mockStudentsChannels.find(ch => ch.id === activeId)?.name}`}
                  </p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {(messages[activeId] || []).map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2",
                      msg.sender === (user?.name || 'You') ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender !== (user?.name || 'You') && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-xs lg:max-w-md",
                        msg.sender === (user?.name || 'You')
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs text-right mt-1 opacity-70">
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 border-t bg-card">
              <div className="relative">
                <Input
                  placeholder="Type a message..."
                  className="pr-28"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="h-4 w-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}