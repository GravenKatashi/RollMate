# Quick Deployment Reference

## EC2 Setup (First Time)

```bash
# 1. Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Log out and back in
exit
```

## Initial Deployment

```bash
# 1. Clone repository
git clone your-repo-url
cd my-web-system

# 2. Configure environment
cp env.production.example .env
nano .env  # Edit with your values

cp back-end/.env.example back-end/.env
nano back-end/.env  # Edit with your values

# 3. Make deploy script executable
chmod +x deploy.sh

# 4. Deploy
./deploy.sh
```

## Common Commands

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Restart services
docker-compose -f docker-compose.prod.yml restart

# Stop services
docker-compose -f docker-compose.prod.yml down

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Rebuild after code changes
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force

# Access backend container
docker-compose -f docker-compose.prod.yml exec backend bash

# Check service status
docker-compose -f docker-compose.prod.yml ps
```

## Required Environment Variables

### Root .env
- `APP_KEY` (generate with: `php artisan key:generate`)
- `DB_PASSWORD` (secure password)
- `FRONTEND_URL` (your frontend domain)
- `API_URL` (your API URL)

### back-end/.env
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY` (same as above)
- `APP_URL` (your API domain)
- `DB_*` (database credentials)
- `FRONTEND_URL` (for CORS)

## Troubleshooting

### Services won't start
```bash
docker-compose -f docker-compose.prod.yml logs
```

### Database connection failed
- Check `DB_HOST` (use `mysql` for containerized, RDS endpoint for RDS)
- Verify `DB_PASSWORD` is correct
- Check security groups if using RDS

### CORS errors
- Verify `FRONTEND_URL` in `back-end/.env` matches your frontend domain
- Check browser console for specific error
- Restart backend: `docker-compose -f docker-compose.prod.yml restart backend`

### Can't access from browser
- Check security group allows ports 80/443
- Verify domain DNS points to EC2 IP
- Check nginx/container logs

