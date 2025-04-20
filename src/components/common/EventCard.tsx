import { Link } from 'react-router-dom';
import { EventData } from '../../interfaces/EventData';
import { motion, useAnimation } from "framer-motion";
import firebase from 'firebase/compat/app';
import { autoColorByTopic } from '../../utils';

interface EventCardProps {
  event: EventData;
  color?: string | undefined;
  className?: string;
  disabled?: boolean;
}

export const EventCard = ({ event, className, disabled }: EventCardProps) => {

  const controls = useAnimation();
  const handleMouseEnter = () => {
    if (window.innerWidth > 640)
      controls.start({ rotateY: 180 });
    else
      controls.start({ rotateY: 0 });
  };

  const handleMouseLeave = () => {
    controls.start({ rotateY: 0 });
  };

  const formatDate = (date: firebase.firestore.Timestamp) => {   //date changed to DD/MM/YY format as mentioned in figma design
    const d = new Date(date.toDate());
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getDateString = (event: EventData): string => {
    if (event.starttime && !event.endtime || event.starttime?.toDate().getDate() === event.endtime?.toDate().getDate()) {
      return event.starttime ? formatDate(event.starttime) : "Date TBA";
    }
    else if (event.starttime && event.endtime) {

      const starttime = event.starttime ? formatDate(event.starttime) : "Date TBA";
      const endDate = formatDate(event.endtime);
      return `${starttime} - ${endDate}`;
    } else if (event.starttime) {
      return formatDate(event.starttime);
    } else {
      return "Date TBA";
    }
  }
  
  const content = <div
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{ perspective: 1000 }}
  >
    <motion.div
      style={{
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right',
        backgroundColor: event.cardColor || autoColorByTopic(event.type),
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s'
      }}
      className={`${'w-full h-[65px] bg-cardSmall bg-blend-soft-light bg-contain lg:w-[255px] lg:h-[330px] xl:h-[24.5vw] xl:w-[20vw] md:w-[218px] md:h-[275px] sm:h-[260px] sm:w-[200px] sm:bg-cardLarge sm:bg-cover'} rounded-[10px] md:rounded-[9px]`}
      animate={controls}
    >
      <motion.div
        className={`absolute w-full h-full backface-hidden text-center sm:flex sm:items-end sm:pb-16 px-3 pt-1 sm:px-8 xl:pb-24`}
      >
        <h3
          className={`overflow-hidden text-ellipsis whitespace-nowrap sm:whitespace-normal sm:overflow-visible font-bold w-full text-left sm:text-center text-[23px] sm:text-[18px] md:text-[20px] lg:text-[23px] ${event.title.length > 25 ? "xl:text-[1.5vw]" : "xl:text-[2vw]"} sm:flex sm:justify-center `} 

        >
          {event.title}
        </h3>
        <div className='flex gap-1 sm:self-center sm:flex-col sm:py-1 text-nowrap sm:absolute sm:bottom-0 sm:left-0 w-full sm:px-8'>
          <p className={`${'font-thin text-[14px] sm:text-[13px] md:text-[14px] lg:text-[16px] xl:text-[17px] sm:flex sm:justify-center'}`}>
            {event.type}<span className='sm:hidden'> •</span>
          </p>
          <p className={`${' font-thin text-[14px] sm:text-[13px]  xl:text-[1vw]'} opacity-80`}>
            {getDateString(event)}
          </p>
        </div>
      </motion.div>
      <motion.div
        className="absolute w-full h-full backface-hidden rounded-[20px] md:rounded-[9px]"
        style={{
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          backgroundImage: `url(${event.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }}
      />
      <div className='bg-[rgba(0,0,0,0.8)] w-full' style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}><p className={`font-bold ${'text-lg flex justify-center'}`}>{event.title}</p></div>
    </motion.div>
  </div>
  if (disabled) return <div className={className}>{content}</div>;
  return (
    <Link to={`/event/${event.title}`} className={className}>
      {content}
    </Link>
  );
};