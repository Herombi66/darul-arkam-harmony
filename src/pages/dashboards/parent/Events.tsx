import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  ChevronRight,
  Bell,
  Filter
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

export default function Events() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filter, setFilter] = useState<string>('all');

  const events = [
    {
      id: 1,
      title: "Parent-Teacher Meeting",
      date: "2024-01-25",
      time: "10:00 AM - 2:00 PM",
      location: "School Auditorium",
      type: "meeting",
      description: "Annual parent-teacher conference to discuss student progress and academic performance.",
      attendees: 150,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Ahmad's Birthday Celebration",
      date: "2024-01-28",
      time: "12:00 PM - 2:00 PM",
      location: "School Cafeteria",
      type: "birthday",
      description: "Celebrating Ahmad Musa's birthday with classmates and teachers.",
      attendees: 25,
      status: "upcoming"
    },
    {
      id: 3,
      title: "End of Term Examination",
      date: "2024-02-05",
      time: "9:00 AM - 3:00 PM",
      location: "Examination Halls",
      type: "exam",
      description: "First term final examinations for all classes.",
      attendees: 500,
      status: "upcoming"
    },
    {
      id: 4,
      title: "Science Fair Exhibition",
      date: "2024-02-15",
      time: "9:00 AM - 4:00 PM",
      location: "School Laboratory & Hall",
      type: "academic",
      description: "Annual science fair showcasing student projects and innovations.",
      attendees: 300,
      status: "upcoming"
    },
    {
      id: 5,
      title: "Sports Day",
      date: "2024-02-20",
      time: "8:00 AM - 5:00 PM",
      location: "School Sports Complex",
      type: "sports",
      description: "Inter-house sports competition and athletic events.",
      attendees: 600,
      status: "upcoming"
    },
    {
      id: 6,
      title: "Cultural Day Celebration",
      date: "2024-03-01",
      time: "10:00 AM - 4:00 PM",
      location: "School Grounds",
      type: "cultural",
      description: "Celebration of cultural diversity with traditional performances and food.",
      attendees: 400,
      status: "upcoming"
    }
  ];

  const eventTypes = [
    { value: 'all', label: 'All Events', color: 'bg-primary' },
    { value: 'meeting', label: 'Meetings', color: 'bg-blue-500' },
    { value: 'exam', label: 'Examinations', color: 'bg-red-500' },
    { value: 'academic', label: 'Academic', color: 'bg-green-500' },
    { value: 'sports', label: 'Sports', color: 'bg-orange-500' },
    { value: 'cultural', label: 'Cultural', color: 'bg-purple-500' },
    { value: 'birthday', label: 'Birthdays', color: 'bg-pink-500' }
  ];

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.type === filter;
  });

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = filteredEvents.filter(event => new Date(event.date) < new Date());

  const getEventTypeColor = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType?.color || 'bg-gray-500';
  };

  const getEventTypeLabel = (type: string) => {
    const eventType = eventTypes.find(et => et.value === type);
    return eventType?.label || type;
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
                <BreadcrumbPage>Events</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">School Events</h1>
              <p className="text-muted-foreground">
                Stay updated with upcoming school events and important dates.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/parent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            {eventTypes.map(type => (
              <Button
                key={type.value}
                variant={filter === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(type.value)}
                className="flex items-center space-x-2"
              >
                <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                <span>{type.label}</span>
              </Button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-sm">Event Legend</h4>
                    <div className="space-y-1">
                      {eventTypes.slice(1).map(type => (
                        <div key={type.value} className="flex items-center space-x-2 text-xs">
                          <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                          <span>{type.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Events */}
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Upcoming Events ({upcomingEvents.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover-lift">
                        <div className={`w-4 h-4 rounded-full ${getEventTypeColor(event.type)} mt-1`}></div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-primary">{event.title}</h3>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-4 w-4 mr-1" />
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {event.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline">
                              {getEventTypeLabel(event.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">{event.description}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="h-4 w-4 mr-1" />
                              {event.attendees} expected attendees
                            </div>
                            <Button size="sm" variant="outline">
                              Add to Calendar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {upcomingEvents.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No upcoming events found for the selected filter.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Past Events */}
              {pastEvents.length > 0 && (
                <Card className="border-0 shadow-elevation">
                  <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pastEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        </div>
                      ))}
                    </div>
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