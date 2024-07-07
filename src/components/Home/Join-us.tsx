import globe from "../../assets/public-visitor-globe-black.png";
import member from "../../assets/members-people-black.png";
import { UserContext } from "../../App";
import { useContext, useEffect, useState } from "react";
import getData from "../../firebase/getData";
import Recruiting from "../../interfaces/Recruiting";

export const Joinus = () => {
  const { userData } = useContext(UserContext);
  const [recruiting, setRecruiting] = useState<Recruiting | null>(null);

  useEffect(() => {
    // Fetch data from Firebase when the component mounts
    getData("recruiting", "OUQ1yzQyGdapR9BT5auy").then((response) => {
      const data = response.result?.data() as Recruiting;
      setRecruiting(data); 
    });
  }, []); 

  return (
    <div className="flex flex-col gap-4 w-full px-6 md:px-14 lg:px-7 container mx-auto mb-16">
      <p className="text-[45px] font-bold my-[30px] mt-20 text-center">Take Action.&nbsp; Join Us.</p>
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
            
              {recruiting?.recruiting ? "For the next generation of builders, you get to contribute your ideas, collaborate, and build." : "Unfortunately, we are not currently recruiting new volunteers. Please check again later!"}
            </p>
            </div>
            {recruiting?.recruiting && (
              <a href={recruiting.formlink} target="_blank" rel="noopener noreferrer">
                <button className="text-black font-bold text-xs border-2 border-black my-8 p-2 px-5 rounded-3xl max-w-fit " onClick={() => window.open(recruiting.formlink,"_blank")}>
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
