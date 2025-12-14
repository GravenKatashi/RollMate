# AWS Deployment Guide

## Pre-Deployment Checklist

### ✅ System Status
- [x] Production Dockerfiles created
- [x] Production docker-compose.yml configured
- [x] CORS configured for production
- [x] Environment variables documented
- [x] Nginx configurations ready

### ⚠️ Before Deploying

1. **Generate Laravel Application Key**
   ```bash
   docker-compose exec backend php artisan key:generate
   ```
   Copy the generated key to your production `.env` file.

2. **Set Secure Database Password**
   - Use a strong, randomly generated password
   - Never use "root" in production

3. **Configure Domain Names**
   - Set up your domain names (e.g., `api.yourdomain.com`, `app.yourdomain.com`)
   - Get SSL certificates (Let's Encrypt or AWS Certificate Manager)

4. **Set Environment Variables**
   - See `back-end/.env.example` for required variables
   - Set `APP_ENV=production`
   - Set `APP_DEBUG=false`
   - Set `FRONTEND_URL` to your frontend domain

## EC2 Deployment Steps

### 1. Launch EC2 Instance

**Recommended AMI:** `Ubuntu Server 22.04 LTS (HVM), SSD Volume Type`

**Instance Specifications:**
- **Type:** t3.medium or larger (2 vCPU, 4GB RAM minimum)
- **Storage:** 20GB+ SSD
- **Security Group:** 
  - Inbound: HTTP (80), HTTPS (443), SSH (22)
  - Outbound: All traffic

### 2. Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

### 3. Install Docker and Docker Compose

```bash
# Update system
sudo apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Log out and back in for group changes
exit
```

### 4. Clone Your Repository

```bash
git clone your-repository-url
cd my-web-system
```

### 5. Configure Environment Variables

Create `.env` file for backend:

```bash
cd back-end
cp .env.example .env
nano .env
```

**Required Variables:**
```env
APP_NAME="Attendance Tracking System"
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=attendance_system
DB_USERNAME=root
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

FRONTEND_URL=https://app.yourdomain.com
```

### 6. Generate Application Key

```bash
# After setting up .env, generate the key
docker-compose -f docker-compose.prod.yml exec backend php artisan key:generate
```

### 7. Set Up Production Environment File

Create `.env` file in project root for docker-compose:

```bash
cd ..
nano .env
```

```env
# Backend Configuration
APP_NAME=Attendance Tracking System
APP_ENV=production
APP_KEY=base64:YOUR_GENERATED_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

# Database Configuration
DB_DATABASE=attendance_system
DB_USERNAME=root
DB_PASSWORD=YOUR_SECURE_PASSWORD_HERE

# Frontend Configuration
FRONTEND_URL=https://app.yourdomain.com
API_URL=https://api.yourdomain.com/api

# Port Configuration (optional)
BACKEND_PORT=8000
FRONTEND_PORT=80
MYSQL_PORT=3306
```

### 8. Build and Start Services

```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 9. Run Database Migrations

```bash
docker-compose -f docker-compose.prod.yml exec backend php artisan migrate --force
```

### 10. Optimize Laravel for Production

```bash
docker-compose -f docker-compose.prod.yml exec backend php artisan config:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan route:cache
docker-compose -f docker-compose.prod.yml exec backend php artisan view:cache
```

### 11. Set Up Nginx Reverse Proxy (Optional but Recommended)

If you want to use a single domain with paths, set up Nginx on the host:

```bash
sudo apt-get install nginx certbot python3-certbot-nginx
```

Create `/etc/nginx/sites-available/attendance-system`:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name app.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

Enable and get SSL:

```bash
sudo ln -s /etc/nginx/sites-available/attendance-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo certbot --nginx -d api.yourdomain.com -d app.yourdomain.com
```

## Using AWS RDS (Recommended for Production)

Instead of containerized MySQL, use AWS RDS:

1. **Create RDS MySQL Instance:**
   - Engine: MySQL 8.0
   - Instance class: db.t3.micro (or larger)
   - Storage: 20GB+
   - Enable automated backups

2. **Update `.env` file:**
   ```env
   DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
   DB_PORT=3306
   DB_DATABASE=attendance_system
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_secure_password
   ```

3. **Update Security Group:**
   - Allow inbound MySQL (3306) from your EC2 security group

4. **Remove MySQL service from docker-compose.prod.yml:**
   - Comment out or remove the `mysql` service
   - Remove `depends_on: mysql` from backend

## Security Best Practices

1. **Firewall Configuration:**
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

2. **Don't Expose MySQL Port:**
   - Remove MySQL port mapping in production
   - Use RDS or keep MySQL internal to Docker network

3. **Regular Updates:**
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

4. **Backup Strategy:**
   - Set up automated RDS backups
   - Backup storage directory: `back-end/storage`
   - Consider using AWS S3 for file storage

5. **Monitoring:**
   - Set up CloudWatch logs
   - Monitor disk space
   - Set up alerts for errors

## Troubleshooting

### Check Container Status
```bash
docker-compose -f docker-compose.prod.yml ps
```

### View Logs
```bash
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
```

### Restart Services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Access Backend Container
```bash
docker-compose -f docker-compose.prod.yml exec backend bash
```

## Post-Deployment

1. **Test All Endpoints:**
   - Login/Register
   - Create classroom
   - Join classroom
   - Mark attendance

2. **Verify CORS:**
   - Check browser console for CORS errors
   - Ensure `FRONTEND_URL` matches your domain

3. **Monitor Performance:**
   - Check CloudWatch metrics
   - Monitor database connections
   - Watch for memory/CPU usage

4. **Set Up Auto-Scaling (Optional):**
   - Configure Application Load Balancer
   - Set up auto-scaling groups
   - Use ECS Fargate for better scaling

## Alternative: AWS ECS Deployment

For better scalability, consider deploying to ECS Fargate:

1. **Build and Push Images to ECR:**
   ```bash
   aws ecr create-repository --repository-name attendance-backend
   aws ecr create-repository --repository-name attendance-frontend
   
   docker build -f back-end/Dockerfile.prod -t attendance-backend .
   docker tag attendance-backend:latest YOUR_ECR_URL/attendance-backend:latest
   docker push YOUR_ECR_URL/attendance-backend:latest
   ```

2. **Create ECS Task Definitions**
3. **Set up Application Load Balancer**
4. **Configure Auto-Scaling**

See AWS ECS documentation for detailed steps.

