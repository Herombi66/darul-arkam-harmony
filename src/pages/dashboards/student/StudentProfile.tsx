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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useEffect, useMemo, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function StudentProfile() {
  const { toast } = useToast();
  const [isEditPhotoOpen, setIsEditPhotoOpen] = useState<boolean>(false);
  const [isSavingPhoto, setIsSavingPhoto] = useState<boolean>(false);
  const [discardOpen, setDiscardOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const persisted = useMemo(() => {
    try {
      const raw = localStorage.getItem('student_profile');
      return raw ? JSON.parse(raw) as { photoUrl: string; phone: string; address: string; guardianPhone: string; emergencyContact: string } : null;
    } catch {
      return null;
    }
  }, []);

  const [photoUrl, setPhotoUrl] = useState<string>(persisted?.photoUrl || "/placeholder.svg");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phone, setPhone] = useState<string>(persisted?.phone || "+234 803 123 4567");
  const [address, setAddress] = useState<string>(persisted?.address || "No. 15 Alkali Street, Nasarawo Ward, Gombe State");
  const [guardianPhone, setGuardianPhone] = useState<string>(persisted?.guardianPhone || "+234 806 789 0123");
  const [emergencyContact, setEmergencyContact] = useState<string>(persisted?.emergencyContact || "+234 807 456 7890");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      toast({ title: 'Invalid file', description: 'Please select an image file.', variant: 'destructive' });
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Max size is 3MB.', variant: 'destructive' });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result as string);
    reader.onerror = () => toast({ title: 'Preview error', description: 'Unable to preview image.', variant: 'destructive' });
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = async () => {
    if (!previewUrl) {
      toast({ title: 'No image selected', description: 'Choose an image before saving.', variant: 'destructive' });
      return;
    }
    try {
      setIsSavingPhoto(true);
      setPhotoUrl(previewUrl);
      toast({ title: 'Photo updated', description: 'Your profile photo has been updated.' });
      setIsEditPhotoOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Could not update profile photo.';
      toast({ title: 'Save failed', description: msg, variant: 'destructive' });
    } finally {
      setIsSavingPhoto(false);
    }
  };

  const validatePhone = (v: string) => /^[+\d][\d\s-]{7,}$/.test(v.trim());
  const validateAddress = (v: string) => v.trim().length >= 8;

  const saveProfile = async () => {
    try {
      setSaving(true);
      if (!validatePhone(phone) || !validatePhone(guardianPhone) || !validatePhone(emergencyContact) || !validateAddress(address)) {
        throw new Error('Please correct invalid fields before saving.');
      }
      const payload = { photoUrl, phone: phone.trim(), address: address.trim(), guardianPhone: guardianPhone.trim(), emergencyContact: emergencyContact.trim() };
      localStorage.setItem('student_profile', JSON.stringify(payload));
      toast({ title: 'Changes saved', description: 'Your profile was updated successfully.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes.';
      toast({ title: 'Save failed', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    try {
      const raw = localStorage.getItem('student_profile');
      if (raw) {
        const p = JSON.parse(raw) as { photoUrl: string; phone: string; address: string; guardianPhone: string; emergencyContact: string };
        setPhotoUrl(p.photoUrl || "/placeholder.svg");
        setPhone(p.phone || "+234 803 123 4567");
        setAddress(p.address || "No. 15 Alkali Street, Nasarawo Ward, Gombe State");
        setGuardianPhone(p.guardianPhone || "+234 806 789 0123");
        setEmergencyContact(p.emergencyContact || "+234 807 456 7890");
        setPreviewUrl(null);
      } else {
        setPhotoUrl("/placeholder.svg");
        setPhone("+234 803 123 4567");
        setAddress("No. 15 Alkali Street, Nasarawo Ward, Gombe State");
        setGuardianPhone("+234 806 789 0123");
        setEmergencyContact("+234 807 456 7890");
        setPreviewUrl(null);
      }
      toast({ title: 'Changes discarded', description: 'All unsaved edits were reverted.' });
    } catch {
      toast({ title: 'Discard failed', description: 'Unable to revert changes.', variant: 'destructive' });
    } finally {
      setDiscardOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar userType="student" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="responsive-div container mx-auto p-6 max-w-4xl">
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
                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28">
                      <AvatarImage src={photoUrl} alt="Ahmed Musa profile photo" className="object-cover" />
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
                  <Button
                    size="sm"
                    type="button"
                    aria-label="Edit profile photo"
                    aria-haspopup="dialog"
                    aria-controls="edit-photo-dialog"
                    onClick={() => setIsEditPhotoOpen(true)}
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit Photo
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Dialog open={isEditPhotoOpen} onOpenChange={setIsEditPhotoOpen}>
              <DialogContent id="edit-photo-dialog" aria-label="Edit profile photo">
                <DialogHeader>
                  <DialogTitle>Update Profile Photo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={previewUrl || photoUrl} alt="Photo preview" className="object-cover" />
                      <AvatarFallback>AM</AvatarFallback>
                    </Avatar>
                  </div>
                  <Input type="file" accept="image/*" onChange={handleFileChange} aria-label="Choose new profile photo" />
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={() => setIsEditPhotoOpen(false)} disabled={isSavingPhoto}>Cancel</Button>
                  <Button type="button" onClick={handleSavePhoto} disabled={isSavingPhoto} aria-busy={isSavingPhoto} aria-disabled={isSavingPhoto}>
                    {isSavingPhoto ? 'Saving…' : 'Save'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

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
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!validatePhone(phone)} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Home Address</Label>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-3" />
                      <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="min-h-[80px]" aria-invalid={!validateAddress(address)} />
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
                    <Input value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} aria-invalid={!validatePhone(guardianPhone)} />
                  </div>
                  <div>
                    <Label>Emergency Contact</Label>
                    <Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} aria-invalid={!validatePhone(emergencyContact)} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <Dialog open={discardOpen} onOpenChange={setDiscardOpen}>
                <Button type="button" variant="outline" onClick={() => setDiscardOpen(true)} aria-haspopup="dialog">Discard Changes</Button>
                {discardOpen && (
                  <DialogContent aria-label="Discard changes confirmation">
                    <DialogHeader>
                      <DialogTitle>Discard unsaved changes?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setDiscardOpen(false)}>Keep Editing</Button>
                      <Button type="button" variant="destructive" onClick={discardChanges}>Discard</Button>
                    </DialogFooter>
                  </DialogContent>
                )}
              </Dialog>
              <Button type="button" onClick={saveProfile} aria-busy={saving} aria-disabled={saving} disabled={saving}> {saving ? 'Saving…' : 'Save Changes'} </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
