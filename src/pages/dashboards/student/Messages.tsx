import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Send, Paperclip, MoreVertical } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function StudentMessages() {
  const [selectedChat, setSelectedChat] = useState(0);

  const conversations = [
    {
      id: 0,
      name: 'Mr. Johnson (Math Teacher)',
      avatar: '/placeholder.svg',
      lastMessage: 'Assignment deadline extended',
      time: '10:30 AM',
      unread: 2
    },
    {
      id: 1,
      name: 'Mrs. Smith (Class Teacher)',
      avatar: '/placeholder.svg',
      lastMessage: 'Parent meeting scheduled',
      time: 'Yesterday',
      unread: 0
    },
    {
      id: 2,
      name: 'School Admin',
      avatar: '/placeholder.svg',
      lastMessage: 'Fee payment reminder',
      time: '2 days ago',
      unread: 1
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'teacher',
      content: 'Hello Ahmad, I wanted to discuss your recent performance',
      time: '10:15 AM'
    },
    {
      id: 2,
      sender: 'student',
      content: 'Good morning sir. I\'m available to discuss',
      time: '10:20 AM'
    },
    {
      id: 3,
      sender: 'teacher',
      content: 'Great! The assignment deadline has been extended to next Friday',
      time: '10:30 AM'
    }
  ];

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
                  <div className="divide-y">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        onClick={() => setSelectedChat(conv.id)}
                        className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                          selectedChat === conv.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={conv.avatar} />
                            <AvatarFallback>{conv.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-medium truncate">{conv.name}</p>
                              <span className="text-xs text-muted-foreground">{conv.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                              {conv.unread > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5">
                                  {conv.unread}
                                </span>
                              )}
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
                        <AvatarImage src={conversations[selectedChat].avatar} />
                        <AvatarFallback>{conversations[selectedChat].name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{conversations[selectedChat].name}</p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'student'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'student' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
