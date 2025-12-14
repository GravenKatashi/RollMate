# Pre-Deployment Checklist

## Critical Items (Must Complete)

### 1. Environment Configuration
- [ ] Generate `APP_KEY`: `php artisan key:generate`
- [ ] Set `APP_ENV=production` in `.env`
- [ ] Set `APP_DEBUG=false` in `.env`
- [ ] Set secure `DB_PASSWORD` (not "root")
- [ ] Set `APP_URL` to your production API domain
- [ ] Set `FRONTEND_URL` to your production frontend domain

### 2. Security
- [ ] Change default database password
- [ ] Remove MySQL port exposure in production (use RDS or internal network)
- [ ] Configure firewall (UFW) on EC2
- [ ] Set up SSL certificates (Let's Encrypt or AWS Certificate Manager)
- [ ] Review and update CORS allowed origins

### 3. Database
- [ ] Run migrations: `php artisan migrate --force`
- [ ] Consider using AWS RDS instead of containerized MySQL
- [ ] Set up automated backups
- [ ] Test database connection

### 4. Application Optimization
- [ ] Cache config: `php artisan config:cache`
- [ ] Cache routes: `php artisan route:cache`
- [ ] Cache views: `php artisan view:cache`
- [ ] Verify production build works

### 5. Infrastructure
- [ ] Set up domain names (DNS records)
- [ ] Configure security groups (ports 80, 443, 22)
- [ ] Set up monitoring (CloudWatch)
- [ ] Configure log aggregation

## Recommended Items

### Performance
- [ ] Set up Redis for caching (optional)
- [ ] Configure CDN for frontend assets (CloudFront)
- [ ] Enable gzip compression (already in nginx config)
- [ ] Set up database indexes (if needed)

### Monitoring
- [ ] Set up CloudWatch alarms
- [ ] Configure error tracking (Sentry, etc.)
- [ ] Set up uptime monitoring
- [ ] Configure log retention policies

### Backup & Recovery
- [ ] Set up automated database backups
- [ ] Backup storage directory
- [ ] Test restore procedures
- [ ] Document recovery process

### Documentation
- [ ] Document API endpoints
- [ ] Create runbook for common issues
- [ ] Document environment variables
- [ ] Create user guide

## Testing Before Production

- [ ] Test user registration
- [ ] Test user login
- [ ] Test classroom creation
- [ ] Test classroom joining
- [ ] Test session creation
- [ ] Test attendance marking
- [ ] Test profile updates
- [ ] Test on mobile devices
- [ ] Test CORS from frontend domain
- [ ] Load testing (if applicable)

## Post-Deployment Verification

- [ ] All endpoints respond correctly
- [ ] No CORS errors in browser console
- [ ] SSL certificates working
- [ ] Database connections stable
- [ ] Logs are being generated
- [ ] Monitoring is active
- [ ] Backups are running

## Rollback Plan

- [ ] Document rollback procedure
- [ ] Keep previous Docker images
- [ ] Backup database before deployment
- [ ] Test rollback in staging environment

