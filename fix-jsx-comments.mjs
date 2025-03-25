import fs from 'fs';
import path from 'path';
import { globby } from 'globby';

const COMPONENTS_DIR = './src/components';

/**
 * Reemplaza los comentarios JSX {/** ... *\/} por comentarios normales // ...
 * @param {string} content - contenido original del archivo
 * @returns {string} contenido modificado
 */
function replaceJSXComments(content) {
  return content.replace(/\{\s*\/\*([\s\S]*?)\*\/\s*\}/g, (_, comment) => {
    const cleaned = comment.trim().split('\n').map(line => `// ${line.trim()}`).join('\n');
    return cleaned;
  });
}

async function fixCommentsInFiles() {
  const files = await globby(`${COMPONENTS_DIR}/**/*.jsx`);
  let totalFixed = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const newContent = replaceJSXComments(content);

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf-8');
      console.log(`🧼 Comentarios corregidos: ${file}`);
      totalFixed++;
    }
  }

  console.log(`\n✅ Archivos modificados: ${totalFixed}`);
}

fixCommentsInFiles().catch(err => {
  console.error('❌ Error al procesar los archivos:', err);
});
