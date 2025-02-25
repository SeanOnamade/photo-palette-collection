
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-light mb-6">Welcome to Your Studio</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          This is your creative space. Explore your photography portfolio or start building something new.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            className="bg-portfolio-accent hover:bg-portfolio-accent/90 text-white"
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
