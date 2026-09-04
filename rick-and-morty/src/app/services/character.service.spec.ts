import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CharacterService } from './character.service';
import { CharacterResponse } from '../models/character.model';

describe('CharacterService', () => {
  let service: CharacterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(CharacterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('pide la pagina indicada', () => {
    service.getCharacters(3).subscribe();

    const req = httpMock.expectOne((r) => r.url === 'https://rickandmortyapi.com/api/character');
    expect(req.request.params.get('page')).toBe('3');
    expect(req.request.params.get('name')).toBeNull();
    req.flush({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
  });

  it('anade el filtro ?name= cuando hay busqueda', () => {
    service.getCharacters(1, '  rick  ').subscribe();

    const req = httpMock.expectOne((r) => r.url === 'https://rickandmortyapi.com/api/character');
    expect(req.request.params.get('name')).toBe('rick');
    req.flush({ info: { count: 0, pages: 0, next: null, prev: null }, results: [] });
  });

  it('convierte el 404 del filtro sin resultados en una lista vacia', () => {
    let received: CharacterResponse | undefined;
    service.getCharacters(1, 'zzzzz').subscribe((r) => (received = r));

    httpMock
      .expectOne((r) => r.url === 'https://rickandmortyapi.com/api/character')
      .flush({ error: 'There is nothing here' }, { status: 404, statusText: 'Not Found' });

    expect(received?.results).toEqual([]);
    expect(received?.info.pages).toBe(0);
  });

  it('propaga los errores reales', () => {
    let failed = false;
    service.getCharacters().subscribe({ error: () => (failed = true) });

    httpMock
      .expectOne((r) => r.url === 'https://rickandmortyapi.com/api/character')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(failed).toBe(true);
  });
});
