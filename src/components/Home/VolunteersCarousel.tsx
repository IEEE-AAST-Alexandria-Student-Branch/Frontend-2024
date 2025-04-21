import { useEffect, useRef, useState } from "react";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./styles/SwipeCarousel.css";
import HeadVolunteer from "../../interfaces/HeadVolunteer";

export const VolunteersCarousel = ({ headVolunteers }: { headVolunteers: HeadVolunteer[] }) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // Default to the first index in preparation to loop back to the last one after mounting.
  // We want the last slide first so that the first slide (chairman) is centered on load.
  const swiperRef = useRef<SwiperRef | null>(null);

  const setCurrentWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", setCurrentWidth);
    return () => window.removeEventListener("resize", setCurrentWidth);
  }, []);

  useEffect(() => {
    /* This is a weird workaround. The carousel can't start at the last index normally because without looping you can't be there.
       There's a bug where this behavior also applies to looping carousels, so we have to manually slide back one after mounting the component. */
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.slidePrev(0);
    }
  }, [headVolunteers.length]);

  const handleVolunteerClick = (index: number) => {
    // Scroll to the clicked volunteer in the carousel
    if (swiperRef.current?.swiper) {
      if (index === (activeIndex - 1 + headVolunteers.length) % headVolunteers.length) {
        swiperRef.current.swiper.slidePrev();
        return;
      }
      swiperRef.current.swiper.slideToLoop((index - 1 + headVolunteers.length) % headVolunteers.length); // Ensure index is non-negative
    }
  };

  return (
    <div className="relative rounded-2xl h-full">
      <Swiper
        ref={swiperRef}
        modules={[Autoplay, Pagination]}
        spaceBetween={width < 1024 && width >= 768 ? 10 : 30}
        slidesPerView={width >= 1024 ? 3 : width >= 768 ? 2 : 1}
        loop={true}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        style={{ height: "400px" }}
        onSlideChange={(swiper) => {
          setActiveIndex(
            width >= 1024
              ? (swiper.realIndex + 1) % headVolunteers.length
              : swiper.realIndex
          );
        }}
      >
        {headVolunteers.map((volunteer, idx) => (
          <SwiperSlide
            key={idx}
            style={{
              backgroundImage: `url(${volunteer.photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className={`cursor-pointer relative aspect-video shrink-0 rounded-xl object-cover grayscale h-64 md:h-80 lg:h-96 w-full md:w-[300px] lg:w-[350px] overflow-hidden ${
              activeIndex === idx ? "filter-none" : "grayscale"
            }`}
            onClick={() => handleVolunteerClick(idx)} // Handle click to scroll
          >
            <div
              className={`absolute inset-0 transition-transform duration-300`}
            ></div>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white py-2 px-3 md:py-3 md:px-4">
              <p className="text-xl md:text-2xl font-semibold">
                {volunteer.name}
              </p>
              <p className="text-xs md:text-sm">{volunteer.role}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
