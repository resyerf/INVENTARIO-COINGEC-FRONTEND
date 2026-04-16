import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { InventarioRepository, UbicacionEntity, SubCategoriaEntity } from '../../domain/repositories/inventario.repository.interface';
import { CreateActivoCommand } from '../../domain/models/activo/create-activo.command';
import { CreateCategoriaCommand } from '../../domain/models/categoria/create-categoria.command';
import { CreateSubCategoriaCommand } from '../../domain/models/subcategoria/create-subcategoria.command';
import { CreateUbicacionCommand } from '../../domain/models/ubicacion/create-ubicacion.command';
import { CreateUsuarioCommand } from '../../domain/models/usuario/create-usuario.command';
import { AsignacionActivoCommand } from '../../domain/models/asignacion/asignacion-activo.command';
import { FinalizarAsignacionRequest } from '../../domain/models/asignacion/finalizar-asignacion.request';

import { SubCategoriaDto } from '../dtos/subcategoria.dto';
import { UbicacionDto } from '../dtos/ubicacion.dto';

@Injectable({
  providedIn: 'root'
})
export class InventarioHttpRepository extends InventarioRepository {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
    super();
  }

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

  searchSubCategorias(termino: string): Observable<SubCategoriaEntity[]> {
    // In a real strict clean architecture, we might map DTO to Entity here. 
    // Since properties match exactly, we can just cast or let TS infer.
    return this.http.get<SubCategoriaDto[]>(`${this.baseUrl}/api/Subcategoria/search`, {
      params: { termino }
    });
  }

  searchUbicaciones(termino: string): Observable<UbicacionEntity[]> {
    return this.http.get<UbicacionDto[]>(`${this.baseUrl}/api/Ubicacion/search`, {
      params: { termino }
    });
  }

  getAllUbicaciones(): Observable<UbicacionEntity[]> {
    return this.http.get<UbicacionDto[]>(`${this.baseUrl}/api/Ubicacion`);
  }
}
