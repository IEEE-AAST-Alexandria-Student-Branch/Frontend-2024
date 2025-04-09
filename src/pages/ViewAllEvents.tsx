import { useEffect, useState } from "react";
import { EventData } from "../interfaces/EventData";
import subscribeToCollection from "../firebase/subscribeToCollection";
import { EventCard } from "../components/common/EventCard";
import { Link } from "react-router-dom";
import { SortButton } from "../components/common/SortButton";
import { LikeButton } from "../components/common/LikeButton";
import DOMPurify from "dompurify";
import {Spinner} from "@chakra-ui/react";
import { eventTypesWithColors } from "../utils";

const topics = eventTypesWithColors.map((event)=>{return event.type})

const formatEventDate = (date: Date, format: string) => {
  if (format === "long") {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('en-GB', options);
    const time = date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
    return `${formattedDate}, ${time}`;
  } else if (format === "short") {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      year: 'numeric'
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const parts = formattedDate.split(' ');
    return `${parts[0]}, ${parts[1]}`;
  }
  return date.toString();
};

const isEventOngoing = (event: EventData) => {
  const today = new Date();
  if (event.endtime && event.starttime && (event.starttime.toDate() < today) && (event.endtime.toDate() > today) && event.registrationOpen && event.formLink && event.formLink.length > 0) {
    return "Ongoing! Register now!"; //event is ongoing and registration is open
  }
  if (event.starttime && (event.starttime.toDate() > today) && event.registrationOpen && event.formLink && event.formLink.length > 0) {
    return "Coming soon! Register now!"; //event is upcoming and registration is open
  }
  if (event.starttime && (event.starttime.toDate() > today)) {
    return "Coming soon!"; //event is upcoming
  }
  if (!event.starttime && !event.endtime && event.registrationOpen && event.formLink && event.formLink.length > 0) {
    return "Registration open!"; //event has no start or end time and registration is open
  }

  return null;
};


export const ViewAllEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>([]); //seperate state for topic filtered events to avoid deleting the original events
  const [filter, setFilter] = useState("date");
  const [loading, setLoading] = useState(true);

  const changeFilter = (newfilter: string) => {
    let finalFilter = newfilter;

    if (filter.includes(newfilter)) {
      if (filter.includes("reverse")) {
        finalFilter = newfilter;
      } else {
        finalFilter = newfilter + "-reverse";
      }
    }

    setFilter(finalFilter);
  };
  useEffect(() => {
    filterEvents(filter);
  }, [events, filter]);

  const filterEvents = (filter: string) => {
    let sortedEvents = [...events];

    switch (filter) {
      case "date":
        sortedEvents.sort((a, b) => (b.starttime?.seconds ?? 0) - (a.starttime?.seconds ?? 0));
        break;
      case "date-reverse":
        sortedEvents.sort((a, b) => (a.starttime?.seconds ?? 0) - (b.starttime?.seconds ?? 0));
        break;

      case "likes":
        sortedEvents.sort((a, b) => (b.likedBy.length ?? 0) - (a.likedBy.length ?? 0));
        break;
      case "likes-reverse":
        sortedEvents.sort((a, b) => (a.likedBy.length ?? 0) - (b.likedBy.length ?? 0));
        break;
    }

    const selectedTopic = document.querySelector('select')?.value || "All";
    if (selectedTopic !== "All") {
      sortedEvents = sortedEvents.filter(event => event.type === selectedTopic);
    }

    setFilteredEvents(sortedEvents);
  };

  const mapEvents = (events: EventData[]) => {
    return events.map((event) => (
      <Link key={event.id} to={`/event/${event.title}`}>
        <div className="ml-4 flex flex-col sm:flex-row gap-2">
          <EventCard
            event={event}
            className="xl:scale-90"
          />
          <div className="w-full flex flex-col max-h-[350px]">
            <div className="font-extrabold text-xl sm:text-3xl flex gap-3">{event.title} <LikeButton item={event} type="event" className="font-normal text-lg" /></div>
            {isEventOngoing(event) && <p className="italic text-yellow-600 mb-2">{isEventOngoing(event)}</p>}
            <p className="font-extralight mb-2 whitespace-normal overflow-hidden text-ellipsis line-clamp-6" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(event.description) }}></p>
            <hr className="w-full mt-auto border-[#151F33] border-2 mb-2"></hr>
            <p><span className="font-bold">Type: </span><span>{event.type}</span></p>
            {
              event.starttime &&
              <p><span className="font-bold">Starts: </span><span>{formatEventDate(event.starttime.toDate(), "long")}</span></p>
            }
            {
              event.endtime &&
              <p className="mb-8"><span className="font-bold">Ends: </span><span>{formatEventDate(event.endtime.toDate(), "long")}</span></p>
            }
          </div>
        </div>
      </Link>
    ));
  }
  useEffect(() => {
    const unsubscribe = subscribeToCollection("events", (res: { result: EventData[]; ids: any[]; }) => {
      if (res.result && res.ids) {
        const newevents = (res.result as EventData[]).map((event, index) => ({
          ...event,
          id: res.ids ? res.ids[index] : null,
        }));
        setEvents(newevents.sort((a, b) => (b.starttime?.seconds ?? 0) - (a.starttime?.seconds ?? 0)));
        setFilteredEvents(newevents.sort((a, b) => (b.starttime?.seconds ?? 0) - (a.starttime?.seconds ?? 0)));
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);
  if(loading) 
  return (
    <div className="w-full h-[60vh] flex items-center justify-center"><Spinner size="xl" /></div>
  )
  return(
    <div className="flex flex-col items-center bg-[#000B21] text-white header">
      <div className="h-[150px] w-full"></div>
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-4 lg:px-[89px] gap-4">

        <h2 className="text-white text-[24px] m</div>d:text-[32px] lg:text-[45px] font-bold">All Events</h2>


        <SortButton label="Date" filterKey="date" currentFilter={filter} changeFilter={changeFilter} />
        <SortButton label="Likes" filterKey="likes" currentFilter={filter} changeFilter={changeFilter} />
        {/*topic filter*/}
        <select
          className="bg-[#151F33] text-white p-2 rounded h-12 w-full md:w-1/6"
          onChange={(e) => {
            const selectedTopic = e.target.value;
            const filtered = selectedTopic === "All" ? events : events.filter(event => event.type === selectedTopic);
            setFilteredEvents(filtered);
          }}
        >
          <option value="All">All</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>


      <div className="w-full px-10 lg:px-10">
        {filteredEvents.length === 0 && <p className="text-white text-[24px] font-bold text-center mt-40 mb-40">No events found... Check back soon!</p>}
        {filter.includes("date") ? (
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#151F33] rounded-full"></div>
            <div className="flex flex-col mt-4 ml-4">
              {filteredEvents.reduce((acc, event, index) => {
                const eventDate = event.starttime ? new Date(event.starttime.seconds * 1000) : null;
                const eventMonth = eventDate ? eventDate.toLocaleString('default', { month: 'short' }) + ', ' + eventDate.getFullYear() : 'TBA';

                if (index === 0 || eventMonth !== acc[acc.length - 1].month) {
                  acc.push({ month: eventMonth, events: [event] });
                } else {
                  acc[acc.length - 1].events.push(event);
                }

                return acc;
              }, [] as { month: string, events: EventData[] }[]).sort((a, b) => a.month === 'TBA' ? -1 : b.month === 'TBA' ? 1 : 0).map((group, groupIndex) => (
                <div key={groupIndex} className="relative">
                  <div className={`absolute -left-[33px] top-0 w-10 h-10 ${group.events.some(isEventOngoing) ? 'bg-green-500 shadow-[0_0_10px_rgba(0,255,0,0.8)]' : 'bg-[#151F33]'} rounded-full flex`}>
                    <div className="m-auto bg-white w-3 h-3 rounded-full"></div>
                  </div>
                  <div className="text-white font-bold mb-2 ml-4 mt-2">{group.month}</div>
                  <div className="flex flex-col gap-4 mb-10">
                    {mapEvents(group.events)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-10 mb-10">
            {mapEvents(filteredEvents)}
          </div>
        )

        }
      </div>
    </div>
  );
}

