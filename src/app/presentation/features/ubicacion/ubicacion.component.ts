import { Component } from '@angular/core';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { CreateUbicacionCommand } from '../../../domain/models/ubicacion/create-ubicacion.command';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent {
  statusMessage = '';
  statusError = false;

  ubicacionForm: CreateUbicacionCommand = {
    nombre: '',
    descripcion: ''
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

  createUbicacion() {
    this.inventarioRepo.createUbicacion(this.ubicacionForm)
      .subscribe({
        next: result => this.showSuccess(`Ubicación creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la ubicación'}`)
      });
  }
}
