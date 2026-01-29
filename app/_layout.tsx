import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Pokédex do Feijão",
        }}
      />

      <Stack.Screen
        name="pokemon/[name]"
        options={{
          title: "Detalhes do Pokémon",
        }}
      />
    </Stack>
  );
}
