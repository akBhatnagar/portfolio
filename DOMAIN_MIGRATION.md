# Move Everything to DigitalOcean Droplet

Complete guide to migrate akshaybhatnagar.in and all subdomains from Vercel to your droplet.

**Droplet IP:** 206.189.129.16

---

## Part 1: Add Domain to DigitalOcean DNS

1. Go to [DigitalOcean Control Panel](https://cloud.digitalocean.com/) → **Networking** → **Domains**
2. Click **Add Domain**
3. Enter: `akshaybhatnagar.in`
4. Select your droplet (206.189.129.16) or choose "Create new record"
5. Click **Add Domain**

DigitalOcean will create default A records. You'll get nameservers like:
- `ns1.digitalocean.com`
- `ns2.digitalocean.com`
- `ns3.digitalocean.com`

---

## Part 2: Create DNS Records in DigitalOcean

In the domain's DNS records, add/update:

| Type | Hostname | Value | TTL |
|------|----------|-------|-----|
| A | @ | 206.189.129.16 | 3600 |
| A | www | 206.189.129.16 | 3600 |
| A | todo | 206.189.129.16 | 3600 |
| A | comingsoon | 206.189.129.16 | 3600 |

(Add more A records for other subdomains as needed — all point to the droplet; nginx routes by hostname.)

---

## Part 3: Change Nameservers at Your Registrar

1. Go to where you manage akshaybhatnagar.in (GoDaddy, etc.)
2. Open **Nameservers** / **Edit nameservers**
3. Select **I'll use my own nameservers** and enter:
   - `ns1.digitalocean.com`
   - `ns2.digitalocean.com`
   - `ns3.digitalocean.com`
4. Save

DNS propagation: 15 minutes to 48 hours (often under 1 hour).

---

## Part 4: Apps on the Droplet

| Hostname | App | Port |
|----------|-----|------|
| akshaybhatnagar.in, www | Portfolio | 3000 |
| todo.akshaybhatnagar.in | To-Do App | 3001 |
| comingsoon.akshaybhatnagar.in | Coming Soon page | 3002 |

Nginx routes each hostname to the correct port.

---

## Part 5: Enable HTTPS (After DNS Propagates)

```bash
ssh root@206.189.129.16
certbot --nginx -d akshaybhatnagar.in -d www.akshaybhatnagar.in -d todo.akshaybhatnagar.in -d comingsoon.akshaybhatnagar.in
```

---

## Checklist

- [ ] Add domain in DigitalOcean
- [ ] Create A records (add subdomains as you migrate apps)
- [ ] Update nameservers at registrar
- [ ] Wait for DNS propagation
- [ ] Run certbot for HTTPS
- [ ] Migrate each app (portfolio ✅, todo next, etc.)
