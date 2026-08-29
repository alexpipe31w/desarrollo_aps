import { Routes } from '@angular/router';
import { Formulario } from './paginas/formulario/formulario';
import { Ejercicio } from './paginas/ejercicio/ejercicio';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'formulario',
        pathMatch: 'full'
    },
    {
        path: 'formulario',
        component: Formulario
    },
    {
        path: 'ejercicio',
        component: Ejercicio
    }
];
