# Deployment Guide for ChatPDFPilot

This guide covers various deployment options for ChatPDFPilot.

## Prerequisites

- Node.js 18+ installed
- Google Gemini API key
- Domain name (for production)

## Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure your environment variables:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
PORT=5000
NODE_ENV=production
```

## Local Production Build

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

## Docker Deployment

1. Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start application
CMD ["npm", "start"]
```

2. Build and run:
```bash
docker build -t chatpdfpilot .
docker run -p 5000:5000 --env-file .env chatpdfpilot
```

## Cloud Deployment Options

### 1. Vercel (Recommended for Frontend + Serverless)

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.

### 2. Railway

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

### 3. Render

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variables

### 4. DigitalOcean App Platform

1. Create new app from GitHub
2. Set build command: `npm run build`
3. Set run command: `npm start`
4. Configure environment variables

## Nginx Configuration (for VPS deployment)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## SSL Certificate (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Process Management (PM2)

```bash
npm install -g pm2

# Start application
pm2 start npm --name "chatpdfpilot" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## Monitoring and Logging

### Application Logs
```bash
# View logs
pm2 logs chatpdfpilot

# Monitor in real-time
pm2 monit
```

### Health Check Endpoint
The application includes a health check at `/api/health`

## Performance Optimization

### 1. Enable Gzip Compression
```javascript
// In server/index.ts
import compression from 'compression';
app.use(compression());
```

### 2. Static File Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Optimization
- Use connection pooling
- Implement proper indexing
- Regular database maintenance

## Security Considerations

1. **Environment Variables**: Never commit API keys
2. **CORS**: Configure proper CORS settings
3. **Rate Limiting**: Implement API rate limiting
4. **File Upload**: Validate file types and sizes
5. **HTTPS**: Always use SSL in production

## Backup Strategy

1. **Database Backups**: Regular automated backups
2. **File Storage**: Backup uploaded PDFs
3. **Configuration**: Version control all configs

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check firewall settings
   - Verify proxy configuration
   - Ensure WebSocket support in load balancer

2. **API Key Issues**
   - Verify Gemini API key is valid
   - Check API quotas and limits
   - Ensure proper environment variable setup

3. **File Upload Problems**
   - Check disk space
   - Verify file permissions
   - Review upload size limits

### Debug Mode
```bash
NODE_ENV=development npm start
```

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Implement session storage (Redis)
- Database clustering

### Vertical Scaling
- Increase server resources
- Optimize application performance
- Use CDN for static assets

## Maintenance

### Regular Tasks
- Update dependencies
- Monitor logs
- Check disk space
- Review security updates
- Backup verification

### Update Process
```bash
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Build application
npm run build

# Restart application
pm2 restart chatpdfpilot
```
