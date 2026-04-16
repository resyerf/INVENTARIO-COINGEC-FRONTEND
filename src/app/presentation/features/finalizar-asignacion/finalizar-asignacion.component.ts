import { Component } from '@angular/core';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { FinalizarAsignacionRequest } from '../../../domain/models/asignacion/finalizar-asignacion.request';

@Component({
  selector: 'app-finalizar-asignacion',
  templateUrl: './finalizar-asignacion.component.html',
  styleUrls: ['./finalizar-asignacion.component.css']
})
export class FinalizarAsignacionComponent {
  statusMessage = '';
  statusError = false;

  finalizarForm: FinalizarAsignacionRequest & { id: string } = {
    id: '',
    estadoRecibido: '',
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

  finalizeAsignacion() {
    if (!this.finalizarForm.id) {
      this.showError('Debe ingresar el ID de la asignación a finalizar.');
      return;
    }

    const request: FinalizarAsignacionRequest = {
      estadoRecibido: this.finalizarForm.estadoRecibido,
      observaciones: this.finalizarForm.observaciones
    };

    this.inventarioRepo.finalizeAsignacion(this.finalizarForm.id, request)
      .subscribe({
        next: () => this.showSuccess('Asignación finalizada correctamente.'),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo finalizar la asignación'}`)
      });
  }
}
