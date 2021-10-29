module.exports = {
  apps : [{
    name: 'esp-neopixel',
    script: 'app.js',
    watch: 'true',
    max_memory_restart: '100M',
    kill_timeout: 3000,
    listen_timeout: 3000,
    increment_var: "PORT",
    instances: 1,
    env: {
      "NODE_ENV": "development",
      "PORT": "3050"
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }, /*{
    script: './service-worker/',
    watch: ['./service-worker']
  }*/],
/*
  deploy : {
    production : {
      user : 'SSH_USERNAME',
      host : 'SSH_HOSTMACHINE',
      ref  : 'origin/master',
      repo : 'GIT_REPOSITORY',
      path : 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }*/
};
