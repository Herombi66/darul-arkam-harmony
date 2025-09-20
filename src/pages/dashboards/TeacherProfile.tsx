import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  BookOpen,
  Camera,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Upload,
  Settings,
  GraduationCap
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Validation schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  subjects: z.string().min(1, 'Subjects taught is required'),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function TeacherProfile() {
  const { token, user } = useAuth();
  const [teacherData, setTeacherData] = useState({
    name: user ? `${user.firstName} ${user.lastName}` : "Dr. Fatima Hassan",
    email: user?.email || "fatima.hassan@darularkam.edu.ng",
    bio: "Experienced educator with over 15 years in teaching Mathematics and Physics. Passionate about STEM education and student development.",
    subjects: "Mathematics, Physics",
    avatar: user?.profileImage || "/placeholder.svg",
    employeeId: "TCH-2023-001",
    department: "Science Department",
    joinDate: "2018-09-01",
    qualification: "PhD in Mathematics",
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: teacherData.name,
      email: teacherData.email,
      bio: teacherData.bio,
      subjects: teacherData.subjects,
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Fetch teacher data on component mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await fetch('/api/teachers/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const teacher = data.data;
          const user = teacher.user;

          setTeacherData({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            bio: teacher.bio || '',
            subjects: teacher.subjects?.map((s: any) => s.name).join(', ') || '',
            avatar: user.profileImage || '/placeholder.svg',
            employeeId: teacher.employeeId || 'TCH-2023-001',
            department: teacher.department || 'Science Department',
            joinDate: teacher.joinDate || '2018-09-01',
            qualification: teacher.qualification || 'PhD in Mathematics',
          });

          // Update form defaults
          profileForm.reset({
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            bio: teacher.bio || '',
            subjects: teacher.subjects?.map((s: any) => s.name).join(', ') || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch teacher data:', error);
        toast.error('Failed to load profile data');
      }
    };

    fetchTeacherData();
  }, [profileForm]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (!file.type.match('image/(jpeg|jpg|png)')) {
        toast.error('Please select a JPG or PNG image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) throw new Error('Canvas is empty');
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCropComplete = async () => {
    if (completedCrop && imgRef.current) {
      try {
        setIsLoading(true);
        setUploadProgress(0);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        const croppedBlob = await getCroppedImg(imgRef.current, completedCrop);
        const formData = new FormData();
        formData.append('avatar', croppedBlob, 'avatar.jpg');

        const response = await fetch('/api/users/upload-avatar', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload avatar');
        }

        const data = await response.json();
        setTeacherData(prev => ({ ...prev, avatar: data.avatarUrl }));

        setUploadProgress(100);
        clearInterval(progressInterval);
        setCropModalOpen(false);
        setSelectedImage(null);
        toast.success('Profile picture updated successfully');
      } catch (error) {
        toast.error('Failed to upload image');
      } finally {
        setIsLoading(false);
        setUploadProgress(0);
      }
    }
  };

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);

      // Update user profile (name, email)
      const userResponse = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName: data.name.split(' ')[0],
          lastName: data.name.split(' ').slice(1).join(' '),
          email: data.email
        })
      });

      if (!userResponse.ok) {
        throw new Error('Failed to update user profile');
      }

      // Update teacher profile (bio, subjects)
      const teacherResponse = await fetch('/api/teachers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bio: data.bio,
          subjects: data.subjects.split(', ').map(s => s.trim())
        })
      });

      if (!teacherResponse.ok) {
        throw new Error('Failed to update teacher profile');
      }

      setTeacherData(prev => ({ ...prev, ...data }));
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change password');
      }

      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordForm.watch('newPassword') || '');

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="teacher" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-primary">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and account settings</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile Information</TabsTrigger>
              <TabsTrigger value="picture">Profile Picture</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="settings">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...profileForm.register('name')}
                          className={profileForm.formState.errors.name ? 'border-destructive' : ''}
                        />
                        {profileForm.formState.errors.name && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          {...profileForm.register('email')}
                          className={profileForm.formState.errors.email ? 'border-destructive' : ''}
                        />
                        {profileForm.formState.errors.email && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="subjects">Subjects Taught</Label>
                        <Input
                          id="subjects"
                          {...profileForm.register('subjects')}
                          className={profileForm.formState.errors.subjects ? 'border-destructive' : ''}
                        />
                        {profileForm.formState.errors.subjects && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.subjects.message}</p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          {...profileForm.register('bio')}
                          className={profileForm.formState.errors.bio ? 'border-destructive' : ''}
                          rows={4}
                          placeholder="Tell us about yourself..."
                        />
                        {profileForm.formState.errors.bio && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.bio.message}</p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          {profileForm.watch('bio')?.length || 0}/500 characters
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                      <div className="space-y-2">
                        <Label>Employee ID</Label>
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{teacherData.employeeId}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Department</Label>
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>{teacherData.department}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Join Date</Label>
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(teacherData.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Qualification</Label>
                        <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{teacherData.qualification}</span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="picture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Profile Picture
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={teacherData.avatar} alt={teacherData.name} />
                      <AvatarFallback className="text-2xl">{teacherData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col items-center space-y-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <Upload className="h-4 w-4" />
                        <span>Choose Image</span>
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        JPG or PNG, max 5MB
                      </p>
                    </div>
                  </div>

                  <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Crop Image</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {selectedImage && (
                          <ReactCrop
                            crop={crop}
                            onChange={setCrop}
                            onComplete={setCompletedCrop}
                            aspect={1}
                            circularCrop
                          >
                            <img
                              ref={imgRef}
                              src={selectedImage}
                              alt="Crop preview"
                              className="max-w-full h-auto"
                            />
                          </ReactCrop>
                        )}

                        {isLoading && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Uploading...</span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <Progress value={uploadProgress} />
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCropModalOpen(false);
                              setSelectedImage(null);
                            }}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleCropComplete}
                            disabled={!completedCrop || isLoading}
                          >
                            {isLoading ? 'Uploading...' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="h-5 w-5 mr-2" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          {...passwordForm.register('currentPassword')}
                          className={passwordForm.formState.errors.currentPassword ? 'border-destructive' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? 'text' : 'password'}
                          {...passwordForm.register('newPassword')}
                          className={passwordForm.formState.errors.newPassword ? 'border-destructive' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                      )}

                      {passwordForm.watch('newPassword') && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Password Strength</span>
                            <Badge variant={passwordStrength >= 75 ? 'default' : passwordStrength >= 50 ? 'secondary' : 'destructive'}>
                              {passwordStrength >= 75 ? 'Strong' : passwordStrength >= 50 ? 'Medium' : 'Weak'}
                            </Badge>
                          </div>
                          <Progress value={passwordStrength} className="h-2" />
                          <div className="grid grid-cols-4 gap-1 text-xs">
                            <div className={`flex items-center ${passwordStrength >= 25 ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              8+ chars
                            </div>
                            <div className={`flex items-center ${passwordStrength >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Lowercase
                            </div>
                            <div className={`flex items-center ${passwordStrength >= 75 ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Uppercase
                            </div>
                            <div className={`flex items-center ${passwordStrength >= 100 ? 'text-green-600' : 'text-muted-foreground'}`}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Number
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...passwordForm.register('confirmPassword')}
                          className={passwordForm.formState.errors.confirmPassword ? 'border-destructive' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                      )}
                    </div>

                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Password must be at least 8 characters long and contain uppercase, lowercase, and numeric characters.
                      </AlertDescription>
                    </Alert>

                    <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Notification Preferences</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email notifications</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">SMS notifications</span>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Privacy Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Profile visibility</span>
                          <Button variant="outline" size="sm">Public</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Contact information</span>
                          <Button variant="outline" size="sm">Private</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                        <p className="text-sm text-muted-foreground">Irreversible actions</p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
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