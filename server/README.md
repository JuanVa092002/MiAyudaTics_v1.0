# MiAyudaTics — Backend

Servidor MERN profesional para la gestión de solicitudes TIC.

## Desarrollo
```bash
pnpm run dev      # Servidor con auto-reload
pnpm run build    # Compilar a JS (dist/)
pnpm run typecheck # Verificar tipos
```

## Testing (Deploy Confidence)
Esta suite está diseñada para dar confianza antes del despliegue. No utiliza base de datos real (Lean Mode), lo que permite ejecuciones en milisegundos para detectar roturas visibles en Auth, Roles y Validaciones.

```bash
pnpm test               # Ejecutar tests una vez
pnpm run test:watch     # Modo interactivo
pnpm run test:coverage  # Ver cobertura de código
```

## Configuración
Asegúrate de tener un archivo `.env` configurado basado en `.env.example`.
> [!NOTE]
> Los tests usan `test_secret` como JWT_SECRET automáticamente.
