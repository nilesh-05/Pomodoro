import React from "react";
import {
	StyleSheet,
	Text,
	Dimensions,
	Animated,
	View,
	TouchableOpacity,
	Vibration,
	StatusBar,
	TextInput,
	Platform,
	FlatList,
} from "react-native";
import colors from "../config/colors";

const { width, height } = Dimensions.get("screen");
const timerArray = [...Array(10).keys()].map((i) => (i === 0 ? 1 : i * 5));
const SIZE = width * 0.3;
const SPACING = (width - SIZE) / 2;

const Timer = () => {
	// let index = 0;
	const [duration, setDuration] = React.useState(timerArray[0]);
	// const [timeLeft, setTimeLeft] = React.useState(timerArray[index]);

	const scrollX = React.useRef(new Animated.Value(0)).current;
	const timerAnimation = React.useRef(new Animated.Value(height)).current;

	const animation = React.useCallback(() => {
		Animated.sequence([
			Animated.timing(timerAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(timerAnimation, {
				toValue: height,
				duration: duration * 1000,
				useNativeDriver: true,
			}),
		]).start(() => {
			// handlePlay();
		});
	}, [duration]);

	// const handlePlay = () => {
	// 	setInterval(() => {
	// 		setTimeLeft(timeLeft - 1);
	// 	}, 1000);
	// };

	return (
		<View style={styles.container}>
			<StatusBar hidden />
			<Animated.View
				style={[
					StyleSheet.absoluteFillObject,
					{
						height,
						width,
						backgroundColor: colors.red,
						transform: [
							{
								translateY: timerAnimation,
							},
						],
					},
				]}
			>
				{/* <Text style={styles.text}>{timeLeft}</Text> */}
			</Animated.View>
			<Animated.View
				style={[
					StyleSheet.absoluteFillObject,
					{
						justifyContent: "flex-end",
						alignItems: "center",
						paddingBottom: 100,
					},
				]}
			>
				<TouchableOpacity onPress={animation}>
					<View style={styles.roundButton} />
				</TouchableOpacity>
			</Animated.View>
			<View
				style={{
					position: "absolute",
					top: height / 3,
					left: 0,
					right: 0,
					flex: 1,
				}}
			>
				{/* <Text style={styles.text}>{duration}</Text> */}
				<Animated.FlatList
					data={timerArray}
					keyExtractor={(item) => item.toString()}
					onMomentumScrollEnd={(event) => {
						const index = Math.round(event.nativeEvent.contentOffset.x / SIZE);
						// setDuration(timerArray[index] * 60);
						setDuration(timerArray[index]);
					}}
					horizontal
					bounces={false}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: scrollX } } }],
						{ useNativeDriver: true },
					)}
					snapToInterval={SIZE}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{
						paddingHorizontal: SPACING,
					}}
					renderItem={({ item, index }) => {
						const inputRange = [
							(index - 1) * SIZE,
							index * SIZE,
							(index + 1) * SIZE,
						];
						const opacity = scrollX.interpolate({
							inputRange,
							outputRange: [0.3, 1, 0.3],
						});
						const scale = scrollX.interpolate({
							inputRange,
							outputRange: [0.6, 1, 0.6],
						});
						return (
							<View
								style={{
									width: SIZE,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Animated.Text
									style={[
										styles.text,
										{
											opacity,
											transform: [{ scale }],
										},
									]}
								>
									{item}
								</Animated.Text>
							</View>
						);
					}}
				/>
			</View>
		</View>
	);
};

export default Timer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.black,
	},
	roundButton: {
		width: 80,
		height: 80,
		borderRadius: 40,
		backgroundColor: colors.red,
	},
	text: {
		fontSize: SIZE * 0.6,
		fontFamily: Platform.OS === "android" ? "Roboto" : "system",
		color: colors.text,
		fontWeight: "900",
	},
});
