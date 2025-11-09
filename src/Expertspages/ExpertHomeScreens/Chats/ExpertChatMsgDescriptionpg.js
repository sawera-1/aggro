import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import firestore from "@react-native-firebase/firestore";
import auth from '@react-native-firebase/auth';
import { useTranslation } from "react-i18next";

export default function ExpertChatDes() {
    const route = useRoute();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const { userId } = route.params || {}; 
    const currentUserId = auth().currentUser?.uid;

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch user info
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const unsubscribe = firestore()
            .collection("users")
            .doc(userId)
            .onSnapshot(
                (docSnap) => {
                    if (docSnap.exists) setUserData(docSnap.data());
                    else setUserData(null);
                    setLoading(false);
                },
                (error) => {
                    console.error("Error fetching user data:", error);
                    Alert.alert(t('expertChatDes.errorTitle'), t('expertChatDes.errorMessage'));
                    setLoading(false);
                }
            );

        return () => unsubscribe();
    }, [userId]);

    // Navigate to feedback page with full user object
    const handleReportUser = () => {
        if (!currentUserId) {
            Alert.alert(t('expertChatDes.loginToReport'));
            return;
        }

        navigation.navigate("ExpertFeedback", {
            reportedUser: {
                uid: userId,
                name: userData.name,
                phoneNumber: userData.phoneNumber,
                dpImage: userData.dpImage,
                qualification: userData.qualification,
                specialization: userData.specialization,
                experience: userData.experience,
            },
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#006644" />
            </SafeAreaView>
        );
    }

    if (!userData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Text style={styles.notFoundText}>{t('expertChatDes.userNotFound')}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={26} color="#fff" />
                </TouchableOpacity>

                <Image
                    source={userData.dpImage ? { uri: userData.dpImage } : require("../../../images/chdummyimg.png")}
                    style={styles.headerAvatar}
                />

                <Text style={styles.headerTitle}>
                    {userData.name || t('expertChatDes.unknownUser')}
                </Text>
            </View>

            {/* Scrollable Info */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Image
                    source={userData.dpImage ? { uri: userData.dpImage } : require("../../../images/chdummyimg.png")}
                    style={styles.profileAvatar}
                />

                <Text style={styles.profileName}>{userData.name || t('expertChatDes.na')}</Text>
                <Text style={styles.profilePhone}>{t('expertChatDes.phoneLabel')}{userData.phoneNumber || t('expertChatDes.na')}</Text>

                {/* Report Button */}
                <TouchableOpacity style={styles.reportButton} onPress={handleReportUser}>
                    <Ionicons name="alert-circle" size={22} color="#fff" style={{ marginRight: 10 }} />
                    <Text style={styles.reportButtonText}>{t('expertChatDes.reportUser')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    notFoundText: { fontSize: 16, color: "#666" },
    header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#006644", elevation: 5 },
    backButton: { marginRight: 12 },
    headerAvatar: { width: 38, height: 38, borderRadius: 19, marginRight: 12, borderWidth: 1, borderColor: "#fff" },
    headerTitle: { color: "#fff", fontSize: 19, fontWeight: "bold", flexShrink: 1 },
    scrollContent: { padding: 20, alignItems: "center", flexGrow: 1 },
    profileAvatar: { width: 130, height: 130, borderRadius: 65, borderWidth: 2.5, borderColor: "#006644", marginBottom: 15 },
    profileName: { fontSize: 22, fontWeight: "bold", color: "#006644", marginBottom: 6 },
    profilePhone: { fontSize: 15, color: "#444", marginBottom: 30 },
    reportButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#ff9900", paddingVertical: 15, paddingHorizontal: 22, borderRadius: 14, width: "90%", elevation: 4 },
    reportButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
