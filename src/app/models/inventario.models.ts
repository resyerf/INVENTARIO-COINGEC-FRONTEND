export interface CreateActivoCommand {
  nombreEquipo: string;
  subCategoriaId: string;
  costoUnitario: number;
  cantidad: number;
  marca?: string;
  modelo?: string;
  serie?: string;
  etiquetado: string;
  ubicacionId?: string | null;
  fechaAdquisicion?: string | null;
  usuarioId?: string | null;
}

export interface CreateCategoriaCommand {
  codigo: string;
  descripcion: string;
  ubicacionId: string;
}

export interface CreateSubCategoriaCommand {
  nombre: string;
  categoriaId: string;
}

export interface CreateUbicacionCommand {
  nombre: string;
  descripcion: string;
}

export interface CreateUsuarioCommand {
  nombreCompleto: string;
  documentoIdentidad: string;
  email: string;
  area: string;
  cargo: string;
  sede: string;
  creadoPor: string;
}

export interface AsignacionActivoCommand {
  activoId: string;
  usuarioId: string;
  fechaAsignacion: string;
  observaciones?: string;
}

export interface FinalizarAsignacionRequest {
  estadoRecibido: string;
  observaciones?: string;
}
