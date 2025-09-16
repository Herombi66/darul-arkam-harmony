import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [userType, setUserType] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userType) {
      toast({
        title: "Please select user type",
        description: "You must select whether you're a student, teacher, parent, or staff member.",
        variant: "destructive"
      });
      return;
    }

    // Demo login - redirect to appropriate dashboard
    toast({
      title: "Login Successful!",
      description: `Welcome to your ${userType} dashboard.`,
    });

    // Redirect based on user type
    const dashboardRoutes = {
      student: '/dashboard/student',
      teacher: '/dashboard/teacher',
      parent: '/dashboard/parent',
      admin: '/dashboard/admin',
      'exams-officer': '/dashboard/exams',
      'admission-officer': '/dashboard/admission',
      'finance-officer': '/dashboard/finance',
      'media-officer': '/dashboard/media'
    };

    navigate(dashboardRoutes[userType as keyof typeof dashboardRoutes] || '/dashboard/student');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-white hover:bg-white/20"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        <Card className="shadow-glow border-0 animate-bounce-in">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <img src={schoolLogo} alt="Darul Arqam Academy" className="h-16 w-16" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              Darul Arqam Academy
            </CardTitle>
            <p className="text-muted-foreground">School Management System</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">Login As</Label>
                <Select value={userType} onValueChange={setUserType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="exams-officer">Exams Officer</SelectItem>
                    <SelectItem value="admission-officer">Admission Officer</SelectItem>
                    <SelectItem value="finance-officer">Finance Officer</SelectItem>
                    <SelectItem value="media-officer">Media Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username / ID Number</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username or ID"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  required
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">
                <LogIn className="h-4 w-4 mr-2" />
                Login to Dashboard
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Link 
                to="/forgot-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
              <div className="text-xs text-muted-foreground">
                Need help? Contact the school administrator
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}