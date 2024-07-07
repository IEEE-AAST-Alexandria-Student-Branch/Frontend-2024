import "../App.css";
import "./styles/EventDetails.css";
import "firebase/firestore";

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Sponsors } from "../components/EventDetails/Sponsors";
import { Resources } from "../components/EventDetails/Resources";
import { NavBar } from "../components/common/navbar";
import Banner from "../assets/banner.jpg";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Spinner } from '@chakra-ui/react';

import Bell from '../assets/notification-bell-white@2x.png';
import Star from '../assets/fav-event-star-white@2x.png';
import PlusIcon from '../assets/plus.png';
import { Schedule } from "../components/EventDetails/schedule";
import { Speakers } from "../components/EventDetails/Speakers";
import Gallery from "../components/EventDetails/Gallery";
import getDataByField from "../firebase/getDataByField";

import { EventData } from "../interfaces/EventData";
import { Ivideo, Inote, IsponsorsIds, scheduleItem, IspksIds } from "../interfaces/EventData";


export const EventDetails = () => {
  const { name: eventName } = useParams<{ name: string }>();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Ivideo[]>([]);
  const [notes, setNotes] = useState<Inote[]>([]);
  const [sponsorIds, setSponsorIDs] = useState<IsponsorsIds>();
  const [isResourcesEnabled, setIsResourcesEnabled] = useState(false);
  const [isSponsorEnabled, setSponsorEnabled] = useState(false);
  const [speakers, setSpeakers] = useState<IspksIds>();
  const [schedule, setSchdule] = useState<scheduleItem[]>([]);

  const fetchData = async () => {
    let isMounted = true; // Flag to prevent state updates on unmounted component
    getDataByField("events", "title", "==", eventName).then(data => {
      console.log(eventName)
      if (isMounted) {
        setEventData(data.result?.[0] || null);
        setLoading(false);
        if (data.result?.[0].videos) {
          setVideos(data.result?.[0].videos);
          setIsResourcesEnabled(true);
        }
        if (data.result?.[0].keynotes) {
          setNotes(data.result?.[0].keynotes);
          setIsResourcesEnabled(true);
        }
        if (data.result?.[0].sponsors) {
          setSponsorIDs(data.result?.[0].sponsors)
          setSponsorEnabled(true);
        }
        if (data.result?.[0].speakers) {
          setSpeakers(data.result?.[0].speakers);
          console.log(data.result?.[0].speakers)
        }
        if (data.result?.[0].schedule) {
          setSchdule(data.result ? data.result[0].schedule : []);
          setLoading(false);
        }
        setLoading(false);
        // console.log(data.result?.[0]);
      }
    });
    return () => { isMounted = false; }
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Handle cases where eventData is null or undefined
  
  return loading ? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex " /></div> : (
      <>
      <NavBar/>
      <div className="h-28" style={{borderColor: "#00091A", borderWidth:"4px"}}></div>
      <div id="eventPage">
        <div className="flex items-center justify-center mt-4 w-full h-[400px] rounded-3xl border-8" 
        style={{
          backgroundImage: `url(${eventData?.coverPhoto})`, 
          backgroundColor: "white",
          backgroundSize: "cover", // Optionally add to cover the entire div
          backgroundPosition: "center", // Optionally add to center the image
          borderColor: "#00091A"
        }}
      >
      </div>
      <div id="eventDetailsFlex">
        <div id="eventNameWrapper">
          <span id="eventName">{loading ? "Loading..." : eventData?.title ?? "Error"}</span>
          <span id="eventDesc">{loading ? "Please wait..." : eventData?.description ?? "Event not found."}</span>
        </div>
        <div id="eventDetailsWrapper">
          <span>Time: <b>from 12 July 12:00 PM to 15 July 9:00 PM</b></span>
          <span>Type: <b>Online, Session</b></span>
          <span>Seats: <b>Limited (25 left)</b></span>
        </div>
      </div>
      <Tabs variant='unstyled' style={{ margin: "60px 0px" }}>
        <TabList bg={"#151F33"} style={{ alignItems: "center", borderRadius: "60px", height: "60px", border: "none", padding: "2px 25px" }}>
          <div className="tabsContainer customScrollbar" onWheel={(event) => {
            const delta = Math.sign(event.deltaY);
            event.currentTarget.scrollLeft += delta * 30;
          }}>
            <Tab><span className="tabLabel">Schedule</span></Tab>
            <Tab><span className="tabLabel">Speakers</span></Tab>
            {isSponsorEnabled ? <Tab><span className="tabLabel">Sponsors</span></Tab> : <Tab isDisabled><span className="tabLabel">Sponsors</span></Tab>}
            {isResourcesEnabled ? <Tab><span className="tabLabel">Resources</span></Tab> : <Tab><span className="tabLabel">Resources</span></Tab>}
            <Tab className="mr-1"><span className="tabLabel">Gallery</span></Tab>
          </div>
          <div className="iconButtonsWrapper">
            <button className="iconButton" style={{ backgroundImage: `url(${Bell})` }}></button>
            <button className="iconButton" style={{ backgroundImage: `url(${Star})` }}></button>
          </div>
          <button className="defaultButton" style={{ alignSelf: "center" }} disabled={!eventData?.formLink || eventData?.formLink === ""} onClick={eventData?.formLink && !(eventData?.formLink === "")?()=>{window.open(eventData?.formLink,"_blank")}:()=>{}}>
            <span className="buttonText" >Attend</span>
            <span className="plusButton"><img src={PlusIcon} alt="plus" /></span>
          </button>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Schedule schedules={schedule} />
          </TabPanel>
          <TabPanel>
            <Speakers speakersIds={speakers} />
          </TabPanel>
          {isSponsorEnabled ?
            <TabPanel>
              <Sponsors sponsorIds={sponsorIds} />
            </TabPanel>
            : <TabPanel />}
          {isResourcesEnabled ?
            <TabPanel>
              <Resources videos={videos} notes={notes} />
            </TabPanel>
            : <TabPanel />}
          <TabPanel>
            <Gallery images={eventData?.gallery || []} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
    </>
  );
};
