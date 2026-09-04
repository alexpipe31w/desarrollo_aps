import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError, timeout } from 'rxjs';
import { CharacterResponse } from '../models/character.model';

/** Respuesta vacia: se usa cuando el filtro no encuentra a nadie. */
const EMPTY_RESPONSE: CharacterResponse = {
  info: { count: 0, pages: 0, next: null, prev: null },
  results: [],
};

/**
 * Paso 3: aisla la red del componente.
 * El componente no sabe que existe una URL; solo pide personajes.
 */
@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://rickandmortyapi.com/api/character';

  /**
   * @param page  pagina a pedir (la API empieza en 1)
   * @param name  filtro opcional por nombre (parametro ?name= de la API)
   */
  getCharacters(page: number = 1, name: string = ''): Observable<CharacterResponse> {
    // HttpParams escapa los valores: si alguien busca "rick&morty" no rompe la URL.
    let params = new HttpParams().set('page', page);
    const term = name.trim();
    if (term) {
      params = params.set('name', term);
    }

    return this.http.get<CharacterResponse>(this.apiUrl, { params }).pipe(
      // Toda llamada externa necesita techo: sin timeout, una red colgada deja
      // la UI en "Cargando..." para siempre.
      timeout(10_000),
      catchError((error: unknown) => {
        // Rareza de esta API: cuando ningun personaje coincide con el filtro
        // responde 404, no una lista vacia. Eso no es un fallo, es "sin resultados".
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return of(EMPTY_RESPONSE);
        }
        return throwError(() => error);
      }),
    );
  }
}
