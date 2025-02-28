
import { useState, useMemo, useEffect } from "react";
import PortfolioHero from "@/components/PortfolioHero";
import ImageGallery from "@/components/ImageGallery";
import PortfolioSidebar from "@/components/PortfolioSidebar";

// Define the image interface
interface PortfolioImage {
  src: string;
  alt: string;
  title?: string;
  category?: string;
}

const PhotographyPortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioImages: PortfolioImage[] = [
    {
      src: "src/images/Batch1--2.jpg",
      alt: "Portrait of downtown Calgary through chain link fence",
      title: "Through the Chain Link",
      category: "Urban"
    },
    {
      src: "src/images/Batch1--7.jpg",
      alt: "Food Soda restaurant sign",
      title: "Food Soda",
      category: "Urban"
    },
    {
      src: "src/images/DecPost-10.jpg",
      alt: "Group of friends walking during Halloween",
      title: "Hallowe'en",
      category: "Fun"
    },
    {
      src: "src/images/DecPost-14.jpg",
      alt: "Friends partying",
      title: "Party People",
      category: "Fun"
    },
    {
      src: "src/images/Centennial2023.11.11-SO-4.jpg",
      alt: "Centennial Park at dusk",
      title: "100",
      category: "Landscape"
    },
    {
      src: "src/images/DSC01150.jpg",
      alt: "Cheerleaders at a soccer game hyping up child fans",
      title: "Cheer Leaders",
      category: "Sports"
    },
    {
      src: "src/images/DSC01296.jpg",
      alt: "Goalie making a kick",
      title: "Full Force",
      category: "Sports"
    },
    {
      src: "src/images/DSC03012-3.jpg",
      alt: "Landscape photo of Alumni Lawn",
      title: "Alumni Lawn",
      category: "Landscape"
    },
    {
      src: "src/images/DSC5051.jpg",
      alt: "Performers at Harambee 2023",
      title: "Harambee",
      category: "Fun"
    },
    {
      src: "src/images/DSCF4225.jpg",
      alt: "Portrait of Sean",
      title: "Smug Mug by Nafees",
      category: "Portrait"
    },
    {
      src: "src/images/IMG_0050.jpg",
      alt: "Portrait of a dog",
      title: "Cavalier",
      category: "Portrait"
    },
    {
      src: "src/images/IMG_0391.jpg",
      alt: "Kevin on a hill",
      title: "At His Feet",
      category: "Landscape"
    },
    {
      src: "src/images/IMG_1002.jpg",
      alt: "The Calgary Stampede",
      title: "Stampede",
      category: "Fun"
    },
    {
      src: "src/images/IMG_1016.jpg",
      alt: "Portrait of Precious in front of a Ferris Wheel",
      title: "Precious",
      category: "Portrait"
    },
    {
      src: "src/images/IMG_1586.jpg",
      alt: "Statue of a knight on a horse in France",
      title: "Steed",
      category: "Landscape"
    },
    {
      src: "src/images/IMG_1752.jpg",
      alt: "Carnival ride",
      title: "Rounds",
      category: "Fun"
    },
    {
      src: "src/images/IMG_2149.jpg",
      alt: "Jed on his bike",
      title: "Jed",
      category: "Portrait"
    },
    {
      src: "src/images/IMG_2291.jpg",
      alt: "The Eiffel Tower",
      title: "Tour Eiffel",
      category: "Urban"
    },
    {
      src: "src/images/IMG_3718.jpg",
      alt: "Pinching the Eiffel Tower",
      title: "Figurine",
      category: "Urban"
    },
    {
      src: "src/images/IMG_4497.jpg",
      alt: "Below the Eiffel Tower at dusk",
      title: "Au-Dessous",
      category: "Urban"
    },
    // {
    //   src: "src/images/IMG_5475.jpg",
    //   alt: "Portrait of a woman with dramatic lighting",
    //   title: "Elegance",
    //   category: "Portrait"
    // },
    {
      src: "src/images/IMG_5476.jpg",
      alt: "Boxer on the side of the ring",
      title: "Throw Down",
      category: "Events"
    },
    {
      src: "src/images/IMG_6620.jpg",
      alt: "Portrait of a woman with dramatic lighting",
      title: "Layover",
      category: "Misc."
    },
    {
      src: "src/images/IMG_7614.jpg",
      alt: "A woman on the swing in the park",
      title: "Swing Set",
      category: "Landscape"
    },
    {
      src: "src/images/IMG_8126.jpg",
      alt: "People at the Basilique du Sacré-Cœur de Montmartre",
      title: "Pose",
      category: "Urban"
    },
    {
      src: "src/images/IMG_8768.jpg",
      alt: "Buildings in Nice, France",
      title: "Stramigioli",
      category: "Urban"
    },
    {
      src: "src/images/IMG_9098-2.jpg",
      alt: "Buildings on the coast of Nice, France",
      title: "Beach Front",
      category: "Landscape"
    },
    {
      src: "src/images/IMG_9659.jpg",
      alt: "Portrait of a rubber duck",
      title: "The Frenchman",
      category: "Portrait"
    },
    {
      src: "src/images/IMG_9881-2.jpg",
      alt: "The Arc de Triomphe",
      title: "Arc",
      category: "Urban"
    },
    {
      src: "src/images/ParisStock-25.jpg",
      alt: "The Arc de Triomphe with dramatic lighting",
      title: "Triomphe",
      category: "Urban"
    },
    {
      src: "src/images/ParisStock-03.jpg",
      alt: "The Eiffel Tower",
      title: "Needle in the Sky",
      category: "Urban"
    },
    {
      src: "src/images/Summer-06.jpg",
      alt: "Kevin brushing his shoulder",
      title: "Can't Touch This",
      category: "Portrait"
    },
    ///
    // PORTFOLIO IMAGES STARTING
    ///
    {
      src: "src/images/Portfolio-01.jpg",
      alt: "Man at a train station",
      title: "Station 8",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-02.jpg",
      alt: "The Eiffel Tower",
      title: "Steel and Sky",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-03.jpg",
      alt: "Cathedral vaults",
      title: "Cathedral",
      category: "Architecture"
    },
    {
      src: "src/images/Portfolio-04.jpg",
      alt: "Smokestack in Paris",
      title: "Smog",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-05.jpg",
      alt: "Gare de Lyon, Paris",
      title: "Gare de Lyon",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-06.jpg",
      alt: "Winding Paris Street",
      title: "Winding Path",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-07.jpg",
      alt: "Man walking through Paris",
      title: "Stranger",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-08.jpg",
      title: "Love All Over",
      alt: "Locks at the Sacré-Coeur",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-09.jpg",
      alt: "View of the city of Brussels",
      title: "Brussels",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-10.jpg",
      alt: "Lauren at the beach",
      title: "Lauren",
      category: "Portrait"
    },
    {
      src: "src/images/Portfolio-11.jpg",
      alt: "Girl at the beach",
      title: "Beach",
      category: "Landscape"
    },
    {
      src: "src/images/Portfolio-12.jpg",
      alt: "Streets at Nice",
      title: "Nice Streets",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-13.jpg",
      alt: "Skies at beach in Nice",
      title: "Nice Skies",
      category: "Landscape"
    },
    {
      src: "src/images/Portfolio-14.jpg",
      alt: "Lauren and Amira at the beach",
      title: "Heart!",
      category: "Misc."
    },
    {
      src: "src/images/Portfolio-15.jpg",
      alt: "Beach pose",
      title: "11:10",
      category: "Misc."
    },
    {
      src: "src/images/Portfolio-16.jpg",
      alt: "A conversation",
      title: "What?",
      category: "Portrait"
    },
    {
      src: "src/images/Portfolio-17.jpg",
      alt: "Amira in Nice",
      title: "Amira",
      category: "Portrait"
    },
    {
      src: "src/images/Portfolio-18.jpg",
      alt: "Taking a selfie",
      title: "Our Selfie",
      category: "Portrait"
    },
    {
      src: "src/images/Portfolio-19.jpg",
      alt: "People at the Port of Nice",
      title: "Port of Nice",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-20.jpg",
      alt: "People at the Port of Nice",
      title: "Port of Nice II",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-21.jpg",
      alt: "Girl feeding ducks bread",
      title: "Sharing is Caring",
      category: "Misc."
    },
    {
      src: "src/images/Portfolio-22.jpg",
      alt: "Two koi fish",
      title: "Twin Koi",
      category: "Wildlife"
    },
    {
      src: "src/images/Portfolio-23.jpg",
      alt: "My friends on the Paris Metro",
      title: "La Métro",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-24.jpg",
      alt: "Women on the Champs-Elysees",
      title: "Light Trails",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-25.jpg",
      alt: "Light trails by the Arc de Triomphe",
      title: "At an Angle",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-26.jpg",
      alt: "Zeke grabbing a bite",
      title: "Zeke",
      category: "Portrait"
    },
    {
      src: "src/images/Portfolio-27.jpg",
      alt: "Girls on a trampoline",
      title: "Trampoline",
      category: "Fun"
    },
    {
      src: "src/images/Portfolio-28.jpg",
      alt: "People passing the Sainte-Chapelle in Paris",
      title: "Past the Past",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-29.jpg",
      alt: "People on a bridge in Paris",
      title: "Pont",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-30.jpg",
      alt: "The Louvre Pyramid in Paris",
      title: "Strongest Shape, Weakest Material",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-31.jpg",
      alt: "Tower in Paris",
      title: "Tour d'Ivoire",
      category: "Urban"
    },
    {
      src: "src/images/Portfolio-32.jpg",
      alt: "People at the Port of Nice",
      title: "Port of Nice II",
      category: "Urban"
    },
    // {
    //   src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    //   alt: "Landscape with mountains and lake",
    //   title: "Serenity Valley",
    //   category: "Landscape"
    // },
    // Vertical photo
    // {
    //   src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
    //   alt: "Fashion portrait in purple lighting",
    //   title: "Purple Haze",
    //   category: "Fashion"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    //   alt: "Dramatic mountain landscape at sunset",
    //   title: "Mountain Majesty",
    //   category: "Landscape"
    // },
    // Vertical photo
    // {
    //   src: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9",
    //   alt: "Portrait of a woman with red hair",
    //   title: "Flame",
    //   category: "Portrait"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5",
    //   alt: "City architecture at night",
    //   title: "Urban Nightscape",
    //   category: "Urban"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    //   alt: "Close-up of a dog",
    //   title: "Man's Best Friend",
    //   category: "Pet"
    // },
    // Vertical photo
    // {
    //   src: "https://images.unsplash.com/photo-1464863979621-258859e62245",
    //   alt: "Portrait of a woman in dramatic pose",
    //   title: "Strength",
    //   category: "Portrait"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4",
    //   alt: "Aerial view of forest and lake",
    //   title: "Natural Patterns",
    //   category: "Aerial"
    // },
    // Vertical photo
    // {
    //   src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    //   alt: "Fashion model in stylish pose",
    //   title: "Haute Couture",
    //   category: "Fashion"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b",
    //   alt: "Fashion model on urban street",
    //   title: "Urban Fashion",
    //   category: "Fashion"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1620735692151-26a7e0748429",
    //   alt: "Abstract architectural details",
    //   title: "Geometric Harmony",
    //   category: "Abstract"
    // },
    // Vertical cat photo
    // {
    //   src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
    //   alt: "Close-up of a cat with green eyes",
    //   title: "Whiskers",
    //   category: "Pet"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1519682577862-22b62b24e493",
    //   alt: "Close-up portrait with shallow depth of field",
    //   title: "Depth of Soul",
    //   category: "Portrait"
    // },
    // Adding more photos to double the count - second set
    // Vertical tabby cat
    // {
    //   src: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1",
    //   alt: "Grey tabby kitten",
    //   title: "Curious Kitten",
    //   category: "Pet"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1493962853295-0fd70327578a",
    //   alt: "Brown ox on mountain",
    //   title: "Mountain Guardian",
    //   category: "Wildlife"
    // },
    // Vertical photo
    // {
    //   src: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    //   alt: "Orange and white tabby cat",
    //   title: "Cozy Companion",
    //   category: "Pet"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    //   alt: "Brown antelope and zebra on field at daytime",
    //   title: "Safari Friends",
    //   category: "Wildlife"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1583766395091-2eb9994ed094",
    //   alt: "Portrait of a woman with dramatic lighting - variation",
    //   title: "Elegance II",
    //   category: "Portrait"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1503104834685-7205e8607eb9",
    //   alt: "Portrait of a woman with red hair - variation",
    //   title: "Flame Revisited",
    //   category: "Portrait"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    //   alt: "Landscape with mountains and lake - variation",
    //   title: "Serenity Valley Dawn",
    //   category: "Landscape"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    //   alt: "Close-up of a dog - variation",
    //   title: "Loyal Friend",
    //   category: "Pet"
    // },
    // Vertical photo
    // {
    //   src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    //   alt: "Fashion model in stylish pose - variation",
    //   title: "Haute Couture Evening",
    //   category: "Fashion"
    // },
    // {
    //   src: "https://images.unsplash.com/photo-1469594292607-7bd90f8d3ba4",
    //   alt: "Aerial view of forest and lake - variation",
    //   title: "Natural Patterns Sunset",
    //   category: "Aerial"
    // }
  ];

  // Get unique categories for the filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    portfolioImages.forEach(image => {
      if (image.category) {
        uniqueCategories.add(image.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  }, [portfolioImages]);

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (!selectedCategory) return portfolioImages;
    return portfolioImages.filter(image => image.category === selectedCategory);
  }, [portfolioImages, selectedCategory]);

  return (
    <div className="flex h-screen bg-portfolio-bg overflow-hidden">
      <PortfolioSidebar />
      
      <div className="flex-1 overflow-y-auto">
        <PortfolioHero
          title="Moments in Time"
          subtitle="Photography is the art of freezing moments and stories, turning real life into art."
          backgroundImage="https://images.unsplash.com/photo-1554048612-b6a482bc67e5"
        />

        <section className="py-16 md:py-24 px-4">
          <div className="max-w-[2000px] mx-auto">
            <h2 className="text-portfolio-text text-3xl font-light mb-2 text-center">Portfolio</h2>
            <p className="text-portfolio-muted text-center mb-8 max-w-xl mx-auto">
              A curated selection of my finest work across various photography genres.
            </p>
            
            {/* Category filter */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === null 
                    ? 'bg-portfolio-accent text-white' 
                    : 'bg-gray-100 text-portfolio-text hover:bg-gray-200'}`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${selectedCategory === category 
                      ? 'bg-portfolio-accent text-white' 
                      : 'bg-gray-100 text-portfolio-text hover:bg-gray-200'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <ImageGallery images={filteredImages} columns={5} />
          </div>
        </section>

        <footer className="py-8 text-center text-portfolio-muted text-sm mt-8">
          <div className="container">
            <p>© {new Date().getFullYear()} Sean Onamade. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PhotographyPortfolio;
