module.exports = {
  apps: [{
    name: 'yd-ai-bff',
    script: 'app.ts',
    interpreter: 'ts-node',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
}