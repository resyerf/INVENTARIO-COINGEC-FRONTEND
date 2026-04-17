# Assets - COINGEC Inventario

## Ubicación de Archivos

Coloca tus archivos de imagen en esta carpeta.

### Logo COINGEC

**Nombre esperado:** `coingec-logo.png` (o `.jpg`, `.ai`)

**Ubicación en la app:**
- Menú lateral (sidebar)
- Resolución recomendada: 50x50px (mínimo)
- Formato: PNG con fondo transparente (recomendado)

**Tamaño sugerido:** 100x100px (se escala automáticamente)

**Ejemplos de ubicación:**
```
src/assets/
├── coingec-logo.png    ✓ Aquí
├── coingec-logo.jpg    ✓ O aquí
└── coingec-logo.ai     ✓ O aquí
```

### Notas

- El logo se mostrará en **blanco** en el menú lateral (aplicar filtro CSS automático)
- Preferentemente usar PNG con transparencia para mejor visualización
- Asegúrate de que el logo sea legible en fondo oscuro

### Instrucciones

1. Coloca tu archivo del logo en esta carpeta
2. Actualiza el nombre en `app.component.html` si usas un nombre diferente:
   ```html
   <img src="assets/coingec-logo.png" alt="COINGEC" class="logo-img">
   ```
3. Recarga la página para ver los cambios
