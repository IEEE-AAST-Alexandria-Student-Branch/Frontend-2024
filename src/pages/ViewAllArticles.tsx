import { Spinner } from "@chakra-ui/react";
import "./styles/Dashboard.css";
import subscribeToCollection from "../firebase/subscribeToCollection.js"; // Import the new function
import getDocument from "../firebase/getData.js";
import { useEffect, useState, useContext } from "react";
import { UserContext } from '../App';
import UserData from "../interfaces/userData.js";
import ArticleCard from "../components/Article/Card/ArticleCard.tsx";
import ArticleData from "../interfaces/ArticleData.tsx";
import { SortButton } from "../components/common/SortButton";
import { articleTopics } from "../utils";

export const ViewAllArticles = () => {
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleData[]>([]); //seperate state for topic filtered events to avoid deleting the original events
  const [authors, setAuthors] = useState<{ [key: string]: UserData }>({});
  const [filter, setFilter] = useState("date");
  const { userData } = useContext(UserContext);

  const getAuthorNamesFromSet = async (authorIdsSet: Set<string>): Promise<void> => {
    const authorIds = Array.from(authorIdsSet);
    authorIds.forEach(async (authorId) => {
      const { result } = await getDocument("users", authorId);
      if (result) {
        const authorData = result?.data() as UserData;
        setAuthors((prevAuthors) => ({ ...prevAuthors, [authorId]: authorData }));
      }
    });
  };

  const changeFilter = (newfilter: string) => {
    let finalFilter = newfilter;

    if (filter.includes(newfilter)) {
      if (filter.includes("reverse")) {
        finalFilter = newfilter;
      } else {
        finalFilter = newfilter + "-reverse";
      }
    }

    // Set the filter state with the final filter
    setFilter(finalFilter);

    // Use the final filter to sort articles immediately
    filterArticles(finalFilter);
  };

  const filterArticles = (filter: string) => {
    let sortedArticles = [...articles]; // Create a new array to avoid mutating state directly

    // Sorting logic based on the filter
    switch (filter) {
      case "date":
        sortedArticles.sort((a, b) => b.publishdate.seconds - a.publishdate.seconds);
        break;
      case "date-reverse":
        sortedArticles.sort((a, b) => a.publishdate.seconds - b.publishdate.seconds);
        break;
      case "topic":
        sortedArticles.sort((a, b) => (b.topic || "Article").localeCompare(a.topic || "Article"));
        break;
      case "topic-reverse":
        sortedArticles.sort((a, b) => (a.topic || "Article").localeCompare(b.topic || "Article"));
        break;
      case "likes":
        sortedArticles.sort((a, b) => (b.likedBy || []).length - (a.likedBy || []).length);
        break;
      case "likes-reverse":
        sortedArticles.sort((a, b) => (a.likedBy || []).length - (b.likedBy || []).length);
        break;
    }
    const selectedTopic = document.querySelector('select')?.value || "All";
    if (selectedTopic !== "All") {
      sortedArticles = sortedArticles.filter(article => article.topic === selectedTopic);
    }

    setFilteredArticles(sortedArticles);
  };

  useEffect(() => {
    const unsubscribe = subscribeToCollection("articles", ({ result, ids, error }: { result: any, ids: string[], error: any }) => {
      if (error) {
        console.error("Error fetching articles: ", error);
        return;
      }

      if (result && ids) {
        const newarticles = (result as ArticleData[]).map((article, index) => ({
          ...article,
          id: ids ? ids[index] : null, // Set the id from ids if not null
          liked: userData?.likes?.articles?.includes(ids ? ids[index] : "") || false, // Set liked property based on user data
        }));
        const sortedArticles = newarticles.sort((a, b) => b.publishdate.seconds - a.publishdate.seconds);
        setArticles(sortedArticles);
        setFilteredArticles(sortedArticles);
        const authorIds = newarticles.map((article) => article.author);
        getAuthorNamesFromSet(new Set(authorIds));
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, [userData]); // Ensure to re-run the effect when userData changes

  if (!articles || articles.length === 0) {
    return (
      <>
        <div className="flex items-center justify-center w-full h-[99vh]"><Spinner size="xl" /></div>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center bg-[#000B21] text-white header mb-6 pt-4 md:pt-12 lg:pt-16">
      <div className="h-[150px] md:h-[150px] w-full"></div>
      <div className="w-full px-4 lg:px-[89px]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
          <h2 className="text-white text-[32px] md:text-[45px] font-bold">All Articles</h2>

          {/* Sorting buttons */}
          <SortButton label="Date" filterKey="date" currentFilter={filter} changeFilter={changeFilter} />
        <SortButton label="Likes" filterKey="likes" currentFilter={filter} changeFilter={changeFilter} />
        {/*topic filter*/}
        <select
          className="bg-[#151F33] text-white p-2 rounded h-12 w-full md:w-1/6"
          onChange={(e) => {
            const selectedTopic = e.target.value;
            const filtered = selectedTopic === "All" ? articles : articles.filter(article => article.topic === selectedTopic);
            setFilteredArticles(filtered);
          }}
        >
          <option value="All">All</option>
          {articleTopics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
        </div>

        <div className="w-full px-4">
          <div className="mt-[20px]  md:mt-[30px]  lg:mt-[59px] flex flex-col gap-[30px] md:gap-[30px] lg:gap-[58px] overflow-hidden mb-12">
            {filteredArticles.length === 0 ? (
              <>
              <div className="text-center text-white font-extrabold text-2xl">No articles found with that topic.</div>
              <div className="text-center text-white">Check again soon!</div>
              </>
            ) : (
              filteredArticles.map((article, index) => (
                <ArticleCard
                  key={article.id || index}
                  article={article}
                  author={authors[article.author]}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
