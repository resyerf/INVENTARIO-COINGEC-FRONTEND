export interface DashboardStatsDto {
  // Usuarios
  totalUsuarios: number;
  usuariosActivos: number;
  usuariosInactivos: number;
  
  // Activos
  totalActivos: number;
  activosActivos: number;
  activosInactivos: number;
  activosAsignados: number;
  activosNoAsignados: number;
  
  // Ubicaciones
  totalUbicaciones: number;
  ubicacionesActivas: number;
  ubicacionesInactivas: number;
  
  // Categorías
  totalCategorias: number;
  categoriasActivas: number;
  categoriasInactivas: number;
  
  // Subcategorías
  totalSubcategorias: number;
  subcategoriasActivas: number;
  subcategoriasInactivas: number;
}
