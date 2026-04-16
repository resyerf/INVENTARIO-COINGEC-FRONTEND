import { Component, OnInit } from '@angular/core';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { FinalizarAsignacionRequest } from '../../../domain/models/asignacion/finalizar-asignacion.request';
import { AsignacionDto } from '../../../infrastructure/dtos/asignacion.dto';

@Component({
  selector: 'app-finalizar-asignacion',
  templateUrl: './finalizar-asignacion.component.html',
  styleUrls: ['./finalizar-asignacion.component.css']
})
export class FinalizarAsignacionComponent implements OnInit {
  isListView = true;
  asignaciones: AsignacionDto[] = [];
  
  statusMessage = '';
  statusError = false;

  finalizarForm: FinalizarAsignacionRequest = {
    estadoRecibido: '',
    observaciones: ''
  };
  asignacionId: string = '';

  constructor(private inventarioRepo: InventarioRepository) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllAsignaciones().subscribe({
      next: (data) => this.asignaciones = data.filter(a => a.fechaDevolucion !== null),
      error: (err) => console.error('Error loading data', err)
    });
  }

  toggleView(idStr?: string) {
    if (idStr) {
       this.asignacionId = idStr;
    }
    this.isListView = !this.isListView;
    this.statusMessage = '';
  }

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  finalizeAsignacion() {
    if (!this.asignacionId) {
       this.showError('Ingrese un ID de Asignación válido.');
       return;
    }

    this.inventarioRepo.finalizeAsignacion(this.asignacionId, this.finalizarForm).subscribe({
      next: () => {
        this.showSuccess(`Asignación ${this.asignacionId} finalizada correctamente`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo finalizar la asignación'}`)
    });
  }
}
