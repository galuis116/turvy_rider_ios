import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CircleNameAvatar = ({ firstName, lastName }) => {
  const nameInitials = `${firstName.charAt(0).toUpperCase()}${lastName
    .charAt(0)
    .toUpperCase()}`;

  return (
    <View style={styles.circle}>
      <Text style={styles.text}>{nameInitials}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3440eb",
  },
  text: {
    fontSize: 20,
    color: "#fff",
  },
});

export default CircleNameAvatar;
