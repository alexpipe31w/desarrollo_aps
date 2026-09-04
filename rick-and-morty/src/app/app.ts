import { Component } from '@angular/core';
import { CharacterListComponent } from './components/character-list/character-list.component';

// Paso 7: la raiz solo compone. Toda la logica vive en el componente de lista.
@Component({
  selector: 'app-root',
  imports: [CharacterListComponent],
  template: `<app-character-list />`,
})
export class App {}
