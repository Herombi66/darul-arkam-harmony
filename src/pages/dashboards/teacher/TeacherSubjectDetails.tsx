import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const getGrade = (total: number) => {
  if (total >= 80) return 'A';
  if (total >= 70) return 'B+';
  if (total >= 60) return 'B';
  if (total >= 50) return 'B-';
  if (total >= 40) return 'C';
  return 'F';
};

const getRemark = (grade: string) => {
  switch (grade) {
    case 'A': return 'Excellent';
    case 'B+': return 'Very Good';
    case 'B': return 'Good';
    case 'B-': return 'Satisfactory';
    case 'C': return 'Pass';
    default: return 'Fail';
  }
};

export default function TeacherSubjectDetails() {
  const { subject } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/teacher/subjects/${subject}/students`);
      if (!response.ok) throw new Error('Failed to fetch students');
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [subject]);

  const handleScoreChange = (studentId, field, value) => {
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        const updated = { ...student.scores, [field]: parseInt(value) || 0 };
        const total = updated.ca1 + updated.ca2 + updated.ca3 + updated.exam;
        const grade = getGrade(total);
        const remark = getRemark(grade);
        return {
          ...student,
          scores: updated,
          total,
          grade,
          remark
        };
      }
      return student;
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/teacher/subjects/${subject}/scores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(students)
      });
      if (!response.ok) throw new Error('Failed to save scores');
      alert('Scores saved successfully!');
    } catch (err) {
      alert('Error saving scores: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar userType="teacher" />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading students...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar userType="teacher" />
        <main className="flex-1 flex items-center justify-center">
          <div>Error: {error}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userType="teacher" />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{subject} Scores</h1>
              <p className="text-muted-foreground">Update student scores for {subject}</p>
            </div>
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link to="/dashboard/teacher">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Scores'}
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Student Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead className="text-center">CA1 (10)</TableHead>
                      <TableHead className="text-center">CA2 (10)</TableHead>
                      <TableHead className="text-center">CA3 (10)</TableHead>
                      <TableHead className="text-center">Exam (70)</TableHead>
                      <TableHead className="text-center">Total (100)</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead>Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={student.scores.ca1}
                            onChange={(e) => handleScoreChange(student.id, 'ca1', e.target.value)}
                            className="w-16 text-center"
                            min="0"
                            max="10"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={student.scores.ca2}
                            onChange={(e) => handleScoreChange(student.id, 'ca2', e.target.value)}
                            className="w-16 text-center"
                            min="0"
                            max="10"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={student.scores.ca3}
                            onChange={(e) => handleScoreChange(student.id, 'ca3', e.target.value)}
                            className="w-16 text-center"
                            min="0"
                            max="10"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <Input
                            type="number"
                            value={student.scores.exam}
                            onChange={(e) => handleScoreChange(student.id, 'exam', e.target.value)}
                            className="w-16 text-center"
                            min="0"
                            max="70"
                          />
                        </TableCell>
                        <TableCell className="text-center font-bold">{student.total}</TableCell>
                        <TableCell className="text-center">
                          <Badge>{student.grade}</Badge>
                        </TableCell>
                        <TableCell>{student.remark}</TableCell>
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