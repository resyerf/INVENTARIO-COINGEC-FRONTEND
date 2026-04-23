export interface CreateActivoCommand {
  nombreEquipo: string;
  codigoEquipo: string;
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
  estadoCondicion?:string | null;
}
