import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaPacienteComponent } from './busqueda-paciente.component';

describe('BusquedaPacienteComponent', () => {
  let component: BusquedaPacienteComponent;
  let fixture: ComponentFixture<BusquedaPacienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusquedaPacienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusquedaPacienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
