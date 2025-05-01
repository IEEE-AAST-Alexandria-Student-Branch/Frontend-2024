import "../App.css";
import "./styles/EventDetails.css";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Sponsors } from "../components/EventDetails/Sponsors";
import { Resources } from "../components/EventDetails/Resources";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Spinner, Tooltip } from "@chakra-ui/react";

import { Schedule } from "../components/EventDetails/Schedule";
import Gallery from "../components/EventDetails/Gallery";
import subscribeToDocumentsByField from "../firebase/subscribeToDocumentsByField";
import { EventData } from "../interfaces/EventData";
import { Ivideo, Inote, IsponsorsIds, scheduleItem, IspksIds } from "../interfaces/EventData";
import { LikeButton } from "../components/common/LikeButton";
import DOMPurify from "dompurify";
export const EventDetails = () => {
  const { name: eventName } = useParams<{ name: string }>();
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Ivideo[]>([]);
  const [notes, setNotes] = useState<Inote[]>([]);
  const [sponsorIds, setSponsorIDs] = useState<IsponsorsIds>();
  const [isResourcesEnabled, setIsResourcesEnabled] = useState(false);
  const [isSponsorEnabled, setSponsorEnabled] = useState(false);
  const [_speakers, setSpeakers] = useState<IspksIds>();
  const [schedule, setSchedule] = useState<scheduleItem[]>([]);
  const purifyConfig = {
    ALLOWED_TAGS: ['br', 'strong', 'em', 'ul', 'ol', 'li'],
  };


  const formatEventDate = (date: Date, format: string) => {
    if (format === "long") {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      };
      const formattedDate = date.toLocaleDateString('en-GB', options);
      const time = date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
      return `${formattedDate} at ${time}`;
    } else if (format === "short") {
      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        year: 'numeric'
      };
      const formattedDate = date.toLocaleDateString('en-US', options);
      const parts = formattedDate.split(' ');
      return `${parts[0]}, ${parts[1]}`;
    }
    return date.toString(); // Fallback if format is not recognized
  };

  const fetchData = useCallback(async () => {
    const unsubscribe = subscribeToDocumentsByField("events", "title", "==", eventName, (data:any) => {;
      const event = data.result?.[0] || null;

      setEventData(event);
      setLoading(false);

      if (event) {
        if (event.videos) {
          setVideos(event.videos);
          setIsResourcesEnabled(true);
        }
        if (event.keynotes) {
          setNotes(event.keynotes);
          setIsResourcesEnabled(true);
        }
        if (event.sponsors) {
          setSponsorIDs(event.sponsors);
          setSponsorEnabled(true);
        }
        if (event.speakers) {
          setSpeakers(event.speakers);
        }
        if (event.schedule) {
          setSchedule(event.schedule);
        }
      }
    });

    return () => unsubscribe();
  }, [eventName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const attendButton = 
             <button
    className="defaultButton"
    style={{ alignSelf: "center" }}
    disabled={!eventData?.registrationOpen}
  >
    <span className="buttonText">Attend</span>
  </button>

  return (loading 
    ? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex"/></div>
    : <>
        <div className="h-28" style={{ borderColor: "#00091A", borderWidth: "4px" }}></div>
        <div id="eventPage">
          <div
            className="flex items-center justify-center mt-4 w-full h-[400px] rounded-3xl border-8"
            style={{
              backgroundImage: `url(${eventData?.coverPhoto})`,
              backgroundColor: "white",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderColor: "#00091A",
            }}
          ></div>
          <div id="eventDetailsFlex">
            <div id="eventNameWrapper">
              <div className="flex items-center gap-4">
              <span className="text-[50px] font-display font-bold flex flex-wrap items-center w-auto whitespace-normal">
              <span className="flex-shrink">{/* First part of the text */}
                  {eventData?.title?.split(' ').slice(0, -1).join(' ') ?? "Error"}
              </span>
              <span className="flex items-center whitespace-nowrap">
                &nbsp;{/* Space to separate */}
                {eventData?.title?.split(' ').slice(-1)}{/* Last word */}
                {eventData && <LikeButton item={eventData} type="event" className="font-body font-normal text-[16px] ml-2 mt-2"/>}
              </span>
              </span>    

              </div>
              <div id="eventDetailsWrapper">
                {eventData?.location && (
                  <span>
                    Location: <strong>{eventData.location}</strong>
                  </span>
                )
                    }
                {eventData?.starttime ? (
                <span>
                  Time: from <strong>{formatEventDate(eventData.starttime.toDate(), "long")}</strong>
                  {eventData.endtime && (
                  <> to <strong>{formatEventDate(eventData.endtime.toDate(), "long")}</strong></>
                  )}
                </span>
                ):
                "Time: TBA"
                }
              <span>Type: <strong>{eventData?.type}</strong></span>
              
            </div>
            <hr className="my-8 border-t-2 border-gray-300 w-[calc(100vw-45px)] opacity-25" />
              <span id="eventDesc" className="whitespace-pre-wrap w-[calc(100vw-45px)]"  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(eventData?.description ?? "Event not found.",purifyConfig) }}></span>
            </div>
            


          </div>
          {(eventData?.registrationOpen&&eventData.formLink) ?
              <Link className="flex justify-center mt-4 sm:hidden" to={eventData.formLink}>{attendButton}</Link>:
                  <Tooltip label="Event registration link not available yet.">
                    {attendButton}
                  </Tooltip>}
          <Tabs variant="unstyled" style={{ margin: "60px 0px" }}>
            <TabList
              bg={"#151F33"}
              style={{
                alignItems: "center",
                borderRadius: "60px",
                height: "60px",
                border: "none",
                padding: "2px 25px",
              }}
            >
              <div
                className="tabsContainer customScrollbar"
                onWheel={(event) => {
                  const delta = Math.sign(event.deltaY);
                  event.currentTarget.scrollLeft += delta * 30;
                }}
              >
                <Tab isDisabled={(schedule.length === 0)}><span className="tabLabel">Schedule</span></Tab>
                {/*<Tab isDisabled={(speakers?.speakersIds?.length ?? 0) <= 0}><span className="tabLabel">Speakers</span></Tab> Disabled temporarily for redundancy*/}
                <Tab isDisabled={(sponsorIds?.sponsorIds?.length ?? 0) <= 0}><span className="tabLabel">Sponsors</span></Tab>
                <Tab isDisabled={(videos.length === 0 && notes.length === 0)}><span className="tabLabel">Resources</span></Tab>
                <Tab isDisabled={(eventData?.gallery?.length ?? 0) <= 0} className="mr-1"><span className="tabLabel">Gallery</span></Tab>
              </div>
              <div className="iconButtonsWrapper">
                {/*<button className="iconButton" style={{ backgroundImage: `url(${Bell})` }}></button>
                  Notification button disabled until we get it working!!!
                */ }
              </div>
              {(eventData?.registrationOpen&&eventData.formLink) ?
              <Link className="hidden sm:block" to={eventData.formLink}>{attendButton}</Link>:
                  <Tooltip label="Event registration link not available yet.">
                    {attendButton}
                  </Tooltip>}
            </TabList>
            <TabPanels>
              <TabPanel>
                <Schedule schedules={schedule} />
              </TabPanel>
              {/*<TabPanel>
                <Speakers speakersIds={speakers?.speakersIds || []} />
              </TabPanel>*/}
              {isSponsorEnabled && (
                <TabPanel>
                  <Sponsors sponsorIds={sponsorIds?.sponsorIds || []} />
                </TabPanel>
              )}
              {isResourcesEnabled && (
                <TabPanel>
                  <Resources videos={videos} notes={notes} />
                </TabPanel>
              )}
              <TabPanel>
                <Gallery images={eventData?.gallery || []} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </>
  );
};
