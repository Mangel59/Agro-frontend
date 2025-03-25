// docgen.mjs
import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import recast from 'recast';
import babelParser from '@babel/parser';

const COMPONENTS_DIR = './src/components';

const parser = {
  parse(source) {
    try {
      return babelParser.parse(source, {
        sourceType: 'module',
        plugins: ['jsx'],
        errorRecovery: true,
      });
    } catch {
      return null;
    }
  },
};

function cleanOldDocComments(ast) {
  ast.program.body = ast.program.body.filter((node) => {
    if (node.leadingComments) {
      node.leadingComments = node.leadingComments.filter((comment) => {
        return !/@(file|module|exports|component)/.test(comment.value);
      });
    }
    return true;
  });
}

function autoFixSourceCode(source) {
  let fixed = source;

  // Expresiones regulares incompletas o no cerradas
  fixed = fixed.replace(/new RegExp\(([^)]*)$/, 'new RegExp("")');
  fixed = fixed.replace(/\/[^/\n]*$/, '""');

  // Strings no cerradas
  fixed = fixed.replace(/(['"`])(?:\\.|[^\\])*$/, '""');

  // Fragmentos JSX mal cerrados
  fixed = fixed.replace(/return\s*\(\s*\n([^]*?)\n\s*\);/, (match, inner) => {
    return `return (\n<>\n${inner}\n</>\n);`;
  });

  // Comentarios no cerrados que causan errores
  fixed = fixed.replace(/\/\*\*[^]*?(?=\n[^*\/])/, '/** FIXED */');

  return fixed;
}

function createFallbackComponent(filePath) {
  const fileName = path.basename(filePath);
  const componentName = path.parse(fileName).name;
  const moduleName = filePath
    .replace(/^.*?src[\\/]/, '')
    .replace(/\.jsx$/, '')
    .replace(/[\\/]/g, '_')
    .replace(/[^a-zA-Z0-9_]/g, '_');

  const fallback = `/**
 * @file ${fileName}
 * @module ${moduleName}
 * @exports ${componentName}
 *
 * ⚠️ Fallback generado automáticamente. El archivo original tenía errores de parseo.
 */

/**
 * Componente ${componentName}.
 * @component
 * @returns {JSX.Element}
 */
export default function ${componentName}() {
  return <div>Error de parseo en ${componentName}</div>;
}
`;

  fs.writeFileSync(filePath, fallback, 'utf-8');
  console.warn(`🚨 Fallback generado para: ${filePath}`);
}

async function processFile(filePath) {
  let source;

  try {
    source = fs.readFileSync(filePath, 'utf-8');
  } catch {
    console.error(`❌ No se pudo leer: ${filePath}`);
    return;
  }

  let ast;

  try {
    ast = recast.parse(source, { parser });
  } catch {
    // Intentar corregir
    source = autoFixSourceCode(source);
    try {
      ast = recast.parse(source, { parser });
    } catch {
      console.warn(`⚠️ No se pudo corregir ${filePath}, generando fallback...`);
      createFallbackComponent(filePath);
      return;
    }
  }

  cleanOldDocComments(ast);

  const fileName = path.basename(filePath);
  const componentName = path.parse(fileName).name;
  const relativePath = filePath.split(path.sep).join('/');
  const moduleName = relativePath.replace(/^src\//, '').replace(/\.jsx$/, '').replace(/\W+/g, '_');

  const docHeader = `/**
 * @file ${fileName}
 * @module ${moduleName}
 * @exports ${componentName}
 *
 * Componente ${componentName}.
 */`;

  const docComponent = `/**
 * Componente ${componentName}.
 * @component
 * @returns {JSX.Element}
 */`;

  if (!source.includes('@module')) {
    const finalCode = `${docHeader}\n\n${docComponent}\n${source}`;
    fs.writeFileSync(filePath, finalCode, 'utf-8');
    console.log(`✅ Documentado: ${filePath}`);
  } else {
    console.log(`🔍 Ya documentado: ${filePath}`);
  }
}

async function run() {
  try {
    const files = await globby(`${COMPONENTS_DIR}/**/*.jsx`);
    for (const file of files) {
      console.log('➡️ Procesando:', file);
      await processFile(file);
    }
  } catch (err) {
    console.error(`❌ Error al procesar docgen: ${err.message}`);
  }
}

run();
