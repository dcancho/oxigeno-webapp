import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OxygenProviderResponse}from './interface/patiend.interface';
import {OxygenLocation}from './interface/location.interface';
@Injectable({
  providedIn: 'root'
})
export class OxigenoService {
  private baseUrl = 'https://api-oxigeno.azurewebsites.net/'; // reemplaza esto con la URL base de tu API

  constructor(private http: HttpClient) { }
  
  getOxygenProviders(patientId: string, healthcareCenter: string, oxygenRequirement: string, searchIntensity: string): Observable<OxygenLocation[]> {
    const url = `${this.baseUrl}/oxygen-providers?patientId=${patientId}&healthcareCenter=${healthcareCenter}&oxygenRequirement=${oxygenRequirement}&searchIntensity=${searchIntensity}`;
    return this.http.get<OxygenLocation[]>(url);
  }

  requestOxygen(patientId: string, healthcareCenter: string, oxygenRequirement: string, patientDiagnosis: string): Observable<OxygenProviderResponse> {
    const url = `${this.baseUrl}/oxygen-request?patientId=${patientId}&healthcareCenter=${healthcareCenter}&oxygenRequirement=${oxygenRequirement}&patientDiagnosis=${patientDiagnosis}`;
    return this.http.post<OxygenProviderResponse>(url, {});
  }
}