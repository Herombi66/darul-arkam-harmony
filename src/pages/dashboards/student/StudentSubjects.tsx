import React, { useState } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, User, Calendar, FileText, Search, Filter, 
  ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle, Loader2,
  TrendingUp, CheckCircle
} from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStudentSubjects } from '@/hooks/use-student-subjects';
import { Subject, SubjectStatus, SortField } from '@/types/student-subject';

// --- Utility Functions ---

const getStatusColor = (status: SubjectStatus) => {
  switch (status) {
    case 'excellent': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    case 'good': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
    case 'satisfactory': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800';
    case 'needs_improvement': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return 'bg-green-500';
  if (progress >= 70) return 'bg-blue-500';
  if (progress >= 60) return 'bg-yellow-500';
  return 'bg-orange-500';
};

// --- Sub-components ---

const SubjectStatsCards = ({ stats }: { stats: ReturnType<typeof useStudentSubjects>['stats'] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
        <TrendingUp className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.average}%</div>
        <p className="text-xs text-muted-foreground">Across all subjects</p>
      </CardContent>
    </Card>
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
        <BookOpen className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stats.totalSubjects}</div>
        <p className="text-xs text-muted-foreground">Enrolled courses</p>
      </CardContent>
    </Card>
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Excellent</CardTitle>
        <CheckCircle className="h-4 w-4 text-green-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.excellentCount}</div>
        <p className="text-xs text-muted-foreground">High performing</p>
      </CardContent>
    </Card>
    <Card className="hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
        <AlertCircle className="h-4 w-4 text-orange-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.pendingAssignments}</div>
        <p className="text-xs text-muted-foreground">Need attention</p>
      </CardContent>
    </Card>
  </div>
);

const SubjectCard = ({ 
  subject, 
  onViewDetails 
}: { 
  subject: Subject; 
  onViewDetails: (subject: Subject) => void; 
}) => (
  <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/50 hover:border-l-primary">
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {subject.name}
          </CardTitle>
          <CardDescription className="text-xs font-mono mt-1">
            {subject.code}
          </CardDescription>
        </div>
        <Badge variant="outline" className={`${getStatusColor(subject.status)} font-medium`}>
          {subject.grade}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span className="truncate">{subject.teacher}</span>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-medium">
          <span>Progress</span>
          <span>{subject.progress}%</span>
        </div>
        <Progress 
          value={subject.progress} 
          className="h-2" 
          indicatorClassName={getProgressColor(subject.progress)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted/50 p-2 rounded-md">
          <p className="text-muted-foreground mb-0.5">Last Test</p>
          <p className="font-semibold">{subject.lastTest}</p>
        </div>
        <div className="bg-muted/50 p-2 rounded-md">
          <p className="text-muted-foreground mb-0.5">Assignments</p>
          <p className="font-semibold">
            {subject.assignments > 0 ? (
              <span className="text-orange-600 dark:text-orange-400">{subject.assignments} Pending</span>
            ) : (
              <span className="text-green-600 dark:text-green-400">All Done</span>
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-xs text-muted-foreground pt-1">
        <Calendar className="h-3.5 w-3.5" />
        <span className="truncate">Next: {subject.nextClass}</span>
      </div>

      <Button
        className="w-full mt-2"
        variant="secondary"
        size="sm"
        onClick={() => onViewDetails(subject)}
      >
        View Details
      </Button>
    </CardContent>
  </Card>
);

const SubjectDetailDialog = ({ 
  open, 
  onOpenChange, 
  subject 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  subject: Subject | null; 
}) => {
  if (!subject) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between mr-8">
             <div>
                <DialogTitle className="text-xl text-primary">{subject.name}</DialogTitle>
                <DialogDescription className="font-mono mt-1">{subject.code}</DialogDescription>
             </div>
             <Badge className={getStatusColor(subject.status)}>{subject.grade}</Badge>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Teacher Info */}
          <div className="flex items-center p-3 bg-muted/50 rounded-lg">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Instructor</p>
              <p className="text-sm text-muted-foreground">{subject.teacher}</p>
            </div>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Academic Progress
              </h4>
              <span className="text-sm font-bold">{subject.progress}%</span>
            </div>
            <Progress value={subject.progress} className="h-3" indicatorClassName={getProgressColor(subject.progress)} />
            <p className="text-xs text-muted-foreground">
              You are performing <strong>{subject.status.replace('_', ' ')}</strong> in this subject.
            </p>
          </div>

          {/* Additional Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h5 className="text-xs font-medium text-muted-foreground mb-1">Upcoming Class</h5>
              <div className="flex items-center gap-2">
                 <Calendar className="h-4 w-4 text-primary" />
                 <span className="text-sm font-medium">{subject.nextClass}</span>
              </div>
            </div>
            <div className="border rounded-lg p-3">
              <h5 className="text-xs font-medium text-muted-foreground mb-1">Assignments</h5>
              <div className="flex items-center gap-2">
                 <FileText className="h-4 w-4 text-primary" />
                 <span className="text-sm font-medium">{subject.assignments} Pending</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button>View Course Materials</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// --- Main Component ---

const StudentSubjects = () => {
  const {
    subjects,
    isLoading,
    error,
    stats,
    filters,
    setFilters,
    sortConfig,
    setSortConfig,
    pagination,
    refresh
  } = useStudentSubjects();

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (subject: Subject) => {
    setSelectedSubject(subject);
    setDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your academic profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[50vh]">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h3 className="text-lg font-bold">Something went wrong</h3>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={refresh}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-primary">My Subjects</h1>
              <p className="text-muted-foreground mt-1">Manage your enrolled courses and track progress.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {stats.totalSubjects} Enrolled
              </span>
            </div>
          </div>

          {/* Stats Overview */}
          <SubjectStatsCards stats={stats} />

          {/* Controls: Filter & Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  className="pl-9"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
               <Select 
                 value={filters.status} 
                 onValueChange={(val) => setFilters(prev => ({ ...prev, status: val as SubjectStatus }))}
               >
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="satisfactory">Satisfactory</SelectItem>
                  <SelectItem value="needs_improvement">Needs Impr.</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={sortConfig.field} 
                onValueChange={(val) => setSortConfig(prev => ({ ...prev, field: val as SortField }))}
              >
                <SelectTrigger className="w-[140px]">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="grade">Grade</SelectItem>
                </SelectContent>
              </Select>
               
               <Button 
                 variant="ghost" 
                 size="icon"
                 onClick={() => setSortConfig(prev => ({ ...prev, order: prev.order === 'asc' ? 'desc' : 'asc' }))}
                 title={`Sort ${sortConfig.order === 'asc' ? 'Descending' : 'Ascending'}`}
               >
                 <ArrowUpDown className={`h-4 w-4 transition-transform ${sortConfig.order === 'desc' ? 'rotate-180' : ''}`} />
               </Button>
            </div>
          </div>

          {/* Subject Grid */}
          {subjects.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No subjects found</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                We couldn't find any subjects matching your filters. Try adjusting your search criteria.
              </p>
              <Button 
                variant="link" 
                onClick={() => setFilters({ search: '', status: 'all' })}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subject) => (
                <SubjectCard 
                  key={subject.id} 
                  subject={subject} 
                  onViewDetails={handleViewDetails} 
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => pagination.setPage(p => Math.max(1, p - 1))}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => pagination.setPage(p => Math.min(pagination.totalPages, p + 1))}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Details Modal */}
          <SubjectDetailDialog 
            open={detailsOpen} 
            onOpenChange={setDetailsOpen} 
            subject={selectedSubject} 
          />

        </div>
    </div>
  );
};

export default StudentSubjects;
