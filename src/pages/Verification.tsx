import { NavBar } from "../components/common/navbar.tsx";
import { Link } from "react-router-dom";
import sendVerifyEmail from "../firebase/sendVerificationEmail.js";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/config.js";
import signIn from "../firebase/signin.js";
import { Spinner } from "@chakra-ui/react";



export const Verifying = () => {
  
  const [loading, isLoading] = useState(true);
  const auth = getAuth(app)
  const checkVerification = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.emailVerified) {
          window.open("/mailconfirm", "_self"); // Redirect to "/mail2" route
        } else {
          sendVerifyEmail();
          isLoading(false);
        }
      } else {
        alert("User is not authenticated.");
      }
    });
  }
  useEffect(() => {
    checkVerification()
    }, []);

    const reloadPage = () => {
      if(auth.currentUser)
      window.location.reload();
    }


  

  
  return  loading? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex "/></div> :  (
    <div>
      <NavBar />
      <div className="flex flex-col justify-center p-16 h-screen">
        <div className="max-w-[600px] ">
          <h1 className="text-4xl sm:text-6xl pb-2">Please check your email</h1>
          <p className="pt-4 text-left ">We sent you a verification email with a link. Please click it to verify your email.</p>
          <p className="pb-4 text-left ">Once you've clicked it, click the "Finish" button.</p>
          <p className="pb-8 text-left text-[10pt] text-gray-500">If you can't find it, try checking your spam folder.</p>
          <div className="fixed bottom-0 w-80 h-auto right-0 p-4">
            <img src="src\assets\bg-triangle-ellipse@2x.png" alt="Triangle" />
          </div>
          {/* <Link to="/onboard"> */}
            <button className="bg-white text-black text-sm font-bold py-2 px-4 w-36 border-2 border-white rounded-full m-2 " onClick={reloadPage}>
              Finish
            </button>
          {/* </Link> */}
        </div>
      </div>
    </div>
  );
};
