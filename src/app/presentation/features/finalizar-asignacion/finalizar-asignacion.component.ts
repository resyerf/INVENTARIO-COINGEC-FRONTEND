import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { FinalizarAsignacionRequest } from '../../../domain/models/asignacion/finalizar-asignacion.request';
import { AsignacionDto } from '../../../infrastructure/dtos/asignacion.dto';

@Component({
  selector: 'app-finalizar-asignacion',
  templateUrl: './finalizar-asignacion.component.html',
  styleUrls: ['./finalizar-asignacion.component.css']
})
export class FinalizarAsignacionComponent implements OnInit {
  isListView = true;
  asignaciones: AsignacionDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      asignacionId: ['', Validators.required],
      estadoRecibido: ['', Validators.required],
      observaciones: ['']
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllAsignaciones().subscribe({
      next: (data) => this.asignaciones = data.filter(a => a.fechaDevolucion === null),
      error: (err) => console.error('Error loading data', err)
    });
  }

  toggleView(idStr?: string) {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.form.reset();
      if (idStr) {
        this.form.patchValue({ asignacionId: idStr });
      }
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

  finalizeAsignacion() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const request: FinalizarAsignacionRequest = {
      estadoRecibido: value.estadoRecibido,
      observaciones: value.observaciones
    };

    this.inventarioRepo.finalizeAsignacion(value.asignacionId, request).subscribe({
      next: () => {
        this.showSuccess(`Asignación ${value.asignacionId} finalizada correctamente`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo finalizar la asignación'}`)
    });
  }
}

