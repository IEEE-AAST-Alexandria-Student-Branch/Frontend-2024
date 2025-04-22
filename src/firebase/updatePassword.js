import { getAuth, updatePassword } from "firebase/auth";

export async function setNewPassword(user, newPassword) {
  await updatePassword(user, newPassword).then(() => {
  }).catch(e => {
    console.log("Error updating password: " + e.message);
  })
}
