module.exports = {
  apps: [
    {
      name: 'pbn-manager',
      script: 'npm',
      args: 'run dev',
      cwd: './',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/pbn-manager-error.log',
      out_file: './logs/pbn-manager-out.log',
      log_file: './logs/pbn-manager-combined.log',
      time: true
    },
    {
      name: 'strapi',
      script: 'npm',
      args: 'run develop',
      cwd: './strapi',
      env: {
        NODE_ENV: 'development',
        PORT: 1337
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/strapi-error.log',
      out_file: './logs/strapi-out.log',
      log_file: './logs/strapi-combined.log',
      time: true
    }
  ],

  deploy: {
    production: {
      user: 'root',
      host: 'your-vps-ip',
      ref: 'origin/main',
      repo: 'https://github.com/your-username/pbn-manager.git',
      path: '/var/www/pbn-manager',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && cd strapi && npm install && cd .. && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
} 