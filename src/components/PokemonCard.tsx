import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";
import { useEffect, useState } from "react";
import { getPokemonDetails } from "../services/pokemonService";
import { typeColors } from "../utils/typeColors";

interface Props {
  name: string;
  id?: string;
  onPress: () => void;
}

export default function PokemonCard({ name, id, onPress }: Props) {
  const [type, setType] = useState("normal");
  const sprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${Number(id)}.png`;

  useEffect(() => {
    getPokemonDetails(name).then((data) => setType(data.types[0].type.name));
  }, [name]);

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: typeColors[type] }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.id}>#{id}</Text>
      <Text style={styles.name}>{name}</Text>

      <Image
        source={{ uri: sprite }}
        style={styles.sprite}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 14,
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 4,
    overflow: "hidden",
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    // Android
    elevation: 10,
  },
  name: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  id: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "600",
  },

  sprite: {
    width: 48,
    height: 48,
    position: "absolute",
    bottom: 6,
    right: 6,
    zIndex: 2,
  },
});
