import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  ArrowLeft,
  Download,
  Printer,
  Plus,
  Edit,
  Eye,
  Filter,
  Search,
  FileText,
  Calendar,
  UserCheck,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StudentRecord {
  id: string;
  name: string;
  class: string;
  subject: string;
  attendance: number;
  assignments: {
    submitted: number;
    total: number;
    average: number;
  };
  grades: {
    ca1: number;
    ca2: number;
    ca3: number;
    exam: number;
    total: number;
    grade: string;
    remark: string;
  };
  lastUpdated: string;
}

const mockRecords: StudentRecord[] = [
  {
    id: '1',
    name: 'Ahmad Musa',
    class: 'SS2 A',
    subject: 'Mathematics',
    attendance: 95,
    assignments: { submitted: 8, total: 10, average: 85 },
    grades: { ca1: 25, ca2: 28, ca3: 26, exam: 75, total: 154, grade: 'A', remark: 'Excellent' },
    lastUpdated: '2024-09-20'
  },
  {
    id: '2',
    name: 'Fatima Abubakar',
    class: 'SS2 A',
    subject: 'Mathematics',
    attendance: 88,
    assignments: { submitted: 7, total: 10, average: 78 },
    grades: { ca1: 22, ca2: 24, ca3: 23, exam: 68, total: 137, grade: 'B+', remark: 'Very Good' },
    lastUpdated: '2024-09-19'
  },
  {
    id: '3',
    name: 'Ibrahim Hassan',
    class: 'SS2 B',
    subject: 'Physics',
    attendance: 92,
    assignments: { submitted: 9, total: 10, average: 82 },
    grades: { ca1: 24, ca2: 26, ca3: 25, exam: 72, total: 147, grade: 'A-', remark: 'Good' },
    lastUpdated: '2024-09-18'
  }
];

export default function TeacherRecordSheet() {
  const [records, setRecords] = useState<StudentRecord[]>(mockRecords);
  const [filteredRecords, setFilteredRecords] = useState<StudentRecord[]>(mockRecords);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<StudentRecord | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const classes = ['SS1 A', 'SS1 B', 'SS2 A', 'SS2 B', 'SS3 A', 'SS3 B'];

  useEffect(() => {
    filterRecords();
  }, [records, selectedSubject, selectedClass, searchTerm]);

  const filterRecords = () => {
    let filtered = records;

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(record => record.subject === selectedSubject);
    }

    if (selectedClass !== 'all') {
      filtered = filtered.filter(record => record.class === selectedClass);
    }

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecords(filtered);
  };

  const handleEditRecord = (record: StudentRecord) => {
    setEditingRecord({ ...record });
    setIsEditDialogOpen(true);
  };

  const handleSaveRecord = () => {
    if (editingRecord) {
      const updatedRecords = records.map(record =>
        record.id === editingRecord.id ? editingRecord : record
      );
      setRecords(updatedRecords);
      setIsEditDialogOpen(false);
      setEditingRecord(null);
    }
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting records as ${format.toUpperCase()}...`);
  };

  const handlePrint = () => {
    window.print();
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100 text-green-800';
    if (percentage >= 80) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };


  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Record Sheet</h1>
                <p className="text-muted-foreground">
                  Manage and view student records, grades, and attendance
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" onClick={() => handleExport('csv')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button asChild variant="outline">
                  <Link to="/dashboard/teacher">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-filter">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class-filter">Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map(className => (
                        <SelectItem key={className} value={className}>{className}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="search">Search Student</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Record
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records Table */}
          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Student Records ({filteredRecords.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Assignments</TableHead>
                      <TableHead>Scores</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{record.name}</p>
                            <p className="text-sm text-muted-foreground">ID: {record.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{record.subject}</TableCell>
                        <TableCell>
                          <Badge className={getAttendanceColor(record.attendance)}>
                            {record.attendance}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{record.assignments.submitted}/{record.assignments.total}</p>
                            <p className="text-muted-foreground">Avg: {record.assignments.average}%</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline">
                              Total: {record.grades.total}%
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              CA: {record.grades.ca1 + record.grades.ca2 + record.grades.ca3}/30 | Exam: {record.grades.exam}/70
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRecord(record)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
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

          {/* Edit Record Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Student Record</DialogTitle>
              </DialogHeader>
              {editingRecord && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Student Name</Label>
                      <Input value={editingRecord.name} readOnly />
                    </div>
                    <div>
                      <Label>Class</Label>
                      <Input value={editingRecord.class} readOnly />
                    </div>
                  </div>

                  <Tabs defaultValue="grades" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="grades">Grades</TabsTrigger>
                      <TabsTrigger value="attendance">Attendance</TabsTrigger>
                      <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    </TabsList>

                    <TabsContent value="grades" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>CA1 (10)</Label>
                          <Input
                            type="number"
                            value={editingRecord.grades.ca1}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              grades: { ...editingRecord.grades, ca1: parseInt(e.target.value) || 0 }
                            })}
                          />
                        </div>
                        <div>
                          <Label>CA2 (10)</Label>
                          <Input
                            type="number"
                            value={editingRecord.grades.ca2}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              grades: { ...editingRecord.grades, ca2: parseInt(e.target.value) || 0 }
                            })}
                          />
                        </div>
                        <div>
                          <Label>CA3 (10)</Label>
                          <Input
                            type="number"
                            value={editingRecord.grades.ca3}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              grades: { ...editingRecord.grades, ca3: parseInt(e.target.value) || 0 }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Exam (70)</Label>
                          <Input
                            type="number"
                            value={editingRecord.grades.exam}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              grades: { ...editingRecord.grades, exam: parseInt(e.target.value) || 0 }
                            })}
                          />
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Note:</strong> Grades and remarks will be calculated and released by the Exam Officer.
                          You can only input the raw scores here.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="space-y-4">
                      <div>
                        <Label>Attendance Percentage</Label>
                        <Input
                          type="number"
                          value={editingRecord.attendance}
                          onChange={(e) => setEditingRecord({
                            ...editingRecord,
                            attendance: parseInt(e.target.value) || 0
                          })}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="assignments" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Submitted</Label>
                          <Input
                            type="number"
                            value={editingRecord.assignments.submitted}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              assignments: {
                                ...editingRecord.assignments,
                                submitted: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                        <div>
                          <Label>Total</Label>
                          <Input
                            type="number"
                            value={editingRecord.assignments.total}
                            onChange={(e) => setEditingRecord({
                              ...editingRecord,
                              assignments: {
                                ...editingRecord.assignments,
                                total: parseInt(e.target.value) || 0
                              }
                            })}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveRecord}>
                      Save Changes
                    </Button>
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