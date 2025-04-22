import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import getUser from "../firebase/auth";
import getDocument from "../firebase/getData";
import { Spinner } from "@chakra-ui/react";
import Triangle from "../assets/bg-triangle-ellipse@2x.png";
import LinkedIn from "../assets/linkedin-white.png";

export const MailDesign = () => {

  const [userData, setUserData] = useState<any>([])
  const [loading, setIsLoading] = useState(true);


  const fetchUser = async () => {
    const user = await getUser()
    if (user.uid) {
      await getDocument("users", user.uid).then(res => {
        if (res.result && !res.error) {
          setUserData(res.result?.data());
          setIsLoading(false);
        }
      })
    }
  };
  useEffect(() => {
    // delay(fetchUser,1000);
    fetchUser();
  }, []);

  return (loading
    ? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex " /></div>
    : <div className="flex flex-col justify-center items-center h-screen">
      <div className="max-w-[600px]">
        <h1 className="text-4xl sm:text-6xl">Hey, {userData?.firstname}</h1>
        <p className="pt-4 text-left">
          You’ve entered this email as your IEEE AAST account email address.{" "}
          <br />
          Now it’s time to make sure it’s really you.
          <br /> Just click the link below ;)
        </p>
        <Link to="/onboard">
          <button className="defaultButton mt-12">Yes, It’s Me</button>
        </Link>
        <p className="my-8">
          If you don’t know what this email is, you may have received it by
          mistake. Simply, ignore it.
        </p>
        <footer className="flex justify-between">
          <p className="footer_text">® IEEE AAST ALEX SB</p>
          <a href="https:www.linkedin.com/company/ieeeaast/">
            <img src={LinkedIn} id="linkedin" />
          </a>
          <img src={Triangle} id="twitter" />
        </footer>
      </div>
    </div>
  );
};
