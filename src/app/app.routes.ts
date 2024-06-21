import { Routes } from '@angular/router';
import { BusquedaPacienteComponent } from './busqueda-paciente/busqueda-paciente.component';
import { Mapa1Component } from './mapa-1/mapa-1.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'OxigenoYa', pathMatch: 'full' },
	{ path: 'OxigenoYa', component: BusquedaPacienteComponent },
	{ path: 'mapabusqueda', component: Mapa1Component }
];
