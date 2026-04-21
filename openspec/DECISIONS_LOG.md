# Decisiones Manuales del Usuario

- **MigraciÃ³n a pnpm (2026-04-20):** Se forzÃ³ la adopciÃ³n estricta de pnpm eliminando package-lock.json e imponiendo engines en root para evitar fallos/mezclas de NPM.
- **Git Hooks Orden (2026-04-20):** Se decidiÃ³ que el hook pre-commit debe fallar y abortar en `tsc --noEmit` antes de siquiera intentar correr ESLint.
- **Actualizaciones Major Rechazadas en Client (2026-04-20):** Se rechazaron de manera consciente las actualizaciones React 18->19, React Router 6->7, TailwindCSS 3->4, y FontAwesome 6->7. Esto para priorizar la estabilidad de la migraciÃ³n de JS a TS sin romper la app de entrada. Se aprobaron solo Vite 8, ESLint 10, dotenv 17 y react-toastify 11.
- **Actualizaciones Major Rechazadas en Server (2026-04-20):** Se rechazaron Mongoose 8->9 y Jest 29->30 para asegurar compatibilidad temporal. 
- **DecisiÃ³n Especial sobre Joi (2026-04-20):** Joi no se actualiza porque serÃ¡ eliminado en Fase 2-3 al migrar endpoints a Zod. Deuda tÃ©cnica aceptada. Se aprobaron Express 5, Multer 2, jsonwebtoken 10, Nodemailer 8 y dotenv 17.
- **Regla dotenv 17 (2026-04-20):** dotenv 17 requiere path explícito en dotenv.config(). Regla adoptada: siempre usar path absoluto con __dirname + resolve, nunca dotenv.config() sin argumentos. Aplicar esta regla en toda la migración a TS.

- **SKIP_PRE_COMMIT bypass — Deuda técnica planificada:**
  El hook pre-commit tiene un bypass vía variable de entorno SKIP_PRE_COMMIT=1. Esto es temporal y SOLO válido mientras TypeScript no esté instalado en ambos subproyectos.
  Condición de eliminación: Una vez completadas las Tareas 1.2 y 1.3 (TS en server y client), remover el bloque if/exit 0 del pre-commit hook. A partir de ese punto, NINGÚN commit puede bypassear los checks. Esta fecha límite es la Tarea 1.3.

- **Vitest Globals Config (2026-04-21):**
  Vitest globals requieren types: ['vitest/globals'] en tsconfig.json del client. Sin esto, tsc --noEmit reporta errores falsos en archivos de test. Regla: siempre incluir esta config al configurar Vitest.
