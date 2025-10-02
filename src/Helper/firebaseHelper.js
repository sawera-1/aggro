import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

/* ------------------------------- FARMER AUTH ------------------------------- */

// ✅ Send OTP to user phone number
export const sendOtp = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (e) {
    console.error("Error sending OTP:", e);
    throw e;
  }
};

// ✅ Verify OTP and save farmer data
export const verifyOtpAndSaveUser = async (confirmation, code, userData) => {
  try {
    const userCredential = await confirmation.confirm(code);

    await firestore().collection("users").doc(userCredential.user.uid).set(
      {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber,
        role: userData.role, // "farmer"
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return userCredential.user;
  } catch (e) {
    console.error("Error verifying OTP:", e);
    throw e;
  }
};

// ✅ Check if a user exists by phone number
export const checkIfUserExists = async (phone) => {
  const formatted = phone.trim();
  const snapshot = await firestore()
    .collection("users")
    .where("phoneNumber", "==", formatted)
    .get();

  return !snapshot.empty;
};

// ✅ Verify OTP for farmer login
export const verifyOtpForLogin = async (confirmation, code) => {
  try {
    const userCredential = await confirmation.confirm(code);
    return userCredential.user;
  } catch (e) {
    console.error("Error verifying OTP (login):", e);
    throw e;
  }
};

/* ------------------------------- EXPERT AUTH ------------------------------- */

// ✅ Send OTP to expert
export const sendExpertOtp = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (e) {
    console.error("Error sending Expert OTP:", e);
    throw e;
  }
};

// ✅ Verify OTP and save expert data
export const verifyExpertOtpAndSaveUser = async (confirmation, code, expertData) => {
  try {
    const userCredential = await confirmation.confirm(code);

    await firestore().collection("users").doc(userCredential.user.uid).set(
      {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber,
        role: "expert",
        name: expertData.name,
        experience: expertData.experience,
        specialization: expertData.specialization,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return userCredential.user;
  } catch (e) {
    console.error("Error verifying Expert OTP:", e);
    throw e;
  }
};

/* ------------------------------- USER DATA ------------------------------- */

// ✅ Get current logged-in farmer
export const getUserData = async () => {
  try {
    const uid = auth().currentUser?.uid;
    if (!uid) return null;

    const doc = await firestore().collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// ✅ Get current logged-in expert
export const getExpertData = async () => {
  try {
    const user = auth().currentUser;
    if (!user) throw new Error("No expert logged in");

    const docSnap = await firestore().collection("users").doc(user.uid).get();
    if (!docSnap.exists) throw new Error("No expert data found");

    const data = docSnap.data();
    if (data.role !== "expert") return null;

    return data;
  } catch (error) {
    console.error("Error fetching expert data:", error);
    return null;
  }
};

/* ------------------------------- CHANNELS ------------------------------- */

export const getChannels = async () => {
  try {
    const snapshot = await firestore().collection("channels").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
};

export const getChannelById = async (channelId) => {
  const doc = await firestore().collection("channels").doc(channelId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const getChannelMembersCount = async (channelId) => {
  const snapshot = await firestore()
    .collection("channels")
    .doc(channelId)
    .collection("members")
    .get();
  return snapshot.size;
};

/* ------------------------------- QUERIES ------------------------------- */

export const getQueries = async () => {
  try {
    const snapshot = await firestore().collection("queries").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching queries:", error);
    return [];
  }
};

/* ------------------------------- GOVT SCHEMES & CROPS ------------------------------- */

export const getGovtSchemes = async () => {
  try {
    const snapshot = await firestore().collection("govtSchemes").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching govtSchemes:", error);
    return [];
  }
};

export const getCropInfo = async () => {
  try {
    const snapshot = await firestore().collection("cropInfo").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching cropInfo:", error);
    return [];
  }
};

/* ------------------------------- UPDATE USER ------------------------------- */

export const updateUserData = async (data) => {
  try {
    const uid = auth().currentUser?.uid;
    if (!uid) throw new Error("No user logged in");

    await firestore().collection("users").doc(uid).set(data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

/* ------------------------------- CLOUDINARY UPLOAD ------------------------------- */

export const uploadImageToCloudinary = async (imageFile) => {
  const CLOUD_NAME = "dumgs9cp4";
  const UPLOAD_PRESET = "react_native_uploads";

  try {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: data }
    );

    const result = await res.json();
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    throw err;
  }
};
