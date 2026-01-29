import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { useRouter } from "expo-router";
import { getPokemons } from "../src/services/pokemonService";
import PokemonCard from "../src/components/PokemonCard";
import { SearchBar } from "../src/components/SearchBar";
import { SkeletonGrid } from "../src/components/SkeletonGrid";

export default function Home() {
  const [pokemons, setPokemons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const data = await getPokemons();
      setPokemons(data);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = pokemons.filter((p) =>
    p.name.includes(search.toLowerCase()),
  );

  if (loading) return <SkeletonGrid />;

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <SearchBar value={search} onChange={setSearch} />

      <FlatList
        data={filtered}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <PokemonCard
            name={item.name}
            onPress={() => router.push(`/pokemon/${item.name}`)}
          />
        )}
      />
    </View>
  );
}
