import Logo from "../../../assets/IEEELogoWhite.png";
import Search from "../../../assets/search-magnifier-white.png";
import PostNote from "../../../assets/post-note-white.png";
import Bell from "../../../assets/notify-me-bell-white.png";
import Profile from "../../../assets/profile-person-white.png";
import Arrow from "../../../assets/language-arrow-white.png";
import "./styles/Header.css";
import React, { useState } from 'react';
import { NavBar } from "../../common/navbar.js"

interface searchProps {
  onSearch: (value: string) => void;
}

export const Header: React.FC<searchProps> = ({onSearch}) => {

  const [searchVal, setSearchVal] = useState<string>('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
    console.log(`searched val: ${searchVal}`)
  };

  return (
    <div className="header">
        <NavBar/>
      <div className="search">
        <input
            type="text"
            placeholder="Search members, articles, events..."
            value={searchVal}
            onChange={handleSearchChange}
          />
      </div>
    </div>
    // <div className="header">
    //   <NavBar/>
    //   <div className="header-right">
    //     <a href="">
    //       <img className="logo margin-right" src={Logo} alt="IEEE Logo" />
    //     </a>
    //     <div className="search">
    //       <img className="photo-height" src={Search} alt="Search" />
    //       <input
    //         type="text"
    //         placeholder="Search members, articles, events..."
    //         value={searchVal}
    //         onChange={handleSearchChange}
    //       />
    //     </div>
    //   </div>
    //   <div className="header-left">
    //     <div className="post margin-right">
    //       <img className="photo-height" src={PostNote} alt="Post Note" />
    //       <label>Post</label>
    //     </div>
    //     <img className="margin-right photo-height" src={Bell} alt="Bell" />
    //     <img
    //       className="margin-right photo-height"
    //       src={Profile}
    //       alt="Profile"
    //     />
    //     <img src={Arrow} alt="Arrow" />
    //   </div>
    // </div>
  );
};
