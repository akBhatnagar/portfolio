#!/bin/bash
# Deploy script for DigitalOcean droplet
# Usage: ./scripts/deploy.sh [user@ip]  (default: root@206.189.129.16)
# Ensure .env exists on the droplet at ~/portfolio/.env with EMAIL_USER and EMAIL_PASS
# Builds locally to avoid OOM on small droplets

set -e

REMOTE=${1:-root@206.189.129.16}

echo "Building locally..."
npm ci
npm run build

echo "Syncing to $REMOTE..."
rsync -avz --exclude node_modules --exclude .git --exclude .next/cache --exclude .DS_Store \
  ./ $REMOTE:~/portfolio/
rsync -avz ./comingsoon/ $REMOTE:~/comingsoon/

echo "Installing production deps and starting on droplet..."
ssh $REMOTE "cd ~/portfolio && npm ci --omit=dev && (pm2 restart ecosystem.config.cjs --update-env || pm2 start ecosystem.config.cjs)"

echo "Deploy complete!"
