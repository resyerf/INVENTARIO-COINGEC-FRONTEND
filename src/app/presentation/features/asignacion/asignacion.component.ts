import { Component, OnInit } from '@angular/core';
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

  asignacionForm: AsignacionActivoCommand = {
    activoId: '',
    usuarioId: '',
    fechaAsignacion: new Date().toISOString().split('T')[0],
    observaciones: ''
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  ngOnInit() {
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
    this.inventarioRepo.assignActivo(this.asignacionForm).subscribe({
      next: result => {
        this.showSuccess(`Activo asignado con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo asignar el activo'}`)
    });
  }
}
