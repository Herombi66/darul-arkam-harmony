import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AdmissionStats, FunnelData, ApplicationsByGrade, RecentApplication } from '@/types/admission';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdmissionDashboard() {
  const [stats, setStats] = useState<AdmissionStats | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [applicationsByGrade, setApplicationsByGrade] = useState<ApplicationsByGrade[]>([]);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000');

    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'}/api/admission/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setStats(data.stats);
        setFunnelData(data.funnelData);
        setApplicationsByGrade(data.applicationsByGrade);
        setRecentApplications(data.recentApplications);
      } catch (error) {
        console.error("Failed to fetch admission dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socket.on('application:new', () => {
      fetchData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admission" />
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold text-primary mb-6">Admission Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Total Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.totalInquiries}</p>
                  <p className="text-sm text-muted-foreground">+5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pending Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-500">{stats?.pendingApplications}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Admission Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.admissionRate}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Seats Filled</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{stats?.seatsFilled} / {stats?.totalSeats}</p>
                  <Progress value={(stats?.seatsFilled && stats?.totalSeats) ? (stats.seatsFilled / stats.totalSeats) * 100 : 0} className="mt-2" />
                </CardContent>
              </Card>
            </>
          )}
        </div>
        <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Admission Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-80" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <FunnelChart>
                    <Tooltip />
                    <Funnel dataKey="value" data={funnelData} isAnimationActive>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Funnel>
                  </FunnelChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Applications by Grade</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-80" /> : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={applicationsByGrade} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {applicationsByGrade.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-80" /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Applied</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.studentName}</TableCell>
                      <TableCell>{app.grade}</TableCell>
                      <TableCell><Badge>{app.status}</Badge></TableCell>
                      <TableCell>{new Date(app.dateApplied).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}