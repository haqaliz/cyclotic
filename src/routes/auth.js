import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.send('hello world');
})
// https://firebase.google.com/docs/auth/web/start#web-version-9_3

/*import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBPNCOqaqgIHo85oeEEf4fOH9RBNjhDuMA",
  authDomain: "cyclotic-fc537.firebaseapp.com",
  projectId: "cyclotic-fc537",
  storageBucket: "cyclotic-fc537.appspot.com",
  messagingSenderId: "497525688527",
  appId: "1:497525688527:web:ae73e8ecd0bf9e3681cfba",
  measurementId: "G-B6VP1G8FHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid)
  } else {
    // User is signed out
  }
});

(async () => {
  const r = await createUserWithEmailAndPassword(
    auth,
    'haqaliz@aol.com',
    'king_1374',
  ).catch((e) => e);
  if (r.code) {
    console.log(r.message);
    return;
  }
  console.log(r.user);
})()*/
export default router;
