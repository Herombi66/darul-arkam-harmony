import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Address",
      details: ["Darul Arqam Academy Gombe", "Gombe State, Nigeria"]
    },
    {
      icon: Phone,
      title: "Phone",
      details: ["+234 XXX XXX XXXX", "+234 XXX XXX XXXX"]
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@darularqamgombe.edu.ng", "admin@darularqamgombe.edu.ng"]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: ["Monday - Friday: 8:00 AM - 4:00 PM", "Saturday: 8:00 AM - 12:00 PM"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            Contact Us
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
            Get in touch with us for any inquiries about admissions, academics, or general information
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 animate-fade-in">
            Get In Touch
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card 
                key={index} 
                className="hover-lift border-0 shadow-elevation bg-gradient-to-br from-white to-muted/30 animate-fade-in text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <info.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {info.title}
                  </h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-muted-foreground mb-1">
                      {detail}
                    </p>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Form */}
              <Card className="shadow-glow border-0 animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-primary">
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Your phone number"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="Message subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Your message..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>

                    <Button type="submit" variant="hero" size="lg" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="space-y-8 animate-slide-up">
                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Visit Our Campus
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    We welcome visitors to our campus to see our facilities and meet our faculty. 
                    Please schedule an appointment in advance.
                  </p>
                  <Button variant="outline" size="lg">
                    Schedule a Visit
                  </Button>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Admissions Inquiry
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Interested in enrolling your child? Contact our admissions office for 
                    detailed information about the application process.
                  </p>
                  <Button variant="secondary" size="lg">
                    Admissions Info
                  </Button>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-primary mb-4">
                    Emergency Contact
                  </h3>
                  <p className="text-muted-foreground">
                    For urgent matters outside office hours, please call our emergency line:
                  </p>
                  <p className="text-primary font-semibold text-lg">
                    +234 XXX XXX XXXX
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 animate-fade-in">
            Find Us
          </h2>
          <div className="bg-muted/50 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">
                Interactive Map
              </h3>
              <p className="text-muted-foreground">
                Map integration coming soon
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}