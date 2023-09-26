import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_xKpzW8sJOv43hUTHML8uqaIpQzGQy-4",
  authDomain: "webprojektfirebase.firebaseapp.com",
  projectId: "webprojektfirebase",
  storageBucket: "webprojektfirebase.appspot.com",
  messagingSenderId: "858102654082",
  appId: "1:858102654082:web:10600881fd6e9e4ad3c09b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);


