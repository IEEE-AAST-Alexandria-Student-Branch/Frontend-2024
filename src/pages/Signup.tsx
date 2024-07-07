import { NavBar } from "../components/common/navbar";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input, FormControl, FormErrorMessage } from "@chakra-ui/react";
import setData from "../firebase/setData";
import register from "../firebase/register";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const onOpen = (errorString: string) => {
    setModalIsOpen(true);
    setError(errorString);
  };
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
        email: formData.email,
        likes: [],
        follows: [],
      };
      const res = await register(formData.email, formData.password);
      await setData("users", storedFormData, res.result?.user.uid);
      window.open("/verify", "_self");
    } else {
      setShowError(true);
    }
  };

  const isErrorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) === false;
  const isErrorPass = formData.password.length < 6;

  return (
    <div>
      <div className="h-screen w-[1vh] absolute left-0" style={{
        backgroundImage: "linear-gradient(to bottom, #1F396E, #1D0021)"
      }}></div>
      <NavBar />
      <div className="form-container relative z-10">
        <div className="p-20 h-screen">
          <div className="max-w-[600px] mt-40 max-sm:mt-10" style={{}}>
            <h1 className="text-4xl sm:text-4xl" style={{ fontWeight: 'bold' }}>
              Let's get to know each other
            </h1>
            <p className="pt-2 pb-10 text-left" style={{ fontWeight: 'lighter', fontSize: '13px' }}>
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
                  style={{
                    width: '80%',
                    border: 'none',
                    borderBottom: '1px solid rgb(4, 4, 62)',
                    outline: 'none',
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
                  style={{
                    width: '80%',
                    border: 'none',
                    borderBottom: '1px solid rgb(4, 4, 62)',
                    outline: 'none',
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
                    width: '80%',
                    border: 'none',
                    borderBottom: '1px solid rgb(4, 4, 62)',
                    outline: 'none',
                  }}
                />
                {isErrorEmail && showError && (
                  <FormErrorMessage>Please enter a valid Email.</FormErrorMessage>
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
                    width: '80%',
                    border: 'none',
                    borderBottom: '1px solid rgb(4, 4, 62)',
                    outline: 'none',
                  }}
                />
                {isErrorPass && showError && (
                  <FormErrorMessage>Please enter a 6 character password.</FormErrorMessage>
                )}
              </FormControl>

              <div className="flex flex-nowrap">
                <div className="pt-8 flex flex-nowrap items-center gap-2 flex-col">
                <div className="flex">
                  <Link to="/page1">
                    <button style={{
                      background: 'transparent',
                      padding: '8px',
                      width: '120px',
                      fontSize: '11px',
                      border: '2px solid #fff',
                      borderRadius: '20px',
                      color: '#fff',
                      textAlign: 'center',
                      marginBottom: "2vh",
                    }}>
                      Cancel
                    </button>
                  </Link>
                  
                  <button className="defaultButton ml-2" style={{
                    fontSize: '11px',
                    width: '155px',
                    height: '35px',
                  }}>
                    Send Email
                  </button>
                  </div>
                  <Link to="/signin" className="text-blue-500">Already have an account? Sign in!</Link>
                </div>
              </div>
            </form>

            <div className="bottom-0 w-80 h-auto right-[-2vh] p-4 fixed max-sm:w-[45%] z-0" style={{ zIndex: '-1' }}>
              <img src="src/assets/bg-triangle-ellipse@2x.png" alt="Triangle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
