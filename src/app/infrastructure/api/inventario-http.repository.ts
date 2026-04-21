import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { InventarioRepository, UbicacionEntity, SubCategoriaEntity, ActivoEntity, UsuarioEntity } from '../../domain/repositories/inventario.repository.interface';
import { CreateActivoCommand } from '../../domain/models/activo/create-activo.command';
import { CreateCategoriaCommand } from '../../domain/models/categoria/create-categoria.command';
import { CreateSubCategoriaCommand } from '../../domain/models/subcategoria/create-subcategoria.command';
import { CreateUbicacionCommand } from '../../domain/models/ubicacion/create-ubicacion.command';
import { CreateUsuarioCommand } from '../../domain/models/usuario/create-usuario.command';
import { AsignacionActivoCommand } from '../../domain/models/asignacion/asignacion-activo.command';
import { FinalizarAsignacionRequest } from '../../domain/models/asignacion/finalizar-asignacion.request';

import { ActivoDto } from '../dtos/activo.dto';
import { CategoriaDto } from '../dtos/categoria.dto';
import { SubCategoriaDto } from '../dtos/subcategoria.dto';
import { UbicacionDto } from '../dtos/ubicacion.dto';
import { UsuarioDto } from '../dtos/usuario.dto';
import { AsignacionDto } from '../dtos/asignacion.dto';
import { DashboardStatsDto } from '../dtos/dashboard-stats.dto';

@Injectable({
  providedIn: 'root'
})
export class InventarioHttpRepository extends InventarioRepository {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {
    super();
  }

  createActivo(command: CreateActivoCommand): Observable<string> { return this.http.post<string>(`${this.baseUrl}/api/Activo`, command); }
  createCategoria(command: CreateCategoriaCommand): Observable<string> { return this.http.post<string>(`${this.baseUrl}/api/Categoria`, command); }
  createSubCategoria(command: CreateSubCategoriaCommand): Observable<string> { return this.http.post<string>(`${this.baseUrl}/api/Subcategoria`, command); }
  createUbicacion(command: CreateUbicacionCommand): Observable<string> { return this.http.post<string>(`${this.baseUrl}/api/Ubicacion`, command); }
  createUsuario(command: CreateUsuarioCommand): Observable<string> { return this.http.post<string>(`${this.baseUrl}/api/Usuario`, command); }
  assignActivo(command: AsignacionActivoCommand): Observable<string> { return this.http.post<string>(`${this.baseUrl}/api/Asignacion`, command); }
  finalizeAsignacion(id: string, request: FinalizarAsignacionRequest): Observable<void> { return this.http.patch<void>(`${this.baseUrl}/api/Asignacion/${id}/finalizar`, request); }

  searchSubCategorias(termino: string): Observable<SubCategoriaEntity[]> { return this.http.get<SubCategoriaDto[]>(`${this.baseUrl}/api/Subcategoria/search`, { params: { termino } }); }
  searchUbicaciones(termino: string): Observable<UbicacionEntity[]> { return this.http.get<UbicacionDto[]>(`${this.baseUrl}/api/Ubicacion/search`, { params: { termino } }); }
  searchActivos(termino: string): Observable<ActivoEntity[]> { return this.http.get<ActivoDto[]>(`${this.baseUrl}/api/Activo/search`, { params: { termino } }); }
  searchUsuarios(termino: string): Observable<UsuarioEntity[]> { return this.http.get<UsuarioDto[]>(`${this.baseUrl}/api/Usuario/search`, { params: { termino } }); }

  getAllActivos(): Observable<ActivoDto[]> { return this.http.get<ActivoDto[]>(`${this.baseUrl}/api/Activo`); }

  exportActivosExcel(): Observable<Blob> { return this.http.get(`${this.baseUrl}/api/Activo/export`, { responseType: 'blob' });}

  getAllCategorias(): Observable<CategoriaDto[]> { return this.http.get<CategoriaDto[]>(`${this.baseUrl}/api/Categoria`); }
  getAllSubCategorias(): Observable<SubCategoriaDto[]> { return this.http.get<SubCategoriaDto[]>(`${this.baseUrl}/api/Subcategoria`); }
  getAllUbicaciones(): Observable<UbicacionDto[]> { return this.http.get<UbicacionDto[]>(`${this.baseUrl}/api/Ubicacion`); }
  getAllUsuarios(): Observable<UsuarioDto[]> { return this.http.get<UsuarioDto[]>(`${this.baseUrl}/api/Usuario`); }
  getAllAsignaciones(): Observable<AsignacionDto[]> { return this.http.get<AsignacionDto[]>(`${this.baseUrl}/api/Asignacion`); }

  getDashboardStats(): Observable<DashboardStatsDto> { return this.http.get<DashboardStatsDto>(`${this.baseUrl}/api/Dashboard/stats`); }

  deleteActivo(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/api/Activo/${id}`); }
  deleteCategoria(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/api/Categoria/${id}`); }
  deleteSubCategoria(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/api/Subcategoria/${id}`); }
  deleteUbicacion(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/api/Ubicacion/${id}`); }
  deleteUsuario(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/api/Usuario/${id}`); }
  deleteAsignacion(id: string): Observable<void> { return this.http.delete<void>(`${this.baseUrl}/api/Asignacion/${id}`); }
}
