import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import DashboardSidebar from '@/components/DashboardSidebar';
import { FileText, Calendar, Clock, Upload, Eye, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-800';
    case 'draft': return 'bg-yellow-100 text-yellow-800';
    case 'submitted': return 'bg-blue-100 text-blue-800';
    case 'graded': return 'bg-green-100 text-green-800';
    case 'overdue': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <AlertCircle className="h-4 w-4" />;
    case 'draft': return <FileText className="h-4 w-4" />;
    case 'submitted': return <CheckCircle className="h-4 w-4" />;
    case 'graded': return <CheckCircle className="h-4 w-4" />;
    case 'overdue': return <XCircle className="h-4 w-4" />;
    default: return <FileText className="h-4 w-4" />;
  }
};

type Course = { name?: string; courseCode?: string };
type Assignment = {
  id: string;
  title: string;
  description?: string;
  course?: Course;
  dueDate: string;
  maxScore?: number;
  priority?: 'high' | 'medium' | 'low';
  status?: 'pending' | 'draft' | 'submitted' | 'graded' | 'overdue';
  submissionDate?: string;
  score?: number | null;
  feedback?: string;
};

const getUiStatus = (assignment: Assignment) => {
  if (assignment?.status) return assignment.status;
  if (assignment?.score !== undefined && assignment?.score !== null) return 'graded';
  if (assignment?.submissionDate) return 'submitted';
  if (assignment?.dueDate && new Date(assignment.dueDate).getTime() < Date.now()) return 'overdue';
  return 'pending';
};

export default function StudentAssignments() {
  const { token } = useAuth();
  const { toast } = useToast();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [comments, setComments] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/assignments', {
          headers: {
            Authorization: `Bearer ${token ?? ''}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        const json = await res.json();
        const items = (Array.isArray(json?.data) ? (json.data as unknown[]) : []) as unknown[];
        const normalized: Assignment[] = items.map((raw) => {
          const a = raw as Record<string, unknown>;
          const id = (a['_id'] as string) ?? (a['id'] as string) ?? '';
          return {
            id,
            title: String(a['title'] ?? 'Untitled Assignment'),
            description: typeof a['description'] === 'string' ? (a['description'] as string) : undefined,
            course: a['course'] as Course | undefined,
            dueDate: String(a['dueDate'] ?? new Date().toISOString()),
            maxScore: typeof a['maxScore'] === 'number' ? (a['maxScore'] as number) : undefined,
            priority: (a['priority'] as Assignment['priority']) ?? 'medium',
            status: a['status'] as Assignment['status'] | undefined,
            submissionDate: typeof a['submissionDate'] === 'string' ? (a['submissionDate'] as string) : undefined,
            score: typeof a['score'] === 'number' ? (a['score'] as number) : null,
            feedback: typeof a['feedback'] === 'string' ? (a['feedback'] as string) : undefined,
          };
        });
        setAssignments(normalized);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load assignments';
        setError(msg);
        setAssignments([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAssignments();
    } else {
      setLoading(false);
      setError('Authentication required');
      setAssignments([]);
    }
  }, [token]);

  const pendingAssignments = assignments.filter((a) => getUiStatus(a) === 'pending' || getUiStatus(a) === 'draft');
  const submittedAssignments = assignments.filter((a) => getUiStatus(a) === 'submitted');
  const gradedAssignments = assignments.filter((a) => getUiStatus(a) === 'graded');

  const handleSubmitAssignment = async () => {
    try {
      if (!selectedAssignment) {
        toast({ title: 'No assignment selected', description: 'Please choose an assignment to submit.', variant: 'destructive' });
        return;
      }
      if (!uploadFile) {
        toast({ title: 'No file attached', description: 'Please upload a file before submitting.', variant: 'destructive' });
        return;
      }
      if (!token) {
        toast({ title: 'Authentication required', description: 'Please login again to submit assignments.', variant: 'destructive' });
        return;
      }
      setSubmitting(true);
      const res = await fetch(`/api/assignments/${selectedAssignment.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          files: [
            {
              filename: uploadFile.name,
              size: uploadFile.size,
              type: uploadFile.type,
            },
          ],
          comments,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || `Submission failed (HTTP ${res.status})`);
      }

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === selectedAssignment.id
            ? { ...a, submissionDate: new Date().toISOString(), status: 'submitted' }
            : a
        )
      );
      setUploadFile(null);
      setComments('');
      toast({ title: 'Assignment submitted', description: data?.message || 'Your assignment was submitted successfully.' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit assignment';
      toast({ title: 'Submission error', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar userType="student" />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold text-foreground">Loading assignments...</h1>
            <p className="text-muted-foreground">Please wait while we fetch your assignments.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar userType="student" />
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-red-600">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">My Assignments</h1>
            <p className="text-muted-foreground">Track and manage your academic assignments</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{pendingAssignments.length}</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{submittedAssignments.length}</div>
                <p className="text-xs text-muted-foreground">Awaiting grades</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Graded</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{gradedAssignments.length}</div>
                <p className="text-xs text-muted-foreground">Completed this term</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">76%</div>
                <p className="text-xs text-muted-foreground">This term</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({submittedAssignments.length})</TabsTrigger>
              <TabsTrigger value="graded">Graded ({gradedAssignments.length})</TabsTrigger>
              <TabsTrigger value="all">All Assignments</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pendingAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(getUiStatus(assignment))}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.course?.name || assignment.course?.courseCode || 'Assignment'}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                        <Badge className={getStatusColor(getUiStatus(assignment))}>
                          {getUiStatus(assignment)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(assignment.dueDate).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Max Score: {assignment.maxScore}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button onClick={() => setSelectedAssignment(assignment)}>
                            <Upload className="h-4 w-4 mr-2" />
                            Submit Assignment
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Submit Assignment: {assignment.title}</DialogTitle>
                            <DialogDescription>
                              Upload your completed assignment for {assignment.course?.name || assignment.course?.courseCode || 'Assignment'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="file">Upload File</Label>
                              <Input id="file" type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} />
                            </div>
                            <div>
                              <Label htmlFor="comments">Additional Comments</Label>
                              <Textarea 
                                id="comments" 
                                placeholder="Any additional notes or comments about your submission..."
                                className="min-h-[100px]"
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => {
                                if (!selectedAssignment) return;
                                setAssignments((prev) => prev.map((a) => a.id === selectedAssignment.id ? { ...a, status: 'draft' } : a));
                                toast({ title: 'Draft saved', description: 'Your draft has been saved locally.' });
                              }}>Save as Draft</Button>
                              <Button onClick={handleSubmitAssignment} disabled={submitting || !uploadFile}>
                                {submitting ? 'Submitting...' : 'Submit Assignment'}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              {submittedAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(getUiStatus(assignment))}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.course?.name || assignment.course?.courseCode || 'Assignment'}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(getUiStatus(assignment))}>
                        {getUiStatus(assignment)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Submitted: {new Date(assignment.submissionDate || assignment.dueDate).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Max Score: {assignment.maxScore}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                        <span className="text-sm text-blue-600">Awaiting Grade</span>
                      </div>
                    </div>

                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Submission
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="graded" className="space-y-4">
              {gradedAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(getUiStatus(assignment))}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.course?.name || assignment.course?.courseCode || 'Assignment'}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(getUiStatus(assignment))}>
                          {getUiStatus(assignment)}
                        </Badge>
                        {assignment.score !== undefined && assignment.maxScore !== undefined && (
                          <Badge className="bg-green-100 text-green-800">
                            {assignment.score}/{assignment.maxScore} ({Math.round((assignment.score! / assignment.maxScore) * 100)}%)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    {assignment.feedback && (
                      <div className="bg-muted/50 p-3 rounded-lg mb-4">
                        <h4 className="font-medium text-sm mb-1">Teacher Feedback:</h4>
                        <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Submission
                      </Button>
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Download Feedback
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="all" className="space-y-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(getUiStatus(assignment))}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.course?.name || assignment.course?.courseCode || 'Assignment'}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(getUiStatus(assignment))}>
                          {getUiStatus(assignment)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{new Date(assignment.dueDate).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Max Score: {assignment.maxScore}</span>
                      </div>
                    </div>

                    <Button variant="outline">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
