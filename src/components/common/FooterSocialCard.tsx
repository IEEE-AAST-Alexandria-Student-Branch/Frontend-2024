import React from 'react';
import Arrow from "../../assets/circleArrow.png";

interface FooterSocialCardProps {
  title: string;
  imgSrc: string;
  link: string;
  onOpen: () => void;
}

const FooterSocialCard = ({ title, imgSrc, link, onOpen }: FooterSocialCardProps) => {
  
  const handleClick = () => {
    if (title === "Frequently Asked Questions") {
      onOpen();
    }
  };

  const content = (
    <div className="social-box cursor-pointer" onClick={handleClick}>
      <div className="socialmedia">
        <img src={imgSrc} alt={title} />
        <h4 className="social-title">{title}</h4>
      </div>
      <img className="w-9" src={Arrow} alt="arrow" />
    </div>
  );

  return link !== "" ? (
    <a href={link} target="_blank" rel="noreferrer" className="social-icon">
      {content}
    </a>
  ) : (
    <div className="social-icon">
      {content}
    </div>
  );
};

export default FooterSocialCard;
