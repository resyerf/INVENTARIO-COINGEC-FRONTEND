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

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      codigo: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', Validators.required],
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

  createCategoria() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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

