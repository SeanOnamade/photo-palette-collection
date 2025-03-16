
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const imageArray = [
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575733/k7rbcytphbhrwytat6wd.jpg",
    // "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575730/dlrjeypspioeuuxmbvru.jpg",
    // "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575730/hqbthuybpdoqj4f5v1tl.jpg",
    // "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575730/pgynfaif6azrh0a2ia8c.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575645/h3pciynsremi1cqqz3uz.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575611/mokeqxxjkubhyenaw3fk.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575609/brvqaptid5ybvhskw0l1.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575609/ygjzmpiyxpy9rkhfqgee.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575606/hsgaf27mmfzdoqsch1we.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575606/blcovwdfrgwmxmuynhyg.jpg",
    // "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575605/cfptapnmd4aniqorm6pk.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575602/p39wdzwbtmex1xwokafg.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575601/tlxbxll3kb6zlu283ahy.jpg",
    "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575597/orcntolhequhgd0o1tit.jpg",
    // "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575605/i8gsmkshati8y9eh2jwk.jpg",
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        {backgroundImage && (
          <img
            src={backgroundImage}
            alt="Photography studio background"
            className="w-full h-full object-cover object-center"
          />
        )}
      </div>
      
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-light mb-6 text-white">Sean Onamade</h1>
        <p className="text-xl text-white/80 mb-8 max-w-2xl">
          Explore the portfolio. Build something new.
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
