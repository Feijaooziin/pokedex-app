import { View, StyleSheet } from "react-native";

export function SkeletonGrid() {
  return (
    <View style={styles.container}>
      {[...Array(6)].map((_, i) => (
        <View key={i} style={styles.skeleton} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
  },
  skeleton: {
    width: "48%",
    height: 100,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 12,
  },
});
