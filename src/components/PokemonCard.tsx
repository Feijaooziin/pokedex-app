import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getPokemonDetails } from "../services/pokemonService";
import { typeColors } from "../utils/typeColors";

interface Props {
  name: string;
  id: string;
  onPress: () => void;
}

export default function PokemonCard({ name, id, onPress }: Props) {
  const [type, setType] = useState("normal");

  useEffect(() => {
    getPokemonDetails(name).then((data) => setType(data.types[0].type.name));
  }, [name]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: typeColors[type] }]}
      onPress={onPress}
    >
      <Text style={styles.name}>#{id}</Text>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
