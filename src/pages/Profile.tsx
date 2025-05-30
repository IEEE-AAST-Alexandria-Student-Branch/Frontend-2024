import { useState, ChangeEvent, FormEvent, useContext, useEffect } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { MdErrorOutline } from "react-icons/md";
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
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure, // Import Chakra UI's useDisclosure
  ModalFooter,
  Button
} from "@chakra-ui/react";
import { UserContext } from "../App";
import getUser from "../firebase/auth";
import addStorage from "../firebase/addStorage";
import updateData from "../firebase/updateData";
import getDocument from "../firebase/getData";
import getDocumentsById from "../firebase/getDocumentsById";
import sendPasswordEmail from "../firebase/sendPasswordResetEmail.js";
import ArticleCard from "../components/Article/Card/ArticleCard.tsx"
import subscribeToCollection from "../firebase/subscribeToCollection.js";
import {getUserAuthMethods} from "../firebase/getUserAuthMethods.js"
import ArticleData from "../interfaces/ArticleData.tsx";
import { convertNewLinesToBRTags, convertBRTagsToNewLines } from "../utils.ts";
import UserData from "../interfaces/userData.tsx";
import { SocialIcon } from "../components/common/SocialIcon.tsx";
import DOMPurify from "dompurify";
import {Social} from "../interfaces/userData.tsx";
import { FollowButton } from "../components/common/FollowButton.tsx";
import { HoverIcon } from "../components/common/HoverIcon.tsx";
import IEEELogoSmall from "../assets/ieeesmall.png";
import Admin from "../assets/admin.png";

interface currentUserData {
  mobile: string|null;
  firstname: string;
  lastname: string;
  desc: string;
  profilePicture: File | null | string;
  socials?: Social[];
}
interface IdUserData{
  id: string;
  data: UserData;
}

export const Profile = () => {
  const { isOpen: isCoverPhotoModalOpen, onOpen: onOpenCoverPhotoModal, onClose: onCloseCoverPhotoModal } = useDisclosure(); // Manage cover photo modal state
  const { isOpen: isProfilePictureModalOpen, onOpen: onOpenProfilePictureModal, onClose: onCloseProfilePictureModal } = useDisclosure(); // Manage profile picture modal state
  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null); // State for the selected file
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false); // State for upload status
  const [userEmail, setUserEmail] = useState<string>("");
  const [mobileInvalid, setMobileInvalid] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedUserData, setSelectedUserData]= useState<UserData>();
  const [showFollowersModal, setShowFollowersModal] = useState<boolean>(false);
  const [showFollowingModal, setShowFollowingModal] = useState<boolean>(false);
  const [authMethods, setAuthMethods] = useState<any>(null);
  const [showSizeError, setShowSizeError] = useState<boolean>(false);
  const [uploadingProfilePicture, setUploadingProfilePicture] = useState(false); // New state for profile picture upload
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [_edit] = useState<boolean>(false);
  const [self, setSelf] = useState<boolean>(false);
  const [articles, setArticles]= useState<ArticleData[]>();
  const { userData, setUserData, userId } = useContext(UserContext);
  const { name: id } = useParams<{ name: string }>();
  const mobileRegex = /^(?:\+([0-9]{1,3}))?[0-9]{10,12}$/;
  const defaultCover = "https://img.freepik.com/free-vector/abstract-orange-background_698452-2541.jpg"
  const location = useLocation();
  
  const purifyConfig = {
    ALLOWED_TAGS: ['br', 'strong', 'em', 'ul', 'ol', 'li'],
  };

  const getUsers = async (ids: string[]) => {
    const users = await getDocumentsById("users", ids);
    return users.documents
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

  const [followers, setFollowers] = useState<IdUserData[]>();
  const [following, setFollowing] = useState<IdUserData[]>();

  const setTargetFollowers = (
    listSetter: React.Dispatch<React.SetStateAction<IdUserData[] | undefined>>,
    userId: string,
    newFollowers: string[]
  ) => {
    listSetter((prevList) => {
      if (!prevList) return prevList;
      return prevList.map((user) =>
        user.id === userId
          ? { ...user, data: { ...user.data, followers: newFollowers } }
          : user
      );
    });
  };

  const setCurrentFollowing = (
    setUserData: React.Dispatch<React.SetStateAction<UserData | null>>,
    newFollowing: { users: string[] }
  ) => {
    setUserData((prevUserData) => {
          if (!prevUserData) return null;
          return {
            ...prevUserData,
            following: {
              ...newFollowing,
              events: prevUserData.following?.events || [],
            },
          };
        });
  };


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

  useEffect(()=>{
    setAuthMethods(getUserAuthMethods())
  },[])

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    resetError();
    event.preventDefault();

    // Validate social media links
    if (!validateSocialMediaLinks(currentUserData.socials)) {
      setShowError(true);
      setErrorMessage("One or more social media links are invalid.");

      return;
    }

    const storedcurrentUserData = {
      mobile: currentUserData.mobile,
      imgurl: typeof currentUserData.profilePicture === "string" ? currentUserData.profilePicture : "",
      desc: convertNewLinesToBRTags(currentUserData.desc),
    };

    const user = await getUser();
    const { mobile, profilePicture } = currentUserData;

    if (profilePicture) {
      if (typeof profilePicture !== "string") {
        const res = await addStorage(currentUserData.profilePicture, `profilepics/${user.uid}`);
        storedcurrentUserData.imgurl = res.link;
      }
    }

    if (mobile !== "" && mobile !== userData!.mobile) {
      if (mobile === "") {
        storedcurrentUserData.mobile = null;
      } else if (mobile && !mobileRegex.test(mobile)) {
        setShowError(true);
        setMobileInvalid(true);
        setErrorMessage("Invalid mobile number, Please enter a valid number");
        return;
      }
    }

    try {
      const filteredSocials = currentUserData.socials?.filter((social) => social.url !== "");
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

  const handleCoverPhotoChange = async () => {
    if (!coverPhotoFile) return;

    setUploadingCoverPhoto(true);

    try {
      const user = await getUser();
      const res = await addStorage(coverPhotoFile, `coverphotos/${user.uid}`);
      if (res.error) {
        console.error("Error uploading cover photo:", res.error);
        return;
      }

      // Update the user's cover photo in the database
      await updateData("users", user.uid, { coverPhoto: res.link });

      // Update the UI with the new cover photo
      setSelectedUserData((prev) => ({
        ...prev!,
        coverPhoto: res.link,
      }));

      onCloseCoverPhotoModal(); // Close the modal
    } catch (error) {
      console.error("Error updating cover photo:", error);
    } finally {
      setUploadingCoverPhoto(false);
    }
  };

  const handleProfilePictureUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetError();

    if (!currentUserData.profilePicture) {
      setErrorMessage("Please select a profile picture to upload.");
      setShowError(true);
      return;
    }

    setUploadingProfilePicture(true); // Start loading state

    try {
      const user = await getUser();

      if (typeof currentUserData.profilePicture !== "string") {
        const res = await addStorage(
          currentUserData.profilePicture,
          `profilepics/${user.uid}`
        );
        if (res.error) {
          throw new Error(res.error);
        }
        await updateData("users", user.uid, { imgurl: res.link });
        setCurrentUserData((prev) => ({
          ...prev,
          profilePicture: res.link,
        }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setErrorMessage("An error occurred while uploading the profile picture.");
      setShowError(true);
    } finally {
      setUploadingProfilePicture(false); // End loading state
    }
  };

  // Determine if Tabs should be displayed
  if(!currentUserData||!selectedUserData) return <Center h={'100vh'}><Spinner size='xl'/></Center>

  return (
    <div className="overflow-x-hidden">
      <Slide direction="top" in={showSuccess} style={{ zIndex: 300 }}>
        <Alert status="success" variant="solid" zIndex={300}>
          <AlertIcon />
          {sendEmail?"Check your inbox for a password reset email!":"Data edited and uploaded successfully!"}
        </Alert>
      </Slide>
      <div className="pt-[100px] mx-8 md:mx-32 flex flex-col justify-center">
        <div
          className="bg-cover bg-center mt-6 md:mt-11 h-[200px] -left-[10%] w-[120%] md:left-0 md:w-full md:h-[300px] md:rounded-3xl relative flex items-start justify-end p-2"
          style={{
            backgroundImage: `url(${selectedUserData?.coverPhoto || defaultCover})`,
          }}
        >
          {self && (
            <button
              className="rounded-full p-1 bg-[rgba(0,0,0,0.5)] hover:bg-[rgba(0,0,0,0.7)] transition-opacity duration-300 opacity-80 hover:opacity-100"
              onClick={onOpenCoverPhotoModal} // Open the cover photo modal
            >
              <AiFillEdit color="white" className="w-6 h-6 md:w-10 md:h-10" />
            </button>
          )}
        </div>

        {self&&
        <Modal isOpen={isCoverPhotoModalOpen} onClose={onCloseCoverPhotoModal} isCentered size={"xl"}>
          <ModalOverlay />
          <ModalContent backgroundColor={"#151F33"}>
            <ModalHeader fontSize={"2xl"}>Change Cover Photo</ModalHeader>
            {!(currentUserData.profilePicture instanceof File) && <>
            <Text fontSize="sm" textAlign={"center"} color="gray.500" mb={2}>
              Please use a landscape image for best results.<br></br>
              Max file size is 2MB.
            </Text>
            </>}
            <ModalCloseButton />
            <ModalBody>
                <FormControl className="flex flex-col items-center w-full">
                {coverPhotoFile && (
                  <img
                  className={`w-full mb-4`}
                  src={URL.createObjectURL(coverPhotoFile)}
                  alt="Selected Cover Photo Preview"
                  />)}
                    <Text fontSize="sm" color="gray.500" mb={2}>
                    {coverPhotoFile ? coverPhotoFile.name : "No image selected"}
                    </Text>
                <label htmlFor="cover-photo-upload" className="w-full">
                  <Button
                  as="span"
                  colorScheme="blue"
                  size="sm"
                  w={"full"}
                  mb={4}
                  cursor="pointer"
                  _hover={{ bg: "blue.600" }}
                  >
                  Choose File
                  </Button>
                </label>
                
                <Input
                  id="cover-photo-upload"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={(e) => {
                    const file = e.target.files ? e.target.files[0] : null;
                    if (file && !["image/png", "image/jpeg", "image/gif"].includes(file.type)) {
                      window.alert("Please upload a valid image file (PNG, JPG, or GIF).");
                      return;
                    }
                  if (e.target.files && e.target.files.length > 0) {
                    if (e.target.files[0].size > 2 * 1024 * 1024) { // 2MB limit
                    setCoverPhotoFile(null);
                    setShowSizeError(true);
                    e.target.value = "";
                    } else {
                    setCoverPhotoFile(e.target.files ? e.target.files[0] : null);
                    setShowSizeError(false);
                    }
                  }
                  }}
                />
                {showSizeError && (
                  <div className="flex gap-1 items-center">
                  <MdErrorOutline color={"#c53030"} size={25} />
                  <Text color={"#c53030"} fontWeight={"bold"}>
                    That image exceeds the 2MB size limit.
                  </Text>
                  </div>
                )}
                </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={handleCoverPhotoChange}
                isLoading={uploadingCoverPhoto} // Show loading state
                loadingText="Uploading"
                disabled={!coverPhotoFile || uploadingCoverPhoto} // Disable button if no file is selected
              >
                Upload
              </Button>
              <Button colorScheme="red" onClick={onCloseCoverPhotoModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>}
        <div className="md:ml-16 -mt-14 md:-mt-20 z-0 relative group w-24 h-24 md:w-40 md:h-40">
          <Avatar
            className={`absolute z-10 w-full h-full rounded-full object-cover mb-4 transition-transform duration-300 ${self&&"group-hover:scale-110"}`}
            src={
              typeof currentUserData?.profilePicture === "string"
          ? currentUserData.profilePicture
          : selectedUserData?.imgurl || undefined
            }
            name={`${currentUserData.firstname} ${currentUserData.lastname}`}
            key={`${currentUserData.firstname} ${currentUserData.lastname}`}
            size={{ md: "2xl", base: "xl" }}
          />
          {self && (
            <div
            onClick={onOpenProfilePictureModal} // Open the profile picture modal
            className="z-20 rounded-full w-24 h-24 md:w-32 md:h-32 absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 cursor-pointer">
              <AiFillEdit color="white" className="w-5 h-5 md:w-7 md:h-7" />
          <p className="font-bold select-none text-xs md:text-base">EDIT</p>
            </div>
          )}
        </div>{self &&
        <Modal isOpen={isProfilePictureModalOpen} onClose={onCloseProfilePictureModal} isCentered size={"xl"}>
          <ModalOverlay />
          <ModalContent backgroundColor={"#151F33"}>
            <ModalHeader fontSize={"2xl"}>Change Profile Picture</ModalHeader>
            {!(currentUserData.profilePicture instanceof File) && <>
            <Text fontSize="sm" textAlign={"center"} color="gray.500" mb={2}>
              Max file size is 2MB.
            </Text>
            </>}
            <ModalCloseButton />
            <ModalBody>
              <FormControl className="flex flex-col items-center w-full">
                {typeof currentUserData.profilePicture !== "string" && currentUserData.profilePicture && (
                  <img
                  className="mx-auto mb-4 w-full"
                  src={URL.createObjectURL(currentUserData.profilePicture)}
                  alt="Profile Preview"
                  />
                )}
                <Text fontSize="sm" color="gray.500" mb={2}>
                    {currentUserData.profilePicture instanceof File ? currentUserData.profilePicture.name : "No image selected"}
                    </Text>
                <label htmlFor="profile-picture-upload" className="w-full">
                  <Button
                    as="span"
                    colorScheme="blue"
                    size="sm"
                    w={"full"}
                    mb={4}
                    cursor="pointer"
                    _hover={{ bg: "blue.600" }}
                  >
                    Choose File
                  </Button>
                </label>
                <Input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  display="none"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      if (e.target.files[0].size > 2 * 1024 * 1024) {
                        // 2MB limit
                        setCurrentUserData({ ...currentUserData, profilePicture: null });
                        setShowSizeError(true);
                        e.target.value = "";
                      } else {
                        setCurrentUserData({
                          ...currentUserData,
                          profilePicture: e.target.files[0],
                        });
                        setShowSizeError(false);
                      }
                    }
                  }}
                />
                {showSizeError && (
                  <div className="flex gap-1 items-center">
                    <MdErrorOutline color={"#c53030"} size={25} />
                    <Text color={"#c53030"} fontWeight={"bold"}>
                      That image exceeds the 2MB size limit.
                    </Text>
                  </div>
                )}
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={(e) => {
                  e.preventDefault();
                  handleProfilePictureUpload(e as unknown as FormEvent<HTMLFormElement>);
                }}
                isLoading={uploadingProfilePicture} // Show loading state
                loadingText="Uploading"
                disabled={!(currentUserData.profilePicture instanceof File) || uploadingProfilePicture} // Disable button if no file is selected
              >
                Upload
              </Button>
              <Button colorScheme="red" onClick={onCloseProfilePictureModal}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>}

        <Tabs size='sm' variant={'unstyled'}>
          <div className="flex  justify-between items-center flex-wrap">
            
            <div className="flex flex-col">
              <div className="flex gap-2 items-center"><p className="text-2xl font-extrabold font-textmedium md:ml-4"> {currentUserData.firstname} {currentUserData.lastname}</p>
              {selectedUserData.roles?.includes("admin") && <HoverIcon src={Admin} alt="Site Admin" hoverText="This user is a website admin!" />}
              {selectedUserData.roles?.includes("volunteer") && <HoverIcon src={IEEELogoSmall} alt="Site Admin" hoverText="This user is an IEEE AAST volunteer!"/>}
              </div>
              <div className="flex gap-[10px] items-center font-extralight md:ml-4 mb-7 md:mb-0">
              <Text className="text-sm cursor-pointer" onClick={async () => {
                if (selectedUserData.followers.length > 0) {
                  const users = await getUsers(selectedUserData?.followers);
                  setFollowers(users);
                }
                setShowFollowersModal(true);
              }}>{selectedUserData?.followers?.length || 0} {selectedUserData?.followers.length===1 ?"Follower":"Followers"}</Text>
              •︎
              <Text className="text-sm cursor-pointer" onClick={
                async () => {
                  if (selectedUserData.following.users.length > 0) {
                  const users = await getUsers(selectedUserData?.following.users);
                  setFollowing(users);
                  }
                  setShowFollowingModal(true);}
              }>{selectedUserData?.following?.users?.length || 0} Following</Text>
              <div className="flex gap-1">
                {selectedUserData?.socials?.map((social, index) => {
                  return (
                    <SocialIcon key={index} social={social} />
                  );
                })}
                </div>
              </div>
              </div>
              <TabList className="mx-auto sm:mx-0">
                <Tab>About</Tab>
                <Tab>Articles</Tab>
                {/*<Tab>Contributions</Tab> disabled for now*/ }
                {/*self && <Tab>Settings</Tab>*/}
                {/*!self&&<button className="defaultButton my-auto">Follow</button>*/}
                {self && <Tab>Settings</Tab>}
                {(!self&&id&&userId) && 
                <FollowButton
                targetUserData={selectedUserData}
                currentUserData={userData}
                targetUserId={id}
                currentUserId={userId}
                setTargetFollowers={(userId, updatedFollowers) =>
                  setTargetFollowers(setFollowers, userId, updatedFollowers)
                }
                setCurrentFollowing={(userId, updatedFollowing) =>
                {
                  userId;
                  setCurrentFollowing(setUserData, { users: updatedFollowing })
                }
                }
                className="my-auto"
              />
              }
              </TabList>
              

              <div className="flex justify-center flex-wrap-reverse  w-full lg:justify-end ">
              
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
                      <Text fontFamily={"SF-Pro-Display-Bold"}>Change your mobile number (This is private):</Text>
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

                        <Text fontFamily={'SF-Pro-Display-Bold'} my={4}>Social Media Links: </Text>
                        <FormControl
                          mb={4}
                          isInvalid={
                            showError &&
                            !validateSocialMediaLinks(currentUserData.socials)
                          }
                        >
                          <Input
                            type="url"
                            id="Facebook"
                            name="Facebook"
                            value={currentUserData.socials?.find((social) => social.name === "Facebook")?.url || ""}
                            onChange={handleChange}
                            placeholder="Facebook URL"
                            mb={4}
                            style={{
                              width: "80%",
                              border: "none",
                              borderBottom: "1px solid rgb(4, 4, 62)",
                              outline: "none",
                            }}
                          />
                          <Input
                            type="url"
                            id="Instagram"
                            name="Instagram"
                            value={currentUserData.socials?.find((social) => social.name === "Instagram")?.url || ""}
                            onChange={handleChange}
                            placeholder="Instagram URL"
                            mb={4}
                            style={{
                              width: "80%",
                              border: "none",
                              borderBottom: "1px solid rgb(4, 4, 62)",
                              outline: "none",
                            }}
                          />
                          <Input
                            type="url"
                            id="LinkedIn"
                            name="LinkedIn"
                            value={currentUserData.socials?.find((social) => social.name === "LinkedIn")?.url || ""}
                            onChange={handleChange}
                            placeholder="LinkedIn URL"
                            mb={4}
                            style={{
                              width: "80%",
                              border: "none",
                              borderBottom: "1px solid rgb(4, 4, 62)",
                              outline: "none",
                            }}
                          />
                          <FormErrorMessage mb={4} fontFamily={"SF-Pro-Text-Medium"}>
                            {errorMessage}
                          </FormErrorMessage>
                        </FormControl>
                        {!(authMethods.length === 1 && authMethods.includes("google.com")) && <><Text fontFamily={'SF-Pro-Display-Bold'} my={4}>Change Password: </Text>
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
                        </FormControl></>}

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
      <Modal isOpen={showFollowersModal} onClose={() => setShowFollowersModal(false)} isCentered size={"xl"}>
        <ModalOverlay />
          <ModalContent backgroundColor={"#151F33"}>
        <ModalHeader fontSize={"2xl"}>Followers</ModalHeader>
        <ModalCloseButton />
        <ModalBody minHeight="200px" className="flex flex-col gap-4 items-center customScrollbar" maxHeight={"70vh"} overflowY="auto">
          
            {showFollowersModal && selectedUserData?.followers && selectedUserData.followers.length > 0 ?(
          
            followers?.map((user, index) => (
                <div
                key={index}
                className="flex gap-4 items-center justify-between hover:bg-[#223457] p-2 rounded-xl transition-colors duration-200 w-full cursor-pointer"
                >
                <Link
                  className="flex gap-4 items-center"
                  to={`/profile/${user.id}`}
                  onClick={() => setShowFollowersModal(false)}
                >
                  <Avatar size="md" src={user.data.imgurl} name={`${user.data.firstname} ${user.data.lastname}`} key={`${user.data.firstname} ${user.data.lastname}`} />
                  <p>{user.data.firstname} {user.data.lastname}</p>
                </Link>
                {(id && userId && user.id !== userId) && 

                <FollowButton
                targetUserData={user.data}
                currentUserData={userData}
                targetUserId={user.id}
                currentUserId={userId}
                setTargetFollowers={(userId, updatedFollowers) =>
                  setTargetFollowers(setFollowers, userId, updatedFollowers)
                }
                setCurrentFollowing={(userId, updatedFollowing) =>
                {
                  userId;
                  setCurrentFollowing(setUserData, { users: updatedFollowing })
                }
                }
                className="follow-button ml-auto"
                />
              }
                </div>
            ))
          
            ) :
           <p className="text-2xl font-bold">You don't have any followers yet!</p>
            
            }
        </ModalBody>
          </ModalContent>
      </Modal>

      <Modal isOpen={showFollowingModal} onClose={() => setShowFollowingModal(false)} isCentered size={"xl"}>
        <ModalOverlay />
          <ModalContent backgroundColor={"#151F33"}>
        <ModalHeader fontSize={"2xl"}>Following</ModalHeader>
        <ModalCloseButton />
        <ModalBody minHeight="200px" className="flex flex-col gap-4 items-center customScrollbar" maxHeight={"70vh"} overflowY="auto">
          
            {showFollowingModal && selectedUserData?.following?.users && selectedUserData.following.users.length > 0 ?(
          
            following?.map((user, index) => (
                <Link
                key={index}
                className="flex gap-4 items-center hover:bg-[#223457] p-2 rounded-xl transition-colors duration-200 w-full cursor-pointer"
                to={`/profile/${user.id}`}
                onClick={(e) => {
                if ((e.target as HTMLElement).closest(".follow-button")) {
                e.preventDefault();
                } else {
                setShowFollowingModal(false);
                }
                }}
                >
                <Avatar size="md" src={user.data.imgurl} name={`${user.data.firstname} ${user.data.lastname}`} key={`${user.data.firstname} ${user.data.lastname}`} />
                <p>{user.data.firstname} {user.data.lastname}</p>
                {(id && userId && user.id !== userId) && 

                <FollowButton
                  targetUserData={user.data}
                  currentUserData={userData}
                  targetUserId={user.id}
                  currentUserId={userId}
                  setTargetFollowers={(userId, updatedFollowers) =>
                  setTargetFollowers(setFollowing, userId, updatedFollowers)
                  }
                  setCurrentFollowing={(userId, updatedFollowing) =>
                  {
                    userId;
                    setCurrentFollowing(setUserData, { users: updatedFollowing })}
                  }
                  className="follow-button ml-auto"
                />
                }
                </Link>
            ))
          
            ) :
           <p className="text-2xl font-bold my-auto">{self?"You are not following anyone yet!":"This user is not following anyone yet."}</p>
            
          }
        </ModalBody>
          </ModalContent>
      </Modal>
    </div>
  );
};

const validateSocialMediaLinks = (socials: Social[] | undefined): boolean => {
  if (!socials) return true;

  const regexPatterns: { [key: string]: RegExp } = {
    Facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9(\.\?)?]/,
    Instagram: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+$/,
    LinkedIn: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/
  };

  for (const social of socials) {
    const regex = regexPatterns[social.name];
    if (regex && social.url.trim()!=='' && !regex.test(social.url)) {
      return false;
    }
  }
  return true;
};
