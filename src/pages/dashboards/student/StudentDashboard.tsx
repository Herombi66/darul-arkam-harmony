
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from '@/contexts/AuthContext';
import { 
  BookOpen, 
  FileText, 
  Trophy, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  Activity,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Settings2,
  LucideIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardData {
  user: {
    name: string;
    role: string;
  };
  stats: {
    gpa: number;
    attendance: number;
    pending_assignments: number;
    completed_courses: number;
  };
  quick_actions: Array<{
    id: string;
    label: string;
    icon: string;
    path: string;
  }>;
  upcoming_assignments: Array<{
    id: string;
    title: string;
    course: string;
    dueDate: string;
    status: string;
    priority: string;
  }>;
  recent_grades: Array<{
    subject: string;
    grade: string;
    score: number;
    date: string;
  }>;
  notifications: Array<{
    id: number;
    message: string;
    time: string;
    read: boolean;
  }>;
}

interface DashboardPreferences {
  hiddenActions: string[];
  actionOrder: string[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const QuickActionCard = ({ action, onClick }: { action: QuickAction, onClick: () => void }) => {
  const Icon = {
    BookOpen,
    FileText,
    Trophy,
    Calendar,
    MessageSquare
  }[action.icon as string] || BookOpen;

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all hover:border-primary/50 group h-full"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Go to ${action.label}`}
    >
      <CardContent className="flex flex-row items-center justify-start p-4 text-left gap-4 h-full">
        <div className="p-3 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-sm sm:text-base">{action.label}</h3>
      </CardContent>
    </Card>
  );
};

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: LucideIcon, trend?: string }) => (
  <Card>
    <CardContent className="p-6 flex items-center justify-between space-x-4">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
        {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
      </div>
      <div className="p-3 bg-muted rounded-full">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default function StudentDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Personalization state
  const [preferences, setPreferences] = useState<DashboardPreferences>(() => {
    const saved = localStorage.getItem('student_dashboard_preferences');
    return saved ? JSON.parse(saved) : { hiddenActions: [], actionOrder: [] };
  });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Save preferences when they change
  useEffect(() => {
    localStorage.setItem('student_dashboard_preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await fetch(`${backendUrl}/api/student/dashboard`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token ?? ''}`,
          },
        });

        if (!res.ok) throw new Error('Failed to load dashboard data');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError('Unable to load dashboard information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  // Merge and sort actions based on preferences
  const getVisibleActions = () => {
    if (!data) return [];
    
    const actions = [...data.quick_actions];
    
    // Sort based on saved order
    if (preferences.actionOrder.length > 0) {
      actions.sort((a, b) => {
        const indexA = preferences.actionOrder.indexOf(a.id);
        const indexB = preferences.actionOrder.indexOf(b.id);
        // If both are in the order list, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A is in list, it comes first
        if (indexA !== -1) return -1;
        // If only B is in list, it comes first
        if (indexB !== -1) return 1;
        // If neither, keep original order
        return 0;
      });
    }

    // Filter out hidden actions
    return actions.filter(a => !preferences.hiddenActions.includes(a.id));
  };

  const toggleActionVisibility = (id: string) => {
    setPreferences(prev => ({
      ...prev,
      hiddenActions: prev.hiddenActions.includes(id) 
        ? prev.hiddenActions.filter(aid => aid !== id)
        : [...prev.hiddenActions, id]
    }));
  };

  const moveAction = (id: string, direction: 'up' | 'down') => {
    if (!data) return;
    
    setPreferences(prev => {
      // Get current effective order (combining saved order with any new items from API)
      const currentOrder = prev.actionOrder.length > 0 
        ? prev.actionOrder 
        : data.quick_actions.map(a => a.id);
        
      // Ensure all current IDs are in the list
      const allIds = Array.from(new Set([...currentOrder, ...data.quick_actions.map(a => a.id)]));
      
      const index = allIds.indexOf(id);
      if (index === -1) return prev;
      
      const newOrder = [...allIds];
      if (direction === 'up' && index > 0) {
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
      } else if (direction === 'down' && index < newOrder.length - 1) {
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      }
      
      return { ...prev, actionOrder: newOrder };
    });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => window.location.reload()} className="mt-4" variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {data.user.name.split(' ')[0]}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your academic progress today.
          </p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-sm text-muted-foreground hidden sm:inline-block">
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
           </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="GPA" 
          value={data.stats.gpa} 
          icon={Trophy} 
          trend="Top 10% of class"
        />
        <StatCard 
          title="Attendance" 
          value={`${data.stats.attendance}%`} 
          icon={Clock} 
          trend="Last 30 days"
        />
        <StatCard 
          title="Assignments Due" 
          value={data.stats.pending_assignments} 
          icon={FileText} 
          trend="Next 7 days"
        />
        <StatCard 
          title="Courses" 
          value={data.stats.completed_courses} 
          icon={BookOpen} 
          trend="Active this term"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Quick Actions
          </h2>
          <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Settings2 className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Customize Quick Actions</DialogTitle>
                <DialogDescription>
                  Choose which actions to show and arrange them in your preferred order.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-2">
                {data.quick_actions
                  .sort((a, b) => {
                    const order = preferences.actionOrder.length > 0 
                      ? preferences.actionOrder 
                      : data.quick_actions.map(x => x.id);
                    const indexA = order.indexOf(a.id);
                    const indexB = order.indexOf(b.id);
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    return 0;
                  })
                  .map((action, index, array) => {
                    const isHidden = preferences.hiddenActions.includes(action.id);
                    return (
                      <div key={action.id} className="flex items-center justify-between p-2 rounded-md border bg-card">
                        <div className="flex items-center gap-3">
                          <Checkbox 
                            id={`action-${action.id}`} 
                            checked={!isHidden}
                            onCheckedChange={() => toggleActionVisibility(action.id)}
                          />
                          <Label 
                            htmlFor={`action-${action.id}`}
                            className={`cursor-pointer ${isHidden ? 'text-muted-foreground line-through' : ''}`}
                          >
                            {action.label}
                          </Label>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            disabled={index === 0}
                            onClick={() => moveAction(action.id, 'up')}
                            title="Move Up"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            disabled={index === array.length - 1}
                            onClick={() => moveAction(action.id, 'down')}
                            title="Move Down"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                             variant="ghost"
                             size="icon"
                             className="h-8 w-8"
                             onClick={() => toggleActionVisibility(action.id)}
                             title={isHidden ? "Show" : "Hide"}
                          >
                            {isHidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <DialogFooter>
                <Button onClick={() => setIsCustomizeOpen(false)}>Done</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {getVisibleActions().map((action) => (
            <QuickActionCard 
              key={action.id} 
              action={action} 
              onClick={() => navigate(action.path)} 
            />
          ))}
          {getVisibleActions().length === 0 && (
            <div className="col-span-full p-8 text-center border-2 border-dashed rounded-lg text-muted-foreground">
              <p>No quick actions visible.</p>
              <Button variant="link" onClick={() => setIsCustomizeOpen(true)}>Customize to show actions</Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-7">
        
        {/* Upcoming Assignments (Left Column - 4/7) */}
        <Card className="md:col-span-4 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>You have {data.upcoming_assignments.length} assignments due soon</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/student/assignments')}>
              View All
            </Button>
          </CardHeader>
          <CardContent className="flex-1">
            {data.upcoming_assignments.length > 0 ? (
              <div className="space-y-4">
                {data.upcoming_assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        {assignment.title}
                        {assignment.priority === 'high' && (
                          <Badge variant="destructive" className="text-[10px] h-5 px-1.5">High Priority</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{assignment.course}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium flex items-center gap-1 text-orange-600">
                        <Clock className="h-3 w-3" />
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Due {new Date(assignment.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8">
                <CheckCircle className="h-12 w-12 mb-4 text-green-500/50" />
                <p>All caught up! No upcoming assignments.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Grades & Notifications (Right Column - 3/7) */}
        <div className="md:col-span-3 space-y-6">
          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recent_grades.map((grade, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 last:pb-0 last:border-0 border-b">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                        ${grade.grade.startsWith('A') ? 'bg-green-100 text-green-700' : 
                          grade.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}
                      `}>
                        {grade.grade}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{grade.subject}</p>
                        <p className="text-xs text-muted-foreground">{new Date(grade.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm">{grade.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-xs" onClick={() => navigate('/student/results')}>
                View Full Report <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>

          {/* Notifications/Announcements */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.notifications.map((notif) => (
                  <div key={notif.id} className="flex gap-3 items-start text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="leading-tight">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
