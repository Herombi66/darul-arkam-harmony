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
// Removed role selection UI, so remove Select imports

export default function Login() {
  // Removed role selection; role will be auto-detected by backend
  // const [role, setRole] = useState<'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer'>('student');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // Send only identifier and password; backend auto-detects role
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || 'Login failed');
      }
      // Use role returned from server
      const roleFromServer = (data?.user?.role ?? 'student') as
        'student' | 'teacher' | 'parent' | 'admin' | 'exams-officer' | 'admission-officer' | 'finance-officer' | 'media-officer';
      login({ token: data.token, role: roleFromServer, user: data.user });
      localStorage.setItem('username', identifier);
      toast({ title: 'Login Successful!', description: `Welcome to your dashboard.` });
      const routes = {
        student: '/dashboard/student',
        teacher: '/dashboard/teacher',
        parent: '/dashboard/parent',
        admin: '/dashboard/admin',
        'exams-officer': '/dashboard/exams-officer',
        'admission-officer': '/dashboard/admission-officer',
        'finance-officer': '/dashboard/finance-officer',
        'media-officer': '/dashboard/media-officer',
      } as const;
      navigate(routes[roleFromServer] || '/dashboard/student');
    } catch (err: any) {
      setError(err.message);
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Use generic labels since role is auto-detected on backend
  const identifierLabel = 'Email or ID';
  const identifierPlaceholder = 'Enter email, roll number, or ID number';

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
              Care and Support Academy
            </CardTitle>
            <p className="text-muted-foreground">School Management System</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Removed manual role selection */}
              {/*
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select role" />
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
              */}

              <div className="space-y-2">
                <Label htmlFor="identifier">{identifierLabel}</Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder={identifierPlaceholder}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
                {/* <p className="text-xs text-muted-foreground">
                  You can use your email, roll number (students), or ID number (teachers).
                </p> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                <LogIn className="h-4 w-4 mr-2" />
                {loading ? 'Logging in...' : 'Login to Dashboard'}
              </Button>
              {error && <div className="text-red-500 text-sm">{error}</div>}
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
