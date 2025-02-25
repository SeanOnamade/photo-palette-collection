
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81"
          alt="Photography studio background"
          className="w-full h-full object-cover animate-image-fade-in"
        />
      </div>
      
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-light mb-6 text-white">Welcome to Your Studio</h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl">
          This is your creative space. Explore your photography portfolio or start building something new.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-white text-portfolio-accent hover:bg-white/90"
            onClick={() => navigate("/portfolio")}
          >
            View Photography Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
