// fix-jsx-regex-errors.mjs
import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

const targetDir = './src';
const files = await glob(`${targetDir}/**/*.{js,jsx}`, { absolute: true });

const regexFixes = [
  {
    name: 'regex sin cerrar (missing /)',
    pattern: /new RegExp\(\s*["']([^"']+)$/,
    replacement: (match, p1) => `new RegExp("${p1}")`
  },
  {
    name: 'regex con comillas abiertas sin cerrar',
    pattern: /\/\*[^*]*$/,
    replacement: (match) => '/* corregido */'
  },
  {
    name: 'jsx sin fragmento <>',
    pattern: /return\s*\(\s*\n([^<][\s\S]*?)\n\s*\);/,
    replacement: (match, p1) => `return (\n<>\n${p1}\n</>\n);`
  }
];

let fixedFiles = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  let wasFixed = false;

  for (const fix of regexFixes) {
    if (fix.pattern.test(content)) {
      content = content.replace(fix.pattern, fix.replacement);
      wasFixed = true;
      console.log(`🔧 Aplicando fix "${fix.name}" en: ${path.relative('.', file)}`);
    }
  }

  if (wasFixed && content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    fixedFiles++;
  }
}

console.log(`\n🎯 Correcciones aplicadas a ${fixedFiles} archivo(s).`);
