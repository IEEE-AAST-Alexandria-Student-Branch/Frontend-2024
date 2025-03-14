import globe from "../../assets/public-visitor-globe-black.png";
import member from "../../assets/members-people-black.png";
import { AppConfigContext, UserContext } from "../../App";
import { useContext } from "react";

export const Joinus = () => {
  const { userData } = useContext(UserContext);
  const recruitment = useContext(AppConfigContext).appConfig.recruitment;

  return (
    <div className="flex flex-col gap-4 w-full px-6 md:px-14 container mx-auto mb-16">
      <h2 className="text-[32px] md:text-[45px] lg:text-[40px] font-bold my-[30px] mt-20 text-center">Take Action.&nbsp; Join Us.</h2>
      <div className="flex flex-col lg:flex-row w-full container mx-auto gap-4">
        <div className="bg-orange-100 rounded-3xl h-auto lg:h-[433px] p-4 lg:p-6 flex flex-col lg:flex-row items-center lg:items-start gap-4 w-full">
          {!userData && (
            <div className={`flex flex-col items-center flex-1 justify-between h-full`}>
              <div className="flex flex-col items-center">
              <img src={globe} height="55px" width="55px" className="mb-2" alt="Globe Icon" />
              <p className="text-black text-2xl font-bold">For Public Visitors</p>
              <p className="text-black text-lg text-center lg:text-left w-full lg:w-2/3">
                Become a member and get the latest updates from us, about us, and about the latest in tech.
              </p>
              </div>
              <button className="text-black font-bold text-xs border-2 border-black my-8 p-2 px-4 rounded-3xl max-w-fit" onClick={() => window.location.href = "/Signup"}>
                Become A Member
              </button>
            </div>
          )}
          {!userData && <div className="h-full lg:w-[1.5px] bg-orange-200 opacity-75 rounded-3xl"></div>}
          <div className="flex flex-col items-center flex-1 h-full justify-between">
            <div className="flex flex-col items-center ">
            <img src={member} height="55px" width="55px" className="mb-2" alt="Member Icon" />
            <p className="text-black text-2xl font-bold">For Volunteering</p>
            <p className="text-black text-lg text-center lg:text-left w-full lg:w-2/3">
            
              {recruitment.recruiting? "For the next generation of builders, you get to contribute your ideas, collaborate, and build." : "Unfortunately, we are not currently recruiting new volunteers. Please check again later!"}
            </p>
            </div>
            {recruitment.recruiting && (
              <a href={recruitment.formLink} target="_blank" rel="noopener noreferrer">
                <button className="text-black font-bold text-xs border-2 border-black my-8 p-2 px-5 rounded-3xl max-w-fit " onClick={() => window.open(recruitment.formLink,"_blank")}>
                  Volunteer
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
