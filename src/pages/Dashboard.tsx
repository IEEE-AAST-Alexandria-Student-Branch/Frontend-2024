/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "@chakra-ui/react";
import "./styles/Dashboard.css";
import subscribeToCollection from "../firebase/subscribeToCollection.js"; // Import the new function
import getDocument from "../firebase/getData.js";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../App';
import UserData from "../interfaces/userData.js";
import ArticleCard from "../components/Article/Card/ArticleCard.js";
import ArticleData from "../interfaces/ArticleData";
import { EventData } from "../interfaces/EventData";
import { EventCard } from "../components/common/EventCard.js";
import getCollection from "../firebase/getCollection.js";
import arrowRightIcon from "../assets/right-arrow-svgrepo-com.svg";


export const Dashboard = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [authors, setAuthors] = useState<{ [key: string]: UserData }>({});
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const { userData } = useContext(UserContext); // Make sure to access userData for likes

  // Function to fetch author names
  const fetchAuthors = (authorIds: string[]) => {
    const uniqueAuthorIds = [...new Set(authorIds)];
    uniqueAuthorIds.forEach(authorId => {
      getDocument("users", authorId).then((res) => {
        if (res.result) {
          const authorData = res.result.data() as UserData;
          setAuthors(prevAuthors => ({
            ...prevAuthors,
            [authorId]: authorData,
          }));
        }
      });
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToCollection("articles", ({ result, ids, error }: { result: any, ids: string[], error: any }) => {
      if (error) {
        console.error("Error fetching articles: ", error);
        return;
      }

      if (result && ids) {
        const newArticles = (result as ArticleData[]).map((article, index) => ({
          ...article,
          id: ids[index], // Set the id from ids
          liked: userData?.likes?.articles?.includes(ids[index]) || false, // Check if the user liked the article
        }));
        setArticles(newArticles);
        const authorIds = newArticles.map(article => article.author);
        fetchAuthors(authorIds);
        setLoadingArticles(false);
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, [userData]); // Ensure it runs when userData changes

  useEffect(() => {
    // Fetch events and sort by start time
    getCollection('events').then(res => {
      if (res.result) {
        const sortedEvents = res.result.sort((a: EventData, b: EventData) => {
          if (!a.starttime) return -1;
          if (!b.starttime) return 1;
          return a.starttime.toDate().getTime() - b.starttime.toDate().getTime();
        });
        setEvents(sortedEvents);
        setLoadingEvents(false);
      }
    });
  }, []);

  const filterArticles = articles.slice(0, 3);
  const filterEvents = events
    .sort((a, b) => {
      if (!a.starttime) return -1; // Place events without starttime at the beginning (New event with no date announced)
      if (!b.starttime) return 1;
      return b.starttime.toDate().getTime() - a.starttime.toDate().getTime(); // Sort by starttime descending
    })
    .slice(0, 3); // Take the 3 most recent events

  if (!articles || articles.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-[99vh]"><Spinner size="xl" /></div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-[#000B21] text-white header pt-28">
      {/* <div className="h-[120px] w-full"></div> */}
      {<div className="w-full flex justify-center items-center px-4 mt-0 lg:mt-0 md:px-20 body">
        <div className="relative w-full lg:w-[1733px] h-[300px] md:h-[450px] lg:h-[600px] rounded-[38px] overflow-hidden">
          <div className="absolute z-10 w-full h-full bg-gradient-to-t from-[#000B21A5] via-transparent bottom-0"></div>
          {(loadingArticles||loadingEvents) ? <div className="flex h-full w-full items-center justify-center"><Spinner size="xl" /></div>
          :
          <>
          {filterArticles[0] && (!filterEvents[0] || !filterEvents[0].starttime || filterArticles[0].publishdate.toDate().getTime() > filterEvents[0].starttime?.toDate().getTime()) ? (
        <div className="absolute bottom-[83px] z-10 left-[35px] text-white">
          <h2 className="text-[24px] lg:text-[50px] font-serif font-black">{filterArticles[0]?.title || "no title"}</h2>
          <h3 className="text-[14px] lg:text-[24px]">Article • {filterArticles[0]?.topic} • {authors[filterArticles[0]?.author]?.firstname || "unknown author"}</h3>
          <button className="w-[100px] lg:w-[169px] h-[40px] lg:h-[59px] text-[14px] lg:text-[21px] bg-white text-black font-bold rounded-[20px] lg:rounded-[29px] mt-[20px] lg:mt-[45px]"
            onClick={() => navigate(`/article/${filterArticles[0]?.title}`)}>
            View
          </button>
        </div>
          ) : (
        <div className="absolute bottom-[83px] z-10 left-[35px] text-white">
          <h2 className="text-[24px] lg:text-[50px] font-serif font-black">{filterEvents[0]?.title || "no title"}</h2>
          <h3 className="text-[14px] lg:text-[24px]">Event • {filterEvents[0]?.type} • {filterEvents[0]?.starttime ? filterEvents[0].starttime.toDate().toLocaleString('en-GB', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : "Date TBA"}</h3>
          <button className="w-[100px] lg:w-[169px] h-[40px] lg:h-[59px] text-[14px] lg:text-[21px] bg-white text-black font-bold rounded-[20px] lg:rounded-[29px] mt-[20px] lg:mt-[45px]"
            onClick={() => navigate(`/event/${filterEvents[0]?.title}`)}>
            View
          </button>
        </div>
          )}
          <img
        className="absolute inset-0 w-full h-full object-cover filter blur-lg"
        src={filterArticles[0] && (!filterEvents[0] || !filterEvents[0].starttime || filterArticles[0].publishdate.toDate().getTime() > filterEvents[0].starttime?.toDate().getTime()) ? filterArticles[0]?.image : filterEvents[0]?.coverPhoto}
        alt="Background Blurred"
          />
          <img
        className="relative object-contain w-full h-full"
        src={filterArticles[0] && (!filterEvents[0] || !filterEvents[0].starttime || filterArticles[0].publishdate.toDate().getTime() > filterEvents[0].starttime?.toDate().getTime()) ? filterArticles[0]?.image : filterEvents[0]?.coverPhoto}
        alt="Main Display"
          />
          </>
          }
        </div>
      </div>}

      <div className="mt-[50px] w-full px-4 lg:px-[89px]">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-[24px] lg:text-[45px] font-bold">Latest Articles</h2>
          <Link to="/articles">
            <button className="flex items-center text-[16px] lg:text-[30px] text-white">
              View all
              <img className="ml-[8px]" src={arrowRightIcon} width={24} alt="arrow right" />
            </button>
          </Link>
        </div>
        <div className="mt-[30px] lg:mt-[59px] flex flex-col gap-[30px] lg:gap-[58px]">
          {loadingArticles ?<div className="w-full flex items-center justify-center"> <Spinner size="xl" /></div> :
          filterArticles.map((article, index) => {
            return <ArticleCard article={article} author={authors[article.author]} key={index} />;
          })}
        </div>
      </div>

      <div className="mt-[50px] lg:mt-[100px] w-full px-4 lg:px-[89px]">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-[24px] lg:text-[45px] font-bold">Events</h2>
          <Link to="/events">
            <button className="flex items-center text-[16px] lg:text-[30px] text-white">
              View all
              <img className="ml-[8px]" src={arrowRightIcon} width={24} alt="arrow right" />
            </button>
          </Link>
        </div>
        <div className="mt-[30px] lg:mt-[59px]">
          <div className="flex gap-[20px]">

          <div className="flex flex-col sm:flex sm:flex-row overflow-y-hidden gap-[5px] md:gap-[10px] mb-16 justify-around w-full py-10">
            {loadingEvents? <Spinner size="xl" />
            :filterEvents.map((event)=>(
              <EventCard event={event}/>
            ))}
          </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
