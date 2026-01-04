import { useState, useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User, Shield, Camera, Mail, Loader2, CheckCircle } from 'lucide-react';
import profileService from '@/services/profileService';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profile_image: '',
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Assuming you have a way to get the auth token
        const token = localStorage.getItem('token');
        const data = await profileService.getProfile(token);
        setProfile(data);
        setPreviewImage(data.profile_image);
      } catch (error) {
        toast.error('Failed to fetch profile.');
      }
    };
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      await profileService.updateProfile(profile, token);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handleUpdatePassword = () => {
    toast.success("Password updated successfully!");
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem('token');
        const data = await profileService.updateAvatar(formData, token);
        setPreviewImage(data.profile_image);
        toast.success("Photo updated!");
      } catch (error) {
        toast.error("Failed to update photo.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.id]: e.target.value });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Sticky Identity Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 text-center">
              <div 
                className="relative w-32 h-32 mx-auto group cursor-pointer"
                onClick={handleAvatarClick}
              >
                <Avatar className="w-full h-full text-6xl transition-transform duration-300 group-hover:scale-105">
                  <AvatarImage src={previewImage || "https://github.com/shadcn.png"} alt="@admin" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 bg-blue-600/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full backdrop-blur-sm">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 text-white animate-spin" />
                  ) : (
                    <>
                      <Camera className="h-8 w-8 text-white" />
                      <span className="text-xs text-white mt-1">Change Photo</span>
                    </>
                  )}
                </div>
                {!isUploading && previewImage && (
                  <div className="absolute -bottom-2 -right-2 bg-background rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              <h2 className="mt-4 text-2xl font-bold">{profile.firstName} {profile.lastName}</h2>
              <p className="text-muted-foreground">Administrator</p>
              <div className="mt-4 flex items-center justify-center text-muted-foreground">
                <Mail className="h-4 w-4 mr-2" />
                <span>{profile.email}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Scrollable Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information Card */}
          <Card id="personal-info">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
              <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={profile.firstName} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={profile.lastName} onChange={handleChange} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={profile.email} onChange={handleChange} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleUpdateProfile}>Update Profile</Button>
            </CardFooter>
          </Card>

          {/* Security Card */}
          <Card id="security">
            <div className="h-1.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-t-lg"></div>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security
              </CardTitle>
              <CardDescription>Change your password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleUpdatePassword}>Update Password</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;