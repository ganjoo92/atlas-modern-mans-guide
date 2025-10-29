# 🚀 Atlas Modern Man's Guide - Deployment Guide

Complete guide for deploying Atlas to production and setting up the infrastructure for beta testing.

## 📋 Pre-Deployment Checklist

### ✅ Required Setup
- [ ] Gemini AI API Key (for AI mentor features)
- [ ] Domain name purchased (e.g., `atlasapp.xyz`)
- [ ] SSL certificate (automatic with most platforms)
- [ ] Analytics setup (PostHog/Plausible - optional)
- [ ] Database setup (Supabase - for user data sync)

## 🚀 Quick Deploy Options

### Option 1: Render.com (Recommended - Free Tier)

**Why Render?** Fast setup, automatic SSL, free tier, easy scaling.

1. **Connect Repository**
   ```bash
   # Push your code to GitHub first
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create Render Service**
   - Go to [render.com](https://render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Use these settings:
     - **Build Command**: `npm run build`
     - **Start Command**: `npx serve -s dist -l 3000`
     - **Publish Directory**: `dist`

3. **Environment Variables**
   ```
   VITE_GEMINI_API_KEY=your-actual-gemini-key
   VITE_APP_NAME=Atlas Modern Man's Guide
   NODE_ENV=production
   ```

4. **Custom Domain** (Optional)
   - Add your custom domain in Render dashboard
   - Update DNS to point to Render

### Option 2: Railway.app

**Why Railway?** Great for hobby projects, simple GitHub integration.

1. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli

   # Login and deploy
   railway login
   railway deploy
   ```

2. **Set Environment Variables**
   ```bash
   railway variables set VITE_GEMINI_API_KEY=your-key
   railway variables set NODE_ENV=production
   ```

### Option 3: Fly.io (More Control)

**Why Fly.io?** Global deployment, more control, good for scaling.

1. **Install Fly CLI**
   ```bash
   # Install flyctl
   curl -L https://fly.io/install.sh | sh
   ```

2. **Initialize Fly App**
   ```bash
   fly launch
   # Follow prompts, it will create fly.toml
   ```

3. **Set Secrets**
   ```bash
   fly secrets set VITE_GEMINI_API_KEY=your-key
   ```

4. **Deploy**
   ```bash
   fly deploy
   ```

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your Project URL and anon key

### Step 2: Setup Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the query to create all tables

### Step 3: Configure Environment Variables

Add to your deployment platform:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🐳 Docker Deployment

### Local Testing
```bash
# Development
./deploy.sh dev

# Production build
./deploy.sh prod

# View status
./deploy.sh status
```

### VPS/Cloud Server Deployment
```bash
# Clone repo on server
git clone https://github.com/yourusername/atlas-modern-mans-guide.git
cd atlas-modern-mans-guide

# Setup environment
cp .env.example .env
# Edit .env with your keys

# Deploy
./deploy.sh prod
```

## 📊 Analytics Setup (Optional)

### PostHog (Recommended)
1. Sign up at [posthog.com](https://posthog.com)
2. Get your API key
3. Add to environment:
   ```
   VITE_POSTHOG_KEY=phc_your-key-here
   ```

### Plausible Analytics
1. Sign up at [plausible.io](https://plausible.io)
2. Add your domain
3. Add to environment:
   ```
   VITE_PLAUSIBLE_DOMAIN=your-domain.com
   ```

## 🔧 Environment Configuration

### Development (.env.development)
```bash
VITE_GEMINI_API_KEY=your-dev-key
VITE_APP_NAME=Atlas Dev
NODE_ENV=development
```

### Production (.env.production)
```bash
VITE_GEMINI_API_KEY=your-prod-key
VITE_APP_NAME=Atlas Modern Man's Guide
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_POSTHOG_KEY=phc_your-key
NODE_ENV=production
```

## 🎯 Beta Testing Setup

### Landing Page (Quick Options)

**Option A: Typedream**
1. Go to [typedream.com](https://typedream.com)
2. Use template: "App Launch"
3. Customize with Atlas branding
4. Add email capture form

**Option B: Notion Site**
1. Create Notion page
2. Add sections:
   - Hero: "Atlas — Your Personal AI Mentor for Men"
   - Features overview
   - "Join Beta" email form
3. Make public and get custom domain

**Option C: Simple HTML Landing**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Atlas - Personal AI Mentor for Men</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 2rem; }
        .hero { text-align: center; margin: 4rem 0; }
        .cta { background: #ff6b35; color: white; padding: 1rem 2rem; border: none; border-radius: 8px; font-size: 1.1rem; }
    </style>
</head>
<body>
    <div class="hero">
        <h1>Atlas — Your Personal AI Mentor for Men</h1>
        <p>Join the 7-Day Atlas Challenge and level up your mindset, body, and purpose.</p>
        <button class="cta" onclick="window.open('https://your-atlas-app.com')">
            Join Free Beta
        </button>
    </div>
</body>
</html>
```

### Email Collection

**ConvertKit Setup:**
1. Create ConvertKit account
2. Create form for "Atlas Beta"
3. Embed on landing page

**Tally Form:**
1. Go to [tally.so](https://tally.so)
2. Create "Atlas Beta Signup" form
3. Fields: Name, Email, "What's your biggest challenge?"

## 🔍 Monitoring & Health Checks

### Basic Health Check Endpoint
The app serves at `/` - you can monitor:
- Response time
- HTTP status codes
- Console errors in browser dev tools

### Uptime Monitoring
- **UptimeRobot** (free): Monitor main URL
- **Pingdom**: More detailed monitoring
- **Render/Railway**: Built-in monitoring

## 🚨 Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build
```

**Environment Variables Not Working:**
- Ensure variables start with `VITE_`
- Check spelling and case sensitivity
- Restart deployment after changes

**Gemini API Errors:**
- Verify API key is correct
- Check quota limits in Google AI Studio
- Ensure billing is setup if needed

**Docker Issues:**
```bash
# Clean up containers
docker-compose down
docker system prune -f

# Rebuild from scratch
docker-compose build --no-cache
```

## 📈 Scaling Considerations

### Phase 1 (0-100 users)
- Render/Railway free tier
- Local storage only
- Basic analytics

### Phase 2 (100-1000 users)
- Upgrade to paid hosting
- Add Supabase database
- Implement user accounts

### Phase 3 (1000+ users)
- CDN for static assets
- Redis for caching
- Load balancer for multiple instances

## 📞 Support

For deployment issues:
1. Check the logs: `./deploy.sh status`
2. Review environment variables
3. Test locally first: `./deploy.sh dev`

Ready to launch! 🚀