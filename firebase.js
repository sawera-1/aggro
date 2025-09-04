// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



const firebaseConfig = {
  apiKey: "AIzaSyBcxvIf_Hd12dYBfuPn38nfMuMp7cIMZms",
  authDomain: "agriculture-assistant-bae3f.firebaseapp.com",
  projectId: "agriculture-assistant-bae3f",
  storageBucket: "agriculture-assistant-bae3f.firebasestorage.app",
  messagingSenderId: "119693675733",
  appId: "1:119693675733:web:c6c2bff10b15044021265c",
  measurementId: "G-D3MLFKT1TB"
};

// Initialize Firebase
try {
  var  app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
}
// const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };