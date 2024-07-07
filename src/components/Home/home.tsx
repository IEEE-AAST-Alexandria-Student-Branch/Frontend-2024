import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../App";

export const HomeComp = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {userData} = useContext(UserContext);

  const handleJoinUsClick = () => {
    if (email) {
      navigate(`/signup?email=${encodeURIComponent(email)}`);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      handleJoinUsClick();
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.addEventListener("keypress", handleKeyPress);
    }

    // Clean up the event listener
    return () => {
      if (inputElement) {
        inputElement.removeEventListener("keypress", handleKeyPress);
      }
    };
  }, [email]);

  return (
    <div
      className={`flex flex-col bg-cover bg-center w-full h-screen bg-homeImage`}
    >
      <div className="absolute w-full h-screen bg-gradient-to-t from-[#000B21]/90 via-transparent to-[#000B21]/90"></div>
      <div className="absolute w-full h-screen bg-gradient-to-r from-[#000B21]/90 via-transparent to-[#000B21]/90"></div>
      <div className="flex flex-col justify-center w-full h-full">
        <div className="flex flex-col justify-start ml-20 w-1/2 container z-10">
          <div className="xl:text-4xl md:text-xl sm:text-sm font-bold">
            <p>Fostering innovation through education</p>
            <p>technology, and professional</p>
            <p>development.</p>
          </div>
          {userData ? null: <><div className="flex mt-4 p-2 bg-white rounded-3xl w-[60vw] sm:w-96">
            <input
              ref={inputRef}
              className="w-4/6 text-black placeholder-black pl-2 text-sm focus:outline-none bg-transparent"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              aria-label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-2/6 text-sm bg-black rounded-3xl p-2"
              onClick={handleJoinUsClick}
            >
              Join Us
            </button>
          </div>
          <div className="mt-4 text-sm font-normal">
            <p>Enter your email and become a member.</p>
            <p>No Credit Card Needed.</p>
          </div></>}
          
        </div>
      </div>
      <div className="flex flex-col items-center pb-4 z-10">
        <p>Join 120+ trusted distinguished partners.</p>
      </div>
    </div>
  );
};
