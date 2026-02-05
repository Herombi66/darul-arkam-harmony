import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock, MapPin, Users, Bell } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useState } from 'react';

export default function StudentEvents() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const events = [
    {
      id: 1,
      title: 'Mid-term Examination',
      date: '2024-01-25',
      time: '09:00 AM',
      location: 'Examination Hall',
      type: 'exam',
      attendees: 150,
      description: 'Mid-term examination for all SS3 students'
    },
    {
      id: 2,
      title: 'Science Fair',
      date: '2024-01-28',
      time: '10:00 AM',
      location: 'Main Auditorium',
      type: 'event',
      attendees: 300,
      description: 'Annual science fair showcasing student projects'
    },
    {
      id: 3,
      title: 'Parent-Teacher Meeting',
      date: '2024-02-02',
      time: '02:00 PM',
      location: 'Conference Room',
      type: 'meeting',
      attendees: 80,
      description: 'Meeting to discuss student progress with parents'
    },
    {
      id: 4,
      title: 'Sports Day',
      date: '2024-02-10',
      time: '08:00 AM',
      location: 'Sports Complex',
      type: 'sports',
      attendees: 500,
      description: 'Annual inter-house sports competition'
    },
    {
      id: 5,
      title: 'Cultural Festival',
      date: '2024-02-15',
      time: '11:00 AM',
      location: 'School Grounds',
      type: 'cultural',
      attendees: 400,
      description: 'Celebrating diverse cultures through performances'
    }
  ];

  const upcomingEvents = events.slice(0, 3);

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'exam': return 'bg-destructive/20 text-destructive';
      case 'event': return 'bg-primary/20 text-primary';
      case 'meeting': return 'bg-warning/20 text-warning';
      case 'sports': return 'bg-success/20 text-success';
      case 'cultural': return 'bg-accent/20 text-accent';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6 max-w-7xl">
          <div>
            <h1 className="text-3xl font-bold text-primary">Events</h1>
            <p className="text-muted-foreground">Stay updated with school events and activities</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <Badge className={getEventBadgeColor(event.type)}>
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{event.description}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Bell className="h-4 w-4 mr-2" />
                          Remind
                        </Button>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {event.attendees} attendees
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">All Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {events.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-primary rounded-lg">
                            <CalendarIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">{event.date} • {event.time}</p>
                          </div>
                        </div>
                        <Badge className={getEventBadgeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Calendar</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Event Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold text-primary">5</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Attended</p>
                    <p className="text-2xl font-bold text-primary">12</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Upcoming</p>
                    <p className="text-2xl font-bold text-primary">3</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
