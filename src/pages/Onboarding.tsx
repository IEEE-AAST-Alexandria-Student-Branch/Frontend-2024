import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Avatar,
  Input,
  FormControl,
  FormLabel,
  Spinner,
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
    await addStorage(formData.profilePicture, `profilepics/${user.uid}`).then(
      (res) => {
        storedFormData.imgurl = res.link;
      }
    );
    await updateData("users", user.uid, storedFormData);
    navigate("/")
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, profilePicture: file });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
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
        style={{
          backgroundImage: `url(${Triangle})`,
          backgroundSize: "20%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right bottom",
        }}
      >
        <div className="flex flex-col justify-center p-16 h-screen">
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
                  formData.profilePicture
                    ? URL.createObjectURL(formData.profilePicture)
                    : "src/assets/add-profile-picture-white@2x.png"
                }
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
              >
                Finish
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};