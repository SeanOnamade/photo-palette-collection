
import { useEffect, useState } from "react";

interface PortfolioAboutProps {
  title: string;
  content: string | React.ReactNode;
  imageSrc?: string;
  reverse?: boolean;
}

const PortfolioAbout = ({
  title,
  content,
  imageSrc,
  reverse = false,
}: PortfolioAboutProps) => {
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

    const element = document.getElementById("portfolio-about");
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
      id="portfolio-about"
      className="py-16 md:py-24 px-4"
    >
      <div className="container max-w-5xl">
        <div
          className={`flex flex-col ${
            imageSrc ? "lg:flex-row" : ""
          } gap-8 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}
        >
          {imageSrc && (
            <div
              className={`w-full lg:w-1/2 transition-all duration-1000 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
            >
              <div className="relative rounded-md overflow-hidden">
                <img
                  src={imageSrc}
                  alt="About"
                  className="w-full h-auto object-cover aspect-[3/4]"
                />
              </div>
            </div>
          )}

          <div
            className={`w-full ${
              imageSrc ? "lg:w-1/2" : ""
            } transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="text-portfolio-text text-3xl font-light mb-6">{title}</h2>
            <div className="prose prose-lg text-portfolio-muted max-w-none">
              {typeof content === "string" ? <p>{content}</p> : content}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioAbout;
