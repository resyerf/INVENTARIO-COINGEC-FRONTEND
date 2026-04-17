import { Component, OnInit } from '@angular/core';
import { InventarioRepository } from '../../../domain/repositories/inventario.repository.interface';
import { DashboardStatsDto } from '../../../infrastructure/dtos/dashboard-stats.dto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStatsDto | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private inventarioRepository: InventarioRepository) {}

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    this.isLoading = true;
    this.error = null;

    this.inventarioRepository.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard stats:', err);
        this.error = 'Error al cargar las estadísticas del dashboard';
        this.isLoading = false;
      }
    });
  }
}
