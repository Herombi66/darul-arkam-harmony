import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Heart, Trophy, Globe, Shield } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Islamic Values",
      description: "Instilling strong Islamic principles and moral character in every student."
    },
    {
      icon: BookOpen,
      title: "Academic Excellence",
      description: "Providing world-class education with modern teaching methodologies."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "Building a supportive community of learners, teachers, and parents."
    },
    {
      icon: Trophy,
      title: "Achievement",
      description: "Celebrating success in academics, sports, and character development."
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Preparing students for success in an interconnected world."
    },
    {
      icon: Shield,
      title: "Safe Environment",
      description: "Maintaining a secure and nurturing learning environment."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            About Darul Arqam Academy
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
            Excellence in Islamic Education Since Our Foundation
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-8 animate-fade-in">
              Our Mission & Vision
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="shadow-elevation hover-lift animate-fade-in">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">Mission</h3>
                  <p className="text-muted-foreground">
                    To provide exceptional Islamic education that combines academic excellence with 
                    moral character development, preparing students to be righteous leaders and 
                    contributing members of society.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-elevation hover-lift animate-fade-in">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-primary mb-4">Vision</h3>
                  <p className="text-muted-foreground">
                    To be the leading Islamic educational institution in Nigeria, recognized for 
                    producing graduates who excel academically while embodying the highest Islamic 
                    values and contributing positively to global society.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 animate-fade-in">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="hover-lift border-0 shadow-elevation bg-gradient-to-br from-white to-muted/30 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <value.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 animate-fade-in">
              Our History
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="text-center mb-8">
                Darul Arqam Academy Gombe was established with the vision of providing quality Islamic 
                education that prepares students for both this world and the hereafter. Our institution 
                has grown from humble beginnings to become one of the most respected Islamic schools in Gombe State.
              </p>
              <p className="text-center mb-8">
                Over the years, we have consistently produced graduates who excel in their chosen fields 
                while maintaining strong Islamic values. Our alumni serve in various sectors including 
                education, healthcare, business, and public service, making positive contributions to society.
              </p>
              <p className="text-center">
                Today, we continue to evolve and adapt to modern educational needs while staying true to 
                our Islamic roots and commitment to excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            Join Our Academic Family
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
            Discover how we can help shape your child's future with excellence in Islamic education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
            <Button asChild variant="secondary" size="xl">
              <Link to="/admission">Apply for Admission</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}