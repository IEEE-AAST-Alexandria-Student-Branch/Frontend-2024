import { Avatar } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import UserData from "../../../interfaces/userData";
import ArticleData from "../../../interfaces/ArticleData";
import { LikeButton } from "../../common/LikeButton";
import { BookMarkButton } from "../../common/BookMarkButton";

interface ArticleCardProps {
  article: ArticleData;
  author?: UserData | undefined;
}

const ArticleCard = ({ article, author }: ArticleCardProps) => {
  return (
    <Link to={`/article/${article.title}`} className="flex flex-col md:flex-row">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-[550px] h-[200px] md:h-[250px] md:mr-[58px]">
          <img
            src={article.image || "#"}
            alt="Article"
            className="w-full h-full object-cover rounded-[16px]"
          />
        </div>
        <div className="flex flex-col justify-between w-full mt-4 lg:mt-0">
          <div className="text-[12px] lg:text-[15px] mb-[20px] lg:mb-[33px] text-[#F4F4F4]">
            {author && (
              <Link className="flex items-center gap-2" to={`/profile/${article.author}`}>
                <Avatar src={author?.imgurl} name={`${author?.firstname} ${author?.lastname}`}></Avatar>
                <h5>{author?.firstname || "unknown author"} {author?.lastname || "author"}</h5>
              </Link>
            )}
          </div>
          <div className="text-[20px] lg:text-[27px] font-serif">
            <h1>{article.title}</h1>
          </div>
          <div className="text-[16px] lg:text-[22px] mb-[20px] lg:mb-[32px]">
            <h3 className="font-extralight">{article.description}</h3>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[10px]">
              <div className="text-[12px] lg:text-[15px] w-[70px] lg:w-[90px] h-[30px] lg:h-[35px] bg-[#151F33] rounded-[20px] flex items-center justify-center">
                {article.topic || "Article"}
              </div>
              <p className="opacity-50 italic text-sm ml-4">
                {`${article.publishdate.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} at ${article.publishdate.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </p>
            </div>
            <div className="flex items-center gap-[20px] lg:gap-[39px]">
              <LikeButton item={article} type="article" />
              <button>
                <BookMarkButton item={article} />
              </button>
              {/* <button>
                <img src={optionIcon} alt="options" />
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
