import * as React from "react";
import {
	Vibration,
	StatusBar,
	Animated,
	Dimensions,
	TouchableOpacity,
	View,
	StyleSheet,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";

import colors from "../config/colors";
import FloatingText from "./FloatingText";

const { width, height } = Dimensions.get("screen");

const timers = [...Array(10).keys()].map((i) => (i === 0 ? 1 : i * 5));
const itemSize = width * 0.4;
const itemSpacing = (width - itemSize) / 2;

export default function App() {
	const [duration, setDuration] = React.useState(timers[0]);
	const [time, setTime] = React.useState("Work");
	const [sound, setSound] = React.useState();
	const xScroll = React.useRef(new Animated.Value(0)).current;

	const timerAnimation = React.useRef(new Animated.Value(height)).current;
	const animateButton = React.useRef(new Animated.Value(0)).current;

	const inputRef = React.useRef();

	const buttonClicked = () => {
		animations();
		if (time === "Work") setTime("Break");
		else setTime("Work");
	};

	const playSound = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require("../../assets/iphone-ding-sound.mp3"),
		);
		setSound(sound);

		console.log("Playing Sound");
		await sound.playAsync();
	};

	React.useEffect(() => {
		return sound
			? () => {
					console.log("Unloading Sound");
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	const PATTERN = [0, 1000, 1000, 1000];
	const animations = React.useCallback(() => {
		Animated.sequence([
			Animated.timing(animateButton, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(timerAnimation, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.parallel([
				Animated.timing(timerAnimation, {
					toValue: height,
					duration: duration * 1000,
					useNativeDriver: true,
				}),
			]),
		]).start(() => {
			Vibration.vibrate(PATTERN);
			playSound();
			Animated.timing(animateButton, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		});
	}, [duration]);

	const opacity = animateButton.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 0],
	});

	const translateY = animateButton.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 200],
	});

	const textOpacity = animateButton.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 1],
	});
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
				<FloatingText mode={time} />
			</Animated.View>
			<Animated.View
				style={[
					StyleSheet.absoluteFillObject,
					{
						justifyContent: "flex-end",
						alignItems: "center",
						paddingBottom: 100,
						opacity,
						transform: [
							{
								translateY,
							},
						],
					},
				]}
			>
				<TouchableOpacity onPress={buttonClicked}>
					<MaterialIcons
						name="play-circle-filled"
						size={80}
						color={colors.red}
						style={styles.roundButton}
					/>
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
				<Animated.View
					style={{
						position: "absolute",
						width: itemSize,
						justifyContent: "center",
						alignSelf: "center",
						alignItems: "center",
						opacity: textOpacity,
					}}
				></Animated.View>
				<Animated.FlatList
					data={timers}
					keyExtractor={(item) => item.toString()}
					horizontal
					bounces={false}
					showsHorizontalScrollIndicator={false}
					onMomentumScrollEnd={(event) => {
						const index = Math.round(
							event.nativeEvent.contentOffset.x / itemSize,
						);
						setDuration(timers[index] * 60);
					}}
					onScroll={Animated.event(
						[{ nativeEvent: { contentOffset: { x: xScroll } } }],
						{ useNativeDriver: true },
					)}
					snapToInterval={itemSize}
					decelerationRate="fast"
					style={{ flexGrow: 0, opacity }}
					contentContainerStyle={{
						paddingHorizontal: itemSpacing,
					}}
					renderItem={({ item, index }) => {
						const inputRange = [
							(index - 1) * itemSize,
							index * itemSize,
							(index + 1) * itemSize,
						];

						const opacity = xScroll.interpolate({
							inputRange,
							outputRange: [0.4, 1, 0.4],
						});

						const scale = xScroll.interpolate({
							inputRange,
							outputRange: [0.6, 1, 0.6],
						});
						return (
							<View
								style={{
									width: itemSize,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<Animated.Text
									style={[
										styles.text,
										{
											opacity,
											transform: [
												{
													scale,
												},
											],
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
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.black,
	},
	text: {
		fontSize: itemSize * 0.8,
		color: colors.text,
		fontWeight: "800",
	},
});
