const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('dist') && !file.includes('features')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.js') && !file.endsWith('eslint.config.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./server');

const groups = {
  A: [],
  B: [],
  C: [],
  D: []
};

let totalLines = 0;
let totalFiles = 0;

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n').length;
  totalLines += lines;
  totalFiles++;
  
  const requireRegex = /require\(['"](.*?)['"]\)/g;
  let match;
  const requires = [];
  while ((match = requireRegex.exec(content)) !== null) {
    if (!match[1].startsWith('.')) requires.push(match[1]); // only external
  }
  
  const filename = f.replace(/\\/g, '/').replace('server/', '');
  let complexity = 'Baja';
  if (lines > 100) complexity = 'Media';
  if (lines > 200) complexity = 'Alta';
  
  const entry = `- \`${filename}\` | ${lines} líneas | ${complexity} | ${requires.join(', ') || 'Ninguna'}`;
  
  if (filename.includes('utils/') || filename.includes('tests/') || filename.includes('validators/')) {
    groups.A.push(entry);
  } else if (filename.includes('middleware/') || filename.includes('config/')) {
    groups.B.push(entry);
  } else if (filename.includes('models/')) {
    groups.C.push(entry);
  } else {
    groups.D.push(entry);
  }
});

let md = `## Task Breakdown (Inventario de Migración)

**Métricas del Inventario:**
- **Total de archivos JS a migrar:** ${totalFiles}
- **Líneas de código totales:** ${totalLines}
- **Errores TS esperados (Estimado):** 
  - Grupo A: ~30 (Mayormente tipado de helpers genéricos y schemas)
  - Grupo B: ~20 (Middlewares con Custom Request typings)
  - Grupo C: ~80 (Interfaces y Tipos estables para Mongoose schemas)
  - Grupo D: ~200 (Controllers req/res y encadenamiento de validación runtime)

### Grupo A — Migrar primero (sin dependencias internas)
*Tipos, constantes, utilidades, helpers, middlewares simples, validadores*
${groups.A.join('\n')}

### Grupo B — Migrar segundo (dependen de A)
*Configuraciones, conexión DB, middlewares de auth*
${groups.B.join('\n')}

### Grupo C — Migrar tercero (dependen de A y B)
*Modelos de Mongoose*
${groups.C.join('\n')}

### Grupo D — Migrar último (dependen de todo)
*Servicios, controladores, rutas*
${groups.D.join('\n')}
`;

fs.writeFileSync('scratch/inventory.md', md);
