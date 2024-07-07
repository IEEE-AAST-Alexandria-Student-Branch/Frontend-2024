import imgContainer from "../assets/images/eventarticlesImg.webp";
import arrowRightIcon from "../assets/right-arrow-svgrepo-com.svg";
import articleImage1 from "../assets/images/urn aaid sc US 360876a4-664a86-9505-fdd8c336159f;revision=0.webp";
import articleImage2 from "../assets/images/urn aaid sc US 360876a4-a18b-4a86-9505-fdd8c336159f;revision=0.webp";
import articleImage3 from "../assets/images/urn aaid sc US 360876a4-664a86-9505-fdd8c336159f;revision=0.webp";
import saveicon from "../assets/bookmark-ribbon-white.png";
import optionIcon from "../assets/more-ellipsis-white.png";
import { NavBar } from "../components/common/navbar";

export const Dashboard = () => {
  return (
    <div className="flex flex-col items-center bg-[#121212] text-white">
      <div className="h-[150px] w-full">
        <NavBar />
      </div>

      <div className="w-full min-h-screen flex justify-center items-center">
        <div className="relative w-[1733px] h-[988px] rounded-[38px] overflow-hidden">
          <div className="absolute z-10 w-full h-screen bg-gradient-to-t from-[#000B21A5] via-transparent bottom-0"></div>

          <div className="absolute bottom-[83px] z-10 left-[35px] text-white">
            <h2 className="text-[50px] font-serif font-black">Onboarding - Making minimal fun ;)</h2>
            <h3 className="text-[24px]">Article • Design • Craig Fidrigie</h3>
            <button className="w-[169px] h-[59px] text-[21px] bg-white text-black font-bold rounded-[29px] mt-[45px]">
              View
            </button>
          </div>

          <img
            className="object-cover w-full -translate-y-[125px]"
            src={imgContainer}
            alt="Event"
          />
        </div>
      </div>

      <div className="mt-[100px] w-full px-[89px]">
        <div className="flex justify-between items-center">
          <h2 className="text-white text-[45px] font-bold">Latest Articles</h2>
          <button className="flex items-center text-[30px] text-white">
            View all
            <img className="ml-[8px]" src={arrowRightIcon} width={24} alt="arrow right" />
          </button>
        </div>

        <div className="mt-[59px] flex flex-col gap-[58px]">
          <div className="flex">
            <div className="w-[460px] h-[302px] mr-[58px]">
              <img
                src={articleImage1}
                alt="Article"
                className="w-[460px] h-[302px] object-cover rounded-[16px]"
              />
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="text-[15px] mb-[33px] text-[#F4F4F4]">
                <h5>--Natalie • Yesterday ✨ Member-only</h5>
              </div>
              <div className="text-[27px] font-serif">
                <h1>Swiftly approaching, an all new reality kit!</h1>
              </div>
              <div className="text-[22px] mb-[32px]">
                <h3>
                  Cultivating active, vibrant, and honest exchange among cross-disciplinary and interdisciplinary global communities of technical industry professionals is essential for fostering innovation, collaboration, and progress. Here are some key points to consider when working towards this goal.
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <button className="text-[15px] w-[90px] h-[35px] bg-[#151F33] rounded-[20px]">
                    Swift
                  </button>
                  <p>• 5 min read</p>
                </div>
                <div className="flex items-center gap-[39px]">
                  <button>
                    <img src={saveicon} alt="save" />
                  </button>
                  <button>
                    <img src={optionIcon} alt="options" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-[460px] h-[302px] mr-[58px]">
              <img
                src={articleImage2}
                alt="Article"
                className="w-[460px] h-[302px] object-cover rounded-[16px]"
              />
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="text-[15px] mb-[33px] text-[#F4F4F4]">
                <h5>--Natalie • Yesterday ✨ Member-only</h5>
              </div>
              <div className="text-[27px] font-serif">
                <h1>Vision OS – Build your first app</h1>
              </div>
              <div className="text-[22px] mb-[32px]">
                <h3>
                  Cultivating active, vibrant, and honest exchange among cross-disciplinary and interdisciplinary global communities of technical industry professionals is essential for fostering innovation, collaboration, and progress. Here are some key points to consider when working towards this goal.
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <button className="text-[15px] w-[90px] h-[35px] bg-[#151F33] rounded-[20px]">
                    Swift
                  </button>
                  <p>• 5 min read</p>
                </div>
                <div className="flex items-center gap-[39px]">
                  <button>
                    <img src={saveicon} alt="save" />
                  </button>
                  <button>
                    <img src={optionIcon} alt="options" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="w-[460px] h-[302px] mr-[58px]">
              <img
                src={articleImage3}
                alt="Article"
                className="w-[460px] h-[302px] object-cover rounded-[16px]"
              />
            </div>
            <div className="flex flex-col justify-between w-full">
              <div className="text-[15px] mb-[33px] text-[#F4F4F4]">
                <h5>--Natalie • Yesterday ✨ Member-only</h5>
              </div>
              <div className="text-[27px] font-serif">
                <h1>Reactor Pattern in NodeJS</h1>
              </div>
              <div className="text-[22px] mb-[32px]">
                <h3>
                  Cultivating active, vibrant, and honest exchange among cross-disciplinary and interdisciplinary global communities of technical industry professionals is essential for fostering innovation, collaboration, and progress. Here are some key points to consider when working towards this goal.
                </h3>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <button className="text-[15px] w-[90px] h-[35px] bg-[#151F33] rounded-[20px]">
                    Swift
                  </button>
                  <p>• 5 min read</p>
                </div>
                <div className="flex items-center gap-[39px]">
                  <button>
                    <img src={saveicon} alt="save" />
                  </button>
                  <button>
                    <img src={optionIcon} alt="options" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[100px] w-full px-[89px]">
        <h2 className="text-white text-[45px] font-bold">Events</h2>
        <div className="mt-[59px] overflow-x-scroll scrollbar-hide">
          <div className="flex space-x-[20px]">
            <div className="flex-shrink-0 w-[537px] h-[686px] bg-purple-600 rounded-[12px] flex flex-col justify-center items-center text-center">
              <h3 className="text-[45px] font-bold mb-[20px]">Swiftly Approaching</h3>
              <p className="text-[24px]">Hackathon</p>
              <p className="text-[24px]">1<sup>st</sup> of September</p>
            </div>
            <div className="flex-shrink-0 w-[537px] h-[686px] bg-blue-600 rounded-[12px] flex flex-col justify-center items-center text-center">
              <h3 className="text-[45px] font-bold mb-[20px]">Leading Your Career</h3>
              <p className="text-[24px]">Mega Event</p>
              <p className="text-[24px]">12 - 16 of July</p>
            </div>
            <div className="flex-shrink-0 w-[537px] h-[686px] bg-green-600 rounded-[12px] flex flex-col justify-center items-center text-center">
              <h3 className="text-[45px] font-bold mb-[20px]">From Zero to Hero</h3>
              <p className="text-[24px]">Workshop</p>
              <p className="text-[24px]">10, 11, 12 of August</p>
            </div>
            <div className="flex-shrink-0 w-[537px] h-[686px] bg-red-600 rounded-[12px] flex flex-col justify-center items-center text-center">
              <h3 className="text-[45px] font-bold mb-[20px]">Mastering the Basics</h3>
              <p className="text-[24px]">Workshop</p>
              <p className="text-[24px]">20, 21, 22 of September</p>
            </div>
            <div className="flex-shrink-0 w-[537px] h-[686px] bg-yellow-600 rounded-[12px] flex flex-col justify-center items-center text-center">
              <h3 className="text-[45px] font-bold mb-[20px]">Advanced Techniques</h3>
              <p className="text-[24px]">Workshop</p>
              <p className="text-[24px]">15, 16, 17 of October</p>
            </div>
          </div>
        </div>
      </div>
        <p className="text-white text-[24px] mt-[10px]">More services coming out soon... stay tuned.<br />
        <a href="#" className="underline block text-center">Tell us what you expect</a>
        </p>
      </div>
  );
};
