import { Component, OnInit } from '@angular/core';
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

  subCategoriaForm: CreateSubCategoriaCommand = {
    nombre: '',
    categoriaId: ''
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  ngOnInit() {
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
  }

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  createSubCategoria() {
    if (!this.subCategoriaForm.categoriaId) {
       this.showError('El ID de Categoría es obligatorio.');
       return;
    }

    this.inventarioRepo.createSubCategoria(this.subCategoriaForm).subscribe({
      next: result => {
        this.showSuccess(`Subcategoría creada con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la subcategoría'}`)
    });
  }
}
