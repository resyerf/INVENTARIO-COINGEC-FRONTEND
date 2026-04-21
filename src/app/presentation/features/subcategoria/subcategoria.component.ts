import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { CreateSubCategoriaCommand } from '../../../domain/models/subcategoria/create-subcategoria.command';
import { SubCategoriaDto } from '../../../infrastructure/dtos/subcategoria.dto';

@Component({
  selector: 'app-subcategoria',
  templateUrl: './subcategoria.component.html',
  styleUrls: ['./subcategoria.component.css']
})
export class SubcategoriaComponent implements OnInit {
  isListView = true;
  subcategorias: SubCategoriaDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;
  itemToDelete: string | null = null;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      categoriaId: ['', Validators.required]
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllSubCategorias().subscribe({
      next: (data) => this.subcategorias = data,
      error: (err) => console.error('Error loading data', err)
    });
  }

  toggleView() {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.form.reset();
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

  searchCategorias = async (termino: string): Promise<{id:string; nombre:string; display:string}[]> => {
    try {
      const categorias = await this.inventarioRepo.searchCategorias(termino).toPromise() || [];
      return categorias.map(c => ({
        id: c.id,
        nombre: c.descripcion,
        display: `${c.codigo} - ${c.descripcion}`
      }));
    } catch (error) {
      return [];
    }
  };

  createSubCategoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command: CreateSubCategoriaCommand = this.form.value;
    this.inventarioRepo.createSubCategoria(command).subscribe({
      next: result => {
        this.showSuccess(`Subcategoría creada con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la subcategoría'}`)
    });
  }

  confirmDelete(id: string) {
    this.itemToDelete = id;
  }

  cancelDelete() {
    this.itemToDelete = null;
  }

  executeDelete() {
    if (this.itemToDelete) {
      this.inventarioRepo.deleteSubCategoria(this.itemToDelete).subscribe({
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

