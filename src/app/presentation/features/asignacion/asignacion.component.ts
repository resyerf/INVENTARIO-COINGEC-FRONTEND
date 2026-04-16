import { Component } from '@angular/core';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { AsignacionActivoCommand } from '../../../domain/models/asignacion/asignacion-activo.command';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent {
  statusMessage = '';
  statusError = false;

  asignacionForm: AsignacionActivoCommand = {
    activoId: '',
    usuarioId: '',
    fechaAsignacion: new Date().toISOString().slice(0, 10),
    observaciones: ''
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  assignActivo() {
    this.inventarioRepo.assignActivo(this.asignacionForm)
      .subscribe({
        next: result => this.showSuccess(`Asignación creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo asignar el activo'}`)
      });
  }
}
