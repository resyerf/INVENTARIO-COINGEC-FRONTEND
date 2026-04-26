import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { CreateUbicacionCommand } from '../../../domain/models/ubicacion/create-ubicacion.command';
import { UbicacionDto } from '../../../infrastructure/dtos/ubicacion.dto';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.css']
})
export class UbicacionComponent implements OnInit {
  isListView = true;
  ubicaciones: UbicacionDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;
  itemToDelete: string | null = null;

  isEditMode = false;
  editingId: string | null = null;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      descripcion: ['']
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllUbicaciones().subscribe({
      next: (data) => this.ubicaciones = data,
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

  editUbicacion(ubicacion: any) {
    this.isEditMode = true;
    this.editingId = ubicacion.id;
    this.form.patchValue({
      nombre: ubicacion.nombre,
      descripcion: ubicacion.descripcion
    });
    this.isListView = false;
    this.statusMessage = '';
  }

  saveUbicacion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.editingId) {
      const command = { ...this.form.value, id: this.editingId };
      this.inventarioRepo.updateUbicacion(this.editingId, command).subscribe({
        next: () => {
          this.showSuccess('Ubicación actualizada correctamente');
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
      const command: CreateUbicacionCommand = this.form.value;
      this.inventarioRepo.createUbicacion(command).subscribe({
        next: result => {
          this.showSuccess(`Ubicación creada con ID: ${result}`);
          this.loadData();
          setTimeout(() => this.toggleView(), 1500);
        },
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la ubicación'}`)
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
      this.inventarioRepo.deleteUbicacion(this.itemToDelete).subscribe({
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

