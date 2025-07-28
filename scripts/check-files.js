const fs = require('fs');
const path = require('path');

console.log('🔍 Проверка файлов...\n');

const filesToCheck = [
  'scripts/fix-tailwind-config.js',
  'scripts/fix-preview-deps.js',
  'scripts/fix-vps-all-enhanced.js',
  'templates/astro-pbn-blog/package.json',
  'templates/astro-pbn-blog/astro.config.mjs'
];

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

console.log('\n📁 Содержимое папки scripts:');
try {
  const scriptsDir = path.join(__dirname);
  const files = fs.readdirSync(scriptsDir);
  files.forEach(file => {
    console.log(`   - ${file}`);
  });
} catch (error) {
  console.log(`   ❌ Ошибка чтения папки scripts: ${error.message}`);
}

console.log('\n📁 Содержимое папки templates:');
try {
  const templatesDir = path.join(__dirname, '..', 'templates');
  const templates = fs.readdirSync(templatesDir);
  templates.forEach(template => {
    console.log(`   - ${template}`);
  });
} catch (error) {
  console.log(`   ❌ Ошибка чтения папки templates: ${error.message}`);
} 