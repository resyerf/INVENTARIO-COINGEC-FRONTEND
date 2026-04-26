export interface UpdateActivoCommand {
  id: string;
  nombreEquipo: string;
  codigoEquipo?: string;
  categoriaId: string;
  costoUnitario: number;
  cantidad: number;
  marca?: string;
  modelo?: string;
  serie?: string;
  estado?: string;
  etiquetado: string;
  ubicacionId?: string;
  fechaAdquisicion?: string;
}
