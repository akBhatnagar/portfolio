# Droplet Cleanup Plan

**Droplet:** 206.189.129.16  
**Current usage:** 6.5G / 24G (28%)  
**Potential savings:** ~2.9 GB

---

## Safe to clean (no impact on apps)

| Item | Size | Command | Saves |
|------|------|---------|-------|
| **systemd journal** | 2.4 GB | Limit retention (see below) | ~2.2 GB |
| **Failed login logs (btmp)** | 317 MB | `truncate -s 0 /var/log/btmp /var/log/btmp.1` | ~317 MB |
| **apt cache** | 163 MB | `apt-get clean` | ~163 MB |
| **npm cache** | 182 MB | `npm cache clean --force` | ~182 MB |
| **Next.js build cache** | 63 MB | `rm -rf ~/portfolio/.next/cache` | ~63 MB |

**Subtotal:** ~2.9 GB

---

## Requires your decision

| Item | Size | Notes |
|------|------|-------|
| **wordcrypt_backup** | 23 MB | Old Python project backup in `/root/wordcrypt_backup`. Delete only if you no longer need it. |

---

## Cleanup commands (run in order)

### 1. Limit systemd journal (saves ~2.2 GB)

```bash
# Keep only 7 days of logs, max 100MB
sudo sed -i 's/#SystemMaxUse=/SystemMaxUse=100M/' /etc/systemd/journald.conf
sudo sed -i 's/#MaxRetentionSec=/MaxRetentionSec=7day/' /etc/systemd/journald.conf
sudo systemctl restart systemd-journald
# Remove old journal files
sudo journalctl --vacuum-time=7d
```

### 2. Clear failed login logs (saves ~317 MB)

```bash
sudo truncate -s 0 /var/log/btmp /var/log/btmp.1
```

### 3. Clear apt cache (saves ~163 MB)

```bash
sudo apt-get clean
```

### 4. Clear npm cache (saves ~182 MB)

```bash
npm cache clean --force
```

### 5. Clear Next.js build cache (saves ~63 MB)

```bash
rm -rf ~/portfolio/.next/cache
```
*(Regenerates on next deploy)*

### 6. Optional: Remove wordcrypt_backup (saves 23 MB)

```bash
rm -rf ~/wordcrypt_backup
```
*Only if you don't need this backup.*

---

## One-liner (safe items only)

```bash
ssh root@206.189.129.16 'truncate -s 0 /var/log/btmp /var/log/btmp.1 && apt-get clean && npm cache clean --force && rm -rf ~/portfolio/.next/cache'
```

This frees ~565 MB immediately. For journal cleanup (~2.2 GB), run the journal commands separately.
