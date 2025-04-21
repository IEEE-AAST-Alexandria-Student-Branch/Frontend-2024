import { useEffect, useState } from "react";
import Trophy from "../../assets/carousel-award.jpg";
import getCollection from "../../firebase/getCollection";
import Award from "../../interfaces/Award";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; // Add Pagination module
import "swiper/css";
import "swiper/css/pagination"; // Import pagination styles
import "./styles/SwipeCarousel.css";

export const SwipeCarousel = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [width, setWidth] = useState<number>(window.innerWidth);

  const setCurrentWidth = () => {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", setCurrentWidth);
    return () => window.removeEventListener("resize", setCurrentWidth);
  }, [])

  useEffect(() => {
    getCollection("awards").then((response) => {
      if (response.result) {
        const sortedAwards = response.result.sort(
          (a: Award, b: Award) => a.year - b.year
        );
        setAwards(sortedAwards);
      }
    });
  }, []);

  return (
    <div className="relative rounded-2xl h-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={width < 1024 && width >= 768? 10 : 30}
        slidesPerView={width >= 1024? 3 : width >= 768? 2 : 1}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        style={{ height: "400px" }}
        
      >
        {awards.map((award, idx) => (
          <SwiperSlide key={idx}>
            <div className="text-center relative w-full h-full flex flex-col justify-between items-center pt-4 bg-white border-2 border-purple-400 rounded-lg swirly-background cursor-pointer">
            <p className="text-[#5D17EB] font-bold text-xl">{award.description}</p>
            
                <div
                className={`${
                  award.name.length > 45 ? "text-[18px]" : "text-[20px] mt-4"
                } font-semibold text-center text-black  xl:w-[350px] h-fit`}
                >
                {award.name}
                </div>
                {award.winner&&<p className="text-[#5D17EB] font-bold text-xl">{award.winner}</p>}

              <div className="xl:w-48 xl:h-48 md:w-40 md:h-40 h-48 w-48 flex items-center justify-center mt-14 mb-8">
                <img
                  src={Trophy}
                  className="w-full h-full object-contain"
                  alt="Trophy"
                />
              </div>
              <div className="absolute bottom-4 right-4 text-4xl font-bold text-[#5D17EB]">
                {award.year}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
