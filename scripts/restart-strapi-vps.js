#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Restarting Strapi on VPS...');

try {
  // Kill existing Strapi processes
  console.log('📋 Stopping existing Strapi processes...');
  execSync('ssh root@185.232.205.247 "pkill -f strapi"', { stdio: 'inherit' });
  
  // Wait a moment for processes to stop
  setTimeout(() => {
    try {
      // Start Strapi in development mode
      console.log('🚀 Starting Strapi in development mode...');
      execSync('ssh root@185.232.205.247 "cd /var/www/manager-pbn/strapi && npm run develop"', { 
        stdio: 'inherit',
        detached: true 
      });
      
      console.log('✅ Strapi restarted successfully!');
      console.log('📝 Schema changes applied - new template values are now available');
      
    } catch (error) {
      console.error('❌ Failed to start Strapi:', error.message);
    }
  }, 2000);
  
} catch (error) {
  console.error('❌ Failed to restart Strapi:', error.message);
} 