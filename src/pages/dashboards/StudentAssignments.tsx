import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  BookOpen,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  MessageSquare,
  Calendar,
  Star,
  Send
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface Assignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  grade?: string;
  feedback?: string;
  submissionInstructions: string;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  resources: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  submittedAt?: string;
  gradedAt?: string;
}

export default function StudentAssignments() {
  const assignments: Assignment[] = [
    {
      id: '1',
      title: 'Mathematics Problem Set - Quadratic Equations',
      description: 'Complete the quadratic equations worksheet and show all working steps. Include both algebraic and graphical solutions.',
      subject: 'Mathematics',
      dueDate: '2024-01-25',
      status: 'pending',
      submissionInstructions: 'Submit your solutions as a PDF file. Include your name and class at the top.',
      attachments: [
        { name: 'Quadratic_Equations_Worksheet.pdf', url: '#', type: 'pdf' }
      ],
      resources: [
        { name: 'Quadratic Formula Guide.pdf', url: '#', type: 'pdf' },
        { name: 'Video Tutorial - Solving Quadratics', url: '#', type: 'video' }
      ]
    },
    {
      id: '2',
      title: 'Physics Lab Report - Projectile Motion',
      description: 'Write a complete lab report on the projectile motion experiment conducted in class.',
      subject: 'Science',
      dueDate: '2024-01-22',
      status: 'submitted',
      submittedAt: '2024-01-20',
      submissionInstructions: 'Submit as a Word document with proper formatting and include all required sections.',
      attachments: [
        { name: 'Lab_Data_Sheet.xlsx', url: '#', type: 'excel' }
      ],
      resources: [
        { name: 'Lab_Report_Template.docx', url: '#', type: 'word' }
      ]
    },
    {
      id: '3',
      title: 'English Literature Essay - Shakespeare Analysis',
      description: 'Write a 1000-word essay analyzing the themes of love and betrayal in Romeo and Juliet.',
      subject: 'English Language',
      dueDate: '2024-01-28',
      status: 'graded',
      grade: 'A-',
      feedback: 'Excellent analysis of themes. Your thesis statement is strong, but consider adding more textual evidence in the body paragraphs.',
      gradedAt: '2024-01-30',
      submissionInstructions: 'Submit as a PDF or Word document. Use MLA formatting.',
      attachments: [],
      resources: [
        { name: 'Romeo_and_Juliet_Text.pdf', url: '#', type: 'pdf' },
        { name: 'Essay_Writing_Guide.pdf', url: '#', type: 'pdf' }
      ]
    },
    {
      id: '4',
      title: 'History Research Project - Nigerian Civil War',
      description: 'Research and present on the causes and consequences of the Nigerian Civil War.',
      subject: 'History',
      dueDate: '2024-01-30',
      status: 'overdue',
      submissionInstructions: 'Submit a 1500-word research paper with proper citations.',
      attachments: [],
      resources: [
        { name: 'Research_Database_Access.pdf', url: '#', type: 'pdf' }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'graded':
        return <Star className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'submitted':
        return 'text-blue-600 bg-blue-50';
      case 'graded':
        return 'text-green-600 bg-green-50';
      case 'overdue':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const pendingCount = assignments.filter(a => a.status === 'pending').length;
  const submittedCount = assignments.filter(a => a.status === 'submitted').length;
  const gradedCount = assignments.filter(a => a.status === 'graded').length;
  const overdueCount = assignments.filter(a => a.status === 'overdue').length;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">My Assignments</h1>
            <p className="text-muted-foreground">
              View, submit, and track your academic assignments
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-500 rounded-full">
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
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Send className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Submitted</p>
                    <p className="text-2xl font-bold text-primary">{submittedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500 rounded-full">
                    <Star className="h-6 w-6 text-white" />
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
                  <div className="p-3 bg-red-500 rounded-full">
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
          <Tabs defaultValue="all" className="animate-fade-in">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
              <TabsTrigger value="submitted">Submitted ({submittedCount})</TabsTrigger>
              <TabsTrigger value="graded">Graded ({gradedCount})</TabsTrigger>
              <TabsTrigger value="overdue">Overdue ({overdueCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {assignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              {assignments.filter(a => a.status === 'pending').map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              {assignments.filter(a => a.status === 'submitted').map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </TabsContent>

            <TabsContent value="graded" className="space-y-4">
              {assignments.filter(a => a.status === 'graded').map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </TabsContent>

            <TabsContent value="overdue" className="space-y-4">
              {assignments.filter(a => a.status === 'overdue').map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'graded':
        return <Star className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'submitted':
        return 'text-blue-600 bg-blue-50';
      case 'graded':
        return 'text-green-600 bg-green-50';
      case 'overdue':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="border-0 shadow-elevation hover-lift">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                {assignment.subject}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Due: {new Date(assignment.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Badge variant="outline" className={getStatusColor(assignment.status)}>
            <div className="flex items-center space-x-1">
              {getStatusIcon(assignment.status)}
              <span className="capitalize">{assignment.status}</span>
            </div>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{assignment.description}</p>

        {/* Submission Instructions */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <h4 className="font-medium text-sm mb-1">Submission Instructions:</h4>
          <p className="text-sm text-muted-foreground">{assignment.submissionInstructions}</p>
        </div>

        {/* Attachments */}
        {assignment.attachments.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Attachments:</h4>
            <div className="space-y-2">
              {assignment.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{attachment.name}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        {assignment.resources.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Resources:</h4>
            <div className="space-y-2">
              {assignment.resources.map((resource, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resource.name}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grade and Feedback */}
        {assignment.status === 'graded' && assignment.grade && (
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm text-green-800">Grade: {assignment.grade}</h4>
              <span className="text-xs text-green-600">
                Graded on {new Date(assignment.gradedAt!).toLocaleDateString()}
              </span>
            </div>
            {assignment.feedback && (
              <div>
                <h5 className="font-medium text-sm text-green-800 mb-1">Teacher Feedback:</h5>
                <p className="text-sm text-green-700">{assignment.feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Submission Status */}
        {assignment.status === 'submitted' && assignment.submittedAt && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              Submitted on {new Date(assignment.submittedAt).toLocaleDateString()}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2">
          {assignment.status === 'pending' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Submit Assignment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file">Upload File</Label>
                    <Input id="file" type="file" />
                  </div>
                  <div>
                    <Label htmlFor="comments">Comments (Optional)</Label>
                    <Textarea id="comments" placeholder="Add any comments for your teacher..." />
                  </div>
                  <Button className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {assignment.status === 'graded' && (
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Reply to Feedback
            </Button>
          )}

          <Button variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}