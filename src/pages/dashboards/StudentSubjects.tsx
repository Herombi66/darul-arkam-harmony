import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  Calculator,
  FlaskConical,
  BookOpen,
  Clock,
  Users,
  ChevronRight,
  GraduationCap,
  Globe,
  Palette,
  Music,
  Activity
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface Subject {
  id: string;
  name: string;
  icon: any;
  description: string;
  teacher: string;
  schedule: string;
  grade: string;
  color: string;
}

export default function StudentSubjects() {
  const subjects: Subject[] = [
    {
      id: 'mathematics',
      name: 'Mathematics',
      icon: Calculator,
      description: 'Advanced algebra, geometry, and calculus concepts',
      teacher: 'Mr. Adebayo Johnson',
      schedule: 'Mon, Wed, Fri - 8:00 AM',
      grade: 'A-',
      color: 'bg-blue-500'
    },
    {
      id: 'science',
      name: 'Science',
      icon: FlaskConical,
      description: 'Physics, chemistry, and biology fundamentals',
      teacher: 'Mrs. Fatima Ibrahim',
      schedule: 'Tue, Thu - 9:00 AM',
      grade: 'B+',
      color: 'bg-green-500'
    },
    {
      id: 'english',
      name: 'English Language',
      icon: BookOpen,
      description: 'Literature, grammar, and communication skills',
      teacher: 'Ms. Grace Okafor',
      schedule: 'Mon, Tue, Thu - 10:00 AM',
      grade: 'A',
      color: 'bg-purple-500'
    },
    {
      id: 'history',
      name: 'History',
      icon: Globe,
      description: 'World history and Nigerian heritage',
      teacher: 'Mr. Samuel Eze',
      schedule: 'Wed, Fri - 11:00 AM',
      grade: 'B',
      color: 'bg-orange-500'
    },
    {
      id: 'art',
      name: 'Fine Arts',
      icon: Palette,
      description: 'Drawing, painting, and creative expression',
      teacher: 'Mrs. Amina Hassan',
      schedule: 'Tue, Fri - 1:00 PM',
      grade: 'A-',
      color: 'bg-pink-500'
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      description: 'Theory, composition, and performance',
      teacher: 'Mr. David Nwosu',
      schedule: 'Mon, Wed - 2:00 PM',
      grade: 'B+',
      color: 'bg-indigo-500'
    },
    {
      id: 'physical-education',
      name: 'Physical Education',
      icon: Activity,
      description: 'Sports, fitness, and health education',
      teacher: 'Coach Musa Ahmed',
      schedule: 'Tue, Thu, Sat - 3:00 PM',
      grade: 'A',
      color: 'bg-red-500'
    },
    {
      id: 'civic-education',
      name: 'Civic Education',
      icon: Users,
      description: 'Citizenship, government, and social studies',
      teacher: 'Mrs. Ngozi Okoye',
      schedule: 'Wed, Fri - 12:00 PM',
      grade: 'B',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">My Subjects</h1>
            <p className="text-muted-foreground">
              View and manage your enrolled subjects for the current semester
            </p>
          </div>

          {/* Subjects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-up">
            {subjects.map((subject, index) => (
              <Card
                key={subject.id}
                className="hover-lift border-0 shadow-elevation group cursor-pointer transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-full ${subject.color} text-white`}>
                      <subject.icon className="h-6 w-6" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {subject.grade}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {subject.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {subject.description}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      <span className="truncate">{subject.teacher}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{subject.schedule}</span>
                    </div>
                  </div>

                  <Link to={`/dashboard/student/academics/subjects/${subject.id}`}>
                    <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <span className="flex items-center justify-between w-full">
                        <span>View Details</span>
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Subjects</p>
                    <p className="text-2xl font-bold text-primary">{subjects.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success rounded-full">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Average Grade</p>
                    <p className="text-2xl font-bold text-primary">B+</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Hours</p>
                    <p className="text-2xl font-bold text-primary">24</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}