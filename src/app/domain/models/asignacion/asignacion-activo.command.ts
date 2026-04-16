export interface AsignacionActivoCommand {
  activoId: string;
  usuarioId: string;
  fechaAsignacion: string;
  observaciones?: string;
}
