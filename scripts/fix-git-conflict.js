#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🔧 Fixing Git conflict on VPS...');

try {
  // Подключаемся к VPS и исправляем конфликт
  console.log('📋 Removing conflicting untracked files...');
  execSync('ssh root@185.232.205.247 "cd /var/www/manager-pbn && rm -f templates/astro-slots-review/package-lock.json"', { stdio: 'inherit' });
  
  console.log('📋 Pulling latest changes...');
  execSync('ssh root@185.232.205.247 "cd /var/www/manager-pbn && git pull"', { stdio: 'inherit' });
  
  console.log('📋 Restarting Strapi to apply schema changes...');
  execSync('ssh root@185.232.205.247 "cd /var/www/manager-pbn/strapi && pkill -f strapi && sleep 2 && npm run develop"', { 
    stdio: 'inherit',
    detached: true 
  });
  
  console.log('✅ Git conflict fixed and Strapi restarted!');
  console.log('📝 Template selection should now work correctly.');
  
} catch (error) {
  console.error('❌ Failed to fix Git conflict:', error.message);
} 