import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { ActivatedRoute, Router } from '@angular/router';
import { OxigenoService } from '../oxigeno.service';
import { internados } from '../interface/intermedio.location';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar'; 

@Component({
  selector: 'app-mapa-1',
  standalone: true,
  templateUrl: './mapa-1.component.html',
  styleUrls: ['./mapa-1.component.css'],
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatToolbarModule]
})
export class Mapa1Component implements AfterViewInit {
  private map: any;
  private oxygenAmount: number = 0;  // Almacena la cantidad de oxígeno solicitada

  constructor(private route: ActivatedRoute, private router: Router, private oxigenoService: OxigenoService) { }

  private initMap(): void {
    // Inicializar el mapa en un punto neutro (para evitar errores iniciales)
    this.map = L.map('map').setView([0, 0], 15);

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; OpenStreetMap contributors'
    });

    tiles.addTo(this.map);
  }

  private addMarker(lat: number, lng: number, hospitalData: any, showButton: boolean): void {
    const popupContent = `
      Nombre: ${hospitalData.nombre}<br>
      Dirección: ${hospitalData.direccion}<br>
      Distrito: ${hospitalData.distrito}<br>
      Oxígeno Disponible: ${hospitalData.oxigeno_disponible}<br>
      Costo Oxígeno: ${hospitalData.costo_oxigeno}<br>
      ${showButton ? '<button id="request-oxygen-btn">Solicitar Oxígeno</button>' : ''}
    `;

    const marker = L.marker([lat, lng]).addTo(this.map)
      .bindPopup(popupContent)
      .openPopup();

    if (showButton) {
      marker.on('popupopen', () => {
        const button = document.getElementById('request-oxygen-btn');
        if (button) {
          button.addEventListener('click', () => this.handleClickOxygenRequest(hospitalData));
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      const dni = params['dni'];
      this.oxygenAmount = +params['oxygenAmount'];
  
      if (dni) {
        this.oxigenoService.getOxygenProvidersByDNI(dni).subscribe({
          next: (response: internados[]) => {
            const paciente = response.find(p => p.pacienteData.dni === dni);
            if (paciente && paciente.hospitalData.latitud && paciente.hospitalData.longitud) {
              const { latitud, longitud } = paciente.hospitalData;
  
              // Inicializar el mapa y centrarlo en el hospital del paciente
              this.initMap();
              this.addMarker(latitud, longitud, paciente.hospitalData, false);
  
              // Guardar las coordenadas del hospital del paciente para centrar el mapa más tarde
              const patientHospitalCoords = [latitud, longitud];
              if (this.oxygenAmount && this.oxygenAmount > 0) {
                this.oxigenoService.getHospitalsByDistrictAndOxygen(dni, this.oxygenAmount).subscribe({
                  next: (hospitals: any[]) => {
                    hospitals.forEach(hospital => {
                      if (hospital.latitud && hospital.longitud && hospital.oxigeno_disponible >= this.oxygenAmount && hospital.distrito === paciente.hospitalData.distrito) {
                        const showButton = hospital.id !== paciente.hospitalData.id_hospital;
                        this.addMarker(hospital.latitud, hospital.longitud, hospital, showButton);
                      }
                    });
                    this.map.setView(patientHospitalCoords, 15);
                  },
                  error: (err) => {
                    console.error(err);
                  }
                });
              } else {
                // Si no se especifica una cantidad de oxígeno, simplemente centrar el mapa en el hospital del paciente
                this.map.setView(patientHospitalCoords, 15);
              }
            } else {
              console.error('Datos del paciente no encontrados o incompletos');
            }
          },
          error: (err) => {
            console.error(err);
          }
        });
      } else {
        console.error('DNI no proporcionado en los parámetros de consulta');
      }
    });
  }

  handleClickOxygenRequest(hospitalData: any) {
    const newOxygenAmount = hospitalData.oxigeno_disponible - this.oxygenAmount;
    if (newOxygenAmount >= 0) {
      this.oxigenoService.updateOxygenAvailability(hospitalData.id_hospital, newOxygenAmount).subscribe({
        next: (response) => {
          // Redirigir a la página principal después de la solicitud
          this.router.navigate(['/OxigenoYa']);
        },
        error: (err) => {
          console.error(err);
        }
      });
    } else {
      console.error('Oxígeno insuficiente en el hospital');
    }
  }
}
