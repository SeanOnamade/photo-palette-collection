import { useEffect, useState } from "react";

interface PortfolioHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  alignment?: "left" | "center" | "right";
}

const PortfolioHero = ({
  title,
  subtitle,
  backgroundImage,
  alignment = "center",
}: PortfolioHeroProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getAlignmentClasses = () => {
    switch (alignment) {
      case "left":
        return "text-left items-start";
      case "right":
        return "text-right items-end";
      default:
        return "text-center items-center";
    }
  };

  return (
    <section
      className={
        "relative min-h-[70vh] flex items-center justify-center " +
        "px-4 py-16 md:py-24 overflow-hidden bg-portfolio-accent"
      }
      // Only wrap backgroundImage with url(...) here
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div
        className={`container relative z-10 flex flex-col ${getAlignmentClasses()} max-w-4xl`}
      >
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-white">
            {title}
          </h1>
        </div>

        {subtitle && (
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p className="text-lg md:text-xl max-w-xl text-white/90">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PortfolioHero;
