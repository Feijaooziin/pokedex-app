import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { generations } from "../utils/generations";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function GenerationSelect({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Geração</Text>
      <Picker selectedValue={value} onValueChange={onChange}>
        {generations.map((g) => (
          <Picker.Item key={g.id} label={g.label} value={g.id} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
  },
});
