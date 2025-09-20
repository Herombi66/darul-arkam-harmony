import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Mr. Abdullahi Musa",
    email: "abdullahi.musa@email.com",
    phone: "+234 801 234 5678",
    address: "123 Main Street, Gombe, Nigeria",
    dateOfBirth: "1985-05-15",
    occupation: "Business Owner",
    emergencyContact: "Mrs. Fatima Musa - +234 802 345 6789",
    bio: "Dedicated parent committed to providing the best education for my children at Darul Arqam Academy."
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original data if needed
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar userType="parent" />

      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Breadcrumb Navigation */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dashboard/parent">Parent Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Profile</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information and account settings.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/dashboard/parent">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-elevation">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder-avatar.jpg" alt={profileData.name} />
                      <AvatarFallback className="text-2xl">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-primary">{profileData.name}</h3>
                      <p className="text-sm text-muted-foreground">Parent ID: PAR/2024/001</p>
                      <p className="text-sm text-muted-foreground">{profileData.occupation}</p>
                    </div>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-elevation">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Personal Information
                    {isEditing && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handleCancel}>
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                          <User className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span>{profileData.name}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                          <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span>{profileData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                          <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span>{profileData.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dob"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        />
                      ) : (
                        <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                          <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                          <span>{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-start p-3 bg-muted/50 rounded-lg">
                        <MapPin className="h-4 w-4 mr-3 mt-1 text-muted-foreground" />
                        <span>{profileData.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    {isEditing ? (
                      <Input
                        id="occupation"
                        value={profileData.occupation}
                        onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <User className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{profileData.occupation}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency">Emergency Contact</Label>
                    {isEditing ? (
                      <Input
                        id="emergency"
                        value={profileData.emergencyContact}
                        onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center p-3 bg-muted/50 rounded-lg">
                        <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{profileData.emergencyContact}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        rows={3}
                      />
                    ) : (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{profileData.bio}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}