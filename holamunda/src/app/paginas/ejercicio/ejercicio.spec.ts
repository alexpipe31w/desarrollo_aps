import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ejercicio } from './ejercicio';

describe('Ejercicio', () => {
  let component: Ejercicio;
  let fixture: ComponentFixture<Ejercicio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ejercicio],
    }).compileComponents();

    fixture = TestBed.createComponent(Ejercicio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
