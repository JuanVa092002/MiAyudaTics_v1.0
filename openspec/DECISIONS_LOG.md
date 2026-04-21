# Decisiones Manuales del Usuario

- **Migraci贸n a pnpm (2026-04-20):** Se forz贸 la adopci贸n estricta de pnpm eliminando package-lock.json e imponiendo engines en root para evitar fallos/mezclas de NPM.
- **Git Hooks Orden (2026-04-20):** Se decidi贸 que el hook pre-commit debe fallar y abortar en `tsc --noEmit` antes de siquiera intentar correr ESLint.
- **Actualizaciones Major Rechazadas en Client (2026-04-20):** Se rechazaron de manera consciente las actualizaciones React 18->19, React Router 6->7, TailwindCSS 3->4, y FontAwesome 6->7. Esto para priorizar la estabilidad de la migraci贸n de JS a TS sin romper la app de entrada. Se aprobaron solo Vite 8, ESLint 10, dotenv 17 y react-toastify 11.
- **Actualizaciones Major Rechazadas en Server (2026-04-20):** Se rechazaron Mongoose 8->9 y Jest 29->30 para asegurar compatibilidad temporal. 
- **Decisi贸n Especial sobre Joi (2026-04-20):** Joi no se actualiza porque ser谩 eliminado en Fase 2-3 al migrar endpoints a Zod. Deuda t茅cnica aceptada. Se aprobaron Express 5, Multer 2, jsonwebtoken 10, Nodemailer 8 y dotenv 17.
- **Regla dotenv 17 (2026-04-20):** dotenv 17 requiere path expl韈ito en dotenv.config(). Regla adoptada: siempre usar path absoluto con __dirname + resolve, nunca dotenv.config() sin argumentos. Aplicar esta regla en toda la migraci髇 a TS.
