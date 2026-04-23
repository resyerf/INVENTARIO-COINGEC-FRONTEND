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
  activosFiltrados: ActivoDto[] = [];

  filtros = {
    equipo: '',
    marca: '',
    condicion: '',
    subcategoria: '',
    estado: '' // 'activo', 'inactivo', o ''
  };
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;
  itemToDelete: string | null = null;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombreEquipo: ['', Validators.required],
      codigoEquipo: ['-'],
      subCategoriaId: ['', Validators.required],
      costoUnitario: [0],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      marca: [''],
      modelo: [''],
      serie: ['', Validators.maxLength(100)],
      etiquetado: [''],
      ubicacionId: ['', Validators.required],
      usuarioId: [null],
      fechaAdquisicion: [null],
      estadoCondicion: ['']
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllActivos().subscribe({
      next: (data) => {
        this.activos = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error loading activos', err)
    });
  }

  aplicarFiltros() {
    this.activosFiltrados = this.activos.filter(a => {
      const qEquipo = this.filtros.equipo.toLowerCase();
      const qMarca = this.filtros.marca.toLowerCase();
      const qCondicion = this.filtros.condicion.toLowerCase();
      const qSubCat = this.filtros.subcategoria.toLowerCase();

      const matchEquipo = a.nombreEquipo?.toLowerCase().includes(qEquipo) ?? false;
      const matchMarca = a.marca?.toLowerCase().includes(qMarca) ?? false;
      const estadoString = a.estado || 'Bien'; // Default condition shown in html
      const matchCondicion = estadoString.toLowerCase().includes(qCondicion);
      const subCatString = a.subCategoria || '';
      const matchSubcategoria = subCatString.toLowerCase().includes(qSubCat);
      
      let matchEstado = true;
      if (this.filtros.estado === 'activo') matchEstado = a.isActive === true;
      if (this.filtros.estado === 'inactivo') matchEstado = a.isActive === false;

      return (qEquipo ? matchEquipo : true) &&
             (qMarca ? matchMarca : true) &&
             (qCondicion ? matchCondicion : true) &&
             (qSubCat ? matchSubcategoria : true) &&
             matchEstado;
    });
  }

  toggleView() {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.form.reset({ cantidad: 1, costoUnitario: 0 });
    }
  }
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    this.inventarioRepo.importActivosExcel(formData).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Resultado_Importacion_${new Date().getTime()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.showSuccess('Importación procesada.');
        this.loadData();
      },
      error: () => this.showError('Error al importar el archivo.')
    });

    event.target.value = null;
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

  confirmDelete(id: string) {
    this.itemToDelete = id;
  }

  cancelDelete() {
    this.itemToDelete = null;
  }

  executeDelete() {
    if (this.itemToDelete) {
      this.inventarioRepo.deleteActivo(this.itemToDelete).subscribe({
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

