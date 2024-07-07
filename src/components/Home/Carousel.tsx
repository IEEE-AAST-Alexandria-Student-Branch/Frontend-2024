import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import Trophy from '../../assets/award.png';
import getCollection from "../../firebase/getCollection";
import Award from "../../interfaces/Award";

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export const SwipeCarousel = () => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [awardIndex, setAwardIndex] = useState(0);
  const dragX = useMotionValue(0);

  useEffect(() => {
    getCollection("awards").then((response) => {
      if (response.result) {
        const sortedAwards = response.result.sort((a: Award, b: Award) => a.year - b.year);
        setAwards(sortedAwards);
      }
    });

    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setAwardIndex((pv) => {
          if (pv === awards.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, [awards.length, dragX]);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && awardIndex < awards.length - 1) {
      setAwardIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && awardIndex > 0) {
      setAwardIndex((pv) => pv - 1);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl h-full">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${awardIndex * 10.5}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Awards awards={awards} awardIndex={awardIndex} />
      </motion.div>

      <Dots awardIndex={awardIndex} setAwardIndex={setAwardIndex} awards={awards} />
    </div>
  );
};

const Awards = ({ awards, awardIndex }: { awards: Award[], awardIndex: number }) => {
  return (
    <>
      {awards.map((award, idx) => {
        const isSelected = awardIndex === idx;
        return (
          <motion.div
            key={idx}
            animate={{
              scale: awardIndex === idx ? 0.95 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className={`aspect-video shrink-0 rounded-xl object-cover grayscale h-96 ${isSelected ? "w-2/5 filter-none" : " w-[160px]"}`}
          >
            <div className="bg-white w-full h-full rounded-xl text-blue-800 p-5">
              <div className="flex items-center justify-center gap-6 flex-col sm:flex-row">
                <img src={Trophy} className="lg:w-[5vw] w-16" />
                {isSelected ? <p className="md:text-xl xl:text-3xl font-bold text-center">{award.name}</p> : null}
              </div>
              <div className="flex flex-col items-center justify-around mt-6 h-20">
                <div className="w-fit h-fit text-[16pt] md:text-[18pt] xl:text-[24pt] text-nowrap">{isSelected ? award.description : ""}</div>
                {award.recipient ? <div className="w-fit h-fit text-[12pt] md:text-[18pt] xl:text-[24pt] text-nowrap">{isSelected && award.recipient}</div> : null}
                <div className="w-fit h-fit text-[18pt] md:text-[30pt] mt-8">{isSelected ? award.year : ""}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

const Dots = ({
  awardIndex,
  setAwardIndex,
  awards,
}: {
  awardIndex: number;
  setAwardIndex: Dispatch<SetStateAction<number>>;
  awards: Award[];
}) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {awards.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setAwardIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${idx === awardIndex ? "bg-neutral-50" : "bg-neutral-500"}`}
          />
        );
      })}
    </div>
  );
};
