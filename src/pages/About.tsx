
import { Instagram, Mail, Phone } from "lucide-react";
import PortfolioSidebar from "@/components/PortfolioSidebar";
import PortfolioHero from "@/components/PortfolioHero";
import { useEffect, useState } from "react";
import PortfolioContact from "@/components/PortfolioContact";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const imageArray = [
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575733/k7rbcytphbhrwytat6wd.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575645/h3pciynsremi1cqqz3uz.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575611/mokeqxxjkubhyenaw3fk.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575609/brvqaptid5ybvhskw0l1.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575609/ygjzmpiyxpy9rkhfqgee.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575606/hsgaf27mmfzdoqsch1we.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575606/blcovwdfrgwmxmuynhyg.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575602/p39wdzwbtmex1xwokafg.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575601/tlxbxll3kb6zlu283ahy.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575597/orcntolhequhgd0o1tit.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575595/eyqbq7lekbrfdrk8bgdx.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575593/h6fsowqukftwt9qj3lao.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575593/rtw4fkoeywig55iiqiko.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575590/gsdsotaaetijemlcejph.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575501/cxrucuym3oogpk0ocerd.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575498/o5mrjq0rp0xjmhabzehu.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575492/po9ojlmhfviy9ptwkbwb.jpg",
  ];

  // Randomly select an image when the component mounts
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * imageArray.length);
    setBackgroundImage(imageArray[randomIndex]);
  }, []);

  return (
    <div className="flex h-screen bg-portfolio-bg overflow-hidden">
      <PortfolioSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <PortfolioHero
          title="About Me"
          subtitle="Capturing life's moments through my lens"
          backgroundImage={backgroundImage}
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
                    I'm a story-lover at my core. Photography allowes me to capture light itself as a standalone story, leaving it to our imaginations and experiences to extrapolate and explore the beauty inherent to every moment. My journey began sophomore year of college, where I joined the school newspaper (the Vanderbilt Hustler), and since then I've been fortunate enough to photograph my friends, my family, and my ever-changing surroundings.
                  </p>
                  <p className="mt-4">
                    My approach is still developing; I tend to focus on on composition, framing, and color. As not only a photographer but also a writer, I believe photography should tell a story and evoke feeling, rather than just document a moment (although the latter isn't bad either!)
                  </p>
                  <p className="mt-4">
                    When I'm not behind the camera, I enjoy writing, making music, hitting the gym, building out software projects, and hanging out with my friends.
                  </p>
                  <p className="mt-4">
                    My work has been featured in the Vanderbilt Hustler, various student organization events, and different photo clubs, and I'm always looking for new challenges and collaborations that push my artistic boundaries. Feel free to reach out!
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
