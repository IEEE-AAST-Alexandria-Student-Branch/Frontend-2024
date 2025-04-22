import { arrayRemove, arrayUnion } from '@firebase/firestore';
import updateData from './firebase/updateData';
import getDocument from './firebase/getData';
import { ensureUserFieldExist } from './firebase/addBookMarksMissingFields';
import ArticleData from './interfaces/ArticleData';
import { EventData } from './interfaces/EventData';
import userData from './interfaces/userData';
import signInWithGoogle from './firebase/signInWithGoogle';
import { docExists } from './firebase/docExists';
import setData from './firebase/setData';

export const eventTypesWithColors = [
  { type: "AI", color: "#C058D3" },
  { type: "Conference", color: "#005F73" },
  {type: "Cloud", color: "#A3A3A3"},
  { type: "Competition", color: "#FF4500" },
  { type: "Database", color: "#ffa1f2" },
  { type: "Game", color: "#b83232" },
  { type: "Media", color: "#588CD3" },
  { type: "Mobile", color: "#eb9131" },
  { type: "Python", color: "#e8d36b" },
  { type: "Security", color: "#81AA34" },
  { type: "Technical", color: "#A3A3A3" },
  { type: "Web", color: "#58D3C0" },
  { type: "Other", color: "#4f3b29" }
];

export const articleTopics = [
  "AI",
  "Database",
  "Game",
  "Media",
  "Mobile",
  "Python",
  "Security",
  "Swift",
  "Technical",
  "Web",
  "Other"
];

export const roles = [
  "admin",
  "writer",
  "volunteer"];
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
    await updateData('users', userId, {
      likes: {
      articles: type === "article" ? (liked ? arrayRemove(item.id) : arrayUnion(item.id)) : userData.likes.articles,
      events: type === "article" ? userData.likes.events : (liked ? arrayRemove(item.id) : arrayUnion(item.id)),
      },
    });

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
  targetUser: userData,
  currentUser: userData,
  targetUserId: string,
  currentUserId: string,
  updateFollowers: (userId: string, updatedFollowers: string[]) => void,
  updateFollowing: (userId: string, updatedFollowing: string[]) => void,
) => {
  // Ensure followers and following arrays are initialized
  const targetUserFollowers = Array.from(new Set(targetUser.followers || []));
  const currentUserFollowing = Array.from(new Set(currentUser.following?.users || []));

  const isFollowing = targetUserFollowers.includes(currentUserId);

  // Update target user's followers locally
  const updatedFollowers = isFollowing
    ? targetUserFollowers.filter((user) => user !== currentUserId)
    : [...targetUserFollowers, currentUserId];

  // Update current user's following locally
  const updatedFollowing = isFollowing
    ? currentUserFollowing.filter((user) => user !== targetUserId)
    : [...currentUserFollowing, targetUserId];

  // Ensure no duplicates in the updated arrays
  const uniqueUpdatedFollowers = Array.from(new Set(updatedFollowers));
  const uniqueUpdatedFollowing = Array.from(new Set(updatedFollowing));

  // Update local state for both users
  updateFollowers(targetUserId, uniqueUpdatedFollowers);
  updateFollowing(currentUserId, uniqueUpdatedFollowing);

  try {
    // Update target user's followers in Firebase
    await updateData("users", targetUserId, { followers: uniqueUpdatedFollowers });

    // Update current user's following in Firebase
    await updateData("users", currentUserId, {
      following: {
        ...currentUser.following,
        users: uniqueUpdatedFollowing,
      },
    });

    return true;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const handleGoogleSignIn = async () => {
  const { result, error } = await signInWithGoogle();
  

  if (error) {
    console.error(error);
    alert(error);
  } else {
    const storedEmptyUser = {
      firstname: result?.user?.displayName?.split(" ")[0] || "",
      lastname: result?.user?.displayName?.split(" ").slice(1).join(" ") || "",
      desc: "",
      email: result?.user?.email || "",
      likes: { events: [], articles: [] },
      followers: [],
      roles: [],
      following: { events: [], users: [] },
      bookmarks: { articles: [] }
    };
    if (result?.user?.uid) {
      const userExists = await docExists("users", result.user.uid);
      if (!userExists) {
        await setData("users", storedEmptyUser, result.user.uid);
        
      }
      window.location.reload();
    }

  }

  
};
