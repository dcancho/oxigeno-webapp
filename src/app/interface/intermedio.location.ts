import { hospital } from "./location.interface";
import { paciente } from "./patiend.interface";

export interface internados{
    id: string;
    cant_oxigeno: string;
    pacienteData: paciente;
    hospitalData: hospital;
}