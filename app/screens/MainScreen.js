import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import Header from "../components/Header";
import Timer from "../components/Timer";

const MainScreen = () => {
	return <Timer style={{ flex: 1 }} />;
};

export default MainScreen;

const styles = StyleSheet.create({
	droidSafeArea: {
		flex: 1,
		paddingTop: Platform.OS === "android" ? 25 : 0,
	},
});
