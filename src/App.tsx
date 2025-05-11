/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { EventDetails } from "./pages/EventDetails";
import { Home } from "./pages/Home";
import { Article } from "./pages/Article";
import "./App.css"; // Import CSS file
import { Spinner } from '@chakra-ui/react'
import getDocument from "./firebase/getData"
import { Onboarding } from "./pages/Onboarding";
import { Verifying } from "./pages/Verification";
import { SignUp } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { WriteArticle } from "./pages/WriteArticle";
import { ViewAllArticles } from "./pages/ViewAllArticles";
import { Admin } from "./pages/Admin";
import getUser from "./firebase/auth";
import { Profile } from "./pages/Profile";
import UserData from "./interfaces/userData";
import { ViewAllEvents } from "./pages/ViewAllEvents";
import { NavBar } from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import { Bookmarks } from "./pages/Bookmarks";
import Recruitment from "./interfaces/Recruiting";
import { NotFound } from "./components/common/NotFound";

export const UserContext = createContext<{
  [x: string]: any;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  userData: null,
  setUserData: () => { },
  userId: null,
  setUserId: () => { }
});

export const AppConfigContext = createContext<{
  appConfig: {
    contactEmail: string | null;
    headsCarouselSettings: any | null;
    recruitment: Recruitment;
    coverPhoto: string | null;
  };
}>({
  appConfig: {
    contactEmail: null,
    headsCarouselSettings: null,
    recruitment: {
      recruiting: false,
      formLink: ""
    },
    coverPhoto: null
  }
});
export const hideNavBarContext = createContext<{
  hideNavBar: boolean;
  setHideNavBar: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  hideNavBar: false,
  setHideNavBar: () => { }
});

function App() {

  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hideNavBar,setHideNavBar] = useState(false);
  const [appConfig, setAppConfig] = useState({
    contactEmail: null as string | null,
    headsCarouselSettings: null as any | null,
    recruitment: {
      recruiting: false,
      formLink: "",
    } as Recruitment,
    coverPhoto: null as string | null
  });

  const fetchUser = async () => {
    try {
      const user = await getUser();
      if (user) {
        const docRef = await getDocument("users", user.uid);
        if (!docRef.error && docRef.result) {
          setUserData(docRef.result.data()); // Update context
          setUserId(user.uid);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user or user data:", error);
      setLoading(false);
    }
  };

  const fetchAppConfig = async () => {
    try {
      const contactEmail = (await getDocument("adminSettings", "contactEmail"))
      const headsCarouselSettings = await getDocument("adminSettings", "headsCarouselSettings");
      const recruitment = await getDocument("adminSettings", "recruitment");
      const coverPhoto = await getDocument("adminSettings", "coverPhoto");
      setAppConfig({
        contactEmail: contactEmail.result?.data()?.email,
        headsCarouselSettings: headsCarouselSettings.result?.data(),
        recruitment: {
          recruiting: recruitment.result?.data()?.recruiting || false,
          formLink: recruitment.result?.data()?.formLink || ""
        },
        coverPhoto: coverPhoto.result?.data()?.link || null
      });
    } catch (error) {
      console.error("Error fetching app config:", error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchAppConfig();
  }, []);

  return loading ? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex " /></div> : (
    <UserContext.Provider value={{ userData, setUserData, userId, setUserId }}>
      <AppConfigContext.Provider value={{ appConfig }}>
        <hideNavBarContext.Provider value={{ hideNavBar, setHideNavBar }}>
        <NavBar hideNavBar={hideNavBar}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Dashboard />} />
          <Route path="/event/:name" element={<EventDetails />} />
          <Route path="/article/:name" element={<Article />} />
          <Route path="/write" element={<WriteArticle />} />
          <Route path="/onboard" element={<Onboarding />} />
          <Route path="/verify" element={<Verifying />} />
          <Route path="/Signup" element={<SignUp />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/Profile/:name" element={<Profile />} />
          <Route path="/articles" element={<ViewAllArticles />} />
          <Route path="/events" element={<ViewAllEvents />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        </hideNavBarContext.Provider>
      </AppConfigContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
