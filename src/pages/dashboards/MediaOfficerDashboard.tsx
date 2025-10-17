import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Calendar, 
  FileText, 
  Upload, 
  Image,
  Video,
  MessageSquare,
  Eye
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function MediaOfficerDashboard() {
  const officerData = {
    name: "Miss. Aisha Muhammad",
    id: "MED/2024/001",
    role: "Media Officer",
    totalPhotos: 1240,
    totalArticles: 45,
    upcomingEvents: 8,
    recentUploads: 12
  };

  const quickActions = [
    {
      title: "Upload Media",
      description: "Add photos and videos to gallery",
      icon: Upload,
      href: "/dashboard/media-officer/gallery",
      variant: "default" as const
    },
    {
      title: "Schedule Events",
      description: "Add upcoming school activities",
      icon: Calendar,
      href: "/dashboard/media-officer/events",
      variant: "secondary" as const
    },
    {
      title: "Write Article",
      description: "Publish news and announcements",
      icon: FileText,
      href: "/dashboard/media-officer/gallery?action=article",
      variant: "accent" as const
    }
  ];

  const recentEvents = [
    { title: "Inter-House Sports", date: "2024-01-20", status: "Scheduled", media: 45 },
    { title: "Science Fair", date: "2024-01-18", status: "Completed", media: 78 },
    { title: "Cultural Day", date: "2024-01-15", status: "Completed", media: 92 },
    { title: "Prize Giving Day", date: "2024-01-12", status: "Completed", media: 134 }
  ];

  const mediaStats = [
    { type: "Photos", count: 1240, recent: 45, icon: Image },
    { type: "Videos", count: 89, recent: 5, icon: Video },
    { type: "Articles", count: 45, recent: 3, icon: FileText },
    { type: "Events", count: 156, recent: 8, icon: Calendar }
  ];

  const upcomingSchedule = [
    { event: "Parent-Teacher Meeting", date: "2024-01-25", coverage: "Photo & Video" },
    { event: "Graduation Ceremony", date: "2024-02-15", coverage: "Full Coverage" },
    { event: "Annual Sports Day", date: "2024-02-20", coverage: "Live Streaming" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="media" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Welcome Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">Welcome back, {officerData.name}!</h1>
            <p className="text-muted-foreground">
              {officerData.role} • ID: {officerData.id} • {officerData.upcomingEvents} Upcoming Events
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            {mediaStats.map((stat, index) => (
              <Card key={index} className="hover-lift border-0 shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total {stat.type}</p>
                      <p className="text-2xl font-bold text-primary">{stat.count}</p>
                      <p className="text-xs text-success">+{stat.recent} this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {quickActions.map((action, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover-lift"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-gradient-primary rounded-lg">
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium text-primary">{action.title}</h3>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                      </div>
                      <Button asChild variant={action.variant}>
                        <Link to={action.href}>Go</Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Events */}
              <Card className="border-0 shadow-elevation animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Events Coverage</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover-lift">
                      <div>
                        <h3 className="font-medium text-primary">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                        <p className="text-xs text-muted-foreground">{event.media} media files</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'Completed' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {event.status}
                        </span>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/dashboard/media-officer/events/${event.title.replace(/\s+/g, '-').toLowerCase()}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Schedule */}
            <Card className="border-0 shadow-elevation animate-slide-in">
              <CardHeader>
                <CardTitle className="text-primary flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedule.map((schedule, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{schedule.event}</p>
                          <p className="text-xs text-muted-foreground">{schedule.date}</p>
                          <p className="text-xs text-primary font-medium mt-1">{schedule.coverage}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/dashboard/media-officer/events">View All Events</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Quick Upload Section */}
          <Card className="border-0 shadow-elevation animate-fade-in">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <Camera className="h-5 w-5 mr-2" />
                Quick Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center hover:border-primary transition-colors">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Upload Photos</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                </div>
                <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center hover:border-primary transition-colors">
                  <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Upload Videos</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV up to 100MB</p>
                </div>
                <div className="p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center hover:border-primary transition-colors">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium mb-1">Write Article</p>
                  <p className="text-xs text-muted-foreground">News & Announcements</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}