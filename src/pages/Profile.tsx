import { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Input,
  FormControl,
  Text,
  Textarea,
  Avatar,
  FormErrorMessage,
  AlertIcon,
  Alert,
  Box,
  Slide,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Spinner,
  Center
} from "@chakra-ui/react";
import { UserContext } from "../App";
import getUser from "../firebase/auth";
import addStorage from "../firebase/addStorage";
import updateData from "../firebase/updateData";
import getDocument from "../firebase/getData";
import sendPasswordEmail from "../firebase/sendPasswordResetEmail.js";
import ArticleCard from "../components/Article/Card/ArticleCard.tsx"
import subscribeToCollection from "../firebase/subscribeToCollection.js";
import ArticleData from "../interfaces/ArticleData.tsx";
import { convertNewLinesToBRTags, convertBRTagsToNewLines, toggleFollow } from "../utils.ts";
import UserData from "../interfaces/userData.tsx";
import { SocialIcon } from "../components/common/SocialIcon.tsx";
import DOMPurify from "dompurify";
import {Social} from "../interfaces/userData.tsx";

const defaultAvatar = <svg viewBox="0 0 128 128" className="w-full h-full bg-[#A0AEC0] rounded-full" role="img" aria-label=" avatar"><path fill="currentColor" d="M103,102.1388 C93.094,111.92 79.3504,118 64.1638,118 C48.8056,118 34.9294,111.768 25,101.7892 L25,95.2 C25,86.8096 31.981,80 40.6,80 L87.4,80 C96.019,80 103,86.8096 103,95.2 L103,102.1388 Z"></path><path fill="currentColor" d="M63.9961647,24 C51.2938136,24 41,34.2938136 41,46.9961647 C41,59.7061864 51.2938136,70 63.9961647,70 C76.6985159,70 87,59.7061864 87,46.9961647 C87,34.2938136 76.6985159,24 63.9961647,24"></path></svg>;

interface currentUserData {
  mobile: string|null;
  firstname: string;
  lastname: string;
  desc: string;
  profilePicture: File | null | string;
  socials?: Social[];
}


export const Profile = () => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [mobileInvalid, setMobileInvalid] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedUserData, setSelectedUserData]= useState<UserData>();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [_edit] = useState<boolean>(false);
  const [self, setSelf] = useState<boolean>(false);
  const [articles, setArticles]= useState<ArticleData[]>();
  const { userData, setUserData, userId } = useContext(UserContext);
  const { name: id } = useParams<{ name: string }>();
  const mobileRegex = /^\+?[1-9]\d{10,14}$/;
  const location = useLocation();
  
  const purifyConfig = {
    ALLOWED_TAGS: ['br', 'strong', 'em', 'ul', 'ol', 'li'],
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  // Define currentUserData state
  const [currentUserData, setCurrentUserData] = useState<currentUserData>({
    mobile: "",
    firstname: "",
    lastname: "",
    desc: "",
    profilePicture: null,
    socials: []
  });
  const fetchCurrentUserEmail = async () => {
    try {
      const user = await getUser();
      if (user && user.email) {
        setUserEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching current user email:", error);
      return null;
    }
  };
  // Fetch user data and check if the `id` matches the logged-in user ID
  useEffect(() => {
    const fetchData = async () => {
      const { result } = await getDocument("users", id);
      if (result) {
        if (id === userId) {
          setSelf(true);
        }
        fetchCurrentUserEmail();
        setSelectedUserData(result.data() as UserData)
        
        setCurrentUserData({
          mobile: result.data()?.mobile || "",
          firstname: result.data()?.firstname || "",
          lastname: result.data()?.lastname || "",
          desc: result.data()?.desc || "",
          profilePicture: result.data()?.imgurl || null,
          socials: result.data()?.socials || []
        });
      }
      const unsubscribe = subscribeToCollection("articles", ({ result, ids, error }: { result: any, ids: string[], error: any }) => {
        if(error){
          console.error('error fetching articles: ',error);
          return;
        }
        if (result && ids) {
          const articlesWithIds = result.map((article: ArticleData, index: number) => ({
            ...article,
            id: ids[index],
          }));
          setArticles(articlesWithIds.filter((article: ArticleData) => {
            return id === article.author;
          }));
        }
      })
      return () => unsubscribe();
    };

    fetchData();
  }, [id, userData, userId]);

  useEffect(() => {
    if (userData && userId && selectedUserData) {
      setSelf(id === userId);
    }
  }, [userData, userId, selectedUserData]);

  // Force update when the location changes
  useEffect(() => {
    setCurrentUserData((prevState) => ({
      ...prevState,
      mobile: "",
      desc: "",
      profilePicture: null,
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
      roles: [],
      socials: []
    }));
  }, [location.pathname]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { id, value } = event.target;
    if (["Facebook", "Instagram", "LinkedIn"].includes(id)) {
      setCurrentUserData({
        ...currentUserData,
        socials: currentUserData.socials?.some(social => social.name === id)
          ? currentUserData.socials.map(social =>
              social.name === id ? { ...social, url: value } : social
            )
          : [...(currentUserData.socials || []), { name: id as "Facebook" | "Instagram" | "LinkedIn", url: value }]
      });
    } else {
      setCurrentUserData({
        ...currentUserData,
        [id]: value,
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setCurrentUserData({ ...currentUserData, profilePicture: file });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    resetError();
    const storedcurrentUserData = {
      mobile: currentUserData.mobile,
      imgurl: typeof currentUserData.profilePicture === "string" ? currentUserData.profilePicture : "",
      desc: convertNewLinesToBRTags(currentUserData.desc),
    };
    console.log(storedcurrentUserData);
    event.preventDefault();
    const user = await getUser();
    const { mobile, profilePicture } = currentUserData;

    if (profilePicture) {
      console.log(currentUserData.profilePicture);
      if (typeof profilePicture !== "string") {
        const res = await addStorage(currentUserData.profilePicture, `profilepics/${user.uid}`);
        storedcurrentUserData.imgurl = res.link;
      }
    }

    if (mobile !== "" && mobile !== userData!.mobile) {
      if (mobile === "") {
        storedcurrentUserData.mobile = null;
      } else if (mobile&&!mobileRegex.test(mobile)) {
        setShowError(true);
        setMobileInvalid(true);
        setErrorMessage("Invalid mobile number, Please enter a valid number");
        return;
      }
    }

    try {
      const filteredSocials = currentUserData.socials?.filter(social => social.url !== "");
      await updateData("users", user.uid, { ...storedcurrentUserData, socials: filteredSocials });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setTimeout(() => {
          navigate(0);
        }, 500);
      }, 1000);
    } catch (error) {
      console.error("Error updating user data:", error);
      setShowError(true);
      setErrorMessage("An error occurred while updating your profile.");
    }
  };

  const resetError = () => {
    setMobileInvalid(false);
    setShowError(false);
  };

  const goback = () => {
    navigate("/");
  };

  // Determine if Tabs should be displayed
  if(!currentUserData||!selectedUserData) return <Center h={'100vh'}><Spinner size='xl'/></Center>

  return (
    <div>
      <Slide direction="top" in={showSuccess} style={{ zIndex: 300 }}>
        <Alert status="success" variant="solid" zIndex={300}>
          <AlertIcon />
          {sendEmail?"Check your inbox for a password reset email!":"Data edited and uploaded successfully!"}
        </Alert>
      </Slide>
      <div className="pt-[100px] mx-8 md:mx-32 flex flex-col justify-center">
        <div className="bg-[url('https://img.freepik.com/free-vector/abstract-orange-background_698452-2541.jpg')] bg-cover bg-center mt-11 h-[100px] md:w-full md:h-[300px] rounded-3xl relative"></div>
        <div className=" ml-8 md:ml-16 -mt-14 md:-mt-20 z-0 relative mb-32 md:mb-44">
          {currentUserData.profilePicture ? (
            <img
              className="absolute z-10 w-24 h-24 md:w-40 md:h-40 rounded-full object-cover mb-7"
              src={
          typeof currentUserData.profilePicture === "string"
            ? `${currentUserData.profilePicture}`
            : URL.createObjectURL(currentUserData.profilePicture)
              }
              alt="Profile"
            />
          ) : (
            <div className="absolute z-10 w-24 h-24 md:w-40 md:h-40 rounded-full mb-7">
              {defaultAvatar}
            </div>
          )}
        </div>
        <Tabs size='sm' variant={'unstyled'}>
          <div className="flex  justify-between items-center flex-wrap">
            <div className="flex flex-col">
              <p className="text-2xl font-extrabold font-textmedium md:ml-16"> {currentUserData.firstname} {currentUserData.lastname}</p>
              <div className="flex gap-[10px] items-center font-extralight md:ml-16 mb-7 md:mb-0">
              <Text className="text-sm">{selectedUserData?.followers?.length || 0} Followers</Text>
              •︎
              <Text className="text-sm">{selectedUserData?.following?.users?.length || 0} Following</Text>
              <div className="flex gap-1">
                {selectedUserData?.socials?.map((social, index) => {
                  return (
                    <SocialIcon key={index} social={social} />
                  );
                })}
                </div>
              </div>
              </div>
              <div className="flex justify-center flex-wrap-reverse  w-full lg:justify-end ">
              <TabList>
                <Tab>About</Tab>
                <Tab>Articles</Tab>
                {/*<Tab>Contributions</Tab> disabled for now*/ }
                {/*self && <Tab>Settings</Tab>*/}
                {/*!self&&<button className="defaultButton my-auto">Follow</button>*/}
              </TabList>
              {self && <Tab>Settings</Tab>}
              {!self && 
                <button 
                  className="defaultButton my-auto"
                  onClick={() => {
                    if (userData && selectedUserData && id && userId) {
                      toggleFollow(selectedUserData, userData, id, userId, setSelectedUserData, setUserData)
                    }
                  }}
                >
                  {userId && 
                    selectedUserData?.followers.includes(userId)
                      ? "Unfollow"
                      : "Follow"
                  }
                </button>
              }
            </div>
          </div>

          <TabPanels>
            {/*<TabPanel> disabled for now
              <Box>
              <p>Contributions</p>
              </Box>
            </TabPanel>*/}
            <TabPanel>
              <div className={"font-body mb-4"} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentUserData.desc ?? "",purifyConfig) }}></div>
            </TabPanel>
            <TabPanel>
              <Box>
                <div className="flex flex-col gap-8 mt-[40px]">{articles?.map((article: ArticleData, index: number)=> {
                  return <ArticleCard key={index} article={article}/>
                })}</div>
              </Box>
            </TabPanel>
            {self && 
            <TabPanel>
              <div className="form-container">
                <div className="h-fit">
                  <div className="max-w-[600px]">
                    <Text fontFamily={"SF-Pro-Display-Bold"} fontSize={23} mb={4}>Edit Profile</Text>
                    <form onSubmit={ handleSubmit }>
                      <Text fontFamily={"SF-Pro-Display-Bold"} mb={4}>Change your Profile Picture:</Text>
                      <FormControl isInvalid={showError && mobileInvalid}>
                        <label htmlFor="profile-picture">
                          <Avatar
                            size="xl"
                            src={
                              currentUserData.profilePicture
                                ? typeof currentUserData.profilePicture === "string"
                                  ? `${currentUserData.profilePicture}`
                                  : URL.createObjectURL(currentUserData.profilePicture)
                                : "src/assets/add-profile-picture-white@2x.png"
                            }
                            borderRadius="full"
                            boxShadow="lg"
                            cursor="pointer"
                            mb={8}
                          />
                          <Input
                            type="file"
                            id="profile-picture"
                            name="profilePicture"
                            accept="image/*"
                            onChange={handleFileChange}
                            display="none"
                            position="absolute"
                            opacity={0}
                            zIndex={-1}
                          />
                        </label>
                      </FormControl>

                      <Text fontFamily={"SF-Pro-Display-Bold"}>Change your mobile number:</Text>
                      <FormControl isInvalid={showError && mobileInvalid}>
                        <Input
                          type="tel"
                          id="mobile"
                          value={currentUserData.mobile||""}
                          name="phoneNumber"
                          onChange={handleChange}
                          placeholder="Mobile Number"
                          mb={4}
                          style={{
                            width: '80%',
                            border: 'none',
                            borderBottom: '1px solid rgb(4, 4, 62)',
                            outline: 'none',
                          }}
                        />
                        <FormErrorMessage mb={4} fontFamily={"SF-Pro-Text-Medium"}>
                          {errorMessage}
                        </FormErrorMessage>
                      </FormControl>

                      <Text fontFamily={'SF-Pro-Display-Bold'} mb={2}>Description: </Text>
                      <FormControl mb={10}>
                        <Textarea
                        className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 h-[200px] md:h-[300px] box-border resize-y"
                          id="desc"
                          resize={"none"}
                          name="Description"
                          value={convertBRTagsToNewLines(currentUserData.desc)}
                          onChange={handleChange}
                          placeholder="Describe yourself"
                          boxSizing="border-box"
                          flexWrap={"wrap"}
                          flex={"flexbox"}
                        />
                      </FormControl>
                        <Text fontFamily={'SF-Pro-Display-Bold'} my={4}>Social Media Links: </Text>
                        <FormControl mb={4} isInvalid={showError && !currentUserData.socials?.every(social => social.url === "" || isValidUrl(social.url))}>
                          <Input
                            type="url"
                            id="Facebook"
                            name="Facebook"
                            value={currentUserData.socials?.find(social => social.name === "Facebook")?.url || ""}
                            onChange={handleChange}
                            placeholder="Facebook URL"
                            mb={4}
                            style={{
                              width: '80%',
                              border: 'none',
                              borderBottom: '1px solid rgb(4, 4, 62)',
                              outline: 'none',
                            }}
                          />
                          <Input
                            type="url"
                            id="Instagram"
                            name="Instagram"
                            value={currentUserData.socials?.find(social => social.name === "Instagram")?.url || ""}
                            onChange={handleChange}
                            placeholder="Instagram URL"
                            mb={4}
                            style={{
                              width: '80%',
                              border: 'none',
                              borderBottom: '1px solid rgb(4, 4, 62)',
                              outline: 'none',
                            }}
                          />
                          <Input
                            type="url"
                            id="LinkedIn"
                            name="LinkedIn"
                            value={currentUserData.socials?.find(social => social.name === "LinkedIn")?.url || ""}
                            onChange={handleChange}
                            placeholder="LinkedIn URL"
                            mb={4}
                            style={{
                              width: '80%',
                              border: 'none',
                              borderBottom: '1px solid rgb(4, 4, 62)',
                              outline: 'none',
                            }}
                          />
                          <FormErrorMessage mb={4} fontFamily={"SF-Pro-Text-Medium"}>
                            {errorMessage}
                          </FormErrorMessage>
                        </FormControl>
                        <Text fontFamily={'SF-Pro-Display-Bold'} my={4}>Change Password: </Text>
                        <FormControl mb={4}>
                          <button
                            className="defaultButton"
                            type="button"
                            style={{
                              fontSize: '16px',
                              fontFamily: 'SF-Pro-Display-Bold',
                              width: '155px',
                              height: '35px',
                            }}
                            onClick={async () => {
                              try {
                                await sendPasswordEmail(userEmail);
                                setSendEmail(true);
                                setShowSuccess(true);
                                setTimeout(() => {
                                  setShowSuccess(false);
                                  setSendEmail(false);
                                }, 3000);
                              } catch (error) {
                                console.error("Error sending password reset email:", error);
                                setShowError(true);
                                setErrorMessage("An error occurred while sending the password reset email.");
                              }
                            }}
                          >
                            Change Password
                          </button>
                        </FormControl>

                      <div className="flex flex-nowrap">
                        <div className="pt-8 flex flex-nowrap items-center gap-4 flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <button
                              style={{
                                background: 'transparent',
                                padding: '8px',
                                width: '120px',
                                fontSize: '16px',
                                border: '2px solid #fff',
                                borderRadius: '20px',
                                color: '#fff',
                                textAlign: 'center',
                                fontFamily: 'SF-Pro-Display-Bold',
                              }}
                              onClick={goback}
                            >
                              Cancel
                            </button>
                            <button
                              className="defaultButton ml-2"
                              style={{
                              fontSize: '16px',
                              fontFamily: 'SF-Pro-Display-Bold',
                              width: '155px',
                              height: '35px',
                              }}
                              disabled={
                              currentUserData.mobile === selectedUserData?.mobile &&
                              currentUserData.desc === selectedUserData?.desc &&
                              currentUserData.profilePicture === selectedUserData?.imgurl &&
                              JSON.stringify(currentUserData.socials) === JSON.stringify(selectedUserData?.socials)
                              }
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              
            </TabPanel>
            }
          </TabPanels>
        </Tabs>
      </div>
      <div className=" w-full flex justify-center h-fit"></div>
    </div>
  );
};
