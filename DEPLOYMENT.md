# Guff Ghar - Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account
- Domain name (optional)

### 1. Environment Setup

Create a `.env` file with your production values:

```bash
# Database - Use your production PostgreSQL URL
DATABASE_URL="postgresql://username:password@your-db-host:5432/guffghar"

# Authentication - Generate a strong secret
JWT_SECRET="your-very-secure-jwt-secret-key-minimum-32-characters"

# Cloudinary - Get from your Cloudinary dashboard
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email - For notifications (Gmail example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# App Configuration
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NODE_ENV="production"

# Security
CORS_ORIGIN="https://your-domain.com"
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Open Prisma Studio to verify
npm run db:studio
```

### 3. Build & Deploy

#### Option A: Traditional Server Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

#### Option B: Vercel Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`
4. Add environment variables in Vercel dashboard

#### Option C: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npm run db:generate

EXPOSE 3000

CMD ["npm", "start"]
```

### 4. Database Hosting Options

#### Recommended: Supabase (Free tier available)
1. Create account at supabase.com
2. Create new project
3. Get connection string from Settings > Database
4. Use as DATABASE_URL

#### Alternative: Railway, PlanetScale, or AWS RDS

### 5. Media Storage

#### Cloudinary Setup
1. Sign up at cloudinary.com
2. Get credentials from dashboard
3. Add to environment variables

### 6. Security Checklist

- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set correct CORS_ORIGIN
- [ ] Use production database
- [ ] Enable rate limiting (optional)
- [ ] Set up monitoring (optional)

### 7. Performance Optimization

- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Optimize images with Cloudinary
- [ ] Enable database connection pooling
- [ ] Monitor response times

### 8. Post-Deployment

1. Test user registration/login
2. Test posting and media upload
3. Test real-time chat
4. Test video calling
5. Verify email notifications
6. Test mobile responsiveness

### 9. Scaling Considerations

For high traffic:
- Use Redis for session storage
- Implement horizontal scaling
- Add load balancer
- Use separate WebSocket server
- Implement caching layer

### 10. Monitoring & Logs

- Monitor database performance
- Track API response times
- Set up error logging
- Monitor WebSocket connections
- Track user engagement metrics

## 🎯 Quick Start Commands

```bash
# Development
npm run dev

# Production Build
npm run build
npm start

# Database Management
npm run db:studio
npm run db:migrate
```

## 🆘 Troubleshooting

### Common Issues:

1. **Database Connection Error**
   - Verify DATABASE_URL is correct
   - Check database server is running
   - Ensure IP is whitelisted

2. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Clear browser localStorage

3. **File Upload Failing**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper CORS setup

4. **WebSocket Connection Issues**
   - Check firewall settings
   - Verify Socket.io configuration
   - Test with browser dev tools

5. **Real-time Features Not Working**
   - Ensure server.js is running
   - Check authentication tokens
   - Verify database permissions

## 📞 Support

For issues or questions:
- Check GitHub issues
- Review application logs
- Test in development environment first

## 🔄 Updates

To update the application:
1. Pull latest changes
2. Run `npm install`
3. Run database migrations if needed
4. Rebuild and restart

---

**Your Guff Ghar app is now ready for real users! 🎉**