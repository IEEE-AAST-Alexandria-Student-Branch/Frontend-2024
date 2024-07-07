import Arrow from "../../assets/circleArrow.png";

interface FooterSocialCard {
  title: string;
  imgSrc: string;
  link: string;
}

const FooterSocialCard = ({ title, imgSrc, link }: FooterSocialCard) => {
  return (
    <a href={link} target="_blank" rel="noreferrer" className="social-icon">
    <div className="social-box">
      <div className="socialmedia">
        
          <img src={imgSrc} alt={title} />
        
        <h4 className="social-title">{title}</h4>
      </div>
      <img className="w-9" src={Arrow} alt="arrow" />
    </div>
    </a>
  );
};

export default FooterSocialCard;
