
import { useState, useMemo, useEffect } from "react";
import PortfolioHero from "@/components/PortfolioHero";
import ImageGallery from "@/components/ImageGallery";
import PortfolioSidebar from "@/components/PortfolioSidebar";

// Define the image interface
interface PortfolioImage {
  src: string;
  aspectRatio?: number; // width / height — used by shortest-column-first masonry
  alt: string;
  title?: string;
  category?: string;
}

/**
 * Helper function: If the URL is a Cloudinary link,
 * insert `q_auto,f_auto` transformations after `/upload/`.
 * Otherwise, return the URL unchanged.
 */
function transformCloudinaryUrl(url: string) {
  const cloudName = "res.cloudinary.com/dnhzt8ver"; // Replace with your actual Cloudinary subdomain if needed
  // Only modify if it's from your Cloudinary account and contains '/upload/'
  if (url.includes(cloudName) && url.includes("/upload/")) {
    const [before, after] = url.split("/upload/");
    // Insert transformations right after '/upload/'
    // e.g. '/upload/q_auto,f_auto/'
    return `${before}/upload/q_auto,f_auto/${after}`;
  }
  return url; // Return as-is for local images or other hosts
}

const PhotographyPortfolio = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const portfolioImages: PortfolioImage[] = [
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Batch1--2.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575488/gpl9pfvawuckdrdtcit2.jpg",
      aspectRatio: 0.75,
      alt: "Portrait of downtown Calgary through chain link fence",
      title: "Through the Chain Link",
      category: "Urban"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Batch1--7.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575488/djdlvslkk5wtyincdd57.jpg",
      aspectRatio: 1.5,
      alt: "Food Soda restaurant sign",
      title: "Food Soda",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031520029.jpg",
      aspectRatio: 1.508,
      alt: "Portrait of a man sitting in a lounge with purple neon lighting",
      title: "What Happens In Vegas",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Batch1--7.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119567/portfolio/IMG_5186.jpg",
      aspectRatio: 0.667,
      alt: "Louis posing at Wyatt",
      title: "Louis",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119529/portfolio/DecPost-10.jpg",
      aspectRatio: 1.5,
      alt: "Group of friends walking during Halloween",
      title: "Hallowe'en",
      category: "Fun"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/DecPost-14.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575492/po9ojlmhfviy9ptwkbwb.jpg",
      aspectRatio: 1.5,
      alt: "Friends partying",
      title: "Party People",
      category: "Fun"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119527/portfolio/Centennial2023.11.11-SO-4.jpg",
      aspectRatio: 1.499,
      alt: "Centennial Park at dusk",
      title: "100",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119609/portfolio/IMG_9691-2.jpg",
      aspectRatio: 0.629,
      alt: "Marco posing",
      title: "Marco",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119617/portfolio/IMG_9874-3.jpg",
      aspectRatio: 0.607,
      alt: "Car driving past AMC",
      title: "AMC",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119530/portfolio/DSC01150.jpg",
      aspectRatio: 1.351,
      alt: "Cheerleaders at a soccer game hyping up child fans",
      title: "Cheer Leaders",
      category: "Sports"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031510019.jpg",
      aspectRatio: 0.663,
      alt: "Close-up of a bronze mannequin head with number etched on the forehead",
      title: "Bronze",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/DSC01296.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575492/reiv5j2h94qf1tdyunwt.jpg",
      aspectRatio: 1.5,
      alt: "Goalie making a kick",
      title: "Full Force",
      category: "Sports"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/DSC01296.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119551/portfolio/IMG_2371-2.jpg",
      aspectRatio: 1.5,
      alt: "Ballet dancers on stage",
      title: "Grand Jeté",
      category: "Events"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119532/portfolio/DSC03012-3.jpg",
      aspectRatio: 1.5,
      alt: "Landscape photo of Alumni Lawn",
      title: "Alumni Lawn",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_9418.jpg",
      aspectRatio: 0.667,
      alt: "Woman posed by painting",
      title: "Robe in Motion",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6538-4.jpg",
      aspectRatio: 1,
      alt: "Ex-Sutherland residents pose for grad",
      title: "Sutherland",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119533/portfolio/DSC5051.jpg",
      aspectRatio: 1.5,
      alt: "Performers at Harambee 2023",
      title: "Harambee",
      category: "Events"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0212.jpg",
      aspectRatio: 1.5,
      alt: "People at the date party",
      title: "Date Party",
      category: "Events"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/DSCF4225.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119558/portfolio/IMG_3909.jpg",
      aspectRatio: 0.667,
      alt: "Portrait of Elizabeth",
      title: "Another Finish Line!",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/DSCF4225.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575496/dpsd5ylj93x8jqgbn1o1.jpg",
      aspectRatio: 0.699,
      alt: "Portrait of Sean",
      title: "Smug Mug by Nafees",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_8502.jpg",
      aspectRatio: 0.667,
      alt: "Davis dressed for Halloween",
      title: "Davis",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_4546-5.jpg",
      aspectRatio: 0.758,
      alt: "Ela throwing up her hat",
      title: "Celebration",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119539/portfolio/IMG_0472.jpg",
      aspectRatio: 0.667,
      alt: "Trump Tower, Chicago",
      title: "Trump Tower",
      category: "Architecture"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0050.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575498/vxynmg2ekoyayathaq5j.jpg",
      aspectRatio: 1.5,
      alt: "Portrait of a dog",
      title: "Cavalier",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0050.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119535/portfolio/IMG_0093.jpg",
      aspectRatio: 0.667,
      alt: "Hands in front of a building",
      title: "Low-Angle",
      category: "Urban"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0391.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575501/cxrucuym3oogpk0ocerd.jpg",
      aspectRatio: 1.5,
      alt: "Kevin on a hill",
      title: "At His Feet",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119545/portfolio/IMG_1002.jpg",
      aspectRatio: 1.5,
      alt: "The Calgary Stampede",
      title: "Stampede",
      category: "Fun"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_1016.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575498/o5mrjq0rp0xjmhabzehu.jpg",
      aspectRatio: 1.5,
      alt: "Portrait of Precious in front of a Ferris Wheel",
      title: "Precious",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_1016.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119611/portfolio/IMG_9739-Enhanced-NR.jpg",
      aspectRatio: 0.667,
      alt: "Marco posing",
      title: "Keep Your Distance",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119546/portfolio/IMG_1586.jpg",
      aspectRatio: 1.5,
      alt: "Statue of a knight on a horse in France",
      title: "Steed",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031510025.jpg",
      aspectRatio: 1.508,
      alt: "Smiling man holding a Canon camera up to his face",
      title: "Yoshi",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119547/portfolio/IMG_1752.jpg",
      aspectRatio: 1.714,
      alt: "Carnival ride",
      title: "Rounds",
      category: "Fun"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119555/portfolio/IMG_2950.jpg",
      aspectRatio: 1.5,
      alt: "Ballet dancers posing",
      title: "Strike a Pose!",
      category: "Events"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031510021.jpg",
      aspectRatio: 0.663,
      alt: "Golden mannequin bust against a red wall with blue window light",
      title: "The Studio",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031510029.jpg",
      aspectRatio: 1.508,
      alt: "Silhouette of a person reaching into a fridge bathed in blue light",
      title: "Midnight Snack",
      category: "Fun"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119630/portfolio/IMG_9921.jpg",
      aspectRatio: 1.5,
      alt: "Chicago cityscape",
      title: "Chicago",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6106.jpg",
      aspectRatio: 0.705,
      alt: "Marco sitting on the stairs, grad",
      title: "Reflection",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_2036%20(1).jpg",
      aspectRatio: 0.667,
      alt: "Portrait of Maya",
      title: "Glad to Be A Grad!",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119550/portfolio/IMG_2291.jpg",
      aspectRatio: 0.667,
      alt: "The Eiffel Tower",
      title: "Tour Eiffel",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119542/portfolio/IMG_0513-2.jpg",
      aspectRatio: 0.667,
      alt: "Franklin, blurred",
      title: "Frankin",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119557/portfolio/IMG_3718.jpg",
      aspectRatio: 1.5,
      alt: "Pinching the Eiffel Tower",
      title: "Figurine",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119579/portfolio/IMG_6788.jpg",
      aspectRatio: 1.686,
      alt: "Group posing for grad pic",
      title: "Boys",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119563/portfolio/IMG_4497.jpg",
      aspectRatio: 0.667,
      alt: "Below the Eiffel Tower at dusk",
      title: "Au-Dessous",
      category: "Architecture"
    },
    // {
    //   src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119569/portfolio/IMG_5475.jpg",
    //   alt: "Portrait of a woman with dramatic lighting",
    //   title: "Elegance",
    //   category: "Portrait"
    // },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119571/portfolio/IMG_5476.jpg",
      aspectRatio: 0.639,
      alt: "Boxer on the side of the ring",
      title: "Throw Down",
      category: "Events"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6620.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575589/r9gzjffqgrabnnix3wif.jpg",
      aspectRatio: 1.333,
      alt: "Denver Airport",
      title: "Layover",
      category: "Misc."
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6620.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119624/portfolio/IMG_9907.jpg",
      aspectRatio: 0.667,
      alt: "Man under an umbrella",
      title: "Slick",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119587/portfolio/IMG_8126.jpg",
      aspectRatio: 0.667,
      alt: "People at the Basilique du Sacré-Cœur de Montmartre",
      title: "Pose",
      category: "Architecture"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119591/portfolio/IMG_8768.jpg",
      aspectRatio: 0.667,
      alt: "Buildings in Nice, France",
      title: "Stramigioli",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119594/portfolio/IMG_9098-2.jpg",
      aspectRatio: 1.5,
      alt: "Buildings on the coast of Nice, France",
      title: "Beach Front",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119643/portfolio/_MG_9502.jpg",
      aspectRatio: 0.667,
      alt: "Snow fight",
      title: "Snow Day",
      category: "Fun"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119581/portfolio/IMG_6850-2-2.jpg",
      aspectRatio: 0.699,
      alt: "Students in trees for grad",
      title: "Climbing Trees",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119585/portfolio/IMG_7614.jpg",
      aspectRatio: 1.5,
      alt: "A woman on the swing in the park",
      title: "Swing Set",
      category: "Landscape"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_9659.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575590/gsdsotaaetijemlcejph.jpg",
      aspectRatio: 1.5,
      alt: "Portrait of a rubber duck",
      title: "The Frenchman",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_9881-2.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575595/zs6ltg0p0ihmsli8ktlm.jpg",
      aspectRatio: 1.485,
      alt: "The Arc de Triomphe",
      title: "Arc",
      category: "Architecture"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_9881-2.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119574/portfolio/IMG_5680-2-4.jpg",
      aspectRatio: 0.667,
      alt: "Jocelyn posing for grad",
      title: "Jocelyn",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031520014.jpg",
      aspectRatio: 1.508,
      alt: "Dorm room with a palm plant in sunlight and a Roronoa Zoro wanted poster",
      title: "Sunlight",
      category: "Misc."
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_9881-2.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119584/portfolio/IMG_7030.jpg",
      aspectRatio: 0.667,
      alt: "Elijah posing for grad",
      title: "Cheers",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-25.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575592/k0ptpkmk7atqsoygfvgs.jpg",
      aspectRatio: 1.485,
      alt: "The Arc de Triomphe with dramatic lighting",
      title: "Triomphe",
      category: "Architecture"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-25.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119565/portfolio/IMG_4924.jpg",
      aspectRatio: 0.667,
      alt: "Louis posing for grad",
      title: "Sly",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-03.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119599/portfolio/IMG_9193-2.jpg",
      aspectRatio: 0.742,
      alt: "Light on a downtown street",
      title: "Winter Light",
      category: "Urban"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-03.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_3433%20(1).jpg",
      aspectRatio: 0.667,
      alt: "Teyon graduation",
      title: "In The Gardens",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-03.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6669-2.jpg",
      aspectRatio: 0.653,
      alt: "Friend group posed for graduation",
      title: "To New Heights",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-03.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119628/portfolio/IMG_9919.jpg",
      aspectRatio: 0.667,
      alt: "Franklin on the ferry",
      title: "Ferry",
      category: "Portrait"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/ParisStock-03.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575591/fiumnmznn4o2bhqoicjf.jpg",
      aspectRatio: 0.667,
      alt: "The Eiffel Tower",
      title: "Needle in the Sky",
      category: "Architecture"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Summer-06.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575734/ggey6l1gzuycxpcyk4kt.jpg",
      aspectRatio: 1.5,
      alt: "Kevin brushing his shoulder",
      title: "Can't Touch This",
      category: "Portrait"
    },
    ///
    // PORTFOLIO IMAGES STARTING
    ///
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-01.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575593/h6fsowqukftwt9qj3lao.jpg",
      aspectRatio: 1.5,
      alt: "Man at a train station",
      title: "Station 8",
      category: "Urban"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-03.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575593/rtw4fkoeywig55iiqiko.jpg",
      aspectRatio: 1.5,
      alt: "Cathedral vaults",
      title: "Cathedral",
      category: "Architecture"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-02.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1741575592/xephmmad7zdlqfy9t7dm.jpg",
      aspectRatio: 0.667,
      alt: "The Eiffel Tower",
      title: "Steel and Sky",
      category: "Architecture"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-02.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119600/portfolio/IMG_9223.jpg",
      aspectRatio: 1.5,
      alt: "Skyscrapers in downtown Calgary",
      title: "Skyscrapers",
      category: "Urban"
    },
    {
      // src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-02.jpg",
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119582/portfolio/IMG_6996-2.jpg",
      aspectRatio: 1.5,
      alt: "Elijah grad pic on a bench",
      title: "Elijah",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-04.jpg",
      aspectRatio: 1.5,
      alt: "Smokestack in Paris",
      title: "Smog",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-05.jpg",
      aspectRatio: 0.667,
      alt: "Gare de Lyon, Paris",
      title: "Gare de Lyon",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-06.jpg",
      aspectRatio: 0.667,
      alt: "Winding Paris Street",
      title: "Winding Path",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031510026.jpg",
      aspectRatio: 1.508,
      alt: "Two friends smiling at the camera",
      title: "Sam and Tobenna",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-07.jpg",
      aspectRatio: 0.996,
      alt: "Man walking through Paris",
      title: "Stranger",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-08.jpg",
      aspectRatio: 1.5,
      title: "Love All Over",
      alt: "Locks at the Sacré-Coeur",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_9416.jpg",
      aspectRatio: 0.667,
      alt: "Woman posed by painting",
      title: "Robe Like A Cape",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-09.jpg",
      aspectRatio: 1.5,
      alt: "View of the city of Brussels",
      title: "Brussels",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-10.jpg",
      aspectRatio: 1.5,
      alt: "Lauren at the beach",
      title: "Lauren",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-11.jpg",
      aspectRatio: 1.5,
      alt: "Girl at the beach",
      title: "Beach",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_3932.jpg",
      aspectRatio: 0.667,
      alt: "Elizabeth graduation",
      title: "Smile!",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-12.jpg",
      aspectRatio: 0.667,
      alt: "Streets at Nice",
      title: "Nice Streets",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119607/portfolio/IMG_9622-2.jpg",
      aspectRatio: 0.667,
      alt: "Marco posing in studio",
      title: "Framing",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119572/portfolio/IMG_5491.jpg",
      aspectRatio: 0.667,
      alt: "Spiral grad portrait in Kissam",
      title: "Spiral",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119561/portfolio/IMG_4161-2.jpg",
      aspectRatio: 1.5,
      alt: "Elizabeth posing near Wyatt Lawn",
      title: "Wyatt Lawn",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119577/portfolio/IMG_6602-4.jpg",
      aspectRatio: 0.667,
      alt: "Dap up in front of Sutherland",
      title: "Dap",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-13.jpg",
      aspectRatio: 1.5,
      alt: "Skies at beach in Nice",
      title: "Nice Skies",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119549/portfolio/IMG_2149.jpg",
      aspectRatio: 1.5,
      alt: "Jed on his bike",
      title: "Jed",
      category: "Misc."
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-14.jpg",
      aspectRatio: 1.5,
      alt: "Lauren and Amira at the beach",
      title: "Heart!",
      category: "Misc."
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-15.jpg",
      aspectRatio: 1.5,
      alt: "Beach pose",
      title: "11:10",
      category: "Misc."
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-16.jpg",
      aspectRatio: 1.5,
      alt: "A conversation",
      title: "What?",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6737.jpg",
      aspectRatio: 0.645,
      alt: "Group posed in front of Zeppos",
      title: "Zeppos",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-17.jpg",
      aspectRatio: 1.5,
      alt: "Amira in Nice",
      title: "Amira",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-18.jpg",
      aspectRatio: 0.738,
      alt: "Taking a selfie",
      title: "Our Selfie",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-19.jpg",
      aspectRatio: 0.667,
      alt: "People at the Port of Nice",
      title: "Port of Nice",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-20.jpg",
      aspectRatio: 0.856,
      alt: "People at the Port of Nice",
      title: "Port of Nice II",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-21.jpg",
      aspectRatio: 0.667,
      alt: "Girl feeding ducks bread",
      title: "Sharing is Caring",
      category: "Misc."
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-22.jpg",
      aspectRatio: 1.5,
      alt: "Two koi fish",
      title: "Twin Koi",
      category: "Misc."
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-23.jpg",
      aspectRatio: 1.5,
      alt: "My friends on the Paris Metro",
      title: "La Métro",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-24.jpg",
      aspectRatio: 1.5,
      alt: "Women on the Champs-Elysees",
      title: "Light Trails",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_8500.jpg",
      aspectRatio: 0.667,
      alt: "Isaac dressed for Halloween",
      title: "Isaac",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119560/portfolio/IMG_3941.jpg",
      aspectRatio: 0.667,
      alt: "Elizabeth posed for grad",
      title: "Contrast",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119553/portfolio/IMG_2549.jpg",
      aspectRatio: 1.5,
      alt: "Ballet dancers in symmetric pose",
      title: "Symmetry",
      category: "Events"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-25.jpg",
      aspectRatio: 1.5,
      alt: "Light trails by the Arc de Triomphe",
      title: "At an Angle",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-26.jpg",
      aspectRatio: 0.667,
      alt: "Zeke grabbing a bite",
      title: "Zeke",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-27.jpg",
      aspectRatio: 1.5,
      alt: "Girls on a trampoline",
      title: "Trampoline",
      category: "Fun"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-28.jpg",
      aspectRatio: 1.5,
      alt: "People passing the Sainte-Chapelle in Paris",
      title: "Past the Past",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-29.jpg",
      aspectRatio: 1.5,
      alt: "People on a bridge in Paris",
      title: "Pont",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_6838.jpg",
      aspectRatio: 0.667,
      alt: "Ayush grad pic in a tree",
      title: "Ayush",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-30.jpg",
      aspectRatio: 1.5,
      alt: "The Louvre Pyramid in Paris",
      title: "Strongest Shape, Weakest Material",
      category: "Architecture"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-31.jpg",
      aspectRatio: 0.667,
      alt: "Tower in Paris",
      title: "Tour d'Ivoire",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119540/portfolio/IMG_0482.jpg",
      aspectRatio: 1.5,
      alt: "Friends posing for a photo",
      title: "Lock In!",
      category: "Events"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119575/portfolio/IMG_5947.jpg",
      aspectRatio: 0.667,
      alt: "Miles posing for grad",
      title: "Miles",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/Portfolio-32.jpg",
      aspectRatio: 1.5,
      alt: "People at a crosswalk",
      title: "Showdown",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0133.jpg",
      aspectRatio: 1.5,
      alt: "Girls at a date party",
      title: "The Date Party",
      category: "Events"
    },
    // {
    //   src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0253.jpg",
    //   alt: "People at the date party",
    //   title: "Spotlight",
    //   category: "Events"
    // },
    // {
    //   src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0425.jpg",
    //   alt: "People at Game Terminal",
    //   title: "Pose",
    //   category: "Events"
    // },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_8504-2.jpg",
      aspectRatio: 0.667,
      alt: "Davis dressed for Halloween",
      title: "Chin Up, Shoulders Back",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119621/portfolio/IMG_9874-4.jpg",
      aspectRatio: 0.686,
      alt: "Car driving past AMC",
      title: "Part II",
      category: "Urban"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_0320.jpg",
      aspectRatio: 1.5,
      alt: "Arcade",
      title: "Game Terminal",
      category: "Fun"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119596/portfolio/IMG_9100.jpg", // !
      aspectRatio: 1.5,
      alt: "Beach at Nice",
      title: "Nice",
      category: "Landscape"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/IMG_8521-2.jpg",
      aspectRatio: 0.667,
      alt: "Isaac and Davis dressed for Halloween",
      title: "Peaky Blinders",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119543/portfolio/IMG_0523.jpg",
      aspectRatio: 1.5,
      alt: "My friends at Anzie Blue",
      title: "Anzie Blue",
      category: "Events"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119602/portfolio/IMG_9310.jpg",
      aspectRatio: 0.667,
      alt: "Woman posed behind stairs",
      title: "Green and Purple",
      category: "Portrait"
    },
    {
      src: "https://res.cloudinary.com/dnhzt8ver/image/upload/portfolio/000031520020.jpg",
      aspectRatio: 1.508,
      alt: "Rubber duck in sunglasses and a hat next to a Chicago paperweight on a windowsill",
      title: "Étudiant",
      category: "Misc."
    },
    // {
    //   src: "https://res.cloudinary.com/dnhzt8ver/image/upload/v1778119604/portfolio/IMG_9313-2.jpg",
    //   alt: "Woman posed",
    //   title: "A Smile",
    //   category: "Portrait"
    // },
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

  // portfolioImages is a static literal — empty deps so memos compute once and cache forever
  const transformedImages = useMemo(() => {
    return portfolioImages.map((image) => ({
      ...image,
      src: transformCloudinaryUrl(image.src)
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get unique categories for the filter
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    portfolioImages.forEach(image => {
      if (image.category) {
        uniqueCategories.add(image.category);
      }
    });
    return Array.from(uniqueCategories).sort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter images based on selected category
  const filteredImages = useMemo(() => {
    if (!selectedCategory) return transformedImages;
    return transformedImages.filter(
      (image) => image.category === selectedCategory
    );
  }, [transformedImages, selectedCategory]);

  // Cloudinary-only images for the hero — avoids blank flash by picking synchronously
  const heroImagePool = [
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

  // Lazy initializer picks once before first render — no blank flash
  const [backgroundImage] = useState(
    () => heroImagePool[Math.floor(Math.random() * heroImagePool.length)]
  );

  return (
    <div className="flex h-screen bg-portfolio-bg overflow-hidden">
      <PortfolioSidebar />

      <div className="flex-1 overflow-y-auto">
        <PortfolioHero
          title="Snapshots"
          subtitle="Photography is the art of freezing moments in time (or something like that). I'm known to have a terrible memory. It all kinda goes hand in hand."
          backgroundImage={backgroundImage}
        />

        <section className="py-16 md:py-24 px-4">
          <div className="max-w-[2000px] mx-auto">
            <h2 className="text-portfolio-text text-3xl font-light mb-2 text-center">
              Portfolio
            </h2>
            <p className="text-portfolio-muted text-center mb-8 max-w-xl mx-auto">
              A curated selection of my finest work across various photography
              genres.
            </p>

            {/* Category filter */}
            <div className="mb-10 flex flex-wrap justify-center gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    selectedCategory === null
                      ? "bg-portfolio-accent text-white"
                      : "bg-gray-100 text-portfolio-text hover:bg-gray-200"
                  }`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      selectedCategory === category
                        ? "bg-portfolio-accent text-white"
                        : "bg-gray-100 text-portfolio-text hover:bg-gray-200"
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Use the filtered images that have transformations for Cloudinary URLs */}
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