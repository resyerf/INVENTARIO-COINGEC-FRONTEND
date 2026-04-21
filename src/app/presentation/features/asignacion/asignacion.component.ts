import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { AsignacionActivoCommand } from '../../../domain/models/asignacion/asignacion-activo.command';
import { AsignacionDto } from '../../../infrastructure/dtos/asignacion.dto';

@Component({
  selector: 'app-asignacion',
  templateUrl: './asignacion.component.html',
  styleUrls: ['./asignacion.component.css']
})
export class AsignacionComponent implements OnInit {
  isListView = true;
  asignaciones: AsignacionDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;
  itemToDelete: string | null = null;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      activoId: ['', Validators.required],
      usuarioId: ['', Validators.required],
      fechaAsignacion: [new Date().toISOString().split('T')[0], Validators.required],
      observaciones: ['']
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllAsignaciones().subscribe({
      next: (data) => this.asignaciones = data,
      error: (err) => console.error('Error loading data', err)
    });
  }

  searchActivos = async (termino: string) => {
    try {
      const activos = await this.inventarioRepo.searchActivos(termino).toPromise();
      return activos?.map(a => ({
        id: a.id,
        nombre: a.nombreEquipo,
        display: a.serie ? `${a.nombreEquipo} · ${a.serie}` : a.nombreEquipo
      })) || [];
    } catch (error) {
      return [];
    }
  };

  searchUsuarios = async (termino: string) => {
    try {
      const usuarios = await this.inventarioRepo.searchUsuarios(termino).toPromise();
      return usuarios?.map(u => ({
        id: u.id,
        nombre: u.nombreCompleto,
        display: `${u.nombreCompleto} · ${u.email}`
      })) || [];
    } catch (error) {
      return [];
    }
  };

  toggleView() {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.form.reset({ fechaAsignacion: new Date().toISOString().split('T')[0] });
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

  assignActivo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command: AsignacionActivoCommand = this.form.value;
    this.inventarioRepo.assignActivo(command).subscribe({
      next: result => {
        this.showSuccess(`Activo asignado con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo asignar el activo'}`)
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
      this.inventarioRepo.deleteAsignacion(this.itemToDelete).subscribe({
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

