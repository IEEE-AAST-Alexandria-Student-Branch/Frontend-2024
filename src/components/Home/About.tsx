import {Element} from 'react-scroll';
import Card from "./Card";
import NumbersCard from "./NumbersCard";

import Growth from "../../assets/growth-arrow-green.png";
import Integrity from "../../assets/integrity-scales-yellow.png";
import PartnerShip from "../../assets/partner-hands-orange.png";
import Service from "../../assets/service-chip-flamenco.png";
import Trust from "../../assets/trust-net-blue.png";
import Community from "../../assets/community-globe-purple.png";
import EventsNumber from "../../assets/events-number.png";
import PartnerShipsNumber from "../../assets/partnerships-number.png";
import VolunteersNumber from "../../assets/volunteers-number.png";

const cardsData = [
  {
    title: "Growth",
    text: "Promote ongoing education for engineers, scientists, and technologists and maintain a student pipeline to sustain the profession.",
    imgSrc: Growth,
    width: "small",
    backGround: "#E2ECD7",
  },
  {
    title: "Global Community Building",
    text: "Cultivating active, vibrant, and honest exchange among cross-disciplinary and interdisciplinary global communities of technical professionals.",
    imgSrc: Community,
    width: "big",
    backGround: "#E5DEEC",
  },
  {
    title: "Trust",
    text: "Being a trusted and unbiased source of technical information, and forums, for technical dialog and collaboration.",
    imgSrc: Trust,
    width: "big",
    backGround: "#D3E4F5",
  },
  {
    title: "Partnership",
    text: "Cultivate a culture that values contributions, empowers individuals, and strengthens the volunteer-staff partnership for professional service.",
    imgSrc: PartnerShip,
    width: "small",
    backGround: "#F6E6D3",
  },
  {
    title: "Service to humanity",
    text: "Leveraging science, technology, and engineering to benefit human welfare; promoting public awareness and understanding of engineering",
    imgSrc: Service,
    width: "small",
    backGround: "#F5D3D3",
  },
  {
    title: "Integrity in action",
    text: "Fostering a professional climate in which engineers and scientists continue to be respected for their exemplary ethical behaviour and volunteerism.",
    imgSrc: Integrity,
    width: "big",
    backGround: "#F5EFD7",
  },
];

const branchNumbers = [
  {
    title: "360+",
    text: "Events until present",
    imgSrc: EventsNumber,
  },
  {
    title: "120+",
    text: "Partnerships until present",
    imgSrc: PartnerShipsNumber,
  },
  {
    title: "200+",
    text: "Volunteers until present",
    imgSrc: VolunteersNumber,
  },
];

const About = () => {
  return (
    <>
    <Element name="aboutSection">
      <div className="card-container" id="aboutSection">
        <h2 className="card-heading font-bold text-4xl mt-20 ml-9">IEEE Values. &nbsp;Our Core.</h2>
        {cardsData.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
      <div className="box-container">
        {branchNumbers.map((number, index) => (
          <NumbersCard key={index} {...number} />
        ))}
      </div>
      </Element>
    </>
  );
};

export default About;
