import { Observable } from 'rxjs';
import { CreateActivoCommand } from '../models/activo/create-activo.command';
import { CreateCategoriaCommand } from '../models/categoria/create-categoria.command';
import { CreateSubCategoriaCommand } from '../models/subcategoria/create-subcategoria.command';
import { CreateUbicacionCommand } from '../models/ubicacion/create-ubicacion.command';
import { CreateUsuarioCommand } from '../models/usuario/create-usuario.command';
import { AsignacionActivoCommand } from '../models/asignacion/asignacion-activo.command';
import { FinalizarAsignacionRequest } from '../models/asignacion/finalizar-asignacion.request';

// We import DTO structures needed for reading. Even though DTOs are in infrastructure, 
// Domain can define the expected read structures (Entities). To keep it simple, we use the DTO interfaces directly 
// or redefine them in domain. Let's redefine read models in domain to maintain strict separation.
export interface UbicacionEntity {
  id: string;
  nombre: string;
}

export interface SubCategoriaEntity {
  id: string;
  nombre: string;
  categoriaCodigo: string;
  categoriaDescripcion: string;
}

export abstract class InventarioRepository {
  abstract createActivo(command: CreateActivoCommand): Observable<string>;
  abstract createCategoria(command: CreateCategoriaCommand): Observable<string>;
  abstract createSubCategoria(command: CreateSubCategoriaCommand): Observable<string>;
  abstract createUbicacion(command: CreateUbicacionCommand): Observable<string>;
  abstract createUsuario(command: CreateUsuarioCommand): Observable<string>;
  
  abstract assignActivo(command: AsignacionActivoCommand): Observable<string>;
  abstract finalizeAsignacion(id: string, request: FinalizarAsignacionRequest): Observable<void>;
  
  abstract searchSubCategorias(termino: string): Observable<SubCategoriaEntity[]>;
  abstract searchUbicaciones(termino: string): Observable<UbicacionEntity[]>;
  abstract getAllUbicaciones(): Observable<UbicacionEntity[]>;
}
