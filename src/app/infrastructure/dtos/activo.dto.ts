export interface ActivoDto {
  id: string;
  nombreEquipo: string;
  marca?: string;
  modelo?: string;
  serie?: string;
  etiquetado: string;
  cantidad: number;
  estado?: string;
  costoUnitario: number;
  observaciones?: string;
  subCategoria: string;
  custodio?: string;
  ubicacion?: string;
  fechaAdquisicion?: string;
  isActive: boolean;
}
