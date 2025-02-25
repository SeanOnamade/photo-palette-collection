
import { Instagram, Mail, Phone } from "lucide-react";
import PortfolioHero from "@/components/PortfolioHero";
import ImageGallery from "@/components/ImageGallery";
import PortfolioAbout from "@/components/PortfolioAbout";
import PortfolioContact from "@/components/PortfolioContact";
import { useEffect } from "react";

const PhotographyPortfolio = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioImages = [
    {
      src: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e",
      alt: "Portrait of a woman in dramatic lighting",
      title: "Dramatic Portrait",
      category: "Portrait"
    },
    {
      src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      alt: "Landscape with mountains and lake",
      title: "Serenity Valley",
      category: "Landscape"
    },
    {
      src: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5",
      alt: "City architecture at night",
      title: "Urban Nightscape",
      category: "Urban"
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
    {
      src: "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4",
      alt: "Aerial view of forest and lake",
      title: "Natural Patterns",
      category: "Aerial"
    },
    {
      src: "https://images.unsplash.com/photo-1523368749929-6b8e38c66ce4",
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
    {
      src: "https://images.unsplash.com/photo-1519682577862-22b62b24e493",
      alt: "Close-up portrait with shallow depth of field",
      title: "Depth of Soul",
      category: "Portrait"
    }
  ];

  return (
    <div className="bg-portfolio-bg min-h-screen">
      <PortfolioHero
        title="Capturing Moments in Time"
        subtitle="Photography is the art of freezing emotions and stories into timeless frames."
        backgroundImage="https://images.unsplash.com/photo-1542038784456-1ea8e935640e"
      />

      <section className="py-16 md:py-24 px-4">
        <div className="container max-w-5xl">
          <h2 className="text-portfolio-text text-3xl font-light mb-2 text-center">Portfolio</h2>
          <p className="text-portfolio-muted text-center mb-12 max-w-xl mx-auto">
            A curated selection of my finest work across various photography genres.
          </p>
          <ImageGallery images={portfolioImages} />
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
  );
};

export default PhotographyPortfolio;
