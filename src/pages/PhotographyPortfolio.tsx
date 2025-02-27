
import { useState, useMemo, useEffect } from "react";
import PortfolioHero from "@/components/PortfolioHero";
import ImageGallery from "@/components/ImageGallery";
import PortfolioSidebar from "@/components/PortfolioSidebar";

// Define the image interface
interface PortfolioImage {
  src: string;
  alt: string;
  title?: string;
  category?: string;
}

const PhotographyPortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioImages: PortfolioImage[] = [
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1583766395091-2eb9994ed094",
      alt: "Portrait of a woman with dramatic lighting",
      title: "Elegance",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      alt: "Landscape with mountains and lake",
      title: "Serenity Valley",
      category: "Landscape"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      alt: "Fashion portrait in purple lighting",
      title: "Purple Haze",
      category: "Fashion"
    },
    {
      src: "https://images.unsplash.com/photo-1468078809804-4c7b3e60a478",
      alt: "Wedding couple in a forest",
      title: "Forest Romance",
      category: "Wedding"
    },
    {
      src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
      alt: "Dramatic mountain landscape at sunset",
      title: "Mountain Majesty",
      category: "Landscape"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9",
      alt: "Portrait of a woman with red hair",
      title: "Flame",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5",
      alt: "City architecture at night",
      title: "Urban Nightscape",
      category: "Urban"
    },
    {
      src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      alt: "Close-up of a dog",
      title: "Man's Best Friend",
      category: "Pet"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1464863979621-258859e62245",
      alt: "Portrait of a woman in dramatic pose",
      title: "Strength",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4",
      alt: "Aerial view of forest and lake",
      title: "Natural Patterns",
      category: "Aerial"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      alt: "Fashion model in stylish pose",
      title: "Haute Couture",
      category: "Fashion"
    },
    {
      src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
      alt: "Fashion model on urban street",
      title: "Urban Fashion",
      category: "Fashion"
    },
    {
      src: "https://images.unsplash.com/photo-1620735692151-26a7e0748429",
      alt: "Abstract architectural details",
      title: "Geometric Harmony",
      category: "Abstract"
    },
    // Vertical cat photo
    {
      src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      alt: "Close-up of a cat with green eyes",
      title: "Whiskers",
      category: "Pet"
    },
    {
      src: "https://images.unsplash.com/photo-1519682577862-22b62b24e493",
      alt: "Close-up portrait with shallow depth of field",
      title: "Depth of Soul",
      category: "Portrait"
    },
    // Adding more photos to double the count - second set
    // Vertical tabby cat
    {
      src: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
      alt: "Grey tabby kitten",
      title: "Curious Kitten",
      category: "Pet"
    },
    {
      src: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
      alt: "Brown ox on mountain",
      title: "Mountain Guardian",
      category: "Wildlife"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
      alt: "Orange and white tabby cat",
      title: "Cozy Companion",
      category: "Pet"
    },
    {
      src: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
      alt: "Brown antelope and zebra on field at daytime",
      title: "Safari Friends",
      category: "Wildlife"
    },
    {
      src: "https://images.unsplash.com/photo-1583766395091-2eb9994ed094",
      alt: "Portrait of a woman with dramatic lighting - variation",
      title: "Elegance II",
      category: "Portrait"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9",
      alt: "Portrait of a woman with red hair - variation",
      title: "Flame Revisited",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      alt: "Landscape with mountains and lake - variation",
      title: "Serenity Valley Dawn",
      category: "Landscape"
    },
    {
      src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
      alt: "Close-up of a dog - variation",
      title: "Loyal Friend",
      category: "Pet"
    },
    // Vertical photo
    {
      src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
      alt: "Fashion model in stylish pose - variation",
      title: "Haute Couture Evening",
      category: "Fashion"
    },
    {
      src: "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4",
      alt: "Aerial view of forest and lake - variation",
      title: "Natural Patterns Sunset",
      category: "Aerial"
    }
  ];

  // Get unique categories for the filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    portfolioImages.forEach(image => {
      if (image.category) {
        uniqueCategories.add(image.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [portfolioImages]);

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (!selectedCategory) return portfolioImages;
    return portfolioImages.filter(image => image.category === selectedCategory);
  }, [portfolioImages, selectedCategory]);

  return (
    <div className="flex h-screen bg-portfolio-bg overflow-hidden">
      <PortfolioSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <PortfolioHero
          title="Capturing Moments in Time"
          subtitle="Photography is the art of freezing emotions and stories into timeless frames."
          backgroundImage="https://images.unsplash.com/photo-1554048612-b6a482bc67e5"
        />

        <section className="py-16 md:py-24 px-4">
          <div className="max-w-[2000px] mx-auto">
            <h2 className="text-portfolio-text text-3xl font-light mb-2 text-center">Portfolio</h2>
            <p className="text-portfolio-muted text-center mb-8 max-w-xl mx-auto">
              A curated selection of my finest work across various photography genres.
            </p>
            
            {/* Category filter */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === null 
                    ? 'bg-portfolio-accent text-white' 
                    : 'bg-gray-100 text-portfolio-text hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedCategory === category 
                      ? 'bg-portfolio-accent text-white' 
                      : 'bg-gray-100 text-portfolio-text hover:bg-gray-200'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <ImageGallery images={filteredImages} columns={5} />
          </div>
        </section>

        <footer className="py-8 text-center text-portfolio-muted text-sm mt-8">
          <div className="container">
            <p>© {new Date().getFullYear()} Photography Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PhotographyPortfolio;
