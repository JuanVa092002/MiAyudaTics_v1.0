# Log de Progreso (SDD)

## [2026-04-20] Tarea 1.0 — Migración a pnpm y Auditoría
- **Estado:** ✅ Completada
- **Resultado verification:** 
  - Archivos `pnpm-lock.yaml` generados en `/client` y `/server`.
  - Frontend (`pnpm run dev`): Levanta exitosamente en `localhost:5173` con Vite 8.
  - Backend (`pnpm run dev`): Levanta el servidor HTTP. El path de `dotenv` se ha corregido con `require('path').resolve(__dirname, '.env')`, lo cual inyecta correctamente las 6 variables del archivo `.env` recién creado. Mongoose ahora recibe la cadena de conexión y arroja `Authentication failed` (ya que conservé `<db_password>`), lo que confirma que el error crítico de `undefined URI` ha sido resuelto de raíz.
- **Decisiones tomadas:** 
  - En Client: Se aprobó Vite 8, ESLint 10, dotenv 17, react-toastify 11. Se rechazó React 19, React Router 7, Tailwind 4, FontAwesome 7.
  - En Server: Se aprobó Express 5, Multer 2, jsonwebtoken 10, Nodemailer 8, dotenv 17. Se rechazó Mongoose 9, Jest 30. Joi se mantiene por compatibilidad temporal (ADR-002: migración futura a Zod).
- **Deuda técnica generada:** 
  - `allowJs: true` (Agendado como Tarea 2.0 backlog).
  - Versiones ancladas intencionalmente de librerías core.
