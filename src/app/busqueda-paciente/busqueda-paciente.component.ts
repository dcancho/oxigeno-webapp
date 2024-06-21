import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { OxigenoService } from '../oxigeno.service'; // Asegúrate de que la ruta de importación sea correcta
import {OxygenProviderResponse}from '../interface/patiend.interface';
import { Router } from '@angular/router';


@Component({
  selector: 'app-busqueda-paciente',
  standalone: true,
  imports: [  
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule],
  templateUrl: './busqueda-paciente.component.html',
  styleUrl: './busqueda-paciente.component.css'
})
export class BusquedaPacienteComponent {
  dniPaciente = new FormControl('');
  centroSalud = new FormControl('');
  requerimientoOxigeno = new FormControl('');
  errorMessage: string | null = null;

  constructor(private oxigenoService: OxigenoService,private router: Router) { }

  allFieldsFilled() {
    return this.dniPaciente.value && this.centroSalud.value && this.requerimientoOxigeno.value;
  }
  onSubmit() {
    if (this.allFieldsFilled()) {
      this.oxigenoService.getOxygenProviders(
        this.dniPaciente.value?.toString()??'',
        this.centroSalud.value?.toString()??'',
        this.requerimientoOxigeno.value?.toString()??'',
        'high' // reemplaza esto con el valor real de searchIntensity
      ).subscribe((response: OxygenProviderResponse[]) => {
        let found = false;
        response.forEach(paciente => {
          if(paciente.patientId === this.dniPaciente.value && paciente.healthcareCenter === this.centroSalud.value) {
          }
            found = true;
        });
        if (found) {
          // Redirige a la siguiente página
          this.router.navigate(['/mapabusqueda']);
        } else {
          // Muestra un mensaje de error
          this.errorMessage = 'Los datos son incorrectos';
        }
      });
    }
  }
}