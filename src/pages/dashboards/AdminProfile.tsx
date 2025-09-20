import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Settings,
  Camera,
  Save,
  Edit,
  Activity,
  Bell,
  Palette,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  FileText,
  Clock
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'Dr. Muhammad',
    lastName: 'Sani',
    email: 'admin@darularqam.edu.ng',
    phone: '+234 803 123 4567',
    address: 'Gombe State, Nigeria',
    dateOfBirth: '1980-05-15',
    employeeId: 'ADM/2024/001',
    role: 'System Administrator',
    department: 'IT Administration',
    joinDate: '2020-01-15',
    bio: 'Experienced system administrator with over 10 years in educational technology management.',
    profileImage: '/placeholder.svg'
  });

  const [customizationSettings, setCustomizationSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      sms: false,
      systemAlerts: true
    },
    language: 'en'
  });

  const [activityLogs] = useState([
    { id: 1, action: 'Login', timestamp: '2024-09-20T10:30:00Z', location: 'Gombe, Nigeria', device: 'Chrome on Windows' },
    { id: 2, action: 'Updated Profile', timestamp: '2024-09-19T14:15:00Z', location: 'Gombe, Nigeria', device: 'Chrome on Windows' },
    { id: 3, action: 'Changed Password', timestamp: '2024-09-18T09:45:00Z', location: 'Gombe, Nigeria', device: 'Chrome on Windows' },
    { id: 4, action: 'Created User Account', timestamp: '2024-09-17T16:20:00Z', location: 'Gombe, Nigeria', device: 'Chrome on Windows' },
    { id: 5, action: 'Login', timestamp: '2024-09-16T08:00:00Z', location: 'Gombe, Nigeria', device: 'Safari on iPhone' }
  ]);

  const [dashboardStats] = useState({
    totalUsers: 1250,
    activeUsers: 892,
    systemUptime: 99.8,
    pendingTasks: 12
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!profileData.firstName.trim()) errors.firstName = 'First name is required';
    if (!profileData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!profileData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(profileData.email)) errors.email = 'Email is invalid';
    if (!profileData.phone.trim()) errors.phone = 'Phone number is required';
    if (!profileData.bio.trim()) errors.bio = 'Bio is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaveStatus('saving');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      setIsEditing(false);
      setValidationErrors({});
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCustomizationChange = (field: string, value: any) => {
    setCustomizationSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    // TODO: Implement password change API
    setShowPasswordDialog(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const calculateProfileCompleteness = () => {
    const fields = ['firstName', 'lastName', 'email', 'phone', 'address', 'bio'];
    const completedFields = fields.filter(field => profileData[field as keyof typeof profileData]?.toString().trim());
    return (completedFields.length / fields.length) * 100;
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="admin" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary">Admin Profile</h1>
              <p className="text-muted-foreground">Manage your profile information and settings</p>
            </div>
            <div className="flex items-center gap-4">
              {saveStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
                </Alert>
              )}
              {saveStatus === 'error' && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">Failed to update profile. Please try again.</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                disabled={saveStatus === 'saving'}
                className="flex items-center gap-2"
              >
                {saveStatus === 'saving' ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Profile Completeness and Dashboard Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Profile Completeness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Profile Completion</span>
                    <span>{Math.round(calculateProfileCompleteness())}%</span>
                  </div>
                  <Progress value={calculateProfileCompleteness()} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Complete your profile to unlock all features
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Dashboard Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-primary">{dashboardStats.totalUsers}</div>
                    <div className="text-xs text-muted-foreground">Total Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-green-600">{dashboardStats.activeUsers}</div>
                    <div className="text-xs text-muted-foreground">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-blue-600">{dashboardStats.systemUptime}%</div>
                    <div className="text-xs text-muted-foreground">System Uptime</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-orange-600">{dashboardStats.pendingTasks}</div>
                    <div className="text-xs text-muted-foreground">Pending Tasks</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5 h-auto">
              <TabsTrigger value="personal" className="text-xs md:text-sm">Personal</TabsTrigger>
              <TabsTrigger value="professional" className="text-xs md:text-sm">Professional</TabsTrigger>
              <TabsTrigger value="security" className="text-xs md:text-sm">Security</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs md:text-sm">Activity</TabsTrigger>
              <TabsTrigger value="customization" className="text-xs md:text-sm">Customization</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.profileImage} alt="Profile" />
                      <AvatarFallback className="text-lg">
                        {profileData.firstName[0]}{profileData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </div>

                  {/* Personal Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={profileData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        disabled={!isEditing}
                        className={validationErrors.firstName ? 'border-red-500' : ''}
                      />
                      {validationErrors.firstName && (
                        <p className="text-xs text-red-600">{validationErrors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={profileData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        disabled={!isEditing}
                        className={validationErrors.lastName ? 'border-red-500' : ''}
                      />
                      {validationErrors.lastName && (
                        <p className="text-xs text-red-600">{validationErrors.lastName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={!isEditing}
                        className={validationErrors.email ? 'border-red-500' : ''}
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-red-600">{validationErrors.email}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        disabled={!isEditing}
                        className={validationErrors.phone ? 'border-red-500' : ''}
                      />
                      {validationErrors.phone && (
                        <p className="text-xs text-red-600">{validationErrors.phone}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio *</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing}
                      rows={3}
                      className={validationErrors.bio ? 'border-red-500' : ''}
                    />
                    {validationErrors.bio && (
                      <p className="text-xs text-red-600">{validationErrors.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Professional Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Employee ID</Label>
                      <div className="flex items-center gap-2">
                        <Input value={profileData.employeeId} disabled />
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex items-center gap-2">
                        <Input value={profileData.role} disabled />
                        <Badge variant="default">Administrator</Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Input value={profileData.department} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label>Join Date</Label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(profileData.joinDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* System Permissions */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">System Permissions</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Shield className="h-4 w-4 text-success" />
                        <span className="text-sm">Full System Access</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <User className="h-4 w-4 text-success" />
                        <span className="text-sm">User Management</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Settings className="h-4 w-4 text-success" />
                        <span className="text-sm">System Configuration</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                        <Mail className="h-4 w-4 text-success" />
                        <span className="text-sm">Communication Tools</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-muted-foreground">Update your account password regularly</p>
                      </div>
                      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline">Change Password</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Password</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <Input
                                id="currentPassword"
                                type="password"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="newPassword">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword">Confirm New Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              />
                            </div>
                            <Button onClick={handlePasswordChange} className="w-full">
                              Update Password
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Login Sessions</h4>
                        <p className="text-sm text-muted-foreground">Manage your active login sessions</p>
                      </div>
                      <Button variant="outline">View Sessions</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Account Recovery</h4>
                        <p className="text-sm text-muted-foreground">Set up recovery options for account access</p>
                      </div>
                      <Button variant="outline">Setup Recovery</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Activity Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <p className="text-sm font-medium">{log.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {log.location} • {log.device}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customization" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Profile Customization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Theme Preference</Label>
                      <Select value={customizationSettings.theme} onValueChange={(value) => handleCustomizationChange('theme', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notification Preferences
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-xs text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={customizationSettings.notifications.email}
                            onCheckedChange={(checked) => handleCustomizationChange('notifications', { ...customizationSettings.notifications, email: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <p className="text-xs text-muted-foreground">Receive push notifications in browser</p>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={customizationSettings.notifications.push}
                            onCheckedChange={(checked) => handleCustomizationChange('notifications', { ...customizationSettings.notifications, push: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="sms-notifications">SMS Notifications</Label>
                            <p className="text-xs text-muted-foreground">Receive notifications via SMS</p>
                          </div>
                          <Switch
                            id="sms-notifications"
                            checked={customizationSettings.notifications.sms}
                            onCheckedChange={(checked) => handleCustomizationChange('notifications', { ...customizationSettings.notifications, sms: checked })}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="system-alerts">System Alerts</Label>
                            <p className="text-xs text-muted-foreground">Receive system maintenance alerts</p>
                          </div>
                          <Switch
                            id="system-alerts"
                            checked={customizationSettings.notifications.systemAlerts}
                            onCheckedChange={(checked) => handleCustomizationChange('notifications', { ...customizationSettings.notifications, systemAlerts: checked })}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={customizationSettings.language} onValueChange={(value) => handleCustomizationChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="ha">Hausa</SelectItem>
                          <SelectItem value="ar">Arabic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}