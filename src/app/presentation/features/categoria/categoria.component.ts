import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository, UbicacionEntity } from '../../../domain/repositories/inventario.repository.interface';
import { CreateCategoriaCommand } from '../../../domain/models/categoria/create-categoria.command';
import { CategoriaDto } from '../../../infrastructure/dtos/categoria.dto';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  isListView = true;
  categorias: CategoriaDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;
  itemToDelete: string | null = null;

  isEditMode = false;
  editingId: string | null = null;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.required],
      valores: ['', Validators.required],
      ubicacionId: ['', Validators.required]
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllCategorias().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error loading data', err)
    });
  }

  toggleView() {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.form.reset();
      this.isEditMode = false;
      this.editingId = null;
    }
  }

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
      return [];
    }
  };

  editCategoria(categoria: any) {
    this.isEditMode = true;
    this.editingId = categoria.id;
    this.form.patchValue({
      codigo: categoria.codigo,
      descripcion: categoria.descripcion,
      valores: categoria.valores,
      ubicacionId: categoria.ubicacionId
    });
    this.isListView = false;
    this.statusMessage = '';
  }

  saveCategoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.editingId) {
      const command = { ...this.form.value, id: this.editingId };
      this.inventarioRepo.updateCategoria(this.editingId, command).subscribe({
        next: () => {
          this.showSuccess('Categoría actualizada correctamente');
          this.loadData();
          setTimeout(() => {
            this.isListView = true;
            this.isEditMode = false;
            this.editingId = null;
          }, 1500);
        },
        error: err => this.showError(`Error: ${err?.message || 'No se pudo actualizar'}`)
      });
    } else {
      const command: CreateCategoriaCommand = this.form.value;
      this.inventarioRepo.createCategoria(command).subscribe({
        next: result => {
          this.showSuccess(`Categoría creada con ID: ${result}`);
          this.loadData();
          setTimeout(() => this.toggleView(), 1500);
        },
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la categoría'}`)
      });
    }
  }

  confirmDelete(id: string) {
    this.itemToDelete = id;
  }

  cancelDelete() {
    this.itemToDelete = null;
  }

  executeDelete() {
    if (this.itemToDelete) {
      this.inventarioRepo.deleteCategoria(this.itemToDelete).subscribe({
        next: () => {
          this.showSuccess('Registro eliminado correctamente');
          this.loadData();
          this.itemToDelete = null;
        },
        error: (err) => {
          this.showError('Error al eliminar el registro');
          this.itemToDelete = null;
        }
      });
    }
  }
}

