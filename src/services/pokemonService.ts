import { api } from "./api";
import { PokemonDetails } from "../types/pokemon";

export async function getPokemons() {
  const response = await api.get("/pokemon?limit=493&offset=0");
  return response.data.results;
}

export async function getPokemonDetails(name: string): Promise<PokemonDetails> {
  const response = await api.get(`/pokemon/${name}`);
  return response.data;
}
