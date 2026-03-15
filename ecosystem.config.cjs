/**
 * PM2 config for DigitalOcean droplet
 * Apps: portfolio (3000), todo (3001) - add more as you migrate
 */
const path = require("path");
const root = path.resolve(__dirname);

module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: root,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
    // Todo app - uncomment and set cwd when you deploy it
    // {
    //   name: "todo",
    //   script: "npm",
    //   args: "start",
    //   cwd: path.join(root, "..", "todo"),
    //   instances: 1,
    //   autorestart: true,
    //   env: { NODE_ENV: "production", PORT: 3001, HOSTNAME: "0.0.0.0" },
    // },
  ],
};
