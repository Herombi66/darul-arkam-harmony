import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardSidebar from '@/components/DashboardSidebar';
import { TrendingUp, TrendingDown, Minus, Download, Eye, Trophy, Target, BookOpen, FileText } from 'lucide-react';

const currentTermResults = [
  {
    subject: 'Mathematics',
    ca1: 18,
    ca2: 16,
    exam: 78,
    total: 112,
    grade: 'A',
    position: 5,
    remark: 'Excellent'
  },
  {
    subject: 'Physics',
    ca1: 15,
    ca2: 17,
    exam: 65,
    total: 97,
    grade: 'B+',
    position: 8,
    remark: 'Very Good'
  },
  {
    subject: 'Chemistry',
    ca1: 16,
    ca2: 14,
    exam: 58,
    total: 88,
    grade: 'B',
    position: 12,
    remark: 'Good'
  },
  {
    subject: 'Biology',
    ca1: 19,
    ca2: 18,
    exam: 72,
    total: 109,
    grade: 'A',
    position: 3,
    remark: 'Excellent'
  },
  {
    subject: 'English Language',
    ca1: 17,
    ca2: 15,
    exam: 68,
    total: 100,
    grade: 'B+',
    position: 7,
    remark: 'Very Good'
  },
  {
    subject: 'Geography',
    ca1: 14,
    ca2: 13,
    exam: 55,
    total: 82,
    grade: 'B-',
    position: 15,
    remark: 'Satisfactory'
  }
];

const previousTermResults = [
  {
    subject: 'Mathematics',
    total: 105,
    grade: 'A',
    position: 7
  },
  {
    subject: 'Physics',
    total: 92,
    grade: 'B+',
    position: 10
  },
  {
    subject: 'Chemistry',
    total: 85,
    grade: 'B',
    position: 14
  },
  {
    subject: 'Biology',
    total: 108,
    grade: 'A',
    position: 4
  },
  {
    subject: 'English Language',
    total: 96,
    grade: 'B+',
    position: 9
  },
  {
    subject: 'Geography',
    total: 78,
    grade: 'B-',
    position: 18
  }
];

const termComparison = currentTermResults.map(current => {
  const previous = previousTermResults.find(p => p.subject === current.subject);
  return {
    ...current,
    previousTotal: previous?.total || 0,
    previousPosition: previous?.position || 0,
    improvement: previous ? current.total - previous.total : 0,
    positionChange: previous ? previous.position - current.position : 0
  };
});

const getGradeColor = (grade: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-800';
    case 'B+': return 'bg-blue-100 text-blue-800';
    case 'B': return 'bg-yellow-100 text-yellow-800';
    case 'B-': return 'bg-orange-100 text-orange-800';
    case 'C': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getTrendIcon = (value: number) => {
  if (value > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (value < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-gray-600" />;
};

export default function StudentResults() {
  const totalMarks = currentTermResults.reduce((sum, result) => sum + result.total, 0);
  const maxMarks = currentTermResults.length * 120; // Assuming 120 max per subject
  const percentage = Math.round((totalMarks / maxMarks) * 100);
  const classAverage = 72; // Mock class average

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-6xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">My Results</h1>
            <p className="text-muted-foreground">Track your academic performance and progress</p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Percentage</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{percentage}%</div>
                <p className="text-xs text-muted-foreground">Current term average</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Position</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8th</div>
                <p className="text-xs text-muted-foreground">out of 45 students</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Subjects Passed</CardTitle>
                <BookOpen className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">6/6</div>
                <p className="text-xs text-muted-foreground">All subjects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">vs Class Average</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+6%</div>
                <p className="text-xs text-muted-foreground">Above class average</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="current" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="current">Current Term</TabsTrigger>
              <TabsTrigger value="comparison">Term Comparison</TabsTrigger>
              <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
              <TabsTrigger value="reports">Report Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Second Term Results 2024/2025</CardTitle>
                      <CardDescription>Detailed breakdown of your current term performance</CardDescription>
                    </div>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">CA1 (20)</TableHead>
                          <TableHead className="text-center">CA2 (20)</TableHead>
                          <TableHead className="text-center">Exam (80)</TableHead>
                          <TableHead className="text-center">Total (120)</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                          <TableHead className="text-center">Position</TableHead>
                          <TableHead>Remark</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentTermResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.subject}</TableCell>
                            <TableCell className="text-center">{result.ca1}</TableCell>
                            <TableCell className="text-center">{result.ca2}</TableCell>
                            <TableCell className="text-center">{result.exam}</TableCell>
                            <TableCell className="text-center font-bold">{result.total}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={getGradeColor(result.grade)}>
                                {result.grade}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{result.position}</TableCell>
                            <TableCell>{result.remark}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Total Marks: {totalMarks}/{maxMarks}</p>
                        <p className="text-muted-foreground">Overall Percentage: {percentage}%</p>
                      </div>
                      <div>
                        <p className="font-medium">Class Position: 8th/45</p>
                        <p className="text-muted-foreground">Above Class Average</p>
                      </div>
                      <div>
                        <p className="font-medium">Grade: B+</p>
                        <p className="text-muted-foreground">Very Good Performance</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparison">
              <Card>
                <CardHeader>
                  <CardTitle>Term-to-Term Performance Comparison</CardTitle>
                  <CardDescription>Compare your current performance with the previous term</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead className="text-center">Current Total</TableHead>
                          <TableHead className="text-center">Previous Total</TableHead>
                          <TableHead className="text-center">Score Change</TableHead>
                          <TableHead className="text-center">Current Position</TableHead>
                          <TableHead className="text-center">Previous Position</TableHead>
                          <TableHead className="text-center">Position Change</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {termComparison.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.subject}</TableCell>
                            <TableCell className="text-center font-bold">{result.total}</TableCell>
                            <TableCell className="text-center">{result.previousTotal}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                {getTrendIcon(result.improvement)}
                                <span className={result.improvement > 0 ? 'text-green-600' : result.improvement < 0 ? 'text-red-600' : 'text-gray-600'}>
                                  {result.improvement > 0 ? '+' : ''}{result.improvement}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{result.position}</TableCell>
                            <TableCell className="text-center">{result.previousPosition}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                {getTrendIcon(result.positionChange)}
                                <span className={result.positionChange > 0 ? 'text-green-600' : result.positionChange < 0 ? 'text-red-600' : 'text-gray-600'}>
                                  {result.positionChange > 0 ? '+' : ''}{result.positionChange}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Subject Performance Analysis</CardTitle>
                    <CardDescription>Your strengths and areas for improvement</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentTermResults.map((result, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{result.subject}</span>
                          <span>{Math.round((result.total / 120) * 100)}%</span>
                        </div>
                        <Progress value={(result.total / 120) * 100} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Insights</CardTitle>
                    <CardDescription>AI-powered analysis of your academic performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-800 mb-1">Strengths</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Excellent performance in Mathematics and Biology</li>
                        <li>• Consistent improvement in English Language</li>
                        <li>• Strong analytical skills across sciences</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-medium text-orange-800 mb-1">Areas for Improvement</h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• Focus more on Chemistry practical applications</li>
                        <li>• Improve Geography map work skills</li>
                        <li>• Work on Physics problem-solving techniques</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-1">Recommendations</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Join the Chemistry study group</li>
                        <li>• Practice more Geography past questions</li>
                        <li>• Attend Physics extra classes</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Second Term 2024/2025
                    </CardTitle>
                    <CardDescription>Current term report card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><strong>Overall:</strong> 78% (B+)</p>
                      <p className="text-sm"><strong>Position:</strong> 8th/45</p>
                      <p className="text-sm"><strong>Status:</strong> Promoted</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      First Term 2024/2025
                    </CardTitle>
                    <CardDescription>Previous term report card</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><strong>Overall:</strong> 74% (B)</p>
                      <p className="text-sm"><strong>Position:</strong> 12th/45</p>
                      <p className="text-sm"><strong>Status:</strong> Promoted</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Third Term 2023/2024
                    </CardTitle>
                    <CardDescription>Previous session final term</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm"><strong>Overall:</strong> 71% (B)</p>
                      <p className="text-sm"><strong>Position:</strong> 15th/43</p>
                      <p className="text-sm"><strong>Status:</strong> Promoted</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}