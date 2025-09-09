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
