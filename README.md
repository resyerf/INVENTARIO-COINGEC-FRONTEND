# Inventario Frontend

Aplicación Angular mínima para consumir el microservicio `InventarioMicroservice`.

## Instalación

1. Abrir `InventarioFrontend`.
2. Ejecutar `npm install`.
3. Ejecutar `npm start`.

## Configuración del API

El backend se configura en `src/environments/environment.ts` y `src/environments/environment.prod.ts`.
Por defecto usa `http://localhost:5000`.

## Funcionalidad

- Crear Activo
- Crear Categoría
- Crear Subcategoría
- Crear Ubicación
- Crear Usuario
- Asignar activo
- Finalizar asignación

## Notas

Este frontend asume que el backend expone:
- `POST /api/activo`
- `POST /api/categoria`
- `POST /api/subcategoria`
- `POST /api/ubicacion`
- `POST /api/usuario`
- `POST /api/asignacion`
- `PATCH /api/asignacion/{id}/finalizar`
