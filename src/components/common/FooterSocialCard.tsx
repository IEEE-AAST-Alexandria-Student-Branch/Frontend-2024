import Arrow from "../../assets/circleArrow.png";

interface FooterSocialCardProps {
  title: string;
  imgSrc: string;
  link?: string;
  onOpen?: () => void;
}

const FooterSocialCard = ({ title, imgSrc, link, onOpen = () => {} }: FooterSocialCardProps) => {
  const content = (
    <div className="flex items-center justify-between border-b border-[#f9f7f4] pb-4 w-full min-w-[180px] lg:max-w-[400px]">
      <div className="flex items-center">
        <img src={imgSrc} alt={title} className="w-10" />
        <h4 className="ml-5">{title}</h4>
      </div>
      <img className="w-9" src={Arrow} alt="arrow" />
    </div>
  );

  return link && link !== "" ? (
    <a href={link} target="_blank" rel="noreferrer" className="w-full flex justify-center">
      {content}
    </a>
  ) : (
    <div className="w-full flex justify-center cursor-pointer" onClick={onOpen}>
      {content}
    </div>
  );
};

export default FooterSocialCard;
