import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  GraduationCap,
  Download,
  Printer
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function StudentResults() {
  const studentData = {
    name: "Ahmad Musa",
    class: "SS3 A",
    rollNumber: "STU/2024/001",
    term: "First Term",
    academicYear: "2023/2024",
    gender: "Male",
    age: 17,
    totalAverage: 78.5,
    overallGrade: "B",
    formMasterRemark: "Ahmad is a dedicated student who has shown significant improvement this term. He should focus more on Mathematics and Physics.",
    principalRemark: "Good performance. Keep up the good work and strive for excellence in all subjects."
  };

  const schoolInfo = {
    name: "Darul Arkam Academy",
    address: "123 Education Way, Kano, Nigeria",
    phone: "+234 123 456 7890",
    email: "info@darularkam.edu.ng",
    website: "www.darularkam.edu.ng",
    motto: "Knowledge, Character, Excellence"
  };

  const subjects = [
    { 
      name: "Mathematics", 
      firstCA: 8, 
      secondCA: 7, 
      thirdCA: 9, 
      exam: 60, 
      total: 84, 
      grade: "A", 
      remark: "Excellent" 
    },
    { 
      name: "English Language", 
      firstCA: 7, 
      secondCA: 8, 
      thirdCA: 8, 
      exam: 55, 
      total: 78, 
      grade: "B", 
      remark: "Very Good" 
    },
    { 
      name: "Physics", 
      firstCA: 6, 
      secondCA: 7, 
      thirdCA: 7, 
      exam: 50, 
      total: 70, 
      grade: "B", 
      remark: "Good" 
    },
    { 
      name: "Chemistry", 
      firstCA: 8, 
      secondCA: 9, 
      thirdCA: 8, 
      exam: 58, 
      total: 83, 
      grade: "A", 
      remark: "Excellent" 
    },
    { 
      name: "Biology", 
      firstCA: 7, 
      secondCA: 8, 
      thirdCA: 7, 
      exam: 54, 
      total: 76, 
      grade: "B", 
      remark: "Very Good" 
    },
    { 
      name: "Islamic Studies", 
      firstCA: 9, 
      secondCA: 9, 
      thirdCA: 9, 
      exam: 65, 
      total: 92, 
      grade: "A", 
      remark: "Excellent" 
    },
    { 
      name: "Arabic Language", 
      firstCA: 8, 
      secondCA: 7, 
      thirdCA: 8, 
      exam: 52, 
      total: 75, 
      grade: "B", 
      remark: "Very Good" 
    },
    { 
      name: "Geography", 
      firstCA: 6, 
      secondCA: 7, 
      thirdCA: 6, 
      exam: 48, 
      total: 67, 
      grade: "C", 
      remark: "Good" 
    },
    { 
      name: "Economics", 
      firstCA: 7, 
      secondCA: 6, 
      thirdCA: 7, 
      exam: 51, 
      total: 71, 
      grade: "B", 
      remark: "Good" 
    },
    { 
      name: "Computer Studies", 
      firstCA: 9, 
      secondCA: 8, 
      thirdCA: 9, 
      exam: 62, 
      total: 88, 
      grade: "A", 
      remark: "Excellent" 
    }
  ];

  const gradeScale = [
    { grade: "A", range: "80-100", remark: "Excellent" },
    { grade: "B", range: "70-79", remark: "Very Good" },
    { grade: "C", range: "60-69", remark: "Good" },
    { grade: "D", range: "50-59", remark: "Fair" },
    { grade: "E", range: "40-49", remark: "Pass" },
    { grade: "F", range: "0-39", remark: "Fail" }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary">Academic Results</h1>
              <p className="text-muted-foreground">
                {studentData.term} • {studentData.academicYear}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          {/* Report Card */}
          <Card className="border-0 shadow-elevation animate-fade-in">
            <CardContent className="p-6">
              {/* Report Card Header */}
              <div className="border-b pb-4 mb-6">
                <div className="flex items-center mb-2">
                  <img 
                    src="../../../assets/school-logo.png" 
                    alt="School Logo" 
                    className="h-24 w-auto mr-4"
                  />
                  <div className="text-center flex-1">
                    <h2 className="text-3xl font-bold text-primary uppercase">{schoolInfo.name}</h2>
                    <p className="text-sm text-muted-foreground">{schoolInfo.address}</p>
                    <p className="text-sm text-muted-foreground">Tel: {schoolInfo.phone} | Email: {schoolInfo.email}</p>
                    <p className="text-sm font-medium mt-1">Motto: "{schoolInfo.motto}"</p>
                    <h3 className="text-xl font-bold mt-4 text-primary">STUDENT REPORT CARD</h3>
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name:</p>
                  <p className="font-medium">{studentData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class:</p>
                  <p className="font-medium">{studentData.class}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Roll Number:</p>
                  <p className="font-medium">{studentData.rollNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender:</p>
                  <p className="font-medium">{studentData.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Term:</p>
                  <p className="font-medium">{studentData.term}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Academic Year:</p>
                  <p className="font-medium">{studentData.academicYear}</p>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <Table className="border">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold">Subject</TableHead>
                      <TableHead className="font-bold text-center">1st C.A (10%)</TableHead>
                      <TableHead className="font-bold text-center">2nd C.A (10%)</TableHead>
                      <TableHead className="font-bold text-center">3rd C.A (10%)</TableHead>
                      <TableHead className="font-bold text-center">Exams (70%)</TableHead>
                      <TableHead className="font-bold text-center">Total</TableHead>
                      <TableHead className="font-bold text-center">Grade</TableHead>
                      <TableHead className="font-bold">Remark</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : ""}>
                        <TableCell className="font-medium">{subject.name}</TableCell>
                        <TableCell className="text-center">{subject.firstCA}</TableCell>
                        <TableCell className="text-center">{subject.secondCA}</TableCell>
                        <TableCell className="text-center">{subject.thirdCA}</TableCell>
                        <TableCell className="text-center">{subject.exam}</TableCell>
                        <TableCell className="text-center font-medium">{subject.total}</TableCell>
                        <TableCell className="text-center font-medium">{subject.grade}</TableCell>
                        <TableCell>{subject.remark}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary and Remarks */}
              <div className="mt-6 grid grid-cols-1 gap-6">
                <div>
                  <h4 className="font-bold text-primary mb-2">Performance Summary</h4>
                  <div className="flex items-center border-b pb-2 mb-4">
                    <div className="flex gap-8">
                      <div>
                        <span className="text-muted-foreground">Total Average:</span>
                        <span className="font-medium ml-2">{studentData.totalAverage}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Overall Grade:</span>
                        <span className="font-medium ml-2">{studentData.overallGrade}</span>
                      </div>
                    </div>
                  </div>

                  <h4 className="font-bold text-primary mb-2">Grading System</h4>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    {gradeScale.map((grade, index) => (
                      <div key={index} className="p-1">
                        <span className="font-medium">{grade.grade}</span>: {grade.range}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-primary mb-2">Form Master's Remarks</h4>
                    <p className="text-sm p-2 border rounded bg-muted/20 min-h-[60px]">
                      {studentData.formMasterRemark}
                    </p>
                    <div className="mt-4 text-center">
                      <div className="border-t border-dashed pt-2 mx-auto w-40">
                        <p className="text-sm font-medium">Form Master's Signature</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-primary mb-2">Principal's Remarks</h4>
                    <p className="text-sm p-2 border rounded bg-muted/20 min-h-[60px]">
                      {studentData.principalRemark}
                    </p>
                    <div className="mt-4 text-center">
                      <div className="border-t border-dashed pt-2 mx-auto w-40">
                        <p className="text-sm font-medium">Principal's Signature</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="text-center mt-4">
                  <div className="border-t border-dashed pt-2 mx-auto w-40">
                    <p className="text-sm font-medium">Date: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}