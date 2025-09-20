import { useState } from 'react';
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

const assignments = [
  {
    id: 1,
    title: 'Organic Chemistry Lab Report',
    subject: 'Chemistry',
    teacher: 'Dr. Mohammed Usman',
    dueDate: '2024-03-25',
    dueTime: '11:59 PM',
    status: 'pending',
    priority: 'high',
    description: 'Complete lab report on organic compound identification experiment',
    maxScore: 100,
    submissions: 0,
    totalSubmissions: 1,
    type: 'lab_report'
  },
  {
    id: 2,
    title: 'Quadratic Equations Problem Set',
    subject: 'Mathematics',
    teacher: 'Mr. Ibrahim Hassan',
    dueDate: '2024-03-28',
    dueTime: '2:00 PM',
    status: 'pending',
    priority: 'medium',
    description: 'Solve 20 quadratic equation problems from chapter 8',
    maxScore: 50,
    submissions: 0,
    totalSubmissions: 1,
    type: 'problem_set'
  },
  {
    id: 3,
    title: 'Cell Division Essay',
    subject: 'Biology',
    teacher: 'Ms. Aisha Garba',
    dueDate: '2024-03-30',
    dueTime: '5:00 PM',
    status: 'draft',
    priority: 'medium',
    description: 'Write a 1500-word essay on mitosis and meiosis processes',
    maxScore: 75,
    submissions: 1,
    totalSubmissions: 1,
    type: 'essay'
  },
  {
    id: 4,
    title: 'Wave Motion Practical',
    subject: 'Physics',
    teacher: 'Mrs. Fatima Aliyu',
    dueDate: '2024-03-20',
    dueTime: '3:00 PM',
    status: 'submitted',
    priority: 'low',
    description: 'Complete practical experiment on wave properties',
    maxScore: 60,
    submissions: 1,
    totalSubmissions: 1,
    type: 'practical',
    score: 52,
    feedback: 'Good work on the experimental setup. Consider improving your data analysis.'
  },
  {
    id: 5,
    title: 'Romeo and Juliet Analysis',
    subject: 'English Language',
    teacher: 'Mr. John Okafor',
    dueDate: '2024-03-15',
    dueTime: '4:00 PM',
    status: 'graded',
    priority: 'low',
    description: 'Character analysis of Romeo and Juliet',
    maxScore: 80,
    submissions: 1,
    totalSubmissions: 1,
    type: 'essay',
    score: 72,
    feedback: 'Excellent analysis of character development. Well structured arguments.'
  }
];

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

export default function StudentAssignments() {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  const pendingAssignments = assignments.filter(a => a.status === 'pending' || a.status === 'draft');
  const submittedAssignments = assignments.filter(a => a.status === 'submitted');
  const gradedAssignments = assignments.filter(a => a.status === 'graded');

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
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.subject} • {assignment.teacher}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(assignment.priority)}>
                          {assignment.priority}
                        </Badge>
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assignment.dueTime}</span>
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
                              Upload your completed assignment for {assignment.subject}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="file">Upload File</Label>
                              <Input id="file" type="file" accept=".pdf,.doc,.docx,.txt" />
                            </div>
                            <div>
                              <Label htmlFor="comments">Additional Comments</Label>
                              <Textarea 
                                id="comments" 
                                placeholder="Any additional notes or comments about your submission..."
                                className="min-h-[100px]"
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline">Save as Draft</Button>
                              <Button>Submit Assignment</Button>
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
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.subject} • {assignment.teacher}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(assignment.status)}>
                        {assignment.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Submitted: {assignment.dueDate}</span>
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
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.subject} • {assignment.teacher}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-green-100 text-green-800">
                          {assignment.score}/{assignment.maxScore} ({Math.round((assignment.score! / assignment.maxScore) * 100)}%)
                        </Badge>
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
                        {getStatusIcon(assignment.status)}
                        <div>
                          <CardTitle className="text-lg">{assignment.title}</CardTitle>
                          <CardDescription>{assignment.subject} • {assignment.teacher}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {assignment.score && (
                          <Badge className="bg-green-100 text-green-800">
                            {assignment.score}/{assignment.maxScore}
                          </Badge>
                        )}
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{assignment.description}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Due: {assignment.dueDate}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{assignment.dueTime}</span>
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