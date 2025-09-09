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
        phoneNumber: userCredential.user.phoneNumber, // always includes "+"
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
  const formatted = phone.trim(); // make sure no spaces
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

// ✅ Verify OTP for login (don’t overwrite Firestore)
export const verifyOtpForLogin = async (confirmation, code) => {
  try {
    const userCredential = await confirmation.confirm(code);
    return userCredential.user;
  } catch (e) {
    console.error("Error verifying OTP (login):", e);
    throw e;
  }
};
