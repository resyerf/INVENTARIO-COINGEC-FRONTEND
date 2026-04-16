import { Component } from '@angular/core';
import { InventarioRepository, SubCategoriaEntity, UbicacionEntity } from '../../../domain/repositories/inventario.repository.interface';
import { CreateActivoCommand } from '../../../domain/models/activo/create-activo.command';

@Component({
  selector: 'app-activo',
  templateUrl: './activo.component.html',
  styleUrls: ['./activo.component.css']
})
export class ActivoComponent {
  statusMessage = '';
  statusError = false;
  subCategoriaValidation = { isValid: false };
  ubicacionValidation = { isValid: false };

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

  constructor(private inventarioRepo: InventarioRepository) {}

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  searchSubCategorias = async (termino: string): Promise<SubCategoriaEntity[]> => {
    try {
      return await this.inventarioRepo.searchSubCategorias(termino).toPromise() || [];
    } catch (error) {
      console.error('Error searching subcategorias:', error);
      return [];
    }
  };

  searchUbicaciones = async (termino: string): Promise<UbicacionEntity[]> => {
    try {
      return await this.inventarioRepo.searchUbicaciones(termino).toPromise() || [];
    } catch (error) {
      console.error('Error searching ubicaciones:', error);
      return [];
    }
  };

  onSubCategoriaValidation(validation: { isValid: boolean; error?: string }) {
    this.subCategoriaValidation = validation;
  }

  onUbicacionValidation(validation: { isValid: boolean; error?: string }) {
    this.ubicacionValidation = validation;
  }

  createActivo() {
    if (!this.subCategoriaValidation.isValid) {
      this.showError('Por favor, seleccione una Subcategoría válida.');
      return;
    }

    this.inventarioRepo.createActivo(this.activoForm)
      .subscribe({
        next: result => this.showSuccess(`Activo creado con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el activo'}`)
      });
  }
}
