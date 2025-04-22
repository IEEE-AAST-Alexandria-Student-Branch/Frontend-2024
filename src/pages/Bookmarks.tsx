import { UserContext } from '../App';
import { useContext, useEffect, useState } from 'react';
import ArticleCard from '../components/Article/Card/ArticleCard';
import ArticleData from '../interfaces/ArticleData';
import getCollection from '../firebase/getCollection';
import getDocument from '../firebase/getData';
import UserData from '../interfaces/userData';
import { Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

interface ArticleWithAuthor extends ArticleData {
  authorData: UserData; // Add additional property for this page
}

export const Bookmarks = () => {
  const { userData, userId } = useContext(UserContext);
  const [articles, setArticles] = useState<ArticleWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    const { result, error, ids } = await getCollection("articles");
    if (error) {
      console.error("Error fetching articles:", error);
      return;
    }
    if (result) {
      // Ensure userData.bookmarks exist before filtering
      const bookmarkedArticles = result
        .map((article, index) => ({
          ...article,
          id: ids?.[index], // Attach ID to the article object
        }))
        .filter((article) => userData?.bookmarks?.articles?.includes(article.id));


      const authorIds = [...new Set(bookmarkedArticles.map(article => article.author))];

      // Fetch author details
      const authorDataPromises = authorIds.map(async (authorId) => {
        const { result: author, error: authorError } = await getDocument("users", authorId);
        if (authorError) {
          console.error(`Error fetching author ${authorId}:`, authorError);
          return null;
        }

        return { id: authorId, userData: author?.data() || null };
      });

      const authorsArray = await Promise.all(authorDataPromises);

      // Convert authors array into an object map (id -> full userData)
      const authorMap = Object.fromEntries(
        authorsArray.filter(Boolean).map(author => [author?.id, author?.userData])
      );

      // Update articles with full author data
      const articlesWithAuthors = bookmarkedArticles.map(article => ({
        ...article,
        authorData: authorMap[article.author] || null,
      }));

      setArticles(articlesWithAuthors);
      setLoading(false);
    }

  }


  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!userId) {
    return (

      <div className='flex flex-col items-center justify-center px-10 pt-28 h-screen'>
        <h2 className='text-3xl'>You need to be signed in to view your bookmarks!</h2>
        <p className='text-2xl'>You can sign in <Link to="/signin" className='text-blue-500 hover:underline'>here</Link></p>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-[99vh]"><Spinner size="xl" /></div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center px-10 pt-28 h-screen'>
        <h2 className='text-3xl'>No bookmarks available!</h2>
        <p className='text-2xl'>You can go to browse events and articles <Link to="/browse" className='text-blue-500 hover:underline'>here</Link></p>
      </div>
    );
  }

  return (
    <>
      <div className='pt-28 flex flex-col px-4 lg:px-[89px]'>
        <div className="mt-[30px] lg:mt-[59px] flex flex-col gap-[30px] lg:gap-[58px]">
          {articles.map((article, index) => {
            return <ArticleCard article={article} author={article.authorData} key={index} />;
          })
          }
        </div>
      </div>
    </>
  );
}