import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/DashboardSidebar';
import { BookOpen, User, Calendar, TrendingUp, FileText, Clock } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const subjects = [
  {
    id: 1,
    name: 'Mathematics',
    code: 'MTH201',
    teacher: 'Mr. Ibrahim Hassan',
    progress: 85,
    grade: 'A',
    lastTest: '92%',
    nextClass: 'Tomorrow 8:00 AM',
    assignments: 2,
    status: 'excellent'
  },
  {
    id: 2,
    name: 'Physics',
    code: 'PHY201',
    teacher: 'Mrs. Fatima Aliyu',
    progress: 78,
    grade: 'B+',
    lastTest: '78%',
    nextClass: 'Monday 10:00 AM',
    assignments: 1,
    status: 'good'
  },
  {
    id: 3,
    name: 'Chemistry',
    code: 'CHM201',
    teacher: 'Dr. Mohammed Usman',
    progress: 72,
    grade: 'B',
    lastTest: '74%',
    nextClass: 'Tuesday 9:00 AM',
    assignments: 3,
    status: 'satisfactory'
  },
  {
    id: 4,
    name: 'Biology',
    code: 'BIO201',
    teacher: 'Ms. Aisha Garba',
    progress: 88,
    grade: 'A',
    lastTest: '89%',
    nextClass: 'Wednesday 11:00 AM',
    assignments: 1,
    status: 'excellent'
  },
  {
    id: 5,
    name: 'English Language',
    code: 'ENG201',
    teacher: 'Mr. John Okafor',
    progress: 76,
    grade: 'B+',
    lastTest: '81%',
    nextClass: 'Daily 2:00 PM',
    assignments: 2,
    status: 'good'
  },
  {
    id: 6,
    name: 'Geography',
    code: 'GEO201',
    teacher: 'Mrs. Halima Bello',
    progress: 69,
    grade: 'B-',
    lastTest: '65%',
    nextClass: 'Thursday 3:00 PM',
    assignments: 1,
    status: 'needs_improvement'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800';
    case 'good': return 'bg-blue-100 text-blue-800';
    case 'satisfactory': return 'bg-yellow-100 text-yellow-800';
    case 'needs_improvement': return 'bg-orange-100 text-orange-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 70) return 'bg-blue-500';
  if (progress >= 60) return 'bg-yellow-500';
  return 'bg-orange-500';
};

export default function StudentSubjects() {
  const [detailOpen, setDetailOpen] = useState(false);
  type SubjectItem = typeof subjects[number];
  const [detailSubject, setDetailSubject] = useState<SubjectItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const openSubjectDetail = async (subject: SubjectItem) => {
    try {
      setDetailLoading(true);
      setDetailError(null);
      setDetailSubject(subject);
      setDetailOpen(true);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unable to open subject details';
      setDetailError(msg);
    } finally {
      setDetailLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">My Subjects</h1>
            <p className="text-muted-foreground">Track your progress across all enrolled subjects</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overall Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Performance Summary</CardTitle>
                  <CardDescription>Your overall progress across all subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">78%</div>
                      <p className="text-sm text-muted-foreground">Overall Average</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">6</div>
                      <p className="text-sm text-muted-foreground">Total Subjects</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">4</div>
                      <p className="text-sm text-muted-foreground">Subjects Above 75%</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">10</div>
                      <p className="text-sm text-muted-foreground">Pending Assignments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {subjects.map((subject) => (
                  <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base sm:text-lg">{subject.name}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm">{subject.code}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(subject.status)}>
                          {subject.grade}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                        <span className="text-xs sm:text-sm md:text-base">{subject.teacher}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm md:text-base">
                          <span>Progress</span>
                          <span>{subject.progress}%</span>
                        </div>
                        <Progress 
                          value={subject.progress} 
                          className="h-2"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs sm:text-sm md:text-base">
                        <div>
                          <p className="text-muted-foreground">Last Test</p>
                          <p className="font-medium">{subject.lastTest}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Assignments</p>
                          <p className="font-medium">{subject.assignments} pending</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-xs sm:text-sm md:text-base text-muted-foreground">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                        <span>Next: {subject.nextClass}</span>
                      </div>

                      <Button
                        className="w-full"
                        size="sm"
                        type="button"
                        aria-label={`View details for ${subject.name}`}
                        aria-busy={detailLoading && detailSubject?.id === subject.id}
                        aria-disabled={detailLoading}
                        disabled={detailLoading}
                        onClick={() => openSubjectDetail(subject)}
                      >
                        {detailLoading && detailSubject?.id === subject.id ? 'Loading…' : 'View Details'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent aria-label="Subject details">
              <DialogHeader>
                <DialogTitle className="text-primary">{detailSubject?.name || 'Subject Details'}</DialogTitle>
                <DialogDescription>{detailSubject?.code || ''}</DialogDescription>
              </DialogHeader>
              {detailError ? (
                <div className="text-destructive text-sm md:text-base">{detailError}</div>
              ) : (
                <div className="space-y-3 text-sm md:text-base">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{detailSubject?.teacher}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Progress</span>
                      <span>{detailSubject?.progress ?? 0}%</span>
                    </div>
                    <Progress value={detailSubject?.progress ?? 0} className="h-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Last Test</p>
                      <p className="font-medium">{detailSubject?.lastTest ?? 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Assignments</p>
                      <p className="font-medium">{detailSubject?.assignments ?? 0} pending</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Next: {detailSubject?.nextClass}</span>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
