
import { initializeApp, getApps,getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBckn6e_56t_AUhtQKbnZMi6igacS_9qr0",
  authDomain: "instagram-clone-f0fb9.firebaseapp.com",
  projectId: "instagram-clone-f0fb9",
  storageBucket: "instagram-clone-f0fb9.appspot.com",
  messagingSenderId: "578757696650",
  appId: "1:578757696650:web:653508487baa8d2450e173",
  measurementId: "G-WEHFGBEDXT"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(); 
const storage = getStorage();


export {app,db,storage};



 // getApps,getApp this for next js auth