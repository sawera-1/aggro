import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

/* ------------------------------- FARMER AUTH ------------------------------- */

// ✅ Send OTP to user phone number
export const sendOtp = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber); // Firebase sends SMS
    return confirmation; // returns a confirmation object to verify later
  } catch (e) {
    console.error("Error sending OTP:", e);
    throw e;
  }
};

// ✅ Verify OTP during signup and save user in Firestore
export const verifyOtpAndSaveUser = async (confirmation, code, userData) => {
  try {
    const userCredential = await confirmation.confirm(code); // verify OTP entered by user

    // Save user details in Firestore (under "users" collection)
    await firestore().collection("users").doc(userCredential.user.uid).set(
      {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber,
        role: userData.role, // e.g. "farmer"
        createdAt: new Date().toISOString(), // save timestamp
      },
      { merge: true } // merge ensures existing data isn't overwritten
    );

    return userCredential.user;
  } catch (e) {
    console.error("Error verifying OTP:", e);
    throw e;
  }
};

// ✅ Check if a user already exists in Firestore by phone number
export const checkIfUserExists = async (phone) => {
  const formatted = phone.trim(); 
  const snapshot = await firestore()
    .collection("users")
    .where("phoneNumber", "==", formatted)
    .get();

  console.log("Firestore query for:", formatted);
  snapshot.forEach((doc) => {
    console.log("Found user:", doc.id, doc.data());
  });

  return !snapshot.empty; // true = exists, false = not found
};

// ✅ Verify OTP for login (farmer)
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

// ✅ Verify OTP and save expert data in Firestore
export const verifyExpertOtpAndSaveUser = async (confirmation, code, expertData) => {
  try {
    const userCredential = await confirmation.confirm(code);

    // Save expert details in Firestore
    await firestore().collection("users").doc(userCredential.user.uid).set(
      {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber,
        role: "expert",
        name: expertData.name,
        password: expertData.password, // ⚠️ Should be hashed in production!
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

// ✅ Expert login using phone + password
export const loginExpert = async (phone, password) => {
  try {
    const snapshot = await firestore()
      .collection("users")
      .where("phoneNumber", "==", phone)
      .where("role", "==", "expert")
      .get();

    if (snapshot.empty) {
      throw new Error("No expert found with this phone number");
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      throw new Error("Invalid password");
    }

    return userData; // return expert data
  } catch (e) {
    console.error("Expert login error:", e);
    throw e;
  }
};

// ✅ Alternative Expert login (Phone + Password) with formatted phone
export const getExpertByPhoneAndPassword = async (phone, password) => {
  try {
    // Normalize phone: add +92 if missing
    const normalizedPhone = phone.startsWith("+") ? phone : `+92${phone.replace(/^0+/, "")}`;

    const snapshot = await firestore()
      .collection("users")
      .where("phoneNumber", "==", normalizedPhone)
      .where("password", "==", password)
      .where("role", "==", "expert")
      .get();

    if (snapshot.empty) {
      return null; // No match
    }

    return snapshot.docs[0].data(); // Return expert data
  } catch (error) {
    console.error("Error fetching expert:", error);
    throw error;
  }
};

/* ------------------------------- USER DATA ------------------------------- */

// ✅ Get current logged-in farmer's data
export const getUserData = async () => {
  try {
    const uid = auth().currentUser?.uid; // logged-in user ID
    if (!uid) return null;

    const doc = await firestore().collection("users").doc(uid).get();
    return doc.exists ? doc.data() : null;
  } catch (error) {
    console.log("Error fetching user data:", error);
    return null;
  }
};

// ✅ Get current logged-in expert's data
export const getExpertData = async () => {
  try {
    const userId = auth().currentUser?.uid;
    if (!userId) throw new Error("No user logged in");

    const docSnap = await firestore().collection("users").doc(userId).get();
    if (!docSnap.exists) throw new Error("No expert data found");

    const data = docSnap.data();
    if (data.role !== "expert") throw new Error("Logged in user is not an expert");

    return data;
  } catch (error) {
    console.error("Error fetching expert data:", error);
    return null;
  }
};

/* ------------------------------- CHANNELS ------------------------------- */

// ✅ Get all channels
export const getChannels = async () => {
  try {
    const snapshot = await firestore().collection("channels").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.log("Error fetching channels:", error);
    return [];
  }
};

// ✅ Get single channel by ID
export const getChannelById = async (channelId) => {
  const doc = await firestore().collection("channels").doc(channelId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

// ✅ Get number of members in a channel
export const getChannelMembersCount = async (channelId) => {
  const snapshot = await firestore()
    .collection("channels")
    .doc(channelId)
    .collection("members")
    .get();
  return snapshot.size; // returns count
};

/* ------------------------------- QUERIES ------------------------------- */

// ✅ Get all queries (from farmers to experts)
export const getQueries = async () => {
  try {
    const snapshot = await firestore().collection("queries").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching queries:", error);
    return [];
  }
};

/* ------------------------------- UPDATES ------------------------------- */

// ✅ Get government schemes
export const getGovtSchemes = async () => {
  try {
    const snapshot = await firestore().collection("govtSchemes").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching govtSchemes:", error);
    return [];
  }
};

// ✅ Get crop information
export const getCropInfo = async () => {
  try {
    const snapshot = await firestore().collection("cropInfo").get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching cropInfo:", error);
    return [];
  }
};

/* -------------------- USER DATA -------------------- */


// ✅ Update logged-in user's data
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

//--------------------------------
// 🔹 Cloudinary Image Upload
//--------------------------------
export const uploadImageToCloudinary = async (imageFile) => {
  const CLOUD_NAME = "dumgs9cp4";
  const UPLOAD_PRESET = "react_native_uploads";

  try {
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    throw err;
  }
};
