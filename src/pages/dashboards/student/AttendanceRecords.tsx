import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Clock, Calendar as CalendarIcon } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useState } from 'react';

export default function AttendanceRecords() {
  const [selectedMonth, setSelectedMonth] = useState('january');

  const attendanceStats = {
    present: 18,
    absent: 2,
    late: 1,
    totalDays: 21,
    percentage: 85.7
  };

  const recentAttendance = [
    { date: '2024-01-22', status: 'present', time: '08:15 AM' },
    { date: '2024-01-21', status: 'present', time: '08:10 AM' },
    { date: '2024-01-20', status: 'late', time: '08:35 AM' },
    { date: '2024-01-19', status: 'present', time: '08:05 AM' },
    { date: '2024-01-18', status: 'absent', time: '-' },
    { date: '2024-01-17', status: 'present', time: '08:12 AM' }
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary">Attendance Records</h1>
              <p className="text-muted-foreground">Track your attendance history</p>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january">January 2024</SelectItem>
                <SelectItem value="december">December 2023</SelectItem>
                <SelectItem value="november">November 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-success/20 rounded-full">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present</p>
                    <p className="text-2xl font-bold text-primary">{attendanceStats.present}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-destructive/20 rounded-full">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Absent</p>
                    <p className="text-2xl font-bold text-primary">{attendanceStats.absent}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-warning/20 rounded-full">
                    <Clock className="h-6 w-6 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Late</p>
                    <p className="text-2xl font-bold text-primary">{attendanceStats.late}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-primary rounded-full">
                    <CalendarIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance</p>
                    <p className="text-2xl font-bold text-primary">{attendanceStats.percentage}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-elevation">
              <CardHeader>
                <CardTitle className="text-primary">Attendance Calendar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar mode="single" className="rounded-md border" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-elevation">
              <CardHeader>
                <CardTitle className="text-primary">Recent Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAttendance.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${
                          record.status === 'present' ? 'bg-success/20' :
                          record.status === 'absent' ? 'bg-destructive/20' :
                          'bg-warning/20'
                        }`}>
                          {record.status === 'present' && <CheckCircle className="h-5 w-5 text-success" />}
                          {record.status === 'absent' && <XCircle className="h-5 w-5 text-destructive" />}
                          {record.status === 'late' && <Clock className="h-5 w-5 text-warning" />}
                        </div>
                        <div>
                          <p className="font-medium">{record.date}</p>
                          <p className="text-sm text-muted-foreground capitalize">{record.status}</p>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">{record.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
