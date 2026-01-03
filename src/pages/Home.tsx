import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import ImageSlider from '@/components/ImageSlider';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Building } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "Quality Education",
      description: "Comprehensive curriculum combining Islamic values with modern academic excellence."
    },
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Dedicated and qualified teachers committed to student success and character development."
    },
    {
      icon: Award,
      title: "Excellence in Results",
      description: "Outstanding academic achievements and recognition in various competitions and examinations."
    },
    {
      icon: Building,
      title: "Modern Facilities",
      description: "State-of-the-art classrooms, laboratories, and resources for optimal learning environment."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-12">
        <div className="responsive-div container mx-auto px-4">
          <ImageSlider />
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-muted/30">
        <div className="responsive-div container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6 animate-fade-in">
            Welcome to Our Academic Community
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 animate-slide-up">
            At Darul Arqam Academy Gombe, we are committed to providing exceptional Islamic education 
            that nurtures both academic excellence and moral character development in our students.
          </p>
          <Button asChild variant="hero" size="xl" className="animate-bounce-in">
            <Link to="/login">Access Portal</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-12 animate-fade-in">
            Why Choose Darul Arqam Academy?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="hover-lift border-0 shadow-elevation bg-gradient-to-br from-white to-muted/30 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 bg-gradient-primary rounded-full">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="responsive-div container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in">
            Join Our Academic Excellence
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up">
            Experience world-class Islamic education with modern facilities and dedicated faculty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-bounce-in">
            <Button asChild variant="secondary" size="xl">
              <Link to="/login">Student Portal</Link>
            </Button>
            <Button asChild variant="warning" size="xl" className="font-bold">
              <Link to="/admission">Apply Now!</Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="bg-white/10 border-white text-white hover:bg-white hover:text-primary">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="responsive-div container mx-auto px-4 text-center">
          <p className="text-lg font-medium mb-2">Darul Arqam Academy Gombe</p>
          <p className="text-primary-foreground/80">
            Building Excellence in Islamic Education Since Our Foundation
          </p>
        </div>
      </footer>
    </div>
  );
}
