import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ejercicio',
  imports: [FormsModule],
  templateUrl: './ejercicio.html',
  styleUrl: './ejercicio.css',
})
export class Ejercicio {

nombre : string = 'alex';

cambiarNombre() {
  if (this.nombre === 'alex') {
    this.nombre = 'juan';
  } else {
    this.nombre = 'alex';
  }

}

numero1 : number | null = null;
numero2 : number | null = null;
operacion : string = '';
resultado : string = '';

operar() {
  if (this.numero1 === null || this.numero2 === null) {
    this.resultado = 'escribe los dos numeros';
    return;
  }

  if (this.operacion === '') {
    this.resultado = 'selecciona una operacion';
    return;
  }

  if (this.operacion === '+') {
    this.resultado = this.numero1 + ' + ' + this.numero2 + ' = ' + (this.numero1 + this.numero2);
  } else if (this.operacion === '-') {
    this.resultado = this.numero1 + ' - ' + this.numero2 + ' = ' + (this.numero1 - this.numero2);
  } else if (this.operacion === 'x') {
    this.resultado = this.numero1 + ' x ' + this.numero2 + ' = ' + (this.numero1 * this.numero2);
  } else if (this.operacion === '/') {
    if (this.numero2 === 0) {
      this.resultado = 'no se puede dividir entre 0';
    } else {
      this.resultado = this.numero1 + ' / ' + this.numero2 + ' = ' + (this.numero1 / this.numero2);
    }
  }

}
}
