// ChatScreen.js
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import firestore from "@react-native-firebase/firestore";

const ChatScreen = ({ current_user, second_user }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ Create unique chatId (always same for both users)
  const chatId =
    current_user < second_user
      ? `${current_user}_${second_user}`
      : `${second_user}_${current_user}`;

  // ✅ Listen for real-time messages
  useEffect(() => {
    const unsubscribe = firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("createdAt", "desc")
      .onSnapshot((querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [chatId]);

  // ✅ Send message
  const sendMessage = useCallback(async () => {
    if (!text.trim()) return;

    await firestore()
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        text,
        senderId: current_user,
        receiverId: second_user,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

    setText("");
  }, [text, chatId, current_user, second_user]);

  // ✅ Render each message bubble
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.senderId === current_user ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.timeText}>
        {item.createdAt?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
  },
  messageText: { fontSize: 16 },
  timeText: {
    fontSize: 10,
    color: "#555",
    marginTop: 2,
    alignSelf: "flex-end",
  },
});
