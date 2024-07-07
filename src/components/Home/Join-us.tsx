import globe from "../../assets/public-visitor-globe-black.png"
import member from "../../assets/members-people-black.png"

export const Joinus = () => {
  return (
    <div className="flex flex-col gap-4 w-full px-6 md:px-14 lg:px-7 container mx-auto mb-16">
      <p className="text-[45px] font-bold my-[30px] mt-20 text-center">Take Action.&nbsp; Join Us.</p>
      <div className="flex flex-col lg:flex-row w-full container mx-auto gap-4">
        <div className="bg-orange-100 rounded-3xl h-auto lg:h-[433px] p-4 lg:p-6 flex flex-col lg:flex-row items-center lg:items-start gap-4">
          <div className="flex flex-col items-center lg:items-start flex-1">
            <img src={globe} height="55px" width="55px" className="mb-2" alt="Globe Icon" />
            <p className="text-black text-2xl font-bold">For Public Visitors</p>
            <p className="text-black text-lg text-center lg:text-left w-full lg:w-2/3">
              Become a member and get the latest updates from us, about us, and about the latest in tech.
            </p>
            <button className="text-black font-bold text-xs border-2 border-black mt-4 p-2 px-4 rounded-3xl max-w-fit">
              Become A Member
            </button>
          </div>
          <div className="h-full lg:w-[1.5px] bg-orange-200 opacity-75 rounded-3xl"></div>
          <div className="flex flex-col items-center lg:items-start flex-1">
            <img src={member} height="55px" width="55px" className="mb-2" alt="Member Icon" />
            <p className="text-black text-2xl font-bold">For Members</p>
            <p className="text-black text-lg text-center lg:text-left w-full lg:w-2/3">
              For the next generation of builders, you get to contribute your ideas, collaborate, and build.
            </p>
            <button className="text-black font-bold text-xs border-2 border-black mt-4 p-2 px-5 rounded-3xl max-w-fit ">
              Volunteer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
