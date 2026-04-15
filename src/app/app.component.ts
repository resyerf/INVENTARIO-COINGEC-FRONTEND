import { Component } from '@angular/core';
import { ApiService } from './services/api.service';
import {
  CreateActivoCommand,
  CreateCategoriaCommand,
  CreateSubCategoriaCommand,
  CreateUbicacionCommand,
  CreateUsuarioCommand,
  AsignacionActivoCommand,
  FinalizarAsignacionRequest
} from './models/inventario.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selectedPanel = 'activo';
  statusMessage = '';
  statusError = false;

  activoForm: CreateActivoCommand = {
    nombreEquipo: '',
    subCategoriaId: '',
    costoUnitario: 0,
    cantidad: 1,
    marca: '',
    modelo: '',
    serie: '',
    etiquetado: '',
    ubicacionId: null,
    fechaAdquisicion: null,
    usuarioId: null
  };

  categoriaForm: CreateCategoriaCommand = {
    codigo: '',
    descripcion: '',
    ubicacionId: ''
  };

  subCategoriaForm: CreateSubCategoriaCommand = {
    nombre: '',
    categoriaId: ''
  };

  ubicacionForm: CreateUbicacionCommand = {
    nombre: '',
    descripcion: ''
  };

  usuarioForm: CreateUsuarioCommand = {
    nombreCompleto: '',
    documentoIdentidad: '',
    email: '',
    area: '',
    cargo: '',
    sede: '',
    creadoPor: ''
  };

  asignacionForm: AsignacionActivoCommand = {
    activoId: '',
    usuarioId: '',
    fechaAsignacion: new Date().toISOString().slice(0, 10),
    observaciones: ''
  };

  finalizarForm: FinalizarAsignacionRequest & { id: string } = {
    id: '',
    estadoRecibido: '',
    observaciones: ''
  };

  constructor(private api: ApiService) {}

  selectPanel(panel: string) {
    this.selectedPanel = panel;
    this.clearStatus();
  }

  clearStatus() {
    this.statusMessage = '';
    this.statusError = false;
  }

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  createActivo() {
    this.api.createActivo(this.activoForm)
      .subscribe({
        next: result => this.showSuccess(`Activo creado con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el activo'}`)
      });
  }

  createCategoria() {
    this.api.createCategoria(this.categoriaForm)
      .subscribe({
        next: result => this.showSuccess(`Categoría creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la categoría'}`)
      });
  }

  createSubCategoria() {
    this.api.createSubCategoria(this.subCategoriaForm)
      .subscribe({
        next: result => this.showSuccess(`Subcategoría creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la subcategoría'}`)
      });
  }

  createUbicacion() {
    this.api.createUbicacion(this.ubicacionForm)
      .subscribe({
        next: result => this.showSuccess(`Ubicación creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la ubicación'}`)
      });
  }

  createUsuario() {
    this.api.createUsuario(this.usuarioForm)
      .subscribe({
        next: result => this.showSuccess(`Usuario creado con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el usuario'}`)
      });
  }

  assignActivo() {
    this.api.assignActivo(this.asignacionForm)
      .subscribe({
        next: result => this.showSuccess(`Asignación creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo asignar el activo'}`)
      });
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

    this.api.finalizeAsignacion(this.finalizarForm.id, request)
      .subscribe({
        next: () => this.showSuccess('Asignación finalizada correctamente.'),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo finalizar la asignación'}`)
      });
  }
}
