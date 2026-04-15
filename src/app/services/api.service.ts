import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  CreateActivoCommand,
  CreateCategoriaCommand,
  CreateSubCategoriaCommand,
  CreateUbicacionCommand,
  CreateUsuarioCommand,
  AsignacionActivoCommand,
  FinalizarAsignacionRequest
} from '../models/inventario.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  createActivo(command: CreateActivoCommand): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/api/Activo`, command);
  }

  createCategoria(command: CreateCategoriaCommand): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/api/Categoria`, command);
  }

  createSubCategoria(command: CreateSubCategoriaCommand): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/api/Subcategoria`, command);
  }

  createUbicacion(command: CreateUbicacionCommand): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/api/Ubicacion`, command);
  }

  createUsuario(command: CreateUsuarioCommand): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/api/Usuario`, command);
  }

  assignActivo(command: AsignacionActivoCommand): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/api/Asignacion`, command);
  }

  finalizeAsignacion(id: string, request: FinalizarAsignacionRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/api/Asignacion/${id}/finalizar`, request);
  }
}
