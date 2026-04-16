import { Component } from '@angular/core';
import { InventarioRepository, UbicacionEntity } from '../../../domain/repositories/inventario.repository.interface';
import { CreateCategoriaCommand } from '../../../domain/models/categoria/create-categoria.command';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent {
  statusMessage = '';
  statusError = false;

  categoriaForm: CreateCategoriaCommand = {
    codigo: '',
    descripcion: '',
    ubicacionId: ''
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

  searchUbicaciones = async (termino: string): Promise<UbicacionEntity[]> => {
    try {
      return await this.inventarioRepo.searchUbicaciones(termino).toPromise() || [];
    } catch (error) {
      console.error('Error searching ubicaciones:', error);
      return [];
    }
  };

  createCategoria() {
    if (!this.categoriaForm.ubicacionId) {
      this.showError('Por favor, seleccione una Ubicación.');
      return;
    }

    this.inventarioRepo.createCategoria(this.categoriaForm)
      .subscribe({
        next: result => this.showSuccess(`Categoría creada con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la categoría'}`)
      });
  }
}
