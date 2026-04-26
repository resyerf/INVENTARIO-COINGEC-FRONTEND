import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { CreateUsuarioCommand } from '../../../domain/models/usuario/create-usuario.command';
import { UsuarioDto } from '../../../infrastructure/dtos/usuario.dto';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  isListView = true;
  usuarios: UsuarioDto[] = [];
  
  statusMessage = '';
  statusError = false;

  form!: FormGroup;
  itemToDelete: string | null = null;
  
  isEditMode = false;
  editingId: string | null = null;

  constructor(private inventarioRepo: InventarioRepository, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.maxLength(100)]],
      documentoIdentidad: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      area: ['', Validators.required],
      cargo: [''],
      sede: ['', Validators.required],
      creadoPor: ['Admin'] // default
    });
    this.loadData();
  }

  loadData() {
    this.inventarioRepo.getAllUsuarios().subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error loading data', err)
    });
  }

  toggleView() {
    this.isListView = !this.isListView;
    this.statusMessage = '';
    if (!this.isListView) {
      this.isEditMode = false;
      this.editingId = null;
      this.form.reset({ creadoPor: 'Admin' });
    }
  }

  editUsuario(usuario: UsuarioDto) {
    this.isEditMode = true;
    this.editingId = usuario.id;
    this.isListView = false;
    this.statusMessage = '';
    
    this.form.patchValue({
      nombreCompleto: usuario.nombreCompleto,
      documentoIdentidad: usuario.documentoIdentidad,
      email: usuario.email,
      area: usuario.area,
      cargo: usuario.cargo,
      sede: usuario.sede,
      creadoPor: 'Admin'
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

  saveUsuario() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.isEditMode && this.editingId) {
      const command = { id: this.editingId, ...this.form.value };
      this.inventarioRepo.updateUsuario(this.editingId, command).subscribe({
        next: () => {
          this.showSuccess('Usuario actualizado correctamente');
          this.loadData();
          setTimeout(() => this.toggleView(), 1500);
        },
        error: err => this.showError(`Error: ${err?.message || 'No se pudo actualizar el usuario'}`)
      });
    } else {
      const command: CreateUsuarioCommand = this.form.value;
      this.inventarioRepo.createUsuario(command).subscribe({
        next: result => {
          this.showSuccess(`Usuario creado con ID: ${result}`);
          this.loadData();
          setTimeout(() => this.toggleView(), 1500);
        },
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el usuario'}`)
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
      this.inventarioRepo.deleteUsuario(this.itemToDelete).subscribe({
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

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      
      this.inventarioRepo.importUsuariosExcel(formData).subscribe({
        next: (response) => {
          // If the backend returns a blob (like an error report), we could download it.
          // For now, assuming success updates the list.
          this.showSuccess('Plantilla procesada. Revise los registros o posibles errores en la consola/descarga.');
          this.loadData();
          
          // Optionally handle blob response for errors if the backend returns it:
          if (response && response.size > 0 && response.type !== 'application/json') {
             const url = window.URL.createObjectURL(response);
             const a = document.createElement('a');
             a.href = url;
             a.download = 'Errores_Carga_Usuarios.xlsx';
             a.click();
             window.URL.revokeObjectURL(url);
          }
        },
        error: (err) => {
          this.showError('Error al procesar el archivo Excel.');
          console.error(err);
        }
      });
      // Reset the input so the same file can be selected again if needed
      event.target.value = null;
    }
  }
}

