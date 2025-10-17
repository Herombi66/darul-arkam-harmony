import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BookOpen,
  Users,
  GraduationCap,
  Plus,
  Search,
  Edit,
  Trash2,
  FileText,
  Calendar,
  TrendingUp,
  Award
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface Subject {
  id: string;
  name: string;
  code: string;
  teacher: string;
  class: string;
  students: number;
  status: 'active' | 'inactive';
}

interface Enrollment {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  class: string;
  enrollmentDate: string;
  status: 'enrolled' | 'completed' | 'dropped';
}

interface Grade {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  class: string;
  term: string;
  academicYear: string;
  score: number;
  grade: string;
  remarks: string;
}

export default function AdminAcademics() {
  const [activeTab, setActiveTab] = useState('subjects');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data
  useEffect(() => {
    const mockSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        code: 'MATH101',
        teacher: 'Mrs. Fatima Ibrahim',
        class: 'JSS1',
        students: 45,
        status: 'active'
      },
      {
        id: '2',
        name: 'English Language',
        code: 'ENG101',
        teacher: 'Mr. Ahmed Musa',
        class: 'JSS1',
        students: 42,
        status: 'active'
      },
      {
        id: '3',
        name: 'Islamic Studies',
        code: 'ISL101',
        teacher: 'Dr. Muhammad Sani',
        class: 'JSS1',
        students: 48,
        status: 'active'
      }
    ];

    const mockEnrollments: Enrollment[] = [
      {
        id: '1',
        studentName: 'Ahmad Muhammad',
        studentId: 'STD001',
        subject: 'Mathematics',
        class: 'JSS1',
        enrollmentDate: '2024-09-01',
        status: 'enrolled'
      },
      {
        id: '2',
        studentName: 'Fatima Abubakar',
        studentId: 'STD002',
        subject: 'English Language',
        class: 'JSS1',
        enrollmentDate: '2024-09-01',
        status: 'enrolled'
      }
    ];

    const mockGrades: Grade[] = [
      {
        id: '1',
        studentName: 'Ahmad Muhammad',
        studentId: 'STD001',
        subject: 'Mathematics',
        class: 'JSS1',
        term: 'First Term',
        academicYear: '2024/2025',
        score: 85,
        grade: 'A',
        remarks: 'Excellent performance'
      },
      {
        id: '2',
        studentName: 'Fatima Abubakar',
        studentId: 'STD002',
        subject: 'English Language',
        class: 'JSS1',
        term: 'First Term',
        academicYear: '2024/2025',
        score: 78,
        grade: 'B+',
        remarks: 'Good understanding'
      }
    ];

    setSubjects(mockSubjects);
    setEnrollments(mockEnrollments);
    setGrades(mockGrades);
  }, []);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-success';
    if (grade.startsWith('B')) return 'text-primary';
    if (grade.startsWith('C')) return 'text-warning';
    return 'text-destructive';
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'enrolled':
        return 'default';
      case 'inactive':
      case 'dropped':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Academic Management</h1>
              <p className="text-muted-foreground">Manage courses, enrollments, and grades</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Subject
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success/10 rounded-full">
                    <Users className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Enrollments</p>
                    <p className="text-2xl font-bold text-success">{enrollments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning/10 rounded-full">
                    <Award className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grades Recorded</p>
                    <p className="text-2xl font-bold text-warning">{grades.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-full">
                    <TrendingUp className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Performance</p>
                    <p className="text-2xl font-bold text-accent">82%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="subjects">Subjects</TabsTrigger>
              <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>

            <TabsContent value="subjects" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Subject Management</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search subjects..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Students</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjects.map((subject) => (
                        <TableRow key={subject.id}>
                          <TableCell>
                            <div className="font-medium">{subject.name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{subject.code}</Badge>
                          </TableCell>
                          <TableCell>{subject.teacher}</TableCell>
                          <TableCell>{subject.class}</TableCell>
                          <TableCell>{subject.students}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(subject.status)}>
                              {subject.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Users className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="enrollments" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Student Enrollments</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search enrollments..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Student ID</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Enrollment Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {enrollment.studentName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{enrollment.studentName}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{enrollment.studentId}</Badge>
                          </TableCell>
                          <TableCell>{enrollment.subject}</TableCell>
                          <TableCell>{enrollment.class}</TableCell>
                          <TableCell>
                            {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(enrollment.status)}>
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grades" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Grade Management</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search grades..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select defaultValue="2024/2025">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024/2025">2024/2025</SelectItem>
                          <SelectItem value="2023/2024">2023/2024</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Term</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Remarks</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.map((grade) => (
                        <TableRow key={grade.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="/placeholder.svg" />
                                <AvatarFallback>
                                  {grade.studentName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{grade.studentName}</div>
                                <div className="text-sm text-muted-foreground">{grade.studentId}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{grade.subject}</TableCell>
                          <TableCell>{grade.class}</TableCell>
                          <TableCell>{grade.term}</TableCell>
                          <TableCell>
                            <span className="font-medium">{grade.score}%</span>
                          </TableCell>
                          <TableCell>
                            <span className={`font-bold ${getGradeColor(grade.grade)}`}>
                              {grade.grade}
                            </span>
                          </TableCell>
                          <TableCell>{grade.remarks}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}