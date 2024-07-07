import { useState, useRef, useEffect, useContext } from "react";
import Logo from "../../assets/IEEEAAST.ico";
import { LangSelector } from "./langSelector";
import { Link, useLocation } from "react-router-dom";
import { Link as ScrollLink, animateScroll, scroller } from 'react-scroll';
import {UserContext} from "../../App"
import SignOut from "../../firebase/signout"

export const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation(); // Get the current location
  const {userData} = useContext(UserContext);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

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

  useEffect(() => {
    // If the pathname changes, scroll to the section if it's specified in the URL hash
    const hash = location.hash;
    if(hash==="#contactSection") {animateScroll.scrollToBottom({ duration: 0, smooth: 'easeInOutQuart'}); console.log("scrolling to bottom");}
    else if (hash) {
      scroller.scrollTo(hash.substring(1), { duration: 0, smooth: 'easeInOutQuart',offset: 100});
    }
  }, [location]);

  return (
    <>
      <div className="absolute flex items-start sm:items-center justify-between py-2 w-full z-50">
        {/* left */}
        <div className="ml-[40vw] sm:ml-auto">
          <img src={Logo} alt="IEEE branch logo" height={90} width={90} />
        </div>
        {/* mid */}
        <div className="flex-1 justify-center hidden sm:flex">
          <div className="flex justify-center text-3xl gap-8">
            <button>
              <Link to={userData?"/home":"/"} className="text-3xl">Home</Link>
            </button>
            <button>
              <ScrollLink to="aboutSection" smooth={true} duration={0}>
                <button className="cursor-pointer text-3xl" onClick={
                  () => {
                    if(window.location.pathname != "/") {
                      window.location.href="/#aboutSection";
                    }
                  }
                
                }>
                  About
                </button>
              </ScrollLink>
            </button>
            <button>
              <ScrollLink to="contactSection" smooth={true} duration={0}>
                <button className="cursor-pointer text-3xl" onClick={
                  () => {
                    if(window.location.pathname != "/") {
                      window.location.href="/#contactSection";
                    }
                  }
                }>
                  Contact
                </button>
              </ScrollLink>
            </button>
          </div>
        </div>
        {/* end */}
        <div className="items-center justify-end text-3xl gap-8 mr-8 text-black hidden sm:flex">
          <LangSelector />
          <button className="font-bold text-base" onClick={userData?()=>{SignOut();window.location.href="/"}:()=>{}}>
            <Link to={userData?"":"/signin"} className="text-base bg-white px-8 py-4 rounded-full">{userData?"Sign Out":"Sign In"}</Link>
          </button>
        </div>


        {/*Hamburger menu for small screens*/}
        <div className="sm:hidden flex items-center mr-4 z-50">
          <div
            ref={menuRef}
            className={`${menuOpen ? "translate-x-0" : "translate-x-full"} fixed inset-y-0 right-0 w-3/4 transition-transform duration-300 ease-in-out z-40 flex flex-col sm:hidden`}
            style={{
              background: "linear-gradient(0deg, #1f396e 0%, #000b21 100%)",
              boxShadow: menuOpen ? "-4px 0px 4px rgba(0, 0, 0, 0.5)" : "none",
              opacity: 0.98
            }}
          >
            <button
              className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
              style={{ borderColor: "#00050f" }}
              onClick={() => {
                setMenuOpen(false);
                window.location.pathname === "/" ? animateScroll.scrollToTop({ duration: 0 }) : window.open("/", "_self");
              }}
            >
              Home
            </button>
            <ScrollLink to="aboutSection" className="cursor-pointer text-2xl" smooth={true} duration={0}>
              <button
                className="w-full h-12 border-solid border-b my-2 flex justify-center items-center"
                style={{ borderColor: "#00050f" }}
                onClick={() => {
                  setMenuOpen(false);
                  if(window.location.pathname != "/") {
                    window.location.href="/#aboutSection";
                  }
                }}>
                About
              </button>
            </ScrollLink>
            <ScrollLink to="contactSection" className="cursor-pointer text-2xl" smooth={true} duration={0}>
              <button
                className="w-full h-12 border-solid border-b my-2 flex justify-center items-center"
                style={{ borderColor: "#00050f" }}
                onClick={() => {
                  setMenuOpen(false);
                  if(window.location.pathname != "/") {
                    window.location.href="/#contactSection";
                  }
                }}>
                Contact
              </button>
            </ScrollLink>
            <Link to={userData?"":"/signin"}>
            <button
            
              className="w-full h-12 border-solid border-b my-2 flex justify-center items-center text-2xl"
              style={{ borderColor: "#00050f" }}
              onClick={() => {
                setMenuOpen(false);
                if(userData){SignOut();window.location.reload()}
              }}
            >
              {userData?"Sign Out":"Sign In"}
            </button>
            </Link>
          </div>
          

          <button onClick={toggleMenu} className="text-black top-2 right-2 p-1 rounded-lg fixed" style={{ backgroundColor: "#000b21", boxShadow: "0px 0px 4px rgba(255, 255, 255, 1.0)", opacity: "0.8" }}>
            <svg
              className="w-8 h-8"
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
        </div>
      </div>
    </>
  );
};
