// firestoreService.js
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase";

//--------------------------------
// 🔹 Firestore Services
//--------------------------------

// ✅ Add data
export const addData = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

// ✅ Get all data
export const getAllData = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

// ✅ Get single document
export const getDataById = async (collectionName, id) => {
  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
};

// ✅ Update document
export const updateData = async (collectionName, id, newData) => {
  try {
    await updateDoc(doc(db, collectionName, id), newData);
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

// ✅ Delete document
export const deleteData = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (e) {
    console.error("Error deleting document: ", e);
    throw e;
  }
};

//--------------------------------
// 🔹 Firebase Auth Services (Email/Password)
//--------------------------------

// ✅ Sign Up with email
export const handleSignUp = async (email, password, extraData = {}) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const userData = {
    uid: user.uid,
    email: user.email,
    createdAt: new Date().toISOString(),
    ...extraData,
  };

  await setDoc(doc(db, "users", user.uid), userData);
  return userData;
};

// ✅ Login with email
export const login = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// ✅ Forgot Password
export const forgotPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
};

// ✅ Logout
export const logout = async () => {
  await signOut(auth);
};

//--------------------------------
// 🔹 Firebase Phone Auth (with Web SDK)
//--------------------------------

// ✅ Step 1: Send OTP
export const sendOtp = async (phoneNumber, recaptchaContainerId = "recaptcha-container") => {
  const verifier = new RecaptchaVerifier(recaptchaContainerId, { size: "invisible" }, auth);
  return signInWithPhoneNumber(auth, phoneNumber, verifier);
};

// ✅ Step 2: Verify OTP and Save User
export const verifyOtpAndSaveUser = async (confirmation, code, extraData = {}) => {
  const result = await confirmation.confirm(code);
  const user = result.user;

  const userData = {
    uid: user.uid,
    phoneNumber: user.phoneNumber,
    createdAt: new Date().toISOString(),
    ...extraData,
  };

  await setDoc(doc(db, "users", user.uid), userData, { merge: true });
  return userData;
};
