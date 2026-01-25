import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Clock,
  CalendarDays,
  TrendingUp,
  Award,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getSocket } from '@/services/messages';

const API_BASE = import.meta.env.VITE_BACKEND_URL ? import.meta.env.VITE_BACKEND_URL : ''

export default function TeacherDashboard() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<{ name: string; id: string; isFormMaster?: boolean; formClass?: string } | null>(null)
  const [subjects, setSubjects] = useState<{ subject: string; classes: string[] }[]>([])
  const [overview, setOverview] = useState<{ subjectsTeaching: number; totalStudents: number; pendingAssignments: number; todayClasses: number } | null>(null)
  const [schedule, setSchedule] = useState<{ subject: string; class: string; start: string; end: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchAll() {
    if (!user || !token) return
    try {
      setError(null)
      const id = user.id
      const headers = { Authorization: `Bearer ${token}` }
      const [ovRes, subjRes, schedRes] = await Promise.all([
        fetch(`${API_BASE}/api/teacher/${id}/overview`, { headers }),
        fetch(`${API_BASE}/api/teacher/${id}/subjects`, { headers }),
        fetch(`${API_BASE}/api/teacher/${id}/schedule/today`, { headers }),
      ])
      const ovJson = await ovRes.json()
      const subjJson = await subjRes.json()
      const schedJson = await schedRes.json()
      if (!ovRes.ok) throw new Error(ovJson.message || 'Failed to load overview')
      if (!subjRes.ok) throw new Error(subjJson.message || 'Failed to load subjects')
      if (!schedRes.ok) throw new Error(schedJson.message || 'Failed to load schedule')
      setOverview(ovJson.data)
      setSubjects(subjJson.data)
      setSchedule(schedJson.data)
      setProfile({ name: user.name || 'Teacher', id: user.id_number || user.id, isFormMaster: true, formClass: 'SS2 A' })
    } catch (e: any) {
      setError(e?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [user?.id, token])

  useEffect(() => {
    const socket = getSocket()
    if (user?.id) socket.emit('joinTeacher', { teacherId: user.id })
    const onAssign = (payload: any) => { setOverview((prev) => prev ? { ...prev, pendingAssignments: payload.pendingAssignments ?? prev.pendingAssignments } : prev) }
    const onAttend = (payload: any) => { setOverview((prev) => prev ? { ...prev, totalStudents: payload.totalStudents ?? prev.totalStudents } : prev) }
    const onTimetable = (payload: any) => { if (Array.isArray(payload.today)) setSchedule(payload.today) }
    socket.on('assignments:update', onAssign)
    socket.on('attendance:update', onAttend)
    socket.on('timetable:update', onTimetable)
    return () => { socket.off('assignments:update', onAssign); socket.off('attendance:update', onAttend); socket.off('timetable:update', onTimetable) }
  }, [user?.id])

  const quickActions = [
    {
      title: "Mark Attendance",
      description: "Mark today's class attendance",
      icon: UserCheck,
      href: "/dashboard/teacher/attendance",
      variant: "default" as const
    },
    {
      title: "Grade Assignments",
      description: "Review and grade submitted assignments",
      icon: BookOpen,
      href: "/dashboard/teacher/assignments",
      variant: "secondary" as const
    },
    {
      title: "Record Scores",
      description: "Update student CA and exam scores",
      icon: TrendingUp,
      href: "/dashboard/teacher/academics/record-keeping",
      variant: "accent" as const
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-primary">Welcome back, {profile?.name || 'Teacher'}!</h1>
        <p className="text-muted-foreground">
          ID: {profile?.id || user?.id} • {profile?.isFormMaster ? `Form Master - ${profile?.formClass}` : 'Subject Teacher'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
        <Card className="hover-lift border-0 shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-full">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subjects Teaching</p>
                <p className="text-2xl font-bold text-primary">{overview?.subjectsTeaching ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-secondary rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold text-primary">{overview?.totalStudents ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-accent rounded-full">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Assignments</p>
                <p className="text-2xl font-bold text-primary">{overview?.pendingAssignments ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift border-0 shadow-elevation">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today's Classes</p>
                <p className="text-2xl font-bold text-primary">{overview?.todayClasses ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
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

          {/* Teaching Subjects */}
          <Card className="border-0 shadow-elevation animate-fade-in">
            <CardHeader>
              <CardTitle className="text-primary">Teaching Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading subjects...</div>
              ) : error ? (
                <div className="text-center py-4 text-red-600">Error: {error}</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {subjects.map((s, index) => (
                    <Link key={index} to={`/dashboard/teacher/subjects/${s.subject}`}>
                      <div className="p-4 bg-gradient-primary rounded-lg text-white hover:opacity-90 transition-opacity cursor-pointer">
                        <h3 className="font-semibold">{s.subject}</h3>
                        <p className="text-sm opacity-90">{s.classes.join(', ')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule */}
        <Card className="border-0 shadow-elevation animate-slide-in">
          <CardHeader>
            <CardTitle className="text-primary flex items-center">
              <CalendarDays className="h-5 w-5 mr-2" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(loading ? [] : schedule).map((sch, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{sch.subject}</p>
                    <p className="text-xs text-muted-foreground">{sch.class}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-primary">{new Date(sch.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild variant="outline" className="w-full mt-4">
              <Link to="/dashboard/teacher/classes">View All Classes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}