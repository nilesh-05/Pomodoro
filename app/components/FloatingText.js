import React from "react";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";

const FloatingText = ({ mode }) => {
	const workArray = [
		"Either you run the day or the day runs you.",
		"I’m a greater believer in luck, and I find the harder I work the more I have of it.",
		"Opportunity is missed by most people because it is dressed in overalls and looks like work.",
		"Don’t judge each day by the harvest you reap but by the seeds that you plant.",
		"Just one small positive thought in the morning can change your whole day.",
		"Don’t wish it were easier. Wish you were better.",
		"Do the hard jobs first. The easy jobs will take care of themselves.",
		"The man who moves a mountain begins by carrying away small stones.",
		"To think too long about doing a thing often becomes its undoing.",
	];

	const breakArray = [
		"As work is important for your survival, so is rest for a peaceful mind.",
		"The time is enough, you can have a few breaks.",
		"Well, if you are fed up with all your efforts, all you need to do is to take a break.",
		"Taking break helps you understand yourself better.",
		"Rest will make you do things better.",
		"Life is so beautiful. Just take a break to remind yourself it.",
		"The solution for every problem resides within you. Sometimes you just need to give some time and space to find that.",
	];
	return (
		<Text style={styles.text}>
			<Text style={styles.heading}>ENJOY YOUR {mode.toUpperCase()} :)</Text>
			{"\n"}
			{"\n"}
			{mode == "Work"
				? workArray[Math.floor(Math.random() * workArray.length)]
				: breakArray[Math.floor(Math.random() * breakArray.length)]}
		</Text>
	);
};

export default FloatingText;

const styles = StyleSheet.create({
	text: {
		color: colors.text,
		fontSize: 20,
		paddingTop: 10,
		marginHorizontal: 25,
		textAlign: "center",
	},
	heading: {
		fontWeight: "bold",
	},
});
