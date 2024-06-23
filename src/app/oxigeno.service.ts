  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
  import { internados } from './interface/intermedio.location';
  @Injectable({
    providedIn: 'root'
  })
  export class OxigenoService {
    private baseUrl = 'http://localhost:3000'; // reemplaza esto con la URL base de tu API
  
    constructor(private http: HttpClient) { }
      
    getOxygenProvidersByDNI(dni: string): Observable<internados[]> {
      // Actualiza los parámetros para incluir solo el dni del paciente
      const queryParams = new URLSearchParams({ 
        "pacienteData.dni": dni
      }).toString();
      const url = `${this.baseUrl}/internados?${queryParams}`;
      return this.http.get<internados[]>(url).pipe(
        catchError(error => {
          console.error("Error fetching data: ", error);
          return throwError(error);
        })
      );
    }
  
    getHospitalsByDistrictAndOxygen(dni: string, oxygenAmount: number): Observable<any[]> {
      const patientQueryParams = new URLSearchParams({ 
        "pacienteData.dni": dni
      }).toString();
      const patientUrl = `${this.baseUrl}/internados?${patientQueryParams}`;
  
      return this.http.get<internados[]>(patientUrl).pipe(
        switchMap((patients: internados[]): Observable<any[]> => {
          const patient = patients.find(p => p.pacienteData.dni === dni);
          if (patient) {
            const district = patient.hospitalData.distrito;
            const hospitalQueryParams = new URLSearchParams({ 
              "distrito": district,
              "oxigeno_disponible_gte": oxygenAmount.toString()
            }).toString();
            const hospitalsUrl = `${this.baseUrl}/Hospitales?${hospitalQueryParams}`;
            return this.http.get<any[]>(hospitalsUrl).pipe(
              map((hospitals: any[]) => hospitals.filter(h => h.oxigeno_disponible >= oxygenAmount)),
              catchError(error => {
                console.error("Error fetching hospitals: ", error);
                return throwError(error);
              })
            );
          } else {
            throw new Error('Patient not found');
          }
        }),
        catchError(error => {
          console.error("Error fetching patient: ", error);
          return throwError(error);
        })
      );
    }
    requestOxygen(hospitalId: number, oxygenAmount: number): Observable<any> {
      if (!hospitalId) {
        return throwError(() => new Error('Hospital ID is undefined'));
      }
      const url = `${this.baseUrl}/Hospitales/${hospitalId}`;
      return this.http.get<any>(url).pipe(
        switchMap((hospital: any) => {
          if (hospital.oxigeno_disponible >= oxygenAmount) {
            hospital.oxigeno_disponible -= oxygenAmount;
            return this.http.put<any>(url, hospital).pipe(
              catchError(error => {
                console.error("Error updating hospital data: ", error);
                return throwError(error);
              })
            );
          } else {
            // Aquí se usa throwError para manejar correctamente el flujo de errores en RxJS
            return throwError(() => new Error('Insufficient oxygen available'));
          }
        }),
        catchError(error => {
          console.error("Error requesting oxygen: ", error);
          return throwError(error);
        })
      );
    }

    updateOxygenAvailability(hospitalId: string, oxygenAmount: number): Observable<any> {
      const url = `${this.baseUrl}/Hospitales?id_hospital=${hospitalId}`;
      return this.http.patch(url, { oxigeno_disponible: oxygenAmount });
    }
  }