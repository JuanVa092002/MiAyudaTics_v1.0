# Tratamiento de datos — MiAyudaTIC

## Datos personales almacenados

| Dato | Colección | Acceso |
|------|-----------|--------|
| Nombre, correo, teléfono | `usuarios` | Líder TIC; propio usuario en perfil |
| Solicitudes y descripciones | `solicitudes` | Funcionario creador; técnico asignado; líder |
| Evidencias (imágenes) | `storage` + Cloudinary | Mismos roles que la solicitud |
| Notificaciones | `notificaciones` | Solo el usuario destinatario |

## Retención

- Solicitudes y usuarios: mientras el servicio esté activo para el centro
- Logs de aplicación: 30 días recomendado en producción

## Roles

- **Funcionario:** crea solicitudes propias
- **Técnico:** resuelve casos asignados
- **Líder TIC:** administra usuarios, ambientes, tipos de caso y asignaciones

## Transferencia

Datos alojados en MongoDB Atlas (región configurada en el cluster). Correos vía Brevo (UE).
