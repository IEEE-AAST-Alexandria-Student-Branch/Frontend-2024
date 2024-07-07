import { NavBar } from "../components/common/navbar.tsx";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Wrap,
  WrapItem,
  Input,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";
import addStorage from "../firebase/addStorage.js";
import getUser from "../firebase/auth.js";
import getDocument from "../firebase/getData.js";
import updateData from "../firebase/updateData.js";
import { delay } from "framer-motion";

export const Onboarding = () => {
  const [formData, setFormData] = useState({
    mobile: "",
    profilePicture: null
  });
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState(true);


  const fetchUser = async() => {
      console.log(getUser()?.uid)
      await getDocument("users", getUser()?.uid).then (  (res) => {
        if(res.result && !res.error)
          {
        setUserData(res.result?.data());
        setLoading(false);
      }})

  }

 const handleUploadAndEditData = async () => {
  const storedFormData = {
    mobile : formData.mobile,
    link : ""

  }
  await addStorage(formData.profilePicture, getUser()?.uid).then(res => {
    storedFormData.link = res.link;
  });
  await updateData("users", getUser()?.uid, storedFormData);
  window.open("/", "_self");
 }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePicture: file });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send data to server
    console.log(formData);
  };

  useEffect(() => {
    fetchUser();
  }, [])

  return loading? <div className="h-screen flex justify-center items-center"><Spinner size={"xl"} className="flex "/></div>  : (
    <div>
      <NavBar />
      <div className="flex flex-col justify-center p-16 h-screen">
        <div className="max-w-[600px] ">
          <h1 className="text-4xl sm:text-6xl pb-2">Hey, {userData.firstname}</h1>
          <p className="pt-4 pb-8 text-left   ">
            Welcome aboard... now you can finish setting up your profile <br />
            Or you can do it later from your profile tab ;)
          </p>
           <label htmlFor="profile-picture" className="cursor-pointer">
            <Avatar
              size="md"
              src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : "src/assets/add-profile-picture-white@2x.png"}
              borderRadius="full"
              boxShadow="md"
              cursor="pointer"
            />
            <Input
              type="file"
              id="profile-picture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              display="none" // Hide the file input visually
              position="absolute" // Position it absolutely to cover the avatar
              opacity={0} // Make it transparent
              zIndex={-1} // Move it behind the avatar
            />
          </label>
          <form onSubmit={handleSubmit}>
            <FormControl className="pt-4">
              <FormLabel>Mobile Number</FormLabel>
              <Input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />

              {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            </FormControl>
          </form>

          {/* <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="mobile">Mobile Number:</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
              />
            </div>
          </form> */}
          <div className="pt-8">
            {/* Button 1 navigates to '/page1' */}
            <Link to="/">
              <button className="bg-transparent py-2 px-4 w-28   border-2 border-white rounded-full">
                Later
              </button>
            </Link>
            {/* Button 2 navigates to '/page2' */}
            {/* <Link to="/home"> */}
              <button className="bg-white text-black text-sm font-bold py-2 px-8 w-36 border-2 border-white rounded-full m-2 " onClick={handleUploadAndEditData}>
                Finish
              </button>
            {/* </Link> */}
          </div>
          <div className="fixed bottom-0 w-80 h-auto right-0 p-4">
            <img src="src\assets\bg-triangle-ellipse@2x.png" alt="Triangle" />
          </div>
        </div>
      </div>
    </div>
  );
};
