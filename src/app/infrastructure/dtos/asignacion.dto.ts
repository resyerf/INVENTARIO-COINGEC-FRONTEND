export interface AsignacionDto {
  id: string;
  activoId: string;
  usuarioId: string;
  fechaAsignacion: string;
  estado: string;
  nombreActivo?: string;
  nombreUsuario?: string;
}
