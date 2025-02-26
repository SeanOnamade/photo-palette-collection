
import { Instagram, Mail, Phone } from "lucide-react";
import PortfolioHero from "@/components/PortfolioHero";
import ImageGallery from "@/components/ImageGallery";
import PortfolioAbout from "@/components/PortfolioAbout";
import PortfolioContact from "@/components/PortfolioContact";
import PortfolioSidebar from "@/components/PortfolioSidebar";
import { useEffect } from "react";

const PhotographyPortfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioImages = [
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
    }
  ];

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
            <p className="text-portfolio-muted text-center mb-12 max-w-xl mx-auto">
              A curated selection of my finest work across various photography genres.
            </p>
            <ImageGallery images={portfolioImages} columns={5} />
          </div>
        </section>

        <PortfolioAbout
          title="About Me"
          content={
            <>
              <p>
                I am a photographer with a passion for capturing the authentic beauty in every moment. My journey began over a decade ago, and since then I've been fortunate to work with amazing clients across portrait, landscape, and commercial photography.
              </p>
              <p className="mt-4">
                My approach is minimalist and intentional, focusing on composition, lighting, and the genuine emotion of each scene. I believe photography should tell a story and evoke feeling, not just document a moment.
              </p>
            </>
          }
          imageSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
        />

        <PortfolioContact
          title="Get in Touch"
          email="hello@example.com"
          phone="(123) 456-7890"
          socialLinks={[
            {
              name: "Instagram",
              url: "https://instagram.com",
              icon: <Instagram className="w-6 h-6" />
            },
            {
              name: "Email",
              url: "mailto:hello@example.com",
              icon: <Mail className="w-6 h-6" />
            },
            {
              name: "Phone",
              url: "tel:1234567890",
              icon: <Phone className="w-6 h-6" />
            }
          ]}
        />

        <footer className="py-8 text-center text-portfolio-muted text-sm">
          <div className="container">
            <p>© {new Date().getFullYear()} Photography Portfolio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PhotographyPortfolio;
