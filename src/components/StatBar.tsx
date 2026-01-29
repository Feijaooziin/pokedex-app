import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { typeColors } from "../utils/typeColors";

interface Props {
  label: string;
  value: number;
  color: string;
}

export function StatBar({ label, value, color }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const width = animatedValue.interpolate({
    inputRange: [0, 150],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width,
              backgroundColor: color,
            },
          ]}
        />
      </View>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    width: 60,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#eee",
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 8,
  },
  barFill: {
    height: "100%",
    borderRadius: 4,
  },
  value: {
    width: 30,
    textAlign: "right",
    fontWeight: "600",
  },
});
