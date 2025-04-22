import "./styles/MainContent.css";
import { LikeSaveShare } from "./LikeSaveShare";
import { Modal } from "../Modal/Modal";
import { useState, useEffect, useCallback } from "react";
import getDocument from "../../../firebase/getData.js";
import { Timestamp } from "@firebase/firestore";
import ArticleData from "../../../interfaces/ArticleData.js";
import subscribeToDocumentsByField from "../../../firebase/subscribeToDocumentsByField.js";
import UserData from "../../../interfaces/userData.js";
import { Link } from "react-router-dom";

interface MainContentProps {
  articleName: string;
}

interface AuthorData {
  userData: UserData | null;
  id: string | null;
}

export const MainContent: React.FC<MainContentProps> = ({ articleName }) => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [modal, setModal] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData | null>(null);
  const [author, setAuthor] = useState<AuthorData | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => {
    document.body.style.overflow = modal ? "auto" : "hidden";
    setModal(!modal);
  };

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

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (loading || !articleData || !author) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-content">
      <span className="title">{articleData.title}</span>
      <span className="description">{articleData.description}</span>
      <Link to={`/profile/${articleData.author}`} className="profile">
        <div className="pfp">
          <img
            src={author?.userData?.imgurl}
            alt={`${author?.userData?.firstname} ${author?.userData?.lastname}`}
          />
        </div>
        <div className="profile-desc">
          <span className="desc-title">
            {`${author?.userData?.firstname} ${author?.userData?.lastname}`} •
            <span
              onClick={toggleFollow}
              style={{ color: isFollowing ? "dodgerblue" : "" }}
            >
              {isFollowing ? "Follow" : "Following"}
            </span>
          </span>
          <p className="desc-time w-fit">{formatDate(articleData.publishdate)}</p>
        </div>
      </Link>
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
      <hr />
      <a onClick={toggleModal}>
        <u>Report</u>
      </a>
      <hr />
      <a href="">Help</a>
      {modal && <Modal closeModal={setModal} />}
    </div>
  );
};
