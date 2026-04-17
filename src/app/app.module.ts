import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AutocompleteSelectComponent } from './components/autocomplete-select/autocomplete-select.component';
import { ActivoComponent } from './presentation/features/activo/activo.component';
import { CategoriaComponent } from './presentation/features/categoria/categoria.component';
import { SubcategoriaComponent } from './presentation/features/subcategoria/subcategoria.component';
import { UbicacionComponent } from './presentation/features/ubicacion/ubicacion.component';
import { UsuarioComponent } from './presentation/features/usuario/usuario.component';
import { AsignacionComponent } from './presentation/features/asignacion/asignacion.component';
import { FinalizarAsignacionComponent } from './presentation/features/finalizar-asignacion/finalizar-asignacion.component';
import { DashboardComponent } from './presentation/features/dashboard/dashboard.component';

import { InventarioRepository } from './domain/repositories/inventario.repository.interface';
import { InventarioHttpRepository } from './infrastructure/api/inventario-http.repository';

@NgModule({
  declarations: [
    AppComponent, 
    AutocompleteSelectComponent, 
    ActivoComponent, 
    CategoriaComponent, 
    SubcategoriaComponent, 
    UbicacionComponent, 
    UsuarioComponent, 
    AsignacionComponent, 
    FinalizarAsignacionComponent,
    DashboardComponent
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [
    { provide: InventarioRepository, useClass: InventarioHttpRepository }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
