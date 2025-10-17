import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import { FileText, CheckCircle, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Admission() {
  const [formData, setFormData] = useState({
    studentName: '',
    dateOfBirth: '',
    gender: '',
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    address: '',
    previousSchool: '',
    classApplying: '',
    medicalConditions: '',
    agreeTerms: false
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Application Submitted!",
      description: "We'll review your application and contact you soon.",
    });
  };

  const admissionSteps = [
    {
      icon: FileText,
      title: "Submit Application",
      description: "Complete and submit the online application form with required documents."
    },
    {
      icon: Clock,
      title: "Review Process",
      description: "Our admission team reviews your application within 3-5 business days."
    },
    {
      icon: Users,
      title: "Interview",
      description: "Selected candidates will be invited for an interview with our academic team."
    },
    {
      icon: CheckCircle,
      title: "Admission Decision",
      description: "Successful applicants receive admission letters and enrollment instructions."
    }
  ];

  const requirements = [
    "Birth Certificate (Certified copy)",
    "Previous School Report Cards",
    "Passport Photographs (4 copies)",
    "Medical Report",
    "Parent/Guardian ID Copy",
    "Completed Application Form"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Apply for Admission
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
            Join our academic community and embark on a journey of excellence in Islamic education
          </p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 animate-fade-in">
            Admission Process
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {admissionSteps.map((step, index) => (
              <Card 
                key={index} 
                className="hover-lift border-0 shadow-elevation bg-gradient-to-br from-white to-muted/30 animate-fade-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form and Requirements */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Application Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-glow border-0 animate-fade-in">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-primary">
                      Student Application Form
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Student Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Student Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="studentName">Full Name</Label>
                            <Input
                              id="studentName"
                              type="text"
                              placeholder="Student's full name"
                              value={formData.studentName}
                              onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Date of Birth</Label>
                            <Input
                              id="dateOfBirth"
                              type="date"
                              value={formData.dateOfBirth}
                              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="gender">Gender</Label>
                            <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="classApplying">Class Applying For</Label>
                            <Select value={formData.classApplying} onValueChange={(value) => setFormData({...formData, classApplying: value})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nursery1">Nursery 1</SelectItem>
                                <SelectItem value="nursery2">Nursery 2</SelectItem>
                                <SelectItem value="primary1">Primary 1</SelectItem>
                                <SelectItem value="primary2">Primary 2</SelectItem>
                                <SelectItem value="primary3">Primary 3</SelectItem>
                                <SelectItem value="primary4">Primary 4</SelectItem>
                                <SelectItem value="primary5">Primary 5</SelectItem>
                                <SelectItem value="primary6">Primary 6</SelectItem>
                                <SelectItem value="jss1">JSS 1</SelectItem>
                                <SelectItem value="jss2">JSS 2</SelectItem>
                                <SelectItem value="jss3">JSS 3</SelectItem>
                                <SelectItem value="ss1">SS 1</SelectItem>
                                <SelectItem value="ss2">SS 2</SelectItem>
                                <SelectItem value="ss3">SS 3</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Parent Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Parent/Guardian Information</h3>
                        <div className="space-y-2">
                          <Label htmlFor="parentName">Parent/Guardian Name</Label>
                          <Input
                            id="parentName"
                            type="text"
                            placeholder="Parent or guardian's full name"
                            value={formData.parentName}
                            onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="parentEmail">Email Address</Label>
                            <Input
                              id="parentEmail"
                              type="email"
                              placeholder="Parent's email address"
                              value={formData.parentEmail}
                              onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="parentPhone">Phone Number</Label>
                            <Input
                              id="parentPhone"
                              type="tel"
                              placeholder="Parent's phone number"
                              value={formData.parentPhone}
                              onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="address">Home Address</Label>
                          <Textarea
                            id="address"
                            placeholder="Complete home address"
                            rows={3}
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            required
                          />
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-primary">Additional Information</h3>
                        <div className="space-y-2">
                          <Label htmlFor="previousSchool">Previous School (if any)</Label>
                          <Input
                            id="previousSchool"
                            type="text"
                            placeholder="Name of previous school"
                            value={formData.previousSchool}
                            onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="medicalConditions">Medical Conditions/Allergies</Label>
                          <Textarea
                            id="medicalConditions"
                            placeholder="Any medical conditions or allergies we should know about"
                            rows={3}
                            value={formData.medicalConditions}
                            onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                          />
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => setFormData({...formData, agreeTerms: checked as boolean})}
                        />
                        <Label htmlFor="terms" className="text-sm">
                          I agree to the terms and conditions and confirm that all information provided is accurate.
                        </Label>
                      </div>

                      <Button type="submit" variant="hero" size="lg" className="w-full">
                        Submit Application
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              {/* Requirements Sidebar */}
              <div className="space-y-8">
                <Card className="shadow-elevation animate-slide-up">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">
                      Required Documents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-elevation animate-slide-up">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">
                      Important Dates
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary">Application Deadline</h4>
                      <p className="text-sm text-muted-foreground">August 31st, 2024</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Interview Period</h4>
                      <p className="text-sm text-muted-foreground">September 1-15, 2024</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">Session Begins</h4>
                      <p className="text-sm text-muted-foreground">September 23rd, 2024</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-elevation animate-slide-up">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-primary">
                      Need Help?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Contact our admissions office for assistance with your application.
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Admissions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}