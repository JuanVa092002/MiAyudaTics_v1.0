# Guía de integración móvil — MiAyudaTIC

Backend listo para clientes nativos (React Native, Flutter, etc.) sin depender de cookies del navegador.

**Producción**
- API: `https://miayudatics-v1-0.onrender.com/api`
- Socket: `https://miayudatics-v1-0.onrender.com` (mismo host, path `/socket.io`)

---

## 1. Autenticación

### Login

```bash
curl -X POST https://miayudatics-v1-0.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"usuario@ejemplo.com","password":"tu_password"}'
```

Respuesta:

```json
{
  "message": "Usuario ha ingresado exitosamente",
  "dataUser": {
    "token": "<JWT>",
    "user": { ... },
    "expiresIn": 7200
  }
}
```

Guarda `dataUser.token` en almacenamiento seguro (Keychain, EncryptedSharedPreferences, etc.).

### Verificar sesión

```bash
curl https://miayudatics-v1-0.onrender.com/api/auth/verify-token \
  -H "Authorization: Bearer <JWT>"
```

### Rutas protegidas

Todas las llamadas autenticadas:

```
Authorization: Bearer <JWT>
```

No uses cookies en apps nativas.

---

## 2. WebSockets (Socket.IO)

```javascript
import { io } from 'socket.io-client'

const socket = io('https://miayudatics-v1-0.onrender.com', {
  auth: { token: storedJwt },
  transports: ['websocket', 'polling'],
})

socket.on('connection:ack', ({ userId, serverTime }) => {
  console.log('Conectado como', userId)
})

socket.on('actualizarSolicitud', (payload) => {
  // { solicitudId, estado, consecutivo?, updatedAt? }
})

socket.on('actualizarTecnico', (payload) => {
  // { tecnicoId, numeroSolicitudesAsignadas }
})

socket.on('nuevaNotificacion', (payload) => {
  // { _id, mensaje, tipo, ticketId, leido, createdAt }
})
```

**Reconnect:** implementa backoff exponencial; tras cold start de Render (~30–60s) o JWT expirado (2h), re-login y reconectar.

---

## 3. Subir foto desde cámara

### Opción A — Todo en un request (simple)

`POST /api/solicitud` con `multipart/form-data`:

| Campo | Tipo | Requerido |
|-------|------|-----------|
| descripcion | texto | sí (≥10 chars) |
| telefono | texto | sí |
| ambiente | ObjectId | sí |
| tipoCaso | ObjectId | sí |
| usuario | ObjectId | sí (debe coincidir con sesión) |
| foto | archivo | recomendado |

Formatos: JPEG, PNG, GIF, WebP, HEIC/HEIF. Máximo: 10 MB (configurable vía `MEDIA_MAX_BYTES`).

```bash
curl -X POST https://miayudatics-v1-0.onrender.com/api/solicitud \
  -H "Authorization: Bearer <JWT>" \
  -F "descripcion=El proyector no enciende en el salón" \
  -F "telefono=3001234567" \
  -F "ambiente=<AMBIENTE_ID>" \
  -F "tipoCaso=<TIPO_ID>" \
  -F "usuario=<USER_ID>" \
  -F "foto=@/ruta/foto.jpg"
```

### Opción B — Subida desacoplada (retry friendly)

1. `POST /api/media/upload?folder=evidencias` con campo `file`
2. Respuesta: `{ storageId, url, optimizedUrl }`
3. `POST /api/solicitud` con `fotoId=<storageId>` en form (sin archivo)

Útil si la red falla al subir la imagen: reintenta solo el paso 1.

### Resolución técnico con evidencia

`POST /api/solucionCaso/:solicitudId` multipart:

- `evidencia` (archivo, opcional)
- `descripcionSolucion`, `tipoCaso`, `tipoSolucion` (`pendiente` | `finalizado`)

---

## 4. Errores de medios

| HTTP | code | Significado |
|------|------|-------------|
| 413 | `FILE_TOO_LARGE` | Supera `MEDIA_MAX_BYTES` |
| 415 | `UNSUPPORTED_MEDIA` | MIME o magic bytes inválidos |

---

## 5. Pseudocódigo React Native

```typescript
// Login
const res = await fetch(`${API}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ correo, password }),
})
const { dataUser } = await res.json()
await SecureStore.setItemAsync('token', dataUser.token)

// Crear solicitud con foto de cámara
const form = new FormData()
form.append('descripcion', descripcion)
form.append('telefono', telefono)
form.append('ambiente', ambienteId)
form.append('tipoCaso', tipoCasoId)
form.append('usuario', userId)
form.append('foto', {
  uri: photoUri,
  name: 'foto.jpg',
  type: 'image/jpeg',
} as unknown as Blob)

await fetch(`${API}/solicitud`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: form,
})
```

---

## 6. Health check

`GET /api/health` (público):

```json
{
  "status": "ok",
  "integrations": {
    "cloudinary": "configured",
    "brevo": "configured",
    "socket": { "connections": 3 }
  }
}
```

---

## Tipos compartidos

Importa desde `@miayuda/contracts` en monorepo o copia los tipos de `packages/contracts/src/`.
