import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input, FormControl, FormErrorMessage, Slide, Alert, AlertIcon } from "@chakra-ui/react";
import signIn from "../firebase/signin";
import Triangle from "../assets/bg-triangle-ellipse@2x.png"
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react";
import getUser from "../firebase/auth";
import sendPasswordEmail from "../firebase/sendPasswordResetEmail";
import {handleGoogleSignIn} from "../utils"

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


export const Signin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [showSentEmail, setShowSentEmail] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const onClose = () => setIsOpen(false);

  const fetchCurrentUserEmail = async () => {
    try {
      const user = await getUser();
      if (user && user.email) {
        setResetEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching current user email:", error);
      return null;
    }
  };


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setShowError(false);
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };
  useEffect(() => {
    fetchCurrentUserEmail();
    }, []);

  const goback = () => {
    navigate("/")
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowError(false);
    await signIn(formData.email, formData.password).then(res => {
      if (!res.error){
        goback();
        window.location.reload();
        }
      else {
        setShowError(true);
        setErrorMessage(res.error);
      }
    }
    )
  };
  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser();
      if (user) {
        navigate("/");
      }
    };
    checkUser();
  }, []);
  return (
    <div className="min-h-fit">
        <Slide direction="top" in={showSentEmail} style={{ zIndex: 300 }}>
        <Alert status="success" variant="solid" zIndex={300}>
          <AlertIcon />
          If your email exists in our system, we've sent you a password reset email. Check your inbox!
        </Alert>
      </Slide>
      <div className="h-screen w-[1vh] absolute left-0" style={{
        backgroundImage: "linear-gradient(to bottom, #1F396E, #1D0021)"
      }}></div>
      <div className="form-container" style={{backgroundImage: `url(${Triangle})`, backgroundSize:"20%", backgroundRepeat: 'no-repeat', backgroundPosition: 'right bottom'}}>
        <div className="p-20 min-h-screen">
          <div className="max-w-[600px] sm:mt-40  max-sm:mt-10" style={{}}>
            <h1 className="text-center sm:text-left text-4xl sm:text-4xl mb-8" style={{ fontWeight: 'bold' }}>
              Let's Sign you in!
            </h1>
            <form onSubmit={handleSubmit} className="mt-28 sm:mt-0">
              <FormControl mb={10} isInvalid={showError}>
                <Input
                  type="email"
                  id="email"
                  name="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Your Email"
                  mb={8}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1px solid rgb(4, 4, 62)',
                    outline: 'none',

                  }}
                />
                <div className="flex flex-col">
                <Input
                  type="password"
                  id="password"
                  name="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Password"
                  mb={4}
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: '1px solid rgb(4, 4, 62)',
                    outline: 'none',
                  }}
                />
                <span className="px-4 text-blue-500 cursor-pointer w-44" onClick={()=>setIsOpen(true)}>Forgot password?</span>
                <Link to="/Signup" className="text-blue-500 px-4 mt-4">Don't have an account yet? Sign up!</Link>
                </div>

                {showError && (
                  <FormErrorMessage>
                    {errorMessage}
                  </FormErrorMessage>
                )}
              </FormControl>
                <div></div>
                
              {/* //button divs */}
              <div className="flex flex-nowrap">
                <div className="flex flex-nowrap items-center gap-4 flex-col">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <button type="submit" className="defaultButton" style={{
                      fontSize: '11px',
                      width: '155px',
                      height: '35px',
                    }}>
                      Sign In
                    </button>
                    <button type="button" style={{
                      background: 'transparent',
                      padding: '8px',
                      width: '120px',
                      fontSize: '11px',
                      border: '2px solid #fff',
                      borderRadius: '20px',
                      color: '#fff',
                      textAlign: 'center',
                    }} onClick={goback}>
                      Cancel
                    </button>
                  </div>
                  <button
                  className="flex items-center gap-2 bg-white text-black font-medium px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow self-start"
                  onClick={() => {
                    handleGoogleSignIn();
                    console.log("Google Sign-In clicked");
                  }}
                  type="button"
                >
                  <img
                    src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                    alt="Google Logo"
                    className="w-10 h-10"
                  />
                  Sign in with Google
                </button>
                  
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent backgroundColor={"#151F33"}>
              <ModalHeader>Reset Password</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3}
                isLoading={sendingEmail}
                disabled={sendingEmail}
                loadingText="Sending Email..."
                onClick={async()=>{
                  setSendingEmail(true);
                  await sendPasswordEmail(resetEmail)
                  setShowSentEmail(true)
                  onClose()
                  setTimeout(() => {
                    setShowSentEmail(false)
                    setSendingEmail(false)
                  }
                  , 3000)
                  }}>
                  Send Reset Email
                </Button>
                <Button colorScheme="red" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
    </div>
  );
};
