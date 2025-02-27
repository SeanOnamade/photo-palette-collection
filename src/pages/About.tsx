
import { Instagram, Mail, Phone } from "lucide-react";
import PortfolioSidebar from "@/components/PortfolioSidebar";
import PortfolioHero from "@/components/PortfolioHero";
import { useEffect } from "react";
import PortfolioContact from "@/components/PortfolioContact";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-screen bg-portfolio-bg overflow-hidden">
      <PortfolioSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <PortfolioHero
          title="About Me"
          subtitle="Capturing life's moments through my lens"
          backgroundImage="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
        />

        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                    alt="About"
                    className="w-full h-auto object-cover aspect-[3/4]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="prose prose-lg text-portfolio-muted max-w-none">
                  <p>
                    I am a photographer with a passion for capturing the authentic beauty in every moment. My journey began over a decade ago, and since then I've been fortunate to work with amazing clients across portrait, landscape, and commercial photography.
                  </p>
                  <p className="mt-4">
                    My approach is minimalist and intentional, focusing on composition, lighting, and the genuine emotion of each scene. I believe photography should tell a story and evoke feeling, not just document a moment.
                  </p>
                  <p className="mt-4">
                    When I'm not behind the camera, I enjoy hiking in nature, exploring urban landscapes, and studying the work of master photographers who inspire my creative vision.
                  </p>
                  <p className="mt-4">
                    My work has been featured in several publications and exhibitions, and I'm always looking for new challenges and collaborations that push my artistic boundaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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

export default About;
