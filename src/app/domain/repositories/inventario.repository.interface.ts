import { Observable } from 'rxjs';
import { CreateActivoCommand } from '../models/activo/create-activo.command';
import { CreateCategoriaCommand } from '../models/categoria/create-categoria.command';
import { CreateSubCategoriaCommand } from '../models/subcategoria/create-subcategoria.command';
import { CreateUbicacionCommand } from '../models/ubicacion/create-ubicacion.command';
import { CreateUsuarioCommand } from '../models/usuario/create-usuario.command';
import { AsignacionActivoCommand } from '../models/asignacion/asignacion-activo.command';
import { FinalizarAsignacionRequest } from '../models/asignacion/finalizar-asignacion.request';

import { ActivoDto } from '../../infrastructure/dtos/activo.dto';
import { CategoriaDto } from '../../infrastructure/dtos/categoria.dto';
import { SubCategoriaDto } from '../../infrastructure/dtos/subcategoria.dto';
import { UbicacionDto } from '../../infrastructure/dtos/ubicacion.dto';
import { UsuarioDto } from '../../infrastructure/dtos/usuario.dto';
import { AsignacionDto } from '../../infrastructure/dtos/asignacion.dto';
import { DashboardStatsDto } from '../../infrastructure/dtos/dashboard-stats.dto';

export type ActivoEntity = ActivoDto;
export type UsuarioEntity = UsuarioDto;

// For pragmatism in this angular project, we will use DTOs as the read model entity.
export type UbicacionEntity = UbicacionDto;
export type SubCategoriaEntity = SubCategoriaDto;

export abstract class InventarioRepository {
  // Commands
  abstract createActivo(command: CreateActivoCommand): Observable<string>;
  abstract createCategoria(command: CreateCategoriaCommand): Observable<string>;
  abstract createSubCategoria(command: CreateSubCategoriaCommand): Observable<string>;
  abstract createUbicacion(command: CreateUbicacionCommand): Observable<string>;
  abstract createUsuario(command: CreateUsuarioCommand): Observable<string>;
  abstract assignActivo(command: AsignacionActivoCommand): Observable<string>;
  abstract finalizeAsignacion(id: string, request: FinalizarAsignacionRequest): Observable<void>;
  
  // Queries
  abstract searchSubCategorias(termino: string): Observable<SubCategoriaEntity[]>;
  abstract searchUbicaciones(termino: string): Observable<UbicacionEntity[]>;
  abstract searchActivos(termino: string): Observable<ActivoEntity[]>;
  abstract searchUsuarios(termino: string): Observable<UsuarioEntity[]>;
  
  abstract getAllActivos(): Observable<ActivoDto[]>;
  abstract exportActivosExcel(): Observable<Blob>;
  abstract getAllCategorias(): Observable<CategoriaDto[]>;
  abstract getAllSubCategorias(): Observable<SubCategoriaDto[]>;
  abstract getAllUbicaciones(): Observable<UbicacionDto[]>;
  abstract getAllUsuarios(): Observable<UsuarioDto[]>;
  abstract getAllAsignaciones(): Observable<AsignacionDto[]>;

  abstract getDashboardStats(): Observable<DashboardStatsDto>;
}
