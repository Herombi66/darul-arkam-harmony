import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  UserCheck,
  UserX,
  Users,
  Calendar,
  Save,
  Download,
  ArrowLeft,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  present: boolean;
}

const mockStudents: Student[] = [
  { id: '1', name: 'Ahmad Musa', admissionNumber: 'STU/2024/001', present: true },
  { id: '2', name: 'Fatima Abubakar', admissionNumber: 'STU/2024/002', present: true },
  { id: '3', name: 'Ibrahim Hassan', admissionNumber: 'STU/2024/003', present: false },
  { id: '4', name: 'Aisha Mohammed', admissionNumber: 'STU/2024/004', present: true },
  { id: '5', name: 'Yusuf Ibrahim', admissionNumber: 'STU/2024/005', present: true },
  { id: '6', name: 'Khadija Usman', admissionNumber: 'STU/2024/006', present: true },
  { id: '7', name: 'Abdullahi Sani', admissionNumber: 'STU/2024/007', present: false },
  { id: '8', name: 'Maryam Bello', admissionNumber: 'STU/2024/008', present: true }
];

export default function TeacherAttendance() {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedClass, setSelectedClass] = useState('ss2a');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const toggleAttendance = (id: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: true })));
  };

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: false })));
  };

  const presentCount = students.filter(s => s.present).length;
  const absentCount = students.length - presentCount;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Attendance Management</h1>
                <p className="text-muted-foreground">
                  Mark and track student attendance
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

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold text-primary">{students.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success rounded-full">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-primary">{presentCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-destructive rounded-full">
                    <UserX className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-primary">{absentCount}</p>
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
                    <p className="text-sm text-muted-foreground">Attendance Rate</p>
                    <p className="text-2xl font-bold text-primary">{attendanceRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Select Class & Date</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Class</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ss2a">SS2 A</SelectItem>
                      <SelectItem value="ss3b">SS3 B</SelectItem>
                      <SelectItem value="ss1c">SS1 C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="physics">Physics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Quick Actions</label>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={markAllPresent}>
                      All Present
                    </Button>
                    <Button variant="outline" size="sm" onClick={markAllAbsent}>
                      All Absent
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-primary">Mark Attendance</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Attendance
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Admission No.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Mark Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.admissionNumber}</TableCell>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>
                          {student.present ? (
                            <Badge className="bg-success text-white">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Present
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive text-white">
                              <UserX className="h-3 w-3 mr-1" />
                              Absent
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={student.present}
                              onCheckedChange={() => toggleAttendance(student.id)}
                            />
                            <span className="text-sm text-muted-foreground">Present</span>
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
