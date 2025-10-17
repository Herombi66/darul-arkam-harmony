import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardSidebar from '@/components/DashboardSidebar';
import { TrendingUp, TrendingDown, Minus, Download, Eye, Trophy, Target, BookOpen, FileText } from 'lucide-react';

const getGradeOrder = (grade: string): number => {
  switch (grade) {
    case 'A': return 5;
    case 'B+': return 4;
    case 'B': return 3;
    case 'B-': return 2;
    case 'C': return 1;
    default: return 0;
  }
};

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
  const [currentTermResults, setCurrentTermResults] = useState([]);
  const [previousTermResults, setPreviousTermResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data that matches the structure from TeacherRecordSheet
  const mockCurrentResults = [
    {
      subject: 'Mathematics',
      ca1: 25,
      ca2: 28,
      ca3: 26,
      exam: 75,
      total: 77,
      grade: 'B+',
      remark: 'Very Good'
    },
    {
      subject: 'Physics',
      ca1: 24,
      ca2: 26,
      ca3: 25,
      exam: 72,
      total: 74,
      grade: 'B+',
      remark: 'Very Good'
    },
    {
      subject: 'Chemistry',
      ca1: 22,
      ca2: 24,
      ca3: 23,
      exam: 68,
      total: 69,
      grade: 'B',
      remark: 'Good'
    },
    {
      subject: 'Biology',
      ca1: 26,
      ca2: 27,
      ca3: 28,
      exam: 76,
      total: 79,
      grade: 'B+',
      remark: 'Very Good'
    },
    {
      subject: 'English',
      ca1: 23,
      ca2: 25,
      ca3: 24,
      exam: 70,
      total: 71,
      grade: 'B',
      remark: 'Good'
    },
    {
      subject: 'Geography',
      ca1: 21,
      ca2: 23,
      ca3: 22,
      exam: 65,
      total: 66,
      grade: 'B-',
      remark: 'Satisfactory'
    }
  ];

  const mockPreviousResults = [
    {
      subject: 'Mathematics',
      ca1: 22,
      ca2: 25,
      ca3: 24,
      exam: 70,
      total: 71,
      grade: 'B',
      remark: 'Good'
    },
    {
      subject: 'Physics',
      ca1: 21,
      ca2: 23,
      ca3: 22,
      exam: 68,
      total: 67,
      grade: 'B-',
      remark: 'Satisfactory'
    },
    {
      subject: 'Chemistry',
      ca1: 20,
      ca2: 22,
      ca3: 21,
      exam: 65,
      total: 64,
      grade: 'B-',
      remark: 'Satisfactory'
    },
    {
      subject: 'Biology',
      ca1: 24,
      ca2: 25,
      ca3: 26,
      exam: 73,
      total: 75,
      grade: 'B+',
      remark: 'Very Good'
    },
    {
      subject: 'English',
      ca1: 21,
      ca2: 23,
      ca3: 22,
      exam: 67,
      total: 67,
      grade: 'B-',
      remark: 'Satisfactory'
    },
    {
      subject: 'Geography',
      ca1: 19,
      ca2: 21,
      ca3: 20,
      exam: 62,
      total: 61,
      grade: 'C',
      remark: 'Pass'
    }
  ];

  const fetchCurrentResults = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentTermResults(mockCurrentResults);
    } catch (err) {
      setError('Failed to load current term results');
    }
  };

  const fetchPreviousResults = async () => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setPreviousTermResults(mockPreviousResults);
    } catch (err) {
      setError('Failed to load previous term results');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([fetchCurrentResults(), fetchPreviousResults()]);
      } catch (err) {
        setError('Failed to load results data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const termComparison = useMemo(() => {
    if (!currentTermResults.length || !previousTermResults.length) return [];
    return currentTermResults.map(current => {
      const previous = previousTermResults.find(p => p.subject === current.subject);
      return {
        ...current,
        previousTotal: previous?.total || 0,
        previousPosition: previous?.grade || '',
        improvement: previous ? current.total - previous.total : 0,
        gradeChange: previous ? getGradeOrder(current.grade) - getGradeOrder(previous.grade) : 0
      };
    });
  }, [currentTermResults, previousTermResults]);

  const totalMarks = currentTermResults.reduce((sum, result) => sum + (result.total || 0), 0);
  const maxMarks = currentTermResults.length * 100;
  const percentage = maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
  const classAverage = 72; // Mock class average

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar userType="student" />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading results...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex">
        <DashboardSidebar userType="student" />
        <main className="flex-1 flex items-center justify-center">
          <div>Error: {error}</div>
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
                <CardTitle className="text-sm font-medium">Overall grade</CardTitle>
                <Target className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">B+</div>
                <p className="text-xs text-muted-foreground">Very Good</p>
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
                        {currentTermResults.map((result, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{result.subject}</TableCell>
                            <TableCell className="text-center">{result.ca1}</TableCell>
                            <TableCell className="text-center">{result.ca2}</TableCell>
                            <TableCell className="text-center">{result.ca3}</TableCell>
                            <TableCell className="text-center">{result.exam}</TableCell>
                            <TableCell className="text-center font-bold">{result.total}</TableCell>
                            <TableCell className="text-center">
                              <Badge className={getGradeColor(result.grade)}>
                                {result.grade}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">{result.grade}</TableCell>
                            <TableCell>{result.remark}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">Total Marks: {totalMarks}/{maxMarks}</p>
                        <p className="text-muted-foreground">Overall Percentage: {percentage}%</p>
                      </div>
                      <div>
                        <p className="font-medium">Overall Grade: B+</p>
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
                          <TableHead className="text-center">Current Grade</TableHead>
                          <TableHead className="text-center">Previous Grade</TableHead>
                          <TableHead className="text-center">Grade Change</TableHead>
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
                            <TableCell className="text-center">{result.grade}</TableCell>
                            <TableCell className="text-center">{result.previousPosition}</TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-1">
                                {getTrendIcon(result.gradeChange)}
                                <span className={result.gradeChange > 0 ? 'text-green-600' : result.gradeChange < 0 ? 'text-red-600' : 'text-gray-600'}>
                                  {result.gradeChange > 0 ? '+' : ''}{result.gradeChange}
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
                          <span>{result.total}%</span>
                        </div>
                        <Progress value={result.total} className="h-2" />
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
                      <p className="text-sm"><strong>Grade:</strong> B+</p>
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
                      <p className="text-sm"><strong>Grade:</strong> B</p>
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
                      <p className="text-sm"><strong>Grade:</strong> B</p>
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