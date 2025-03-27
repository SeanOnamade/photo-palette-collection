
import { useEffect, useState } from "react";

interface PortfolioContactProps {
  title: string;
  email?: string;
  phone?: string;
  socialLinks?: Array<{
    name: string;
    url: string;
    icon?: React.ReactNode;
  }>;
}

const PortfolioContact = ({ title, email, phone, socialLinks }: PortfolioContactProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("portfolio-contact");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section
      id="portfolio-contact"
      className="py-16 md:py-4 px-4 bg-portfolio-bg"
    >
      <div className="container max-w-2xl">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-portfolio-text text-3xl font-light mb-8">{title}</h2>

          <div className="flex flex-col space-y-6">
            {email && (
              <div className="transition-all duration-700 delay-100">
                <p className="text-sm uppercase tracking-wider text-portfolio-muted mb-1">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="text-portfolio-text text-md hover:text-portfolio-accent transition-colors duration-300 break-all"
                >
                  {email}
                </a>
              </div>
            )}

            {phone && (
              <div className="transition-all duration-700 delay-200">
                <p className="text-sm uppercase tracking-wider text-portfolio-muted mb-1">Phone</p>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="text-portfolio-text text-lg hover:text-portfolio-accent transition-colors duration-300"
                >
                  {phone}
                </a>
              </div>
            )}

            {socialLinks && socialLinks.length > 0 && (
              <div className="transition-all duration-700 delay-300">
                <p className="text-sm uppercase tracking-wider text-portfolio-muted mb-3">Connect</p>
                <div className="flex items-center justify-center space-x-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-portfolio-muted hover:text-portfolio-accent transition-colors duration-300"
                      aria-label={link.name}
                    >
                      {link.icon || link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioContact;
