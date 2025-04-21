import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { AppConfigContext } from "../../App";
import { RecruitmentCard } from "./RecruitmentCard";
import { hideNavBarContext } from "../../App";
import { CiImageOn } from "react-icons/ci";

export const HomeComp = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);
    const { userData } = useContext(UserContext);
    const { appConfig } = useContext(AppConfigContext);
    const { hideNavBar, setHideNavBar } = useContext(hideNavBarContext);

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

        return () => {
            if (inputElement) {
                inputElement.removeEventListener("keypress", handleKeyPress);
            }
        };
    }, [email]);

    return (
        <div
            className={`flex flex-col bg-cover bg-center w-full h-screen overflow-hidden ${
            appConfig.coverPhoto ? "" : "bg-homeImage"
            }`}
            style={{ backgroundImage: appConfig.coverPhoto ? `url(${appConfig.coverPhoto})` : undefined }}
        >
            {/* Background Gradient */}
            <div
                className={`absolute w-full h-screen bg-gradient-to-t from-[#000B21]/90 via-transparent to-[#000B21]/90 transition-opacity duration-500 ${
                    hideNavBar ? "opacity-0" : "opacity-100"
                }`}
            ></div>
            <div
                className={`absolute w-full h-screen bg-gradient-to-r from-[#000B21]/90 via-transparent to-[#000B21]/90 transition-opacity duration-500 ${
                    hideNavBar ? "opacity-0" : "opacity-100"
                }`}
            ></div>

            {/* Main Content */}
            <div
                className={`flex flex-col justify-center w-full transition-opacity h-full ${
                    appConfig.recruitment.recruiting && appConfig.recruitment.formLink.length > 0
                        ? "mt-36"
                        : "mt-14"
                } ${hideNavBar ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
                <div className="flex flex-col justify-start mx-4 md:mx-20 w-full container z-10">
                    <div className="xl:text-4xl md:text-xl sm:text-sm font-bold">
                        <p>Fostering innovation through education</p>
                        <p>technology, and professional</p>
                        <p>development.</p>
                    </div>
                    {userData ? (
                        <div className="flex flex-col gap-2">
                            <p className="text-2xl font-normal w-full mt-5">Welcome back, {userData.firstname}!</p>
                            <Link to="/browse">
                                <button className="defaultButton">Browse</button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="flex mt-4 p-2 bg-white rounded-3xl w-[90%] max-w-md">
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
                                <p>Enter your email and become a member today.</p>
                            </div>
                        </>
                    )}
                    <RecruitmentCard />
                </div>
            </div>

            {/* Footer Section */}
            <div className="flex justify-between w-full">
                <div
                    className={`flex flex-col items-center justify-center w-full pb-4 z-10 transition-opacity relative ${
                        hideNavBar ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                    <p className="text-center w-40 sm:w-full">Join 120+ trusted distinguished partners.</p>
                </div>
                <div
                    className="bg-slate-600 rounded-full p-2 mr-2 absolute z-10 cursor w-16 h-16 right-0 sm:-translate-y-8"
                    onMouseEnter={() => setHideNavBar(true)}
                    onMouseLeave={() => setHideNavBar(false)}
                    onClick={() => setHideNavBar(!hideNavBar)}
                >
                    <CiImageOn className="w-full h-full"></CiImageOn>
                </div>
            </div>
        </div>
    );
};
