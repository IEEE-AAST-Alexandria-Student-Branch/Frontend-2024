import { arrayRemove, arrayUnion } from '@firebase/firestore';
import updateData from './firebase/updateData';
import getDocument from './firebase/getData';
import { ensureUserFieldExist } from './firebase/addBookMarksMissingFields';
import ArticleData from './interfaces/ArticleData';
import { EventData } from './interfaces/EventData';
import userData from './interfaces/userData';

export const eventTypesWithColors = [
  { type: "AI", color: "#C058D3" },
  { type: "Conference", color: "#005F73" },
  { type: "Competition", color: "#FF4500" },
  { type: "Database", color: "#ffa1f2" },
  { type: "Game", color: "#b83232" },
  { type: "Media", color: "#588CD3" },
  { type: "Mobile", color: "#eb9131" },
  { type: "Other", color: "#4f3b29" },
  { type: "Python", color: "#e8d36b" },
  { type: "Security", color: "#81AA34" },
  { type: "Technical", color: "#A3A3A3" },
  { type: "Web", color: "#58D3C0" }
];

export const articleTopics = [
  "Other",
  "Technical",
  "AI",
  "Swift",
  "Python",
  "Web",
  "Mobile",
  "Database",
  "Security",
  "Media",
  "Game"
];

export const autoColorByTopic = (topic: string): string => {
  const event = eventTypesWithColors.find(event => event.type === topic);
  return event ? event.color : "#A3A3A3";
};

export const convertNewLinesToBRTags = (text: string): string => {
  return text.replace(/\n/g, '<br>');
};

export const convertBRTagsToNewLines = (text: string): string => {
  return text.replace(/<br>/g, '\n');
};

export const toggleLike = async (
  item: EventData | ArticleData,
  userData: userData,
  userId: string,
  type: string,
  setUserData: Function,
) => {
  const collectionName = type === "article" ? "articles" : "events";
  if (!item.likedBy) {
    throw new Error("LikedBy field not found in item! Please add it in firebase.");
  }
  const liked = item.likedBy?.includes(userId);

  // Determine the updated likes for the user based on like status
  const updatedLikes = liked
    ? (type === "article"
      ? userData?.likes?.articles?.filter((like) => like !== item.id)
      : userData?.likes?.events?.filter((like) => like !== item.id))
    : (type === "article"
      ? [...(userData?.likes?.articles || []), item.id]
      : [...(userData?.likes?.events || []), item.id]);

  try {
    // Update the user data locally
    const updatedUserLikes = {
      ...userData.likes,
      articles: type === "article" ? updatedLikes : userData.likes.articles,
      events: type === "article" ? userData.likes.events : updatedLikes
    };

    // Update the state with the new user likes
    setUserData({ ...userData, likes: updatedUserLikes });

    // Update user data in Firebase
    await updateData('users', userId, { likes: updatedUserLikes });

    // Check if item likes exist and update in Firebase
    if (item.likedBy !== undefined) {
      // Update item likes in Firebase
      await updateData(collectionName, item.id, { likedBy: liked ? arrayRemove(userId) : arrayUnion(userId) });
    }

    return true;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const toggleBookMark = async (
  item: ArticleData,
  userData: userData,
  userId: string,
  setUserData: Function,
) => {

  let bookMarked = false;

  // Ensure userData has a bookmarks object
  if (!userData.bookmarks) {
    await ensureUserFieldExist(userId);
    await getDocument('users', userId);
    console.log("creating bookmarks")
  }

  if (item.id) {
    bookMarked = userData.bookmarks.articles?.includes(item.id);
  }

  // Determine the updated likes for the user based on like status
  const updatedBookMarks = bookMarked
    ? (userData?.bookmarks.articles.filter((bookmark) => bookmark !== item.id))
    : [...(userData?.bookmarks.articles || []), item.id]

  try {
    // Update the user data locally
    const updatedUserBookMarks = {
      ...userData.bookmarks,
      articles: updatedBookMarks,
    };

    // Update the state with the new user likes
    setUserData({ ...userData, bookmarks: updatedUserBookMarks });

    // Update user data in Firebase
    await updateData('users', userId, { bookmarks: updatedUserBookMarks });

    return true;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export const toggleFollow = async (
  followed: userData,
  follower: userData,
  followedId: string,
  followerId: string,
  setFollowedData: Function,
  setFollowerData: Function,
) => {
  const isfollowing = followed.followers?.includes(followerId);
  console.log(isfollowing);

  setFollowedData({
    ...followed,
    followers: isfollowing
      ? followed.followers.filter((user) => { return user != followerId })
      : [...followed.followers, followerId]
  });

  setFollowerData({
    ...follower,
    following: {
      ...follower.following,
      users: isfollowing
        ? follower.following.users.filter((user) => { return user != followedId })
        : [...follower.following.users, followedId]
    }
  })

  const result = await updateData(
    "users",
    followedId,
    {
      followers: isfollowing
        ? followed.followers.filter((user) => { return user != followerId })
        : [...followed.followers, followerId]
    }
  );

  console.log(result);

  await updateData(
    "users",
    followerId,
    {
      following: {
        events: follower.following.events,
        users: isfollowing
          ? follower.following.users.filter((user) => { return user != followedId })
          : [...follower.following.users, followedId]
      }
    }
  );

}
