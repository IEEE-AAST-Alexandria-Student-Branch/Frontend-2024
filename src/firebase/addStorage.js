import { Timestamp } from "firebase/firestore";
import { storage } from "./config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default async function addStorage(file, slug) {
  const storageRef = ref(
    storage,
    `${slug}/${Timestamp.now().nanoseconds}${
      Timestamp.now().seconds
    }` +
      "-" +
      file.name
  );
  let link = "";
  let error = "";
  await uploadBytes(storageRef, file).then(async (snapshot) => {
    await getDownloadURL(snapshot.ref).then((downloadURL) => {
      link = downloadURL;
    });
  }).catch((err) => {
    error = err.message;
  });

  return { link, error };
}
