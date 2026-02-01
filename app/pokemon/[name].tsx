import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getPokemonDetails } from "../../src/services/pokemonService";
import { typeColors } from "../../src/utils/typeColors";
import { api } from "../../src/services/api";
import { StatBar } from "../../src/components/StatBar";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";

export default function PokemonDetails() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<any>(null);
  const [weaknesses, setWeaknesses] = useState<string[]>([]);
  const [strengths, setStrengths] = useState<string[]>([]);
  const [isShiny, setIsShiny] = useState(false);
  const router = useRouter();
  const currentId = pokemon ? pokemon.id : 1;
  const prevId = currentId > 1 ? currentId - 1 : null;
  const nextId = currentId < 493 ? currentId + 1 : null;
  const playSwitchSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/switch.mp3"),
        { volume: 0.6 },
      );

      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {
      console.log("Erro ao tocar som", e);
    }
  };

  useEffect(() => {
    if (!name) return;

    async function load() {
      const data = await getPokemonDetails(name);
      setPokemon(data);

      // 🔥 calcular fraquezas
      const types = data.types.map((t: any) => t.type.name);
      const weaknessesSet = new Set<string>();
      const strengthsSet = new Set<string>();

      for (const type of types) {
        const res = await api.get(`/type/${type}`);

        // ❌ Fraquezas
        res.data.damage_relations.double_damage_from.forEach((t: any) =>
          weaknessesSet.add(t.name),
        );

        // 🔥 Forças
        res.data.damage_relations.double_damage_to.forEach((t: any) =>
          strengthsSet.add(t.name),
        );
      }

      setWeaknesses(Array.from(weaknessesSet));
      setStrengths(Array.from(strengthsSet));
    }

    load();
  }, [name]);

  if (!pokemon) return null;

  const mainType = pokemon.types[0].type.name;

  const statMap: Record<string, string> = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SP. ATK",
    "special-defense": "SP. DEF",
    speed: "SPD",
  };

  const getSprite = () => {
    const animated =
      pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated;

    if (animated) {
      return isShiny ? animated.front_shiny : animated.front_default;
    }

    return isShiny
      ? pokemon.sprites.front_shiny
      : pokemon.sprites.front_default;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#E3350D" },
          headerTitle: () => (
            <View style={{ alignItems: "center" }}>
              <Image
                source={{
                  uri:
                    pokemon.sprites.other?.showdown?.front_default ||
                    pokemon.sprites.front_default,
                }}
                style={{ width: 32, height: 32 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  color: "#fff",
                  fontSize: 14,
                  marginTop: 2,
                  textTransform: "capitalize",
                }}
              >
                #{String(pokemon.id).padStart(3, "0")} - {pokemon.name}
              </Text>
            </View>
          ),
        }}
      />

      <ScrollView style={styles.root}>
        {/* 🔴 GRADIENTE POKÉDEX */}
        <LinearGradient
          colors={["#E3350D", "#D32F2F", "#B71C1C"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBackground}
        />

        {/* ✨ TROCAR PARA SHINY */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: getSprite() }}
            style={styles.image}
            resizeMode="contain"
          />
          <View style={{ alignItems: "center" }}>
            <Text style={{ fontSize: 16, marginTop: 16, fontWeight: "700" }}>
              ⇄ Trocar ⇄
            </Text>
            <TouchableOpacity
              style={styles.shinyButton}
              onPress={() => setIsShiny((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Text style={styles.shinyText}>
                {isShiny ? "✨Shiny✨" : "Normal"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* brilho */}
          <View style={styles.glow} />
        </View>

        {/* ⚪ CARD */}
        <View style={styles.card}>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.number}>
            #{String(pokemon.id).padStart(3, "0")}
          </Text>

          {/* TIPOS */}
          <View style={styles.types}>
            {pokemon.types.map((t: any) => (
              <View
                key={t.type.name}
                style={[
                  styles.typeBadge,
                  { backgroundColor: typeColors[t.type.name] },
                ]}
              >
                <Text style={styles.typeText}>{t.type.name}</Text>
              </View>
            ))}
          </View>

          {/* INFO */}
          <View style={styles.infoRow}>
            <Text style={styles.label}>Altura</Text>
            <Text>{pokemon.height / 10} m</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Peso</Text>
            <Text>{pokemon.weight / 10} kg</Text>
          </View>

          {/* STATS */}
          <Text style={styles.section}>Base Stats</Text>
          {pokemon.stats.map((stat: any) => (
            <StatBar
              key={stat.stat.name}
              label={statMap[stat.stat.name]}
              value={stat.base_stat}
              color={typeColors[mainType]}
            />
          ))}

          {/* FORÇAS */}
          <Text style={styles.section}>Forte contra</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typesScroll}
          >
            {strengths.map((s) => (
              <View
                key={s}
                style={[styles.typeBadge, { backgroundColor: typeColors[s] }]}
              >
                <Text style={styles.typeText}>{s}</Text>
              </View>
            ))}
          </ScrollView>

          {/* FRAQUEZAS */}
          <Text style={styles.section}>Fraco contra</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.typesScroll}
          >
            {weaknesses.map((w) => (
              <View
                key={w}
                style={[styles.typeBadge, { backgroundColor: typeColors[w] }]}
              >
                <Text style={styles.typeText}>{w}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      {/* ⬅️➡️ NAVEGAÇÃO */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          style={[styles.navButton, !prevId && styles.navButtonDisabled]}
          disabled={!prevId}
          onPress={async () => {
            if (prevId) {
              await playSwitchSound();
              router.replace(`/pokemon/${prevId}`);
            }
          }}
        >
          <Text style={styles.navText}>◀ Anterior</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navButton, !nextId && styles.navButtonDisabled]}
          disabled={!nextId}
          onPress={async () => {
            if (nextId) {
              await playSwitchSound();
              router.replace(`/pokemon/${nextId}`);
            }
          }}
        >
          <Text style={styles.navText}>Próximo ▶</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  headerBackground: {
    height: 260,
    width: "100%",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  imageWrapper: {
    marginTop: -140,
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: 180,
    height: 180,
    zIndex: 2,
  },

  glow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#FF5252",
    opacity: 0.35,
    top: 20,
    zIndex: 1,
  },

  name: {
    fontSize: 32,
    fontWeight: "700",
    textTransform: "capitalize",
    textAlign: "center",
  },

  types: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 8,
    justifyContent: "center",
  },

  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  typeText: {
    color: "#fff",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 20,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },

  section: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },

  label: {
    fontWeight: "600",
  },

  typesScroll: {
    paddingVertical: 6,
    gap: 8,
  },

  shinyButton: {
    marginTop: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FF5252",
  },

  shinyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  number: {
    fontSize: 20,
    color: "#000",
    marginBottom: 8,
    fontWeight: "500",
    letterSpacing: 1,
    textAlign: "center",
  },

  navButtons: {
    backgroundColor: "#FF5252",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },

  navButton: {
    backgroundColor: "#D32F2F",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },

  navButtonDisabled: {
    opacity: 0.6,
  },

  navText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },
});
