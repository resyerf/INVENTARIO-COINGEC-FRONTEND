import { Component } from '@angular/core';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { CreateUsuarioCommand } from '../../../domain/models/usuario/create-usuario.command';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  statusMessage = '';
  statusError = false;

  usuarioForm: CreateUsuarioCommand = {
    nombreCompleto: '',
    documentoIdentidad: '',
    email: '',
    area: '',
    cargo: '',
    sede: '',
    creadoPor: ''
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  createUsuario() {
    this.inventarioRepo.createUsuario(this.usuarioForm)
      .subscribe({
        next: result => this.showSuccess(`Usuario creado con ID: ${result}`),
        error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el usuario'}`)
      });
  }
}
