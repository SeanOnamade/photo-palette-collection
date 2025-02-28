
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

        <section className="py-16 md:py-10 px-4">
          <div className="container max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2">
                <div className="relative rounded-md overflow-hidden">
                  <img
                    src="\images\DSCF4225.jpg"
                    alt="About"
                    className="w-full h-auto object-cover aspect-[3/4]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <div className="prose prose-lg text-portfolio-muted max-w-none">
                  <h1 className="text-xl font-bold mb-4">
                    Sean Onamade.
                  </h1>
                  <p>
                    I'm a story-lover at the core. Photography allowes me to capture light as a standalone story, leaving it to our imaginations to extrapolate, to explore the beauty inherent to every moment. My journey began freshman year of college, where I joined the school newspaper, and since then I've been fortunate enough to photography my friends, my family, and my beautiful surroundings.
                  </p>
                  <p className="mt-4">
                    My approach is still developing; I tend to focus on on composition, framing, and color. As a writer on the side, I believe photography should tell a story and evoke feeling, not just document a moment (although the latter isn't bad either!).
                  </p>
                  <p className="mt-4">
                    When I'm not behind the camera, I enjoy writing, making music, hitting the gym, and hanging out with friends.
                  </p>
                  <p className="mt-4">
                    My work has been featured in the Vanderbilt Hustler, various student organization events, and photo clubs, and I'm always looking for new challenges and collaborations that push my artistic boundaries.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <PortfolioContact
          title="Get in Touch"
          email="sean.d.onamade@vanderbilt.edu"
          phone="(###) ###-####"
          socialLinks={[
            {
              name: "Instagram",
              url: "https://www.instagram.com/sdo.photos/",
              icon: <Instagram className="w-6 h-6" />
            },
            {
              name: "Email",
              url: "sean.d.onamade@vanderbilt.edu",
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
            <p>© {new Date().getFullYear()} Sean Onamade. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default About;
