import { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError, GenericAbortSignal } from "axios";

interface IResults {
  name: string;
  url: string;
}

interface IPokeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: IResults[];
}

export interface IPokeDetailList {
  id: number;
  name: string;
  image: string;
}

const usePokemon = (isBottom: boolean) => {
  const [pokemonList, setPokemonList] = useState<IPokeDetailList[]>([]);
  const [error, setError] = useState<AxiosError>();

  const nextRef = useRef<string | null>(null);

  const fetchPokemonDetails = useCallback(
    ({ url, signal }: { url: string; signal: GenericAbortSignal }) => {
      return axios.get(url, { signal });
    },
    []
  );

  const fetchAll = useCallback(
    async ({
      pokemonList,
      signal,
    }: {
      pokemonList: IPokeListResponse;
      signal: GenericAbortSignal;
    }) => {
      try {
        const response = await Promise.all(
          pokemonList.results.map(({ url }) =>
            fetchPokemonDetails({ url, signal })
          )
        );
        const sanitizedResponse: {
          id: number;
          name: string;
          image: string;
        }[] = response.map(
          ({
            data: {
              id,
              name,
              sprites: { front_default },
            },
          }) => {
            return { id, name, image: front_default };
          }
        );
        setPokemonList((prev) => [...prev, ...sanitizedResponse]);
      } catch (error) {
        if (error instanceof AxiosError) {
          setError(error);
        }
      }
    },
    [fetchPokemonDetails]
  );

  const fetchPokemon = useCallback(
    async ({
      signal,
      url = "https://pokeapi.co/api/v2/pokemon",
    }: {
      signal: GenericAbortSignal;
      url?: string;
    }) => {
      try {
        const fetchPokemonList = async (): Promise<IPokeListResponse> => {
          const pokemonList = await axios.get(url, {
            signal,
          });
          return pokemonList.data;
        };

        const pokemonList = await fetchPokemonList();
        nextRef.current = pokemonList.next;
        fetchAll({ pokemonList, signal });
      } catch (error: unknown) {
        if (signal.aborted) return;
        if (error instanceof AxiosError) {
          setError(error);
        }
      }
    },
    [fetchAll]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchPokemon({ signal: controller.signal });
    return () => {
      controller.abort();
    };
  }, [fetchPokemon]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (isBottom && nextRef.current) {
      fetchPokemon({ signal, url: nextRef.current });
    }

    return () => {
      controller.abort();
    };
  }, [fetchPokemon, isBottom]);

  return {
    data: pokemonList,
    loading: !pokemonList && !error,
    error,
  };
};

export default usePokemon;
