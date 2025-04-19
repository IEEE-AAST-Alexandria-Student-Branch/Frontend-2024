export default interface UserData {
  firstname: string;
  lastname: string;
  email: string;
  imgurl: string;
  mobile: string;
  roles?: string[];
  desc: string;
  likes: likes;
  bookmarks: bookmark;
  followers: string[];
  following: following;
  socials?: Social[];
  verified?: boolean;
}

interface likes {
  articles?: string[];
  events?: string[];
}

interface following {
  events: string[];
  users: string[];
}

interface bookmark {
  articles: string[];
}

export interface Social{
  name:"Facebook"|"Instagram"|"LinkedIn";
  url:string;
}

