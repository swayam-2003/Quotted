import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
    apiKey: "AIzaSyCockyzs4YrDrna4_dyg5rJs6sI81HdnQE",
    authDomain: "quotted-87ee3.firebaseapp.com",
    projectId: "quotted-87ee3",
    storageBucket: "quotted-87ee3.appspot.com",
    messagingSenderId: "1085445663468",
    appId: "1:1085445663468:web:0c97a70c9a8427e1fc93c9",
    measurementId: "G-YCHZEBL7Y0"
};

const app = initializeApp(firebaseConfig);
const fireDB = getFirestore(app);
const auth = getAuth(app)
export { fireDB, auth };
//const analytics = getAnalytics(app);