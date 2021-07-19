import * as React from "react";
import {
	Vibration,
	StatusBar,
	Easing,
	FlatList,
	TextInput,
	Animated,
	Dimensions,
	TouchableOpacity,
	Text,
	View,
	StyleSheet,
} from "react-native";

import colors from "../config/colors";

const { width, height } = Dimensions.get("window");

const timers = [...Array(10).keys()].map((i) => (i === 0 ? 1 : i * 5));
const itemSize = width * 0.38;
const itemSpacing = (width - itemSize) / 2;

export default function App() {
	const [duration, setDuration] = React.useState(timers[0]);

	const xScroll = React.useRef(new Animated.Value(0)).current;

	const timerAnimation = React.useRef(new Animated.Value(height)).current;
	const animateButton = React.useRef(new Animated.Value(0)).current;
	const animateTextInput = React.useRef(new Animated.Value(timers[0])).current;

	const inputRef = React.useRef();

	// const toTime = (seconds) => {
	// 	var date = new Date(null);
	// 	date.setSeconds(seconds);
	// 	return date.toISOString().substr(11, 8);
	// };
	React.useEffect(() => {
		const listner = animateTextInput.addListener(({ value }) => {
			inputRef?.current?.setNativeProps({
				text: Math.ceil(value * 60).toString(),
				// text: toTime(value * 60),
			});
		});
		return () => {
			animateTextInput.removeListener(listner);
			animateTextInput.removeAllListeners();
		};
	});

	const animations = React.useCallback(() => {
		animateTextInput.setValue(duration);
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
				Animated.timing(animateTextInput, {
					toValue: 0,
					duration: duration * 1000 * 60,
					useNativeDriver: true,
				}),
				Animated.timing(timerAnimation, {
					toValue: height,
					duration: duration * 1000 * 60,
					useNativeDriver: true,
				}),
			]),
		]).start(() => {
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
			/>
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
				<TouchableOpacity onPress={animations}>
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
				<Animated.View
					style={{
						position: "absolute",
						width: itemSize,
						justifyContent: "center",
						alignSelf: "center",
						alignItems: "center",
						opacity: textOpacity,
					}}
				>
					<TextInput
						ref={inputRef}
						style={styles.text}
						defaultValue={duration.toString()}
					/>
				</Animated.View>
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
	roundButton: {
		width: 80,
		height: 80,
		borderRadius: 80,
		backgroundColor: colors.red,
	},
	text: {
		fontSize: itemSize * 0.8,
		color: colors.text,
		fontWeight: "800",
	},
});
