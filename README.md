# Akshay Bhatnagar | Portfolio

A modern portfolio built with **Next.js 15**, Tailwind CSS, and React. Includes a contact form with email delivery via nodemailer.

**Live:** https://akshaybhatnagar.in · http://206.189.129.16

> **Contact form:** Add your Gmail credentials to `~/portfolio/.env` on the droplet (`EMAIL_USER`, `EMAIL_PASS` with an [App Password](https://support.google.com/accounts/answer/185833)) for the contact form to work.
> **Domain & migration:** See [DOMAIN_MIGRATION.md](DOMAIN_MIGRATION.md) to move akshaybhatnagar.in and subdomains to the droplet.

## Quick Start

```bash
npm install
cp .env.example .env   # Add your EMAIL_USER and EMAIL_PASS
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable     | Description                    |
|-------------|--------------------------------|
| EMAIL_USER  | Gmail address for contact form |
| EMAIL_PASS  | Gmail App Password             |

## Deploy to DigitalOcean Droplet

### Option 1: Deploy via rsync + PM2

1. On your droplet: `sudo apt install nodejs npm && npm i -g pm2`
2. Copy your SSH key: `ssh-copy-id user@your-droplet-ip`
3. Create `~/.env` on droplet with EMAIL_USER and EMAIL_PASS
4. Run: `./scripts/deploy.sh user@your-droplet-ip`

### Option 2: Docker

```bash
docker build -t portfolio .
docker run -p 3000:3000 --env-file .env portfolio
```

### Option 3: Manual

```bash
npm run build
pm2 start ecosystem.config.cjs
```

### Nginx reverse proxy

Copy `nginx.conf` to `/etc/nginx/sites-available/`, update `server_name`, and enable:

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

**Security:** Never paste credentials in chat. Use SSH keys and environment variables on the server.
