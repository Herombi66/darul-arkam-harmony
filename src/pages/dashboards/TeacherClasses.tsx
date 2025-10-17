import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Users, BookOpen, TrendingUp, Search, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ClassData {
  id: string;
  name: string;
  level: string;
  students: number;
  subjects: string[];
  formTeacher: string;
  averagePerformance: number;
}

const mockClasses: ClassData[] = [
  {
    id: '1',
    name: 'SS2 A',
    level: 'Senior Secondary 2',
    students: 45,
    subjects: ['Mathematics', 'Physics'],
    formTeacher: 'Mrs. Fatima Ibrahim',
    averagePerformance: 78
  },
  {
    id: '2',
    name: 'SS3 B',
    level: 'Senior Secondary 3',
    students: 38,
    subjects: ['Physics'],
    formTeacher: 'Mr. Ahmed Musa',
    averagePerformance: 82
  },
  {
    id: '3',
    name: 'SS1 C',
    level: 'Senior Secondary 1',
    students: 42,
    subjects: ['Mathematics'],
    formTeacher: 'Mrs. Aisha Bello',
    averagePerformance: 75
  },
  {
    id: '4',
    name: 'SS2 B',
    level: 'Senior Secondary 2',
    students: 40,
    subjects: ['Mathematics'],
    formTeacher: 'Mr. Usman Kano',
    averagePerformance: 80
  }
];

export default function TeacherClasses() {
  const [classes] = useState<ClassData[]>(mockClasses);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.level.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'bg-success text-white';
    if (score >= 70) return 'bg-warning text-white';
    return 'bg-destructive text-white';
  };

  const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
  const avgPerformance = Math.round(
    classes.reduce((sum, cls) => sum + cls.averagePerformance, 0) / classes.length
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">My Classes</h1>
                <p className="text-muted-foreground">
                  Manage and view all classes you teach
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

          {/* Stats Overview */}
          <div className="grid md:grid-cols-3 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Classes</p>
                    <p className="text-2xl font-bold text-primary">{classes.length}</p>
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
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-accent rounded-full">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Performance</p>
                    <p className="text-2xl font-bold text-primary">{avgPerformance}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Search Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by class name or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Classes Table */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Classes Overview ({filteredClasses.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Subjects Teaching</TableHead>
                      <TableHead>Form Teacher</TableHead>
                      <TableHead>Avg Performance</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell>{cls.level}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            {cls.students}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {cls.subjects.map((subject, idx) => (
                              <Badge key={idx} variant="outline">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{cls.formTeacher}</TableCell>
                        <TableCell>
                          <Badge className={getPerformanceColor(cls.averagePerformance)}>
                            {cls.averagePerformance}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
