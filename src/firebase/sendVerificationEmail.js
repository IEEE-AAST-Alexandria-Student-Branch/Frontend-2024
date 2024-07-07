import { getAuth, sendEmailVerification } from "firebase/auth";
import { app } from "./config";

const auth = getAuth(app);


export default async function sendVerifyEmail(){
    await sendEmailVerification(auth.currentUser).then(() => {
        console.log("email sent!");
    });
}