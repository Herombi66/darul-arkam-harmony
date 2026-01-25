import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const StudentDashboard = () => {
  return (
    <div className="grid gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <h1 className="text-2xl font-bold">Student Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Mathematics</TableCell>
                  <TableCell>A</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Science</TableCell>
                  <TableCell>B</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No upcoming assignments.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;