import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function RequestLeave() {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const leaveRequests = [
    { id: 1, type: 'Sick Leave', duration: '3 days', startDate: '2024-01-15', status: 'approved', reason: 'Medical appointment' },
    { id: 2, type: 'Personal', duration: '1 day', startDate: '2024-01-10', status: 'pending', reason: 'Family event' },
    { id: 3, type: 'Emergency', duration: '2 days', startDate: '2024-01-05', status: 'rejected', reason: 'Personal emergency' }
  ];

  const handleSubmit = () => {
    toast({
      title: "Leave Request Submitted",
      description: "Your request has been sent for approval",
    });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-primary">Request Leave</h1>
            <p className="text-muted-foreground">Submit leave applications and track status</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">New Leave Request</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Leave Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                          <SelectItem value="emergency">Emergency Leave</SelectItem>
                          <SelectItem value="family">Family Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="halfday">Half Day</SelectItem>
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="2">2 Days</SelectItem>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={startDate} onSelect={setStartDate} />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={endDate} onSelect={setEndDate} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label>Reason for Leave</Label>
                    <Textarea placeholder="Explain the reason for your leave..." rows={4} />
                  </div>

                  <div>
                    <Label>Emergency Contact</Label>
                    <Input placeholder="Phone number" />
                  </div>

                  <Button className="w-full" onClick={handleSubmit}>
                    Submit Request
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="text-primary">Leave Balance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Available Days</p>
                    <p className="text-3xl font-bold text-primary">12</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Used Days</p>
                    <p className="text-3xl font-bold text-primary">6</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Pending Requests</p>
                    <p className="text-3xl font-bold text-primary">1</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="border-0 shadow-elevation">
            <CardHeader>
              <CardTitle className="text-primary">Request History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-full ${
                        request.status === 'approved' ? 'bg-success/20' :
                        request.status === 'rejected' ? 'bg-destructive/20' :
                        'bg-warning/20'
                      }`}>
                        {request.status === 'approved' && <CheckCircle className="h-5 w-5 text-success" />}
                        {request.status === 'rejected' && <XCircle className="h-5 w-5 text-destructive" />}
                        {request.status === 'pending' && <Clock className="h-5 w-5 text-warning" />}
                      </div>
                      <div>
                        <p className="font-medium">{request.type}</p>
                        <p className="text-sm text-muted-foreground">{request.duration} • {request.startDate}</p>
                        <p className="text-xs text-muted-foreground">{request.reason}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      request.status === 'approved' ? 'bg-success/20 text-success' :
                      request.status === 'rejected' ? 'bg-destructive/20 text-destructive' :
                      'bg-warning/20 text-warning'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
