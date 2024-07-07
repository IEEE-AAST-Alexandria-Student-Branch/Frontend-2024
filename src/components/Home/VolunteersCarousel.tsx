import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import HeadVolunteer from '../../interfaces/HeadVolunteer.tsx';
import { useMediaQuery } from 'react-responsive';

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;

// Define different DRAG_BUFFER values for mobile and larger screens
const DRAG_BUFFER_MOBILE = 5;
const DRAG_BUFFER_LARGE = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export const VolunteersCarousel = ({ volunteers }: { volunteers: HeadVolunteer[] }) => {
  const [volunteerIndex, setVolunteerIndex] = useState(0);
  const dragX = useMotionValue(0);

  // Media query to detect if screen size is mobile or larger
  const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

  // Set DRAG_BUFFER based on screen size
  const dragBuffer = isMobile ? DRAG_BUFFER_MOBILE : DRAG_BUFFER_LARGE;

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setVolunteerIndex((prevIndex) => (prevIndex === volunteers.length - 1 ? 0 : prevIndex + 1));
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, [dragX, volunteers.length]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -dragBuffer && volunteerIndex < volunteers.length - 1) {
      setVolunteerIndex((prevIndex) => prevIndex + 1);
    } else if (x >= dragBuffer && volunteerIndex > 0) {
      setVolunteerIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl h-full px-4 md:px-8 lg:px-12 mx-4 md:mx-8 lg:mx-12" style={{ backgroundColor: "hsl(220, 100%, 5%)" }}>
      {/* Carousel container */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        // Adjust translateX based on whether it's mobile or larger screens
        animate={{ translateX: isMobile ? `-${volunteerIndex * 100}%` : `-${volunteerIndex * 26.8}%` }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Volunteers
          volunteerIndex={volunteerIndex}
          volunteers={volunteers}
        />
      </motion.div>
    </div>
  );
};

const Volunteers = ({ volunteerIndex, volunteers }: { volunteerIndex: number; volunteers: HeadVolunteer[] }) => {
  return (
    <>
      {volunteers.map((volunteer, idx) => {
        const isSelected = volunteerIndex === idx;
        return (
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${volunteer.photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            animate={{ scale: isSelected ? 0.95 : 0.85 }}
            transition={SPRING_OPTIONS}
            className={`relative aspect-video shrink-0 rounded-xl object-cover grayscale h-64 md:h-80 lg:h-96 w-full md:w-[300px] lg:w-[350px] ${isSelected ? "filter-none" : ""}`}
          >
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white py-2 px-3 md:py-3 md:px-4">
              <p className="text-xl md:text-2xl font-semibold">{volunteer.name}</p>
              <p className="text-xs md:text-sm">{volunteer.role}</p>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
