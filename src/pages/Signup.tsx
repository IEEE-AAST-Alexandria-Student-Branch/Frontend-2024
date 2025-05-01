import { useState, ChangeEvent, FormEvent, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Input, FormControl, FormErrorMessage, List, ListItem, Button } from "@chakra-ui/react";
import setData from "../firebase/setData";
import register from "../firebase/register";
import Triangle from "../assets/bg-triangle-ellipse@2x.png";
import { handleGoogleSignIn } from "../utils";
import getUser from "../firebase/auth";
import getDocument from "../firebase/getData";
import { UserContext } from "../App";
import UserData from "../interfaces/userData";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const { setUserData, setUserId } = useContext(UserContext); // Access UserContext
  const [loading, setLoading] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    if (email) {
      setFormData((prevData) => ({
        ...prevData,
        email: decodeURIComponent(email),
      }));
    }
  }, [location.search]);

  const [showError, setShowError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;

    // Limit firstName and lastName to 15 characters
    if ((id === "firstName" || id === "lastName") && value.length > 15) {
      return; // Prevent further input if the limit is exceeded
    }

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isErrorEmail && !isErrorPass) {
      setShowError(false);
      const storedFormData = {
        firstname: formData.firstName,
        lastname: formData.lastName,
        desc: "",
        email: formData.email,
        likes: { events: [], articles: [] },
        followers: [],
        roles: [],
        following: { events: [], users: [] },
      };

      try {
        setLoading("email");
        const res = await register(formData.email, formData.password);
        if (res.error) {
          throw new Error(res.error);
        } else {
          // Save user data to Firestore
          await setData("users", storedFormData, res.result?.user.uid);

          // Fetch the newly created user data and update UserContext
          const user = await getUser();
          if (user) {
            const userDoc = await getDocument("users", user.uid);
            if (userDoc.result && !userDoc.error) {
              setUserData(userDoc.result.data() as UserData); // Update UserContext
              setUserId(user.uid); // Update User ID in context
            }
          }

          navigate("/verify");
        }
      } catch (error: any) {
        console.error("Error during registration:", error.message);
        alert(`Registration failed: ${error.message}`);
        setLoading(null);
      }
    } else {
      setShowError(true);
      setLoading(null);
    }
  };

  // Individual criteria for password validation
  const minLength = formData.password.length >= 8;
  const hasLowercase = /[a-z]/.test(formData.password);
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasDigit = /\d/.test(formData.password);
  const hasSpecialChar = /[@$!%*?&#;]/.test(formData.password);

  // Determine if the password is invalid
  const isErrorPass = !minLength || !hasLowercase || !hasUppercase || !hasDigit || !hasSpecialChar;

  // Email validation
  const isErrorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) === false;

  return (
    <div>
      <div
        className="h-screen w-[1vh] absolute left-0"
        style={{
          backgroundImage: "linear-gradient(to bottom, #1F396E, #1D0021)",
        }}
      ></div>
      <div className="form-container relative">
        <div className="p-20 min-h-screen relative z-20">
          <div className="max-w-[600px] mt-40 max-sm:mt-10">
            <h1 className="text-4xl text-center sm:text-left sm:text-4xl" style={{ fontWeight: "bold" }}>
              Let's get to know each other
            </h1>
            <p className="pt-2 pb-10 text-center sm:text-left" style={{ fontWeight: "lighter", fontSize: "13px" }}>
              Tell us who you are. We will send you an email to verify it's you ;)
            </p>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <Input
                  type="text"
                  id="firstName"
                  name="Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First name"
                  maxLength={15} // Optional: Add maxLength for additional browser-level enforcement
                  style={{
                    width: "80%",
                    border: "none",
                    borderBottom: "1px solid rgb(4, 4, 62)",
                    outline: "none",
                    backgroundColor: "#000B21"
                  }}
                />
              </FormControl>

              <FormControl mb={4}>
                <Input
                  type="text"
                  id="lastName"
                  name="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last name"
                  maxLength={15} // Optional: Add maxLength for additional browser-level enforcement
                  style={{
                    width: "80%",
                    border: "none",
                    borderBottom: "1px solid rgb(4, 4, 62)",
                    outline: "none",
                    backgroundColor: "#000B21"
                  }}
                />
              </FormControl>

              <FormControl mb={4} isInvalid={isErrorEmail && showError}>
                <Input
                  type="email"
                  id="email"
                  name="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid rgb(4, 4, 62)",
                    outline: "none",
                    backgroundColor: "#000B21"
                  }}
                />
                {isErrorEmail && showError && (
                  <FormErrorMessage>Please Enter a Valid Email.</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={isErrorPass && showError}>
                <Input
                  type="password"
                  id="password"
                  name="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  style={{
                    width: "100%",
                    border: "none",
                    borderBottom: "1px solid rgb(4, 4, 62)",
                    outline: "none",
                    backgroundColor: "#000B21"
                  }}
                />
                {isErrorPass && showError && (
                  <FormErrorMessage>
                    <List spacing={1} mt={2}>
                      {!minLength && (
                        <ListItem>Password must be at least 8 characters long.</ListItem>
                      )}
                      {!hasLowercase && (
                        <ListItem>Password must contain at least one lowercase letter.</ListItem>
                      )}
                      {!hasUppercase && (
                        <ListItem>Password must contain at least one uppercase letter.</ListItem>
                      )}
                      {!hasDigit && <ListItem>Password must contain at least one digit.</ListItem>}
                      {!hasSpecialChar && (
                        <ListItem>
                          Password must contain at least one special character (e.g., !@#$%^&*;).
                        </ListItem>
                      )}
                    </List>
                  </FormErrorMessage>
                )}
              </FormControl>
              <Link to="/signin" className="text-blue-500 px-4 mt-4">
                    Already have an account? Sign in!
                  </Link>
              <div className="flex flex-nowrap justify-center sm:justify-start">
                
                <div className="pt-8 flex flex-nowrap items-center gap-2 flex-col">
                  <div className="flex flex-col sm:flex-row items-center gap-2">

                    <Button
                    rounded={"full"}
                      className="defaultButton"
                      style={{
                        fontSize: "16px",
                        width: "155px",
                        height: "50px",
                      }}
                      isLoading={loading=="email"}
                      loadingText="Loading..."
                      type="submit"
                    >
                      Send Email
                    </Button>

                    <Link to="/">
                      <Button
                        rounded={"full"}
                        style={{
                          background: "transparent",
                          padding: "8px",
                          fontSize: "16px",
                          width: "155px",
                          height: "50px",
                          border: "2px solid #fff", 
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>
                    <Button
                  className="flex items-center gap-2 bg-white text-black font-medium rounded-full shadow-md hover:shadow-lg transition-shadow self-start mt-2"
                  rounded={"full"}
                  p={7}
                  onClick={() => {
                    setLoading("google");
                    handleGoogleSignIn(setLoading);
                  }}
                  type="button"
                  isLoading={loading=="google"}
                  loadingText="Please wait..."
                  disabled={loading=="email"}
                  >
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="Google Logo"
                    className="w-10 h-10"
                  />
                  Sign in with Google
                  </Button>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="fixed -bottom-4 right-0 w-80 h-auto z-0">
            <img src={Triangle} alt="Triangle" />
          </div>
      </div>
    </div>
  );
};
