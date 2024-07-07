import "./styles/Card.css";

interface CardProps {
  title: string;
  text: string;
  imgSrc: string;
  width: string;
  backGround: string;
}

const Card = ({ title, text, imgSrc, width, backGround }: CardProps) => {
  let w;
  if (width === "small") {
    w = "570px";
  } else {
    w = "770px";
  }
  return (
    <div
      className="card"
      style={{
        width: `${w}`,
        background: `${backGround} url(${imgSrc}) no-repeat`,
        backgroundSize: "contain",
        backgroundPosition: "right",
      }}
    >
      <div className="content">
        <h2 className="card-title">{title}</h2>
        <p className="card-text">{text}</p>
      </div>
    </div>
  );
};

export default Card;
