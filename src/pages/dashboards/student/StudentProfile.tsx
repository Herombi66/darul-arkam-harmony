import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import DashboardSidebar from '@/components/DashboardSidebar';
import { Edit3, Mail, Phone, MapPin, Calendar, User } from 'lucide-react';

export default function StudentProfile() {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and settings</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-lg">AM</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-semibold">Ahmed Musa</h2>
                      <p className="text-muted-foreground">Class 10A • Roll No: 2024001</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">Active Student</Badge>
                        <Badge className="bg-emerald-100 text-emerald-800">Science Stream</Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Photo
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value="Ahmed" readOnly />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value="Musa" readOnly />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input id="dateOfBirth" value="15/08/2008" readOnly />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" value="Male" readOnly />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input id="bloodGroup" value="O+" readOnly />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input id="email" value="ahmed.musa@darularqam.edu.ng" readOnly />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input id="phone" value="+234 803 123 4567" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Home Address</Label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-3" />
                      <Textarea 
                        id="address" 
                        value="No. 15 Alkali Street, Nasarawo Ward, Gombe State"
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Academic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Academic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Admission Number</Label>
                      <Input value="DAA/2024/001" readOnly />
                    </div>
                    <div>
                      <Label>Session</Label>
                      <Input value="2024/2025" readOnly />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Class</Label>
                      <Input value="SS2 Science" readOnly />
                    </div>
                    <div>
                      <Label>House</Label>
                      <Input value="Green House" readOnly />
                    </div>
                  </div>
                  <div>
                    <Label>Stream</Label>
                    <Input value="Science (Physics, Chemistry, Biology)" readOnly />
                  </div>
                </CardContent>
              </Card>

              {/* Guardian Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Guardian Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Father's Name</Label>
                    <Input value="Musa Ibrahim Abdullahi" readOnly />
                  </div>
                  <div>
                    <Label>Mother's Name</Label>
                    <Input value="Aisha Musa Ibrahim" readOnly />
                  </div>
                  <div>
                    <Label>Guardian Phone</Label>
                    <Input value="+234 806 789 0123" />
                  </div>
                  <div>
                    <Label>Emergency Contact</Label>
                    <Input value="+234 807 456 7890" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline">Cancel Changes</Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}