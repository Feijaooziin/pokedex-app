import { TextInput, StyleSheet } from "react-native";

interface Props {
  value: string;
  onChange: (text: string) => void;
}

export function SearchBar({ value, onChange }: Props) {
  return (
    <TextInput
      placeholder="Buscar Pokémon..."
      placeholderTextColor={"#777"}
      style={styles.input}
      value={value}
      onChangeText={onChange}
      autoCapitalize="none"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    color: "#000",
  },
});
