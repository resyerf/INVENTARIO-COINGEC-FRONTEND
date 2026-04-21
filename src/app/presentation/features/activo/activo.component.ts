import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository, SubCategoriaEntity, UbicacionEntity, UsuarioEntity } from '../../../domain/repositories/inventario.repository.interface';
import { CreateActivoCommand } from '../../../domain/models/activo/create-activo.command';
import { ActivoDto } from '../../../infrastructure/dtos/activo.dto';

@Component({
  selector: 'app-activo',
  templateUrl: './activo.component.html',
  styleUrls: ['./activo.component.css']
})
export class ActivoComponent implements OnInit {
  isListView = true;
  activos: ActivoDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombreEquipo: ['', Validators.required],
      subCategoriaId: ['', Validators.required],
      costoUnitario: [0],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      marca: [''],
      modelo: [''],
      serie: ['', Validators.maxLength(100)],
      etiquetado: [''],
      ubicacionId: ['', Validators.required],
      usuarioId: [null],
      fechaAdquisicion: [null]
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllActivos().subscribe({
      next: (data) => this.activos = data,
      error: (err) => console.error('Error loading activos', err)
    });
  }

  toggleView() {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.form.reset({ cantidad: 1, costoUnitario: 0 });
    }
  }

  exportarExcel() {
    this.inventarioRepo.exportActivosExcel().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Activos_Reporte_${new Date().getTime()}.xlsx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        this.showSuccess('Reporte de activos descargado exitosamente.');
      },
      error: (err) => this.showError('Error al exportar los activos a Excel.')
    });
  }

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  searchSubCategorias = async (termino: string): Promise<SubCategoriaEntity[]> => {
    try { return await this.inventarioRepo.searchSubCategorias(termino).toPromise() || []; } 
    catch (error) { return []; }
  };

  searchUbicaciones = async (termino: string): Promise<UbicacionEntity[]> => {
    try { return await this.inventarioRepo.searchUbicaciones(termino).toPromise() || []; } 
    catch (error) { return []; }
  };

  searchUsuarios = async (termino: string): Promise<{ id: string; nombre: string; display?: string }[]> => {
    try {
      const usuarios = await this.inventarioRepo.searchUsuarios(termino).toPromise() || [];
      return usuarios.map(u => ({
        id: u.id,
        nombre: u.nombreCompleto,
        display: `${u.nombreCompleto} · ${u.email}`
      }));
    } catch (error) {
      return [];
    }
  };

  createActivo() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command: CreateActivoCommand = this.form.value;
    this.inventarioRepo.createActivo(command).subscribe({
      next: result => {
        this.showSuccess(`Activo creado con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el activo'}`)
    });
  }
}

