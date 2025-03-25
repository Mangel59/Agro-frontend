import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, 'src'); // cambia si tu carpeta base es otra

async function agregarHeaderJSDoc(dir) {
  const files = await fs.readdir(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      await agregarHeaderJSDoc(fullPath);
    } else if (file.endsWith('.jsx')) {
      let contenido = await fs.readFile(fullPath, 'utf-8');

      if (contenido.includes('@module')) {
        console.log(`⚠️ Ya tiene @module: ${file}`);
        continue;
      }

      const nombreArchivo = path.basename(file, '.jsx');
      const nombreFuncion = (
        contenido.match(/function\s+(\w+)\s*\(/) ||
        contenido.match(/const\s+(\w+)\s*=\s*\(/)
      )?.[1] || nombreArchivo;

      const propsMatch = contenido.match(/function\s+\w+\s*\(\s*\{([^}]*)\}/);
      const propsList = propsMatch?.[1]
        ?.split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0) || [];

      const paramLines = propsList.map(p => ` * @param {*} props.${p} - Propiedad ${p}`).join('\n');

      const jsdocBlock = `/**
 * @file Este archivo contiene el componente ${nombreFuncion}.
 * @module ${nombreFuncion}
 * @exports ${nombreFuncion}
 */

/**
 * Componente ${nombreFuncion}.
 *
 * @function
 * @name ${nombreFuncion}
 * @param {Object} props - Propiedades del componente.
${paramLines ? paramLines + '\n' : ''} * @returns {JSX.Element} Elemento JSX renderizado.
 */`;

      // Insertar justo antes de la declaración de la función
      const updatedContenido = contenido.replace(
        /^(export\s+default\s+function\s+\w+\s*\()/m,
        jsdocBlock + '\n\n$1'
      );

      await fs.writeFile(fullPath, updatedContenido, 'utf-8');
      console.log(`✅ Documentado: ${file}`);
    }
  }
}

agregarHeaderJSDoc(COMPONENTS_DIR).catch(console.error);
