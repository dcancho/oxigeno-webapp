import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { OxigenoService } from '../oxigeno.service'; // Asegúrate de que la ruta de importación sea correcta
import { internados } from '../interface/intermedio.location'; // Import the 'hospital' interface
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
  oxigeno_disponible = new FormControl('');
  errorMessage: string | null = null;

  constructor(private oxigenoService: OxigenoService,private router: Router) { }

  allFieldsFilled() {
    return this.dniPaciente.value && this.oxigeno_disponible.value;
  }
  onSubmit() {
    if (this.allFieldsFilled() && this.dniPaciente?.value) {
      this.oxigenoService.getOxygenProvidersByDNI(this.dniPaciente.value.toString())
        .subscribe({
          next: (response: any[]) => {
            // Verificar si el paciente se encontró y redirigir al mapa correspondiente
            if (response.length > 0) {
              this.router.navigate(['/mapabusqueda'], { queryParams: { dni: this.dniPaciente.value, oxygenAmount: this.oxigeno_disponible.value } });
            } else {
              this.errorMessage = 'Los datos son incorrectos o incompletos.';
            }
          },
          error: (err) => {
            console.error(err);
            this.errorMessage = 'Ocurrió un error al buscar los datos.';
          }
        });
    }
  }
}