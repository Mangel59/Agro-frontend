const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const files = [];
function findJSXFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJSXFiles(fullPath);
    } else if (entry.name.endsWith('.jsx')) {
      files.push(fullPath);
    }
  }
}

findJSXFiles(srcDir);

let updated = 0;
let alreadyDocumented = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  const alreadyHasJsDoc = lines.slice(0, 10).some(line => line.includes('/**'));
  if (alreadyHasJsDoc) {
    alreadyDocumented++;
    return;
  }

  const fileName = path.basename(file, '.jsx');
  const docBlock = `
/**
 * ${fileName} componente principal.
 * @component
 * @returns {JSX.Element}
 */
`.trim();

  // Detectar línea de exportación del componente
  const exportIndex = lines.findIndex(line =>
    line.match(/export\s+default\s+function\s+|const\s+\w+\s*=\s*\(/)
  );

  if (exportIndex !== -1) {
    lines.splice(exportIndex, 0, docBlock);
    fs.writeFileSync(file, lines.join('\n'), 'utf-8');
    console.log('🟢 Documentado:', path.relative(__dirname, file));
    updated++;
  } else {
    console.log('⚠️ No se detectó export en:', path.relative(__dirname, file));
  }
});

console.log('\n✅ Proceso completado');
console.log(`📄 Archivos actualizados con JSDoc: ${updated}`);
console.log(`📄 Archivos que ya estaban documentados: ${alreadyDocumented}`);
