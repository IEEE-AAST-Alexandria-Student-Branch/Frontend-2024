import { createContext, useContext, useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { EventDetails } from "./pages/EventDetails";
import { Home } from "./pages/Home";
import { Article } from "./pages/Article";
import "./App.css"; // Import CSS file
import { ChakraProvider, Spinner } from '@chakra-ui/react'
import theme from './theme'
import getDocument from "./firebase/getData"
import { MailDesign } from "./pages/MailDesign";
import { Onboarding } from "./pages/Onboarding";
import { Verifying } from "./pages/Verification";
import { SignUp } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import getUser from "./firebase/auth";
import { delay } from "framer-motion";
import { set } from "firebase/database";
import { getAuth } from "firebase/auth";
import { app } from "./firebase/config";

export const LangContext = createContext({
  lang: "English",
  setLang: (lang: string) => {}
});

export const UserContext = createContext({
  userData: null,
  setUserData: (data: any) => {},
});


function App() {
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem("lang");
    return savedLang || "en";
  });

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);



  const fetchUser = async () => {
    try {
      const user = await getUser();
      console.log(user);
      if (user) {
        const docRef = await getDocument("users", user.uid);
        if (!docRef.error && docRef.result) {
          setUserData(docRef.result.data());
        }
        setLoading(false);
        console.log(userData)
      } else { setLoading(false) }
    } catch (error) {
      console.error("Error fetching user or user data:", error);
    }
  };

  
  useEffect(() => {
    localStorage.setItem("lang", lang);
    // delay(fetchUser, 1000);
    fetchUser();
  }, [lang]);



  return loading? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex "/></div> : (
    <ChakraProvider disableGlobalStyle={true} theme={theme}>
      <LangContext.Provider value={{ lang, setLang }}>
        <UserContext.Provider value={{ userData, setUserData}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/event/:name" element={<EventDetails />} />
            <Route path="/article/:name" element={<Article />} />
            <Route path="/mailconfirm" element={<MailDesign />} />
            <Route path="/onboard" element={<Onboarding />} />
            <Route path="/verify" element={<Verifying />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/signin" element={<Signin />} />
          </Routes>

          <div
            className="fixed bottom-0 w-full h-20 flex items-center gap-5 p-5 z-50"
            style={{ backgroundColor: "#00091a", boxShadow: "0px -2px 7px black" }}
          >
            <span>Navigation:</span>
            <button
              className="defaultButton"
              onClick={() =>console.log(userData)
              }
            >
              Test API
            </button>
            <button className="defaultButton" onClick={() => window.open("/", "_self")}>
              Home
            </button>
            <button className="defaultButton" onClick={() => window.open("/home", "_self")}>
              Dashboard
            </button>
            <button
              className="defaultButton"
              onClick={() => window.open("/event/Leading Your Career", "_self")}
            >
              Event
            </button>
            <button className="defaultButton" onClick={() => window.open("/article/ArticleName", "_self")}>
              Article
            </button>
          </div>
        </UserContext.Provider>
      </LangContext.Provider>
    </ChakraProvider>
  );
}

export default App;
