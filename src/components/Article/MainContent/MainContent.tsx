import "./styles/MainContent.css";
import { LikeSaveShare } from "./LikeSaveShare";
import { Modal } from "../Modal/Modal";
import { useState , useEffect} from "react";
import getCollection from "../../../firebase/getCollection.js";
import getDocument from "../../../firebase/getData.js";
import { ar, da } from "@faker-js/faker";

interface ArticleData {
  article: string;
  author: string;
  caption: string;
  description: string;
  image: string;
  likes : number;
  publishdate: string;
  title: string;
}

interface AuthorData{
  email : string;
  firstname : string;
  imgurl: string;
  lastactive: any;
  lastname: string;
  phonenumber: number;
  role: string;
}

interface headerSearch {
  searchQuery : string;
}

export const MainContent: React.FC<headerSearch> = ({searchQuery}) => {
  const [isFollowing, setIsFollowing] = useState(true);
  const [modal, setModal] = useState(false);
  const [articleData, setArticleData] = useState<ArticleData[]>([])
  const [authorData, setAuthorData] = useState<AuthorData | null>(null);
  const [lastActive, setLastActive] = useState('')

  //fetch articles
  useEffect(() => {
    getCollection('articles').then(res => {
      if (res.result) {
        setArticleData(res.result as ArticleData[]);
      }
    });
  }, []);

  //fetch authors based on article index
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (articleData.length > 0) {
        const defaultArticleIndex = 0; 
        const articleIndex = filteredArticles.length > 0 ? articleData.indexOf(filteredArticles[0]) : defaultArticleIndex;
        const authorId = articleData[articleIndex]?.author;
        if (authorId) {
          const res = await getDocument("users", authorId);
          if (res.result) {
            const auth = res.result.data() as AuthorData
            setAuthorData(auth);
            //date
            const { seconds, nanoseconds } = auth.lastactive;
            const date = new Date(seconds * 1000 + nanoseconds / 1e6);
            setLastActive(date.toISOString());
          }
        }
      }
    };
    fetchAuthorData();
  }, [articleData, searchQuery]);

  console.log("articleData", articleData)
  console.log("search query:", searchQuery)
  console.log("authdata", authorData)

  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  //filter article displayed based on search query
  const filteredArticles = searchQuery
    ? articleData.filter((article) =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
    
  const displayedArticle = filteredArticles.length > 0 ? filteredArticles[0] : articleData[0];

  console.log("disp art", displayedArticle)

  if (!articleData) {
    return <div>Loading...</div>;
  }

  if (!authorData){
    return<div>Loading ....</div>
  }

  return (
    <div className="main-content">
        <span className="title">{displayedArticle.title}</span>
        <span className="description">{displayedArticle.description}</span>
        <div className="profile">
          <div className="pfp">
            <img src={authorData?.imgurl} alt={`${authorData?.firstname} ${authorData?.lastname}`}></img>
          </div>
          <div className="profile-desc">
            <span className="desc-title">
            {`${authorData?.firstname} ${authorData?.lastname}`} •
              <span
                onClick={toggleFollow}
                style={{ color: isFollowing ? "dodgerblue" : "" }}
              >
                {isFollowing ? "Follow" : "Following"}
              </span>
            </span>
            <span className="desc-time">{lastActive.slice(0,10)}</span>
          </div>
        </div>
        <hr />
        <LikeSaveShare articleID = {articleData.indexOf(displayedArticle)}/>
        <hr />
        <div className="article-img">
          <img src={displayedArticle.image} alt="Article" />
        </div>
        <caption>{displayedArticle.caption}</caption>
        <div className="article-desc">
          {displayedArticle.article}
        </div>
        <LikeSaveShare articleID = {articleData.indexOf(displayedArticle)}/>
        <hr />
        <a href="">More from {`${authorData?.firstname} ${authorData?.lastname}`}</a>
        <hr />
        <a onClick={()=>setModal(true)}><u>Report</u></a>
        <hr />
        <a href="">Help</a>

      {modal && <Modal closeModal={setModal}/>}
    </div>
  );
};
