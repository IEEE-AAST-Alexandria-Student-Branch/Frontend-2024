import { useState, useRef, useEffect, useContext } from "react";
import searchIcon from "../../assets/search-magnifier-white@2x.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Link as ScrollLink, animateScroll, scroller } from 'react-scroll';
import { UserContext } from "../../App"
import SignOut from "../../firebase/signout"
import ProfileMenu from "./ProfileMenu";
import getCollection from "../../firebase/getCollection.js";
import "../common/styles/Navbar.css";
import Home from "../../assets/home.png";
import Browse from "../../assets/browse.png";
import Bookmark from "../../assets/save.png";
import Write from "../../assets/write.png";
import { LogoButton } from "./LogoButton.js";
import UserData from "../../interfaces/userData.js";
import { Avatar } from "@chakra-ui/react";
import Admin from "../../assets/admin.png";


interface ArticleData {
  article: string;
  author: string;
  caption: string;
  description: string;
  image: string;
  likes: number;
  publishdate: string;
  title: string;
}

interface EventData {
  coverPhoto: string;
  description: string;
  enddtime: any;
  formLink: string;
  gallary: string[];
  speakers: string[];
  sponsors: string[];
  starttime: any;
  title: string;
  type: string;
}

interface IdUserData{
  id: string;
  userData: UserData;
}
interface NavBarProps {
  hideNavBar?: boolean;
}
export const NavBar: React.FC<NavBarProps> = ({ hideNavBar }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation(); // Get the current location
  const { userData } = useContext(UserContext);
  const [searched, setSearched] = useState(''); //search
  const [article, setArticle] = useState<ArticleData[]>([]);
  const [events, setEvents] = useState<EventData[]>([]);
  const [users, setUsers] = useState<IdUserData[]>([]);
  const [showSearch, setShowSearch] = useState(true)

  const navigate = useNavigate();
  useEffect(() => {
    getCollection("articles").then((res) => {
      if (res.result) {
        const article = res.result as ArticleData[];
        setArticle(article);
      }
    })
  }, []);

  useEffect(() => {
    getCollection("events").then((res) => {
      if (res.result) {
        const events = res.result as EventData[];
        setEvents(events);
      }
    })
  }, []);

  useEffect(() => {
    getCollection("users").then((res) => {
      if (res.result) {
        const ids = res.ids;
        const users = res.result.map((user: any, index: number) => ({
          id: ids ? ids[index] : '',
          userData: user,
        })) as IdUserData[];
        setUsers(users);
      }
    });
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearched(e.target.value);
  };

  const titles = article.map(articleTitles => articleTitles.title)
  const filterArticles = searched ? titles.filter((t) =>
    t.toLowerCase().includes(searched.toLowerCase())
  ) : null;


  const EventTitle = events.map(e => e.title)

  const filterEvents = searched ? EventTitle.filter((t) =>
    t.toLowerCase().includes(searched.toLowerCase())
  ) : null;

  const filterUsers = searched
  ? users
      .filter((user) => {
        const fullName = `${user.userData.firstname}${user.userData.lastname}`
          .toLowerCase()
          .replace(/\s+/g, '');
        return (
          user.userData.verified &&
          user.userData.verified === true &&
          fullName.includes(searched.toLowerCase().replace(/\s+/g, ''))
        );
      })
      .sort((a, b) => {
        const nameA = `${a.userData.firstname} ${a.userData.lastname}`.toLowerCase();
        const nameB = `${b.userData.firstname} ${b.userData.lastname}`.toLowerCase();
        return nameA.localeCompare(nameB);
      })
  : null;

  const handleClick = (handled: string) => {
    if (filterArticles?.includes(handled)) {
      navigate(`/article/${handled}`);
    } else if (filterEvents?.includes(handled)) {
      navigate(`/event/${handled}`);
    } else {
      console.log("no nav found")
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSearch(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [searched]);


  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const searchRef = useRef<HTMLDivElement | null>(null);

  const handleSearchClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowSearch(false);
    } else {
      setShowSearch(true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleSearchClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleSearchClickOutside);
    };
  }, []);

  useEffect(() => {
    const hash = location.hash;
    if (hash === "#contactSection") {
      setTimeout(() => {
        animateScroll.scrollToBottom({ duration: 0, smooth: "easeInOutQuart" });
        window.history.replaceState(null, "", location.pathname);
      }, 700);
    } else if (hash) {
      scroller.scrollTo(hash.substring(1), {
        duration: 0,
        smooth: "easeInOutQuart",
        offset: 100,
      });
      window.history.replaceState(null, "", location.pathname);
    }
  }, [location]);

  return (
    <>
      <div className="wrapper absolute flex items-start sm:items-center justify-between py-2 w-full z-50">


        <LogoButton className={`${hideNavBar&&"opacity-0"} transition-opacity`} />

        {/* mid and right*/}
        <div className={`flex-1 justify-start hidden sm:flex transition-opacity ${hideNavBar && "opacity-0"}`}>
          <div className="flex justify-center gap-3 ml-5 w-full">
            <button>
              <Link to="/" >
                <div
                  className={`border-2 rounded-full border-white w-[40px] transition-transform duration-200 ${
                  location.pathname === "/" && "scale-125 shadow-[0_0_10px_1px_#ffffff]"
                  }`}
                >
                  <img src={Home} alt="Home" height={90} width={45} />
                </div>
              </Link>
            </button>
            <button>
              <Link to="/browse" >
                <div
                  className={`border-2 rounded-full border-white w-[40px] transition-transform duration-200 p-1 ${
                  location.pathname === "/browse" && "scale-125 shadow-[0_0_10px_1px_#ffffff]"
                  }`}
                >
                  <img src={Browse} alt="Browse" height={90} width={45} />
                </div>
              </Link>
            </button>

            {/*search bar*/}
            <div className="nav-search" ref={searchRef}>
              <div className="search-bar">
                <img className='ml-4' src={searchIcon} alt="search icon" />
                <input
                  type="text"
                  placeholder="Search articles, events..."
                  value={searched}
                  onChange={handleSearch}
                  className="w-full"
                />
              </div>
              <div className={`search-results customScrollbar flex ${(!showSearch || (filterArticles?.length == 0 && filterEvents?.length == 0 && filterUsers?.length == 0) || searched.length == 0) && 'hidden'}`}>
                <div className="flex flex-col w-1/3">
                  <h2 className="text-white text-xl text-center font-extrabold">Articles</h2>
                  {filterArticles?.length == 0 && searched.length > 0 && <div className="result">No articles found</div>}
                  {filterArticles?.map((a, index) => (
                    <div key={index} className="result" onClick={() => {handleClick(a);setShowSearch(false)}}>{a}</div>
                  ))}
                </div>
                <div className="w-[2px] bg-[#00000070] mx-4"></div>

                <div className="flex flex-col w-1/3">
                  <h2 className="text-white text-xl text-center font-extrabold">Events</h2>
                  {filterEvents?.length == 0 && searched.length > 0 && <div className="result">No events found</div>}
                  {filterEvents?.map((e, index) => (
                    <div key={index} className="result" onClick={() => {handleClick(e);setShowSearch(false)}}>{e}</div>
                  ))}
                </div>
                <div className="w-[2px] bg-[#00000070] mx-4"></div>

                <div className="flex flex-col w-1/3">
                  <h2 className="text-white text-xl text-center font-extrabold">Users</h2>
                  {filterUsers?.length == 0 && searched.length > 0 && <div className="result">No users found</div>}
                  {filterUsers?.map((u, index) => (
                    <Link key={index} to={`profile/${u.id}`} onClick={()=>{setShowSearch(false)}} className="result flex gap-2 items-center">
                      <Avatar src={u.userData?.imgurl} name={`${u.userData.firstname} ${u.userData.lastname}`} key={`${u.userData.firstname} ${u.userData.lastname}`} />
                      {u.userData?.firstname ? `${u.userData?.firstname} ${u.userData?.lastname}`: "Unknown User"}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            {/* End of searchbar */}

            <div className="flex gap-2 mr-4">
              {userData?.roles?.includes("admin") &&
                <button>
                <Link to="/admin" >
                  <div
                    className={`border-2 rounded-full border-white w-[40px] transition-transform duration-200 p-1 ${
                      location.pathname === "/admin" && "scale-125 shadow-[0_0_10px_1px_#ffffff]"
                    }`}
                  >
                    <img src={Admin} alt="Admin" height={90} width={45} />
                  </div>
                </Link>
              </button>  
                }
              {
                (userData?.roles?.includes("admin") || userData?.roles?.includes("author")) &&
                  <button>
                    <Link to="/write" >
                      <div
                        className={`border-2 rounded-full border-white w-[40px] transition-transform duration-200 p-1 ${
                          location.pathname === "/write" && "scale-125 shadow-[0_0_10px_1px_#ffffff]"
                        }`}
                      >
                        <img src={Write} alt="Write Article" height={90} width={45} />
                      </div>
                    </Link>
                  </button>
              }
              <button>
                <Link to="/bookmarks">
                  <div
                    className={`border-2 rounded-full border-white w-[40px] transition-transform duration-200 p-[7px] ${
                      location.pathname === "/bookmarks" && "scale-125 shadow-[0_0_10px_1px_#ffffff]"
                    }`}
                  >
                    <img src={Bookmark} alt="Bookmarks" height={90} width={45} />
                  </div>
                </Link>
              </button>
              <button>
                {/* Removed temporarily until we figure out how to implement this
              <div className="border-2 rounded-full border-white w-[40px] p-1">
                <img src={Bell} alt="Notifications" height={90} width={45}  />
              </div>
              */}
              </button>
            </div>

          </div>
        </div>
        <div className={`items-center justify-end text-3xl gap-8 mr-8 transition-opacity text-black hidden sm:flex ${hideNavBar && "opacity-0"}`}>
          {!userData ? <button className="font-bold text-base">
            <Link to={"/signin"} className="text-base bg-white px-8 py-4 rounded-full">{"Sign In"}</Link>
          </button> : <ProfileMenu />
          }
        </div>

        {/* Hamburger menu for small screens */}
        <div className="sm:hidden flex items-center ml-4 z-50">

          <div
            ref={menuRef}
            className={`${menuOpen ? "translate-x-0" : "-translate-x-full"
} fixed inset-y-0 left-0 w-3/4 transition-transform duration-300 ease-in-out z-40 flex flex-col sm:hidden`}
            style={{
              background: "linear-gradient(0deg, #1f396e 0%, #000b21 100%)",
              boxShadow: menuOpen ? "4px 0px 4px rgba(0, 0, 0, 0.5)" : "none",
              opacity: 0.98,
            }}
          >{!mobileSearch?
              <>
                <button
                  className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
                  style={{ borderColor: "#00050f" }}
                  onClick={() => {
                    setMenuOpen(false);
                    window.location.pathname === "/"
                      ? animateScroll.scrollToTop({ duration: 0 })
                      : navigate("/");
                  }}
                >
                  Home
                </button>
                <button
                  className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
                  style={{ borderColor: "#00050f" }}
                  onClick={() => {
                    setMobileSearch(true);
                  }}
                >
                  Search
                </button>
                <button
                  className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
                  style={{ borderColor: "#00050f" }}
                  onClick={() => {
                    setMenuOpen(false);
                    navigate("/browse");
                  }}
                >

                  Browse
                </button>
                <ScrollLink
                  to="aboutSection"
                  className="cursor-pointer text-2xl"
                  smooth={true}
                  duration={0}
                >
                  <button
                    className="w-full h-12 border-solid border-b my-2 flex justify-center items-center"
                    style={{ borderColor: "#00050f" }}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/#aboutSection");
                    }}
                  >
                    About
                  </button>
                </ScrollLink>
                <ScrollLink
                  to="contactSection"
                  className="cursor-pointer text-2xl"
                  smooth={true}
                  duration={0}
                >
                  <button
                    className="w-full h-12 border-solid border-b my-2 flex justify-center items-center"
                    style={{ borderColor: "#00050f" }}
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/#contactSection");
                    }}
                  >
                    Contact
                  </button>
                </ScrollLink>
                <Link to={userData ? "" : "/signin"}>
                  <button
                    className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
                    style={{ borderColor: "#00050f" }}
                    onClick={() => {
                      setMenuOpen(false);
                      if (userData) {
                        SignOut();
                        navigate(0);
                      }
                    }}
                  >
                    {userData ? "Sign Out" : "Sign In"}
                  </button>
                </Link>
              </>:<>
                <button
                  className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
                  style={{ borderColor: "#00050f" }}
                  onClick={() => {
                    setMobileSearch(false);
                  }}
                >
                  Back
                </button>
                <div className="nav-search !w-[95%]" ref={searchRef}>
                  <div className="search-bar">
                    <img src={searchIcon} alt="search icon" />
                    <input
                      type="text"
                      placeholder="Search articles, events..."
                      value={searched}
                      onChange={handleSearch}
                      className="w-full"
                    />
                  </div>
                  <div className={`search-results customScrollbar flex flex-col ${(!showSearch || (filterArticles?.length == 0 && filterEvents?.length == 0 && filterUsers?.length == 0) || searched.length == 0) && 'hidden'}`}>
                    <div className="flex flex-col w-full">
                      <h2 className="text-white text-xl text-center font-extrabold">Articles</h2>
                      {filterArticles?.length == 0 && searched.length > 0 && <div className="result">No articles found</div>}
                      {filterArticles?.map((a, index) => (
                        <div key={index} className="result" onClick={() => {handleClick(a);setShowSearch(false)}}>{a}</div>
                      ))}
                    </div>
                    <div className="w-[2px] bg-[#00000070] mx-4"></div>
                    <div className="flex flex-col w-full">
                      <h2 className="text-white text-xl text-center font-extrabold">Events</h2>
                      {filterEvents?.length == 0 && searched.length > 0 && <div className="result">No events found</div>}
                      {filterEvents?.map((e, index) => (
                        <div className="result" key={index} onClick={() => {handleClick(e);setShowSearch(false)}}>{e}</div>
                      ))}
                    </div>
                    <div className="w-[2px] bg-[#00000070] mx-4"></div>
                    <div className="flex flex-col w-full">
                      <h2 className="text-white text-xl text-center font-extrabold">Users</h2>
                      {filterUsers?.length == 0 && searched.length > 0 && <div className="result">No users found</div>}
                      {filterUsers?.map((u, index) => (
                        <Link key={index} to={`profile/${u.id}`} onClick={()=>{setShowSearch(false)}} className="result flex gap-2 items-center">
                          <Avatar src={u.userData?.imgurl} name={`${u.userData.firstname} ${u.userData.lastname}`} key={`${u.userData.firstname} ${u.userData.lastname}`} />
                          {u.userData?.firstname ? `${u.userData?.firstname} ${u.userData?.lastname}`: "Unknown User"}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            }
          </div>

          <button
            onClick={toggleMenu}
            className="text-black top-2 left-2 p-1 rounded-lg fixed"
            style={{
              backgroundColor: "#000b21",
              boxShadow: "0px 0px 4px rgba(255, 255, 255, 1.0)",
              opacity: "0.8",
            }}
          >
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <div
            className={`fixed top-2 right-2 w-fit rounded-full ${userData?"shadow-[0_0_5px_3px_#000B21]":"mt-4"}`}
          >
            {!userData ? <button className="font-bold text-sm">
              <Link to={"/signin"} className=" bg-white px-4 py-4 rounded-full text-black  ">{"Sign In"}</Link>
            </button> : <ProfileMenu />
            }
          </div>
        </div>
      </div>
    </>
  );
};
