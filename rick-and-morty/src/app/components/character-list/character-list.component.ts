import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { CharacterService } from '../../services/character.service';
import { Character } from '../../models/character.model';

/** Lo que define una consulta a la API: que pagina, que filtro y que intento. */
interface Query {
  page: number;
  name: string;
  attempt: number;
}

@Component({
  selector: 'app-character-list',
  // OJO: no se importa CommonModule. Con @if / @for el control de flujo lo trae
  // el compilador de Angular, ya no hacen falta NgIf ni NgFor.
  imports: [],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css',
})
export class CharacterListComponent {
  private readonly characterService = inject(CharacterService);

  // --- Estado (Paso 4 + reto 3: signals en vez de campos sueltos) ------------
  // En Angular 21 la app es zoneless: si el estado fueran propiedades normales
  // (`characters: Character[] = []`), asignarlas dentro de un subscribe NO
  // avisaria a Angular y la vista se quedaria en blanco. Los signals si avisan.
  readonly characters = signal<Character[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  // --- Estado de la consulta (retos 1 y 2) ----------------------------------
  readonly page = signal(1);
  readonly totalPages = signal(0);
  readonly nameFilter = signal('');

  /** Contador que solo sirve para forzar un reintento de la misma consulta. */
  private readonly attempt = signal(0);

  // Derivados: se recalculan solos cuando cambia algo de lo de arriba.
  readonly hasPrev = computed(() => this.page() > 1);
  readonly hasNext = computed(() => this.page() < this.totalPages());
  readonly isEmpty = computed(
    () => !this.loading() && !this.errorMessage() && this.characters().length === 0,
  );

  /** Una sola fuente de verdad para la peticion. */
  private readonly query = computed<Query>(() => ({
    page: this.page(),
    name: this.nameFilter(),
    attempt: this.attempt(),
  }));

  constructor() {
    toObservable(this.query)
      .pipe(
        tap(() => {
          this.loading.set(true);
          this.errorMessage.set(null);
        }),
        // El filtro dispara una consulta por tecla pulsada: se espera a que el
        // usuario pare de escribir.
        debounceTime(300),
        distinctUntilChanged(
          (a, b) => a.page === b.page && a.name === b.name && a.attempt === b.attempt,
        ),
        // switchMap cancela la peticion anterior al llegar una nueva. Sin esto,
        // si la respuesta de "ri" llega despues que la de "rick", la pantalla
        // acaba mostrando el resultado equivocado.
        switchMap((query) =>
          this.characterService.getCharacters(query.page, query.name).pipe(
            // El error se captura AQUI DENTRO, no en el `error:` del subscribe:
            // si el error sale al observable exterior, este se completa y el
            // componente deja de reaccionar a nuevos filtros o paginas.
            catchError((error: unknown) => {
              console.error('Error al obtener personajes:', error);
              this.errorMessage.set('Hubo un error al cargar los personajes. Intente de nuevo.');
              this.loading.set(false);
              return of(null);
            }),
          ),
        ),
        // Cancela la suscripcion cuando el componente se destruye.
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (response) => {
          if (response === null) {
            return; // ya lo gestiono el catchError
          }
          this.characters.set(response.results);
          this.totalPages.set(response.info.pages);
          this.loading.set(false);
        },
      });
  }

  // --- Acciones de la vista --------------------------------------------------

  /** Reto 2: filtro por nombre. Cambiar el filtro reinicia la paginacion. */
  onSearch(term: string): void {
    this.nameFilter.set(term);
    this.page.set(1);
  }

  /** Reto 1: paginacion con los datos de `info.pages`. */
  nextPage(): void {
    if (this.hasNext()) {
      this.page.update((current) => current + 1);
    }
  }

  prevPage(): void {
    if (this.hasPrev()) {
      this.page.update((current) => current - 1);
    }
  }

  /** Reintento manual tras un error: repite la consulta actual. */
  retry(): void {
    this.attempt.update((current) => current + 1);
  }
}
