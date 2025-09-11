import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// Send OTP
export const sendOtp = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (e) {
    console.error("Error sending OTP:", e);
    throw e;
  }
};

// Verify OTP and save user (for signup)
export const verifyOtpAndSaveUser = async (confirmation, code, userData) => {
  try {
    const userCredential = await confirmation.confirm(code);

    await firestore().collection("users").doc(userCredential.user.uid).set(
      {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber, 
        role: userData.role,
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

// ✅ Check if user exists in Firestore
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

  return !snapshot.empty;
};

// ✅ Verify OTP for login
export const verifyOtpForLogin = async (confirmation, code) => {
  try {
    const userCredential = await confirmation.confirm(code);
    return userCredential.user;
  } catch (e) {
    console.error("Error verifying OTP (login):", e);
    throw e;
  }
};
//experts

// ✅ Send OTP
export const sendExpertOtp = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return confirmation;
  } catch (e) {
    console.error("Error sending Expert OTP:", e);
    throw e;
  }
};

// ✅ Verify OTP & Save Expert Data
export const verifyExpertOtpAndSaveUser = async (confirmation, code, expertData) => {
  try {
    const userCredential = await confirmation.confirm(code);

    // Save in Firestore
    await firestore().collection("users").doc(userCredential.user.uid).set(
      {
        uid: userCredential.user.uid,
        phoneNumber: userCredential.user.phoneNumber,
        role: "expert",
        name: expertData.name,
        password: expertData.password, // ⚠️ In production, NEVER store plain password. Use hashing.
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

// ✅ Login check by phone + password
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
//login

// ✅ Expert Login (Phone + Password)
export const getExpertByPhoneAndPassword = async (phone, password) => {
  try {
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

    return snapshot.docs[0].data(); // Return first matched expert
  } catch (error) {
    console.error("Error fetching expert:", error);
    throw error;
  }
};
  


//user data farmer
export const getUserData = async () => {
  try {
    const uid = auth().currentUser?.uid; // logged-in user ID
    if (!uid) return null;

    const doc = await firestore().collection("users").doc(uid).get();
    if (doc.exists) {
      return doc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.log("Error fetching user data:", error);
    return null;
  }
};
//expert


export const getExpertData = async () => {
  try {
    const userId = auth().currentUser?.uid;
    if (!userId) throw new Error('No user logged in');

    const docSnap = await firestore().collection('users').doc(userId).get();

    if (!docSnap.exists) {
      throw new Error('No expert data found');
    }

    const data = docSnap.data();
    if (data.role !== 'expert') {
      throw new Error('Logged in user is not an expert');
    }

    return data;
  } catch (error) {
    console.error('Error fetching expert data:', error);
    return null;
  }
};














//for Channel
export const getChannels = async () => {
  try {
    const snapshot = await firestore().collection("channels").get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return data;
  } catch (error) {
    console.log("Error fetching channels:", error);
    return [];
  }
};


export const getChannelById = async (channelId) => {
  const doc = await firestore().collection("channels").doc(channelId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

// Get total members count of a channel
export const getChannelMembersCount = async (channelId) => {
  const snapshot = await firestore()
    .collection("channels")
    .doc(channelId)
    .collection("members")
    .get();
  return snapshot.size;
};



//for Quries
export const getQueries = async () => {
  try {
    const snapshot = await firestore().collection("queries").get(); // RN Firebase syntax
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched Queries:", data); // Optional: debug log
    return data;
  } catch (error) {
    console.error("Error fetching queries:", error);
    return [];
  }
};




// updates
export const getGovtSchemes = async () => {
  try {
    let query = firestore().collection('govtSchemes');
    // Try to order by createdAt (if field present and consistent)
    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching govtSchemes:", error);
    // fallback: try without orderBy if orderBy caused an issue
    try {
      const snapshot = await firestore().collection('govtSchemes').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Fallback fetch failed:", e);
      return [];
    }
  }
};

export const getCropInfo = async () => {
  try {
    let query = firestore().collection('cropInfo');
    query = query.orderBy('createdAt', 'desc');
    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching cropInfo:", error);
    try {
      const snapshot = await firestore().collection('cropInfo').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.error("Fallback fetch failed:", e);
      return [];
    }
  }
};