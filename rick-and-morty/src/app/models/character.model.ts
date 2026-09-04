// Paso 2: contrato de datos de https://rickandmortyapi.com/api/character
// Tipar la respuesta real de la API da autocompletado y errores en compilacion,
// no en produccion.

/** La API solo devuelve estos tres valores en `status`. */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/** Metadatos de paginacion que acompanan a cada pagina de resultados. */
export interface PageInfo {
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
}

/** Referencia a otro recurso de la API (origen y ubicacion). */
export interface ResourceRef {
  name: string;
  url: string;
}

export interface CharacterResponse {
  info: PageInfo;
  results: Character[];
}

export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: string;
  image: string;
  origin: ResourceRef;
  location: ResourceRef;
}
