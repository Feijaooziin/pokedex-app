import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar Pokémon"
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        onPress={() => value.length > 0 && onChange("")}
        style={styles.clearButton}
        activeOpacity={0.7}
      >
        {value.length > 0 ? (
          <MaterialCommunityIcons name="close" size={22} color="#999" />
        ) : (
          <MaterialCommunityIcons name="pokeball" size={22} color="#E3350D" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    marginBottom: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 48, // espaço pro ícone
    height: 44,
    fontSize: 16,
    elevation: 2,
  },

  clearButton: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -11 }],
  },
});
