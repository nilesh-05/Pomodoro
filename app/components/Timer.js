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

const { width, height } = Dimensions.get("window");
const timerArray = [...Array(10).keys()].map((i) => (i === 0 ? 1 : i * 5));
const SIZE = width * 0.3;
const SPACING = (width - SIZE) / 2;

const Timer = () => {
  const scrollX = React.useRef(new Animated.Value(0)).current;
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text>Timer Component</Text>
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
        <TouchableOpacity onPress={() => {}}>
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
        <Animated.FlatList
          data={timerArray}
          keyExtractor={(item) => item.toString()}
          horizontal
          bounces={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Helvetica",
    color: colors.text,
    fontWeight: "900",
  },
});
