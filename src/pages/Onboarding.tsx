import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Avatar,
  Input,
  FormControl,
  FormLabel,
  Spinner,
  FormErrorMessage,
} from "@chakra-ui/react";
import addStorage from "../firebase/addStorage.js";
import getUser from "../firebase/auth.js";
import getDocument from "../firebase/getData.js";
import updateData from "../firebase/updateData.js";
import Triangle from "../assets/bg-triangle-ellipse@2x.png";

export const Onboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    mobile: string;
    profilePicture: File | null;
  }>({
    mobile: "",
    profilePicture: null,
  });
  const [userData, setUserData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileInvalid, setIsMobileInvalid] = useState(false);

  const fetchUser = async () => {
    const user = await getUser();
    await getDocument("users", user.uid).then((res) => {
      if (res.result && !res.error) {
        setUserData(res.result?.data());
        setLoading(false);
      }
    });
  };

  const handleUploadAndEditData = async () => {
    const storedFormData = {
      mobile: formData.mobile,
      imgurl: "",
    };

    const user = await getUser();

    // Only upload the profile picture if it is selected
    if (formData.profilePicture) {
      await addStorage(formData.profilePicture, `profilepics/${user.uid}`).then(
        (res) => {
          if (res.error) {
            console.error("Error uploading file:", res.error);
            return;
          }
          storedFormData.imgurl = res.link;
        }
      );
    }

    await updateData("users", user.uid, storedFormData);
    navigate("/");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file && file.size > 2 * 1024 * 1024) { // 2MB in bytes
      window.alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }
    if (file && !["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
      window.alert("Please upload a valid image file (PNG, JPG, or GIF).");
      return;
    }

    setFormData({ ...formData, profilePicture: file });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate mobile number
    if (name === "mobile") {
      const mobileRegex = /^(?:\+([0-9]{1,3}))?[0-9]{10,12}$/;
      setIsMobileInvalid(!mobileRegex.test(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return loading ? (
    <div className="h-screen flex justify-center items-center">
      <Spinner size={"xl"} className="flex " />
    </div>
  ) : (
    <div>
      <div
        className="h-screen w-[1vh] absolute left-0"
        style={{
          backgroundImage: "linear-gradient(to bottom, #1F396E, #1D0021)",
        }}
      ></div>
      <div
        className="form-container relative z-10"
      >
        <div className="flex flex-col justify-center p-16 h-screen relative z-20">
          <div className="max-w-[600px]">
            <h1 className="text-4xl sm:text-6xl pb-2">Hey, {userData.firstname}</h1>
            <p className="pt-4 pb-8 text-left">
              Welcome aboard... now you can finish setting up your profile <br />
              Or you can do it later from your profile tab ;)
            </p>
            <label htmlFor="profile-picture" className="cursor-pointer">
              <Avatar
                size="md"
                src={
                  formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : ""
                }
                name={`${userData.firstname} ${userData.lastname}`}
                key={`${userData.firstname} ${userData.lastname}`}
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
                display="none"
              />
            </label>
            <form onSubmit={handleSubmit}>
              <FormControl className="pt-4" isInvalid={isMobileInvalid}>
                <FormLabel>Mobile Number</FormLabel>
                <Input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  style={{backgroundColor: "#000B21"}}
                />
                {isMobileInvalid && (
                  <FormErrorMessage>
                    Please enter a valid mobile number (e.g., +123456789012).
                  </FormErrorMessage>
                )}
              </FormControl>
            </form>
            <div className="pt-8">
              <Link to="/">
                <button className="bg-transparent py-2 px-4 w-28 border-2 border-white rounded-full">
                  Later
                </button>
              </Link>
              <button
                className="bg-white text-black text-sm font-bold py-2 px-8 w-36 border-2 border-white rounded-full m-2"
                onClick={handleUploadAndEditData}
                disabled={isMobileInvalid}
              >
                Finish
              </button>
            </div>
          </div>
        </div>
        <div className="fixed -bottom-4 right-0 w-80 h-auto z-0">
            <img src={Triangle} alt="Triangle" />
          </div>
      </div>
    </div>
  );
};