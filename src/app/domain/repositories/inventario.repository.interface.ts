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
import { CreateSubCategoriaMasivCommand } from '../models/subcategoria/create-subcategoria-masiv.command';

export type ActivoEntity = ActivoDto;
export type UsuarioEntity = UsuarioDto;
export type CategoriaEntity = CategoriaDto;

// For pragmatism in this angular project, we will use DTOs as the read model entity.
export type UbicacionEntity = UbicacionDto;
export type SubCategoriaEntity = SubCategoriaDto;
export type AsignacionEntity = AsignacionDto;

export abstract class InventarioRepository {
  // Commands
  abstract createActivo(command: CreateActivoCommand): Observable<string>;
  abstract createCategoria(command: CreateCategoriaCommand): Observable<string>;
  abstract createSubCategoria(command: CreateSubCategoriaCommand): Observable<string>;
  abstract CreateSubCategoriaMasivCommand(command: CreateSubCategoriaMasivCommand): Observable<string>;
  abstract createUbicacion(command: CreateUbicacionCommand): Observable<string>;
  abstract createUsuario(command: CreateUsuarioCommand): Observable<string>;
  abstract updateUsuario(id: string, command: any): Observable<void>;
  abstract assignActivo(command: AsignacionActivoCommand): Observable<string>;
  abstract finalizeAsignacion(id: string, request: FinalizarAsignacionRequest): Observable<void>;

  // Queries
  abstract searchSubCategorias(termino: string): Observable<SubCategoriaEntity[]>;
  abstract searchUbicaciones(termino: string): Observable<UbicacionEntity[]>;
  abstract searchCategorias(termino: string): Observable<CategoriaEntity[]>;
  abstract searchActivos(termino: string): Observable<ActivoEntity[]>;
  abstract searchUsuarios(termino: string): Observable<UsuarioEntity[]>;

  abstract getAllActivos(): Observable<ActivoEntity[]>;
  abstract exportActivosExcel(): Observable<Blob>;
  abstract importActivosExcel(formData: FormData): Observable<any>;
  abstract importUsuariosExcel(formData: FormData): Observable<any>;
  abstract getAllCategorias(): Observable<CategoriaEntity[]>;
  abstract getAllSubCategorias(): Observable<SubCategoriaEntity[]>;
  abstract getAllUbicaciones(): Observable<UbicacionEntity[]>;
  abstract getAllUsuarios(): Observable<UsuarioEntity[]>;
  abstract getAllAsignaciones(): Observable<AsignacionEntity[]>;

  abstract getDashboardStats(): Observable<DashboardStatsDto>;

  // Deletes
  abstract deleteActivo(id: string): Observable<void>;
  abstract deleteCategoria(id: string): Observable<void>;
  abstract deleteSubCategoria(id: string): Observable<void>;
  abstract deleteUbicacion(id: string): Observable<void>;
  abstract deleteUsuario(id: string): Observable<void>;
  abstract deleteAsignacion(id: string): Observable<void>;
}
