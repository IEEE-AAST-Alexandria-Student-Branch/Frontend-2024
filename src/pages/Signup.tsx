import { NavBar } from "../components/common/navbar";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Input, FormControl, FormLabel, FormErrorMessage, Button, Center } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import register from "../firebase/register";
import setData from "../firebase/setData";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const SignUp = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [error, setError] = useState<string>("");
  const onOpen = (errorString:string) =>{
    setModalIsOpen(true);
    setError(errorString);
  }
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const lastNameRef = useRef<HTMLInputElement>(null);

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
  
  const [isValid, setIsValid] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isErrorEmail && !isErrorPass) {
      setIsValid(true);
      setShowError(false);
      register(formData.email, formData.password).then(res => {
        console.log(res);
        if(res.error){
          onOpen(res.error);
        }
        else {
          setData("users", formData, res.result?.user.uid).then(() => {window.location.href = "/home";});
          
        }
      });
      
    } else {
      setIsValid(false);
      setShowError(true);
    }
  };

  const isErrorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) === false;
  const isErrorPass = formData.password.length < 6;

  return (
    <>
    <div className="form-container">
      <NavBar />
      <div className="flex flex-col justify-center p-16 h-screen">
        <div className="max-w-[600px]">
          <h1 className="primary-heading text-4xl sm:text-6xl pb-2">
            Let's get to know each other
          </h1>
          <p className="pt-4 pb-8 text-left">
            Tell us who you are. We will send you an email to verify it's you ;)
          </p>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required                
              />{" "}
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                readOnly
                onFocus={() => { lastNameRef.current?.removeAttribute('readonly'); }}
                ref={lastNameRef}
                required
              />
            </FormControl>

            <FormControl mb={4} isInvalid={isErrorEmail && showError}>
              <FormLabel>Your Email</FormLabel>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {isErrorEmail && showError && (
                <FormErrorMessage>Please enter a valid Email.</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={isErrorPass && showError}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {isErrorPass && showError && (
                <FormErrorMessage>Please enter a 6 character password.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl>
              <Button
                className="bg-white text-black text-sm font-bold py-2 px-4 w-36 border-2 border-white rounded-full m-2"
                type="submit"
              >
                Send Email
              </Button>
            </FormControl>
          </form>

          <div className="pt-8">
            <Link to="/page1">
              <button className="bg-transparent py-2 px-4 w-28 border-2 border-white rounded-full">
                Cancel
              </button>
            </Link>
          </div>
          <div className="fixed bottom-0 w-80 h-auto right-0 p-4">
            <img src="src/assets/bg-triangle-ellipse@2x.png" alt="Triangle" />
          </div>
        </div>
      </div>
    </div>
    <Center>
    <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} size="xl">
      <ModalOverlay />
      <ModalContent className="top-[30%]">
        <ModalHeader>Error</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>{error}</p>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={() => setModalIsOpen(false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </Center>
    </>
  );
};
