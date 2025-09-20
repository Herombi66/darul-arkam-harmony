import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Clock, GraduationCap, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface SubjectDetail {
  id: string;
  name: string;
  icon: any;
  description: string;
  teacher: string;
  schedule: string;
  grade: string;
  color: string;
  progress: number;
  assignments: Array<{
    id: string;
    title: string;
    dueDate: string;
    status: 'completed' | 'pending' | 'overdue';
  }>;
  topics: string[];
  resources: Array<{
    id: string;
    title: string;
    type: 'pdf' | 'video' | 'link';
  }>;
}

const subjectDetails: Record<string, SubjectDetail> = {
  mathematics: {
    id: 'mathematics',
    name: 'Mathematics',
    icon: BookOpen,
    description: 'Advanced algebra, geometry, and calculus concepts covering SS3 curriculum',
    teacher: 'Mr. Adebayo Johnson',
    schedule: 'Mon, Wed, Fri - 8:00 AM - 9:30 AM',
    grade: 'A-',
    color: 'bg-blue-500',
    progress: 75,
    assignments: [
      { id: '1', title: 'Quadratic Equations Assignment', dueDate: '2024-01-20', status: 'completed' },
      { id: '2', title: 'Geometry Proofs', dueDate: '2024-01-25', status: 'pending' },
      { id: '3', title: 'Calculus Introduction', dueDate: '2024-01-15', status: 'overdue' }
    ],
    topics: ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics'],
    resources: [
      { id: '1', title: 'Mathematics Textbook PDF', type: 'pdf' },
      { id: '2', title: 'Geometry Tutorial Video', type: 'video' },
      { id: '3', title: 'Online Calculator Tool', type: 'link' }
    ]
  },
  science: {
    id: 'science',
    name: 'Science',
    icon: BookOpen,
    description: 'Integrated science covering physics, chemistry, and biology',
    teacher: 'Mrs. Fatima Ibrahim',
    schedule: 'Tue, Thu - 9:00 AM - 10:30 AM',
    grade: 'B+',
    color: 'bg-green-500',
    progress: 60,
    assignments: [
      { id: '1', title: 'Physics Lab Report', dueDate: '2024-01-22', status: 'pending' },
      { id: '2', title: 'Chemistry Experiment', dueDate: '2024-01-18', status: 'completed' }
    ],
    topics: ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
    resources: [
      { id: '1', title: 'Science Lab Manual', type: 'pdf' },
      { id: '2', title: 'Virtual Lab Simulation', type: 'link' }
    ]
  },
  english: {
    id: 'english',
    name: 'English Language',
    icon: BookOpen,
    description: 'Literature analysis, grammar, and communication skills',
    teacher: 'Ms. Grace Okafor',
    schedule: 'Mon, Tue, Thu - 10:00 AM - 11:30 AM',
    grade: 'A',
    color: 'bg-purple-500',
    progress: 85,
    assignments: [
      { id: '1', title: 'Essay on Shakespeare', dueDate: '2024-01-28', status: 'pending' },
      { id: '2', title: 'Grammar Quiz', dueDate: '2024-01-19', status: 'completed' }
    ],
    topics: ['Literature', 'Grammar', 'Writing', 'Speaking', 'Reading Comprehension'],
    resources: [
      { id: '1', title: 'English Literature Anthology', type: 'pdf' },
      { id: '2', title: 'Writing Skills Workshop', type: 'video' }
    ]
  },
  history: {
    id: 'history',
    name: 'History',
    icon: BookOpen,
    description: 'World history and Nigerian heritage studies',
    teacher: 'Mr. Samuel Eze',
    schedule: 'Wed, Fri - 11:00 AM - 12:30 PM',
    grade: 'B',
    color: 'bg-orange-500',
    progress: 50,
    assignments: [
      { id: '1', title: 'Nigerian Civil War Research', dueDate: '2024-01-30', status: 'pending' }
    ],
    topics: ['Ancient Civilizations', 'World Wars', 'African History', 'Nigerian History'],
    resources: [
      { id: '1', title: 'History Timeline Interactive', type: 'link' }
    ]
  },
  art: {
    id: 'art',
    name: 'Fine Arts',
    icon: BookOpen,
    description: 'Drawing, painting, and creative expression techniques',
    teacher: 'Mrs. Amina Hassan',
    schedule: 'Tue, Fri - 1:00 PM - 2:30 PM',
    grade: 'A-',
    color: 'bg-pink-500',
    progress: 70,
    assignments: [
      { id: '1', title: 'Landscape Painting', dueDate: '2024-01-26', status: 'pending' }
    ],
    topics: ['Drawing', 'Painting', 'Sculpture', 'Art History', 'Design'],
    resources: [
      { id: '1', title: 'Art Techniques Video Series', type: 'video' }
    ]
  },
  music: {
    id: 'music',
    name: 'Music',
    icon: BookOpen,
    description: 'Music theory, composition, and performance skills',
    teacher: 'Mr. David Nwosu',
    schedule: 'Mon, Wed - 2:00 PM - 3:30 PM',
    grade: 'B+',
    color: 'bg-indigo-500',
    progress: 65,
    assignments: [
      { id: '1', title: 'Composition Assignment', dueDate: '2024-01-24', status: 'pending' }
    ],
    topics: ['Music Theory', 'Composition', 'Performance', 'Music History'],
    resources: [
      { id: '1', title: 'Music Theory Workbook', type: 'pdf' }
    ]
  },
  'physical-education': {
    id: 'physical-education',
    name: 'Physical Education',
    icon: BookOpen,
    description: 'Sports, fitness, and health education',
    teacher: 'Coach Musa Ahmed',
    schedule: 'Tue, Thu, Sat - 3:00 PM - 4:30 PM',
    grade: 'A',
    color: 'bg-red-500',
    progress: 90,
    assignments: [
      { id: '1', title: 'Fitness Assessment', dueDate: '2024-01-21', status: 'completed' }
    ],
    topics: ['Sports', 'Fitness', 'Health Education', 'Teamwork'],
    resources: [
      { id: '1', title: 'Exercise Guidelines', type: 'pdf' }
    ]
  },
  'civic-education': {
    id: 'civic-education',
    name: 'Civic Education',
    icon: BookOpen,
    description: 'Citizenship, government, and social studies',
    teacher: 'Mrs. Ngozi Okoye',
    schedule: 'Wed, Fri - 12:00 PM - 1:30 PM',
    grade: 'B',
    color: 'bg-teal-500',
    progress: 55,
    assignments: [
      { id: '1', title: 'Government Systems Essay', dueDate: '2024-01-27', status: 'pending' }
    ],
    topics: ['Government', 'Citizenship', 'Rights & Responsibilities', 'Democracy'],
    resources: [
      { id: '1', title: 'Civic Education Handbook', type: 'pdf' }
    ]
  }
};

export default function StudentSubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const subject = subjectId ? subjectDetails[subjectId] : null;

  if (!subject) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <DashboardSidebar userType="student" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary mb-2">Subject Not Found</h1>
            <p className="text-muted-foreground mb-4">The requested subject could not be found.</p>
            <Button asChild>
              <Link to="/dashboard/student/academics/subjects">Back to Subjects</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'overdue':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4 animate-fade-in">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/student/academics/subjects">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Subjects
              </Link>
            </Button>
          </div>

          {/* Subject Header */}
          <Card className="border-0 shadow-elevation animate-slide-up">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-full ${subject.color} text-white`}>
                    <subject.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-primary">{subject.name}</h1>
                    <p className="text-muted-foreground mt-1">{subject.description}</p>
                    <div className="flex items-center space-x-4 mt-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        {subject.teacher}
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {subject.schedule}
                      </div>
                      <Badge variant="secondary">{subject.grade}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground mb-2">Progress</div>
                  <div className="text-2xl font-bold text-primary mb-2">{subject.progress}%</div>
                  <Progress value={subject.progress} className="w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject Details Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-muted-foreground">{subject.description}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Teacher</h4>
                      <p className="text-sm text-muted-foreground">{subject.teacher}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Schedule</h4>
                      <p className="text-sm text-muted-foreground">{subject.schedule}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Grade</h4>
                      <Badge variant="secondary" className="text-lg px-3 py-1">{subject.grade}</Badge>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Progress</h4>
                      <Progress value={subject.progress} className="mb-2" />
                      <p className="text-sm text-muted-foreground">{subject.progress}% complete</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="assignments" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.assignments.map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(assignment.status)}
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">Due: {assignment.dueDate}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="topics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Topics Covered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subject.topics.map((topic, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span className="text-sm font-medium">{topic}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Learning Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subject.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground capitalize">{resource.type}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Access
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}