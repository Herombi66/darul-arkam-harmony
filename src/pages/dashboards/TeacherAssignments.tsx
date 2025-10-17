import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Plus,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  class: string;
  dueDate: string;
  totalSubmissions: number;
  totalStudents: number;
  status: 'pending' | 'graded' | 'overdue';
  description: string;
  createdDate: string;
}

const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Quadratic Equations Practice',
    subject: 'Mathematics',
    class: 'SS2 A',
    dueDate: '2024-01-25',
    totalSubmissions: 38,
    totalStudents: 45,
    status: 'pending',
    description: 'Solve 20 problems on quadratic equations',
    createdDate: '2024-01-18'
  },
  {
    id: '2',
    title: 'Newton\'s Laws of Motion',
    subject: 'Physics',
    class: 'SS3 B',
    dueDate: '2024-01-22',
    totalSubmissions: 35,
    totalStudents: 38,
    status: 'pending',
    description: 'Write a detailed explanation of Newton\'s three laws',
    createdDate: '2024-01-15'
  },
  {
    id: '3',
    title: 'Calculus Integration',
    subject: 'Mathematics',
    class: 'SS3 A',
    dueDate: '2024-01-20',
    totalSubmissions: 40,
    totalStudents: 40,
    status: 'graded',
    description: 'Complete integration exercises 1-15',
    createdDate: '2024-01-10'
  },
  {
    id: '4',
    title: 'Electromagnetic Waves',
    subject: 'Physics',
    class: 'SS2 A',
    dueDate: '2024-01-15',
    totalSubmissions: 42,
    totalStudents: 45,
    status: 'overdue',
    description: 'Research and present on electromagnetic spectrum',
    createdDate: '2024-01-08'
  }
];

export default function TeacherAssignments() {
  const [assignments] = useState<Assignment[]>(mockAssignments);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <Badge className="bg-success text-white"><CheckCircle className="h-3 w-3 mr-1" />Graded</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-white"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-destructive text-white"><AlertCircle className="h-3 w-3 mr-1" />Overdue</Badge>;
      default:
        return null;
    }
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const overdueCount = assignments.filter(a => a.status === 'overdue').length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Assignments</h1>
                <p className="text-muted-foreground">
                  Create, manage, and grade student assignments
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Assignment
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Assignment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Subject</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select subject" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mathematics">Mathematics</SelectItem>
                              <SelectItem value="physics">Physics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Class</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ss2a">SS2 A</SelectItem>
                              <SelectItem value="ss3b">SS3 B</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Assignment Title</Label>
                        <Input placeholder="Enter assignment title" />
                      </div>
                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea 
                          placeholder="Enter assignment instructions and requirements"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsCreateDialogOpen(false)}>
                          Create Assignment
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button asChild variant="outline">
                  <Link to="/dashboard/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">{assignments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning rounded-full">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-primary">{pendingCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Graded</p>
                    <p className="text-2xl font-bold text-primary">{gradedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-destructive rounded-full">
                    <AlertCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overdue</p>
                    <p className="text-2xl font-bold text-primary">{overdueCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments Tabs */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Assignments Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
                  <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                  <TabsTrigger value="graded">Graded ({gradedCount})</TabsTrigger>
                  <TabsTrigger value="overdue">Overdue ({overdueCount})</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-6">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Due Date</TableHead>
                          <TableHead>Submissions</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {assignments.map((assignment) => (
                          <TableRow key={assignment.id}>
                            <TableCell className="font-medium">{assignment.title}</TableCell>
                            <TableCell>{assignment.subject}</TableCell>
                            <TableCell>{assignment.class}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                {assignment.dueDate}
                              </div>
                            </TableCell>
                            <TableCell>
                              {assignment.totalSubmissions}/{assignment.totalStudents}
                            </TableCell>
                            <TableCell>{getStatusBadge(assignment.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="pending">
                  <div className="text-center py-8 text-muted-foreground">
                    Filter: Pending assignments
                  </div>
                </TabsContent>

                <TabsContent value="graded">
                  <div className="text-center py-8 text-muted-foreground">
                    Filter: Graded assignments
                  </div>
                </TabsContent>

                <TabsContent value="overdue">
                  <div className="text-center py-8 text-muted-foreground">
                    Filter: Overdue assignments
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
