import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'meeting' | 'training' | 'ceremony' | 'deadline';
  attendees?: number;
  status: 'upcoming' | 'today' | 'completed';
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Staff Meeting',
    description: 'Monthly staff meeting to discuss academic progress and upcoming events',
    date: '2024-01-25',
    time: '10:00 AM',
    location: 'Staff Room',
    type: 'meeting',
    attendees: 45,
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Parent-Teacher Conference',
    description: 'Meet with parents to discuss student progress and performance',
    date: '2024-01-28',
    time: '2:00 PM',
    location: 'School Hall',
    type: 'meeting',
    attendees: 120,
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Result Submission Deadline',
    description: 'Final deadline for submitting term results to Exams Office',
    date: '2024-01-30',
    time: '5:00 PM',
    location: 'Exams Office',
    type: 'deadline',
    status: 'upcoming'
  },
  {
    id: '4',
    title: 'Professional Development Workshop',
    description: 'Workshop on modern teaching methodologies and classroom management',
    date: '2024-02-05',
    time: '9:00 AM',
    location: 'Conference Room',
    type: 'training',
    attendees: 30,
    status: 'upcoming'
  },
  {
    id: '5',
    title: 'Inter-House Sports Day',
    description: 'Annual sports competition between school houses',
    date: '2024-02-10',
    time: '8:00 AM',
    location: 'School Field',
    type: 'ceremony',
    attendees: 500,
    status: 'upcoming'
  },
  {
    id: '6',
    title: 'Department Meeting',
    description: 'Science department coordination meeting',
    date: '2024-01-20',
    time: '3:00 PM',
    location: 'Science Lab',
    type: 'meeting',
    attendees: 12,
    status: 'completed'
  }
];

export default function TeacherEvents() {
  const [events] = useState<Event[]>(mockEvents);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getEventTypeBadge = (type: string) => {
    const badges = {
      meeting: <Badge variant="outline" className="bg-blue-100 text-blue-800">Meeting</Badge>,
      training: <Badge variant="outline" className="bg-purple-100 text-purple-800">Training</Badge>,
      ceremony: <Badge variant="outline" className="bg-green-100 text-green-800">Ceremony</Badge>,
      deadline: <Badge variant="outline" className="bg-red-100 text-red-800">Deadline</Badge>
    };
    return badges[type as keyof typeof badges];
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      upcoming: <Badge className="bg-warning text-white">Upcoming</Badge>,
      today: <Badge className="bg-success text-white">Today</Badge>,
      completed: <Badge variant="outline">Completed</Badge>
    };
    return badges[status as keyof typeof badges];
  };

  const filteredEvents = events.filter(event => {
    const typeMatch = filterType === 'all' || event.type === filterType;
    const statusMatch = filterStatus === 'all' || event.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Events & Calendar</h1>
                <p className="text-muted-foreground">
                  View upcoming school events, meetings, and important dates
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

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events</p>
                    <p className="text-2xl font-bold text-primary">{events.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold text-primary">{upcomingEvents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-secondary rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Meetings</p>
                    <p className="text-2xl font-bold text-primary">
                      {events.filter(e => e.type === 'meeting').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-destructive rounded-full">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Deadlines</p>
                    <p className="text-2xl font-bold text-primary">
                      {events.filter(e => e.type === 'deadline').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filter Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Type</label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="meeting">Meetings</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="ceremony">Ceremonies</SelectItem>
                      <SelectItem value="deadline">Deadlines</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Events List */}
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="border-0 shadow-elevation hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-primary">{event.title}</h3>
                        {getEventTypeBadge(event.type)}
                        {getStatusBadge(event.status)}
                      </div>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      {event.attendees && (
                        <div className="flex items-center text-sm mt-2">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{event.attendees} expected attendees</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
