import { Component, OnInit } from '@angular/core';
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

  usuarioForm: CreateUsuarioCommand = {
    nombreCompleto: '',
    documentoIdentidad: '',
    email: '',
    area: '',
    cargo: '',
    sede: '',
    creadoPor: 'Admin'
  };

  constructor(private inventarioRepo: InventarioRepository) {}

  ngOnInit() {
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
  }

  showSuccess(message: string) {
    this.statusMessage = message;
    this.statusError = false;
  }

  showError(message: string) {
    this.statusMessage = message;
    this.statusError = true;
  }

  createUsuario() {
    this.inventarioRepo.createUsuario(this.usuarioForm).subscribe({
      next: result => {
        this.showSuccess(`Usuario creado con ID: ${result}`);
        this.loadData();
        setTimeout(() => this.toggleView(), 1500);
      },
      error: err => this.showError(`Error: ${err?.message || 'No se pudo crear el usuario'}`)
    });
  }
}
