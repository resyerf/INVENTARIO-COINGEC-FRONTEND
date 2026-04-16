import { Component, OnInit } from '@angular/core';
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

  ubicacionForm: CreateUbicacionCommand = {
    nombre: '',
    descripcion: ''
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  ngOnInit() {
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
  }

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  createUbicacion() {
    this.inventarioRepo.createUbicacion(this.ubicacionForm).subscribe({
      next: result => {
        this.showSuccess(`Ubicación creada con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo crear la ubicación'}`)
    });
  }
}
