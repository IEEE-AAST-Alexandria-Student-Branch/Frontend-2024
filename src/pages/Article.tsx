import { Header } from "../components/Article/Header/Header.tsx";
import { Footer } from "../components/Article/Footer/Footer.tsx";
import { MainContent } from "../components/Article/MainContent/MainContent.tsx";
import TestImg from "../assets/test.png";
import React, { useState} from 'react';
import { Query } from "firebase/firestore";
// import getCollection from "../firebase/getCollection.js";

// const article_title = "Onboarding - Making minimal fun ;)";
// const article_desc = "Designing for play using simple lines and fonts.";
// const article_img = TestImg;
// const article_caption = "Caption";
// const article_details =
//   "Lorem ipsum dolor sit amet consectetur adipisicing elit.Cumque qui exercitationem, voluptatum eaque consequuntur hic corrupti tempore quidem maxime odit, amet nemo velit debitis provident magni dolor.Mollitia, esse rerum! Lorem ipsum dolor sit amet consectetur adipisicing elit.Repudiandae non natus enim earum delectus velit, sit id magnam sapiente quos cumque temporibus excepturi accusamus.Quia exercitationem tenetur maxime repellat magnam. Lorem ipsum dolor sit amet consectetur adipisicing elit.Fuga iusto ipsum atque, quia corporis reiciendis ea aspernatur laudantium qui ratione praesentium aperiam, placeat soluta debitis maiores, deserunt dolorum earum ipsam. Lorem ipsum dolor sit amet consectetur adipisicing elit.Aliquam, hic doloribus adipisci assumenda rerum error accusamus aspernatur at, ut consequatur voluptatum porro ? Corrupti suscipit in id dolorum odit fugit cum. Lorem ipsum dolor sit amet consectetur adipisicing elit.Cupiditate nobis excepturi dolores cumque quam minus velit tempora ullam.Architecto officiis ipsam temporibus ipsum amet fugiat omnis maxime eligendi placeat deserunt. Lorem ipsum dolor sit, amet consectetur adipisicing elit.Saepe, earum tempore modi, laborum corrupti nemo culpa reprehenderit laudantium vitae deserunt exercitationem eum omnis in commodi ? Sit nobis totam excepturi labore ? Lorem ipsum dolor sit amet consectetur adipisicing elit.Adipisci accusamus labore eos ipsam perspiciatis illo doloremque delectus sed, tempora in.Pariatur id dolorem laboriosam dolorum minus commodi sapiente, ipsum in?";
// const author_pfp = "";
// const author_name = "Craig Fidrigie";
// const author_active = 3;
// interface ArticleData {
//   article: string;
//   author: string;
//   caption: string;
//   description: string;
//   image: string;
//   likes : number;
//   publishdate: string;
//   title: string;
// }



export const Article = () => {

  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <Header onSearch={handleSearch}/>
      <MainContent searchQuery={searchQuery}
        // article_title={article_title}
        // article_desc={article_desc}
        // article_img={article_img}
        // article_caption={article_caption}
        // article_details={article_details}
        // author_pfp={author_pfp}
        // author_name={author_name}
        // author_active={author_active}
      />
      <Footer />
    </>
  );
};
