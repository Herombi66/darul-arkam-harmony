import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LogIn } from 'lucide-react';
import schoolLogo from '@/assets/school-logo.png';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const detectUserRole = (username: string) => {
    // Auto-detect role based on ID format
    if (username.startsWith('STU')) return 'student';
    if (username.startsWith('TCH')) return 'teacher';
    if (username.startsWith('PAR')) return 'parent';
    if (username.startsWith('ADM')) return 'admin';
    if (username.startsWith('EXM')) return 'exams-officer';
    if (username.startsWith('ADO')) return 'admission-officer';
    if (username.startsWith('FIN')) return 'finance-officer';
    if (username.startsWith('MED')) return 'media-officer';
    return 'student'; // default
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const userType = detectUserRole(credentials.username);

    // Mock user data based on role
    const mockUser = {
      id: credentials.username,
      firstName: userType === 'teacher' ? 'Fatima' : 'Ahmad',
      lastName: userType === 'teacher' ? 'Hassan' : 'Musa',
      email: `${credentials.username.toLowerCase()}@darularkam.edu.ng`,
      role: userType as 'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer',
      profileImage: '/placeholder.svg'
    };

    // Mock token
    const mockToken = `mock-jwt-token-${Date.now()}`;

    // Login user
    login(mockUser, mockToken);

    toast({
      title: "Login Successful!",
      description: `Welcome to your dashboard.`,
    });

    // Redirect based on detected user type
    const dashboardRoutes = {
      student: '/dashboard/student',
      teacher: '/dashboard/teacher',
      parent: '/dashboard/parent',
      admin: '/dashboard/admin',
      'exams-officer': '/dashboard/exams-officer',
      'admission-officer': '/dashboard/admission-officer',
      'finance-officer': '/dashboard/finance-officer',
      'media-officer': '/dashboard/media-officer'
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
                <Label htmlFor="username">Username / ID Number</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your email or ID Number"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  required
                />
                {/* <p className="text-xs text-muted-foreground">
                  Your role will be detected automatically based on your ID
                </p> */}
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