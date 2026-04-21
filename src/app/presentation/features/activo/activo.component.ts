import { Component, OnInit } from '@angular/core';
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
  subCategoriaValidation = { isValid: false };
  ubicacionValidation = { isValid: false };

  activoForm: CreateActivoCommand = {
    nombreEquipo: '', subCategoriaId: '', costoUnitario: 0, cantidad: 1, 
    marca: '', modelo: '', serie: '', etiquetado: '', ubicacionId: null, 
    fechaAdquisicion: null, usuarioId: null
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  ngOnInit() {
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

  onSubCategoriaValidation(v: { isValid: boolean; error?: string }) { this.subCategoriaValidation = v; }
  onUbicacionValidation(v: { isValid: boolean; error?: string }) { this.ubicacionValidation = v; }

  createActivo() {
    if (!this.subCategoriaValidation.isValid) {
      this.showError('Por favor, seleccione una Subcategoría válida.');
      return;
    }

    this.inventarioRepo.createActivo(this.activoForm).subscribe({
      next: result => {
        this.showSuccess(`Activo creado con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500); // Volver a la lista después de éxito
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el activo'}`)
    });
  }
}
