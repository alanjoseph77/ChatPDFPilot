# Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key
- PostgreSQL database (or Neon DB)

### Environment Setup

1. **Create production environment file**:
   ```bash
   cp .env.example .env.production
   ```

2. **Configure production variables**:
   ```env
   NODE_ENV=production
   PORT=8080
   GEMINI_API_KEY=your_production_api_key
   DATABASE_URL=your_production_database_url
   CORS_ORIGIN=https://yourdomain.com
   ```

### Build & Deploy

1. **Install dependencies**:
   ```bash
   npm ci --only=production
   ```

2. **Build the application**:
   ```bash
   npm run build
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY apps/web/package*.json ./apps/web/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 8080

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./uploads:/app/uploads
```

## ☁️ Cloud Deployment

### Vercel (Frontend)
1. Connect your GitHub repository
2. Set build command: `npm run build:web`
3. Set output directory: `apps/web/dist`
4. Configure environment variables

### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set build command: `npm run build:api`
3. Set start command: `npm start`
4. Configure environment variables
5. Set port to `8080`

### Netlify (Frontend Alternative)
1. Build command: `npm run build:web`
2. Publish directory: `apps/web/dist`
3. Configure redirects for SPA

## 🔒 Security Considerations

### Production Checklist
- [ ] Use HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set secure session cookies
- [ ] Implement rate limiting
- [ ] Add request validation
- [ ] Set up monitoring and logging
- [ ] Configure file upload limits
- [ ] Use environment variables for secrets
- [ ] Enable security headers
- [ ] Set up database backups

### Environment Variables Security
- Never commit `.env` files
- Use different API keys for development/production
- Rotate API keys regularly
- Use secrets management in cloud deployments

## 📊 Monitoring

### Health Checks
```bash
curl http://localhost:8080/health
```

### Logs
- Application logs: Check console output
- Error tracking: Implement error monitoring
- Performance: Monitor response times
- Usage: Track API endpoints

## 🔄 Updates & Maintenance

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Database Migrations
```bash
npm run db:push
```

### Backup Strategy
- Regular database backups
- File upload backups
- Configuration backups

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Find process using port 8080
netstat -ano | findstr :8080
# Kill the process
taskkill /PID <process_id> /F
```

**Memory Issues**
- Increase Node.js memory limit: `--max-old-space-size=4096`
- Monitor memory usage
- Implement file cleanup

**WebSocket Connection Issues**
- Check firewall settings
- Verify proxy configuration
- Test WebSocket connectivity

### Performance Optimization
- Enable gzip compression
- Implement caching strategies
- Optimize PDF processing
- Use CDN for static assets
- Database query optimization

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify environment variables
3. Test API endpoints individually
4. Contact support with detailed information
