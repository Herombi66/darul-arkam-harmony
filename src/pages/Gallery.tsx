import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import schoolBuilding from '@/assets/school-building.jpg';
import studentsStudying from '@/assets/students-studying.jpg';
import teachersClassroom from '@/assets/teachers-classroom.jpg';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      src: schoolBuilding,
      title: "School Building",
      description: "Our modern and well-equipped school building"
    },
    {
      src: studentsStudying,
      title: "Students Learning",
      description: "Students engaged in collaborative learning"
    },
    {
      src: teachersClassroom,
      title: "Classroom Environment",
      description: "Interactive classroom sessions with dedicated teachers"
    },
    {
      src: schoolBuilding,
      title: "School Facilities",
      description: "State-of-the-art facilities for optimal learning"
    },
    {
      src: studentsStudying,
      title: "Academic Excellence",
      description: "Students striving for academic excellence"
    },
    {
      src: teachersClassroom,
      title: "Quality Teaching",
      description: "Expert faculty delivering quality education"
    }
  ];

  const categories = [
    "All",
    "Academic",
    "Sports",
    "Events",
    "Facilities"
  ];

  const [activeCategory, setActiveCategory] = useState("All");

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
            School Gallery
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto animate-slide-up">
            Explore life at Darul Arqam Academy through our photo gallery
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "hero" : "outline"}
                onClick={() => setActiveCategory(category)}
                className="animate-fade-in"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image, index) => (
              <Card 
                key={index} 
                className="hover-lift cursor-pointer shadow-elevation animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => openLightbox(index)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <div className="text-white">
                        <h3 className="font-semibold">{image.title}</h3>
                        <p className="text-sm text-white/80">{image.description}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeLightbox}
            >
              <X className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={prevImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon" 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <img
              src={galleryImages[selectedImage].src}
              alt={galleryImages[selectedImage].title}
              className="max-w-full max-h-full object-contain"
            />
            
            <div className="absolute bottom-4 left-4 right-4 text-white text-center">
              <h3 className="text-xl font-semibold mb-2">
                {galleryImages[selectedImage].title}
              </h3>
              <p className="text-white/80">
                {galleryImages[selectedImage].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Students</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-primary mb-2">50+</h3>
              <p className="text-muted-foreground">Teachers</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-primary mb-2">15+</h3>
              <p className="text-muted-foreground">Years Excellence</p>
            </div>
            <div className="animate-fade-in">
              <h3 className="text-4xl font-bold text-primary mb-2">100%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}