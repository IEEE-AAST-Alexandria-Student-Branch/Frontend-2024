import "./styles/MainContent.css";
import { LikeSaveShare } from "./LikeSaveShare";
import { FollowButton } from "../../common/FollowButton.js";
import { useState, useEffect, useCallback, useContext } from "react";
import getDocument from "../../../firebase/getData.js";
import { Timestamp } from "@firebase/firestore";
import ArticleData from "../../../interfaces/ArticleData.js";
import subscribeToDocumentsByField from "../../../firebase/subscribeToDocumentsByField.js";
import UserData from "../../../interfaces/userData.js";
import { UserContext } from "../../../App.js";
import { Link } from "react-router-dom";

interface MainContentProps {
  articleName: string;
}

interface AuthorData {
  userData: UserData | null;
  id: string | null;
}

export const MainContent: React.FC<MainContentProps> = ({ articleName }) => {
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);
  const { userData, userId } = useContext(UserContext)

  const fetchArticle = useCallback(async () => {
    const unsubscribe = subscribeToDocumentsByField("articles", "title", "==", articleName, async (data: any) => {
      const article = (data.result?.[0] as ArticleData) || null;
      setArticleData(article);
      if (article?.author) {
        const authorData = await getDocument("users", article.author);
        setAuthor(authorData.result ? { userData: authorData.result.data() as UserData, id: authorData.result.id } : null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [articleName]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle]);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };


  if (loading || !articleData || !author) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content">
      <span className="title">{articleData.title}</span>
      <span className="description">{articleData.description}</span>
      <div className="flex items-center">
      <Link to={`/profile/${articleData.author}`} className="profile">
        <div className="pfp">
          <img
            src={author?.userData?.imgurl}
            alt={`${author?.userData?.firstname} ${author?.userData?.lastname}`}
          />
        </div>
        <div className="profile-desc">
          <div className="flex items-center">
          <span className="desc-title opacity-80">
            {`${author?.userData?.firstname} ${author?.userData?.lastname}`} •
          </span>

            </div>
          <p className="desc-time w-fit opacity-80">{formatDate(articleData.publishdate)}</p>
        </div>
      </Link>
      <FollowButton
              targetUserData={author?.userData}
              currentUserData={userData}
              targetUserId={author?.id || ""}
              currentUserId={userId || ""}
              className="ml-2 z-20"
              setTargetFollowers={(_userId, updatedFollowers) => {
                if (author?.userData) {
                  setAuthor((prev) => {
                    if (!prev || !prev.userData) return prev;
                    return {
                      ...prev,
                      userData: { ...prev.userData, followers: updatedFollowers },
                    };
                  });
                }
              }}
            />
        </div>
      <hr />
      <LikeSaveShare article={articleData} />
      <hr />
      <div className="article-img" style={{ height: "400px", overflow: "hidden" }}>
        <img
          className="h-full object-contain bg-[#000B21] w-full"
          src={articleData.image}
          alt="Article"
        />
      </div>
      <caption>{articleData.caption}</caption>
      <div className="article-desc">{articleData.article}</div>
      <hr />
      <a href={`/profile/${author.id}`}>
        More from {`${author?.userData?.firstname} ${author?.userData?.lastname}`}
      </a>
    </div>
  );
};
