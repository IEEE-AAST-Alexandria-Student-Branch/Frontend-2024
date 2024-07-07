import { NavBar } from "../components/common/navbar";
import { useState, ChangeEvent, FormEvent } from "react";
import {Link} from "react-router-dom";
import { Input, FormControl, FormLabel, FormErrorMessage, Button } from "@chakra-ui/react";
import signIn from "../firebase/signin";
import getUser from "../firebase/auth";
import { delay } from "framer-motion";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}


export const Signin = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const goback = () => {
    window.open("/", "_self")
  }
  
  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    
    if (!isErrorEmail && !isErrorPass) {
      setShowError(false);
      await signIn(formData.email, formData.password).then (res => {
        if(!res.error && res.result)
            {
                console.log("sign in successful to user: ", res.result);        
            }
      })
      if(await getUser())
        goback();
    } else {
      setShowError(true);
    }
  };


  const isErrorEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) === (false);
  const isErrorPass =  formData.password.length < 6;

  return (
    <div>
      <div className="h-screen w-[1vh] absolute left-0" style={{
        backgroundImage: "linear-gradient(to bottom, #1F396E, #1D0021)"
      }}></div>
      <NavBar />
    <div className="form-container">
      <div className="p-20 h-screen">
        <div className="max-w-[600px] mt-40 max-sm:mt-10" style={{ }}>
        <h1 className="text-4xl sm:text-4xl mb-8" style={{ fontWeight: 'bold' }}>
            Let's Sign you in!
          </h1>
          <form className="" onSubmit={handleSubmit}>

    <FormControl mb={10} isInvalid={isErrorEmail && showError}>
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


{/* //button divs */}
            <div className = "flex flex-nowrap"> 
            <div className="pt-8 flex flex-nowrap items-center gap-4 flex-col">
            <div className="flex flex-col sm:flex-row items-center gap-2">
            <button style={{
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
             <button className="defaultButton ml-2" style = {{fontSize: '11px',
                width: '155px',
                height: '35px',
             }}>
                Sign In
            </button>
            </div>
            <Link to="/Signup" className="text-blue-500">Don't have an account yet? Sign up!</Link>
          </div>
        </div>
    </form>

          <div className="bottom-0 w-80 h-auto right-[-2vh] p-4 fixed max-sm:w-[45%] " >
            <img src="src/assets/bg-triangle-ellipse@2x.png" alt="Triangle" />
          </div>
        </div>
      </div>
    </div>
</div>
  );
};