# 🚀 Vercel Deployment Guide for Guff Ghar

## Quick Deploy Steps

### 1. **Prepare Database** (Choose One)

#### Option A: Supabase (Recommended - Free)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings > Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

#### Option B: Railway (Easy)
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy connection URL

#### Option C: Neon (Serverless)
1. Go to [neon.tech](https://neon.tech)
2. Create database
3. Get connection string

### 2. **Deploy to Vercel**

#### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "c:\Users\Rishaaav\Desktop\Guff Ghar V2"
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: guff-ghar-v2
# - Directory: ./
# - Override settings? No
```

#### Method 2: GitHub + Vercel Dashboard
1. Push code to GitHub repository
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Deploy with default settings

### 3. **Environment Variables**

Add these in Vercel Dashboard > Settings > Environment Variables:

```bash
# Required
DATABASE_URL=postgresql://your-db-connection-string
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-chars
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app

# Optional (for file uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key  
CLOUDINARY_API_SECRET=your-api-secret
```

### 4. **Important Notes**

⚠️ **Socket.io Limitations**: Vercel serverless functions don't support WebSocket connections. For real-time features:

- **Testing**: Basic app functionality will work
- **Real-time chat**: Will need separate WebSocket server (Railway, Render, etc.)
- **Alternative**: Use polling or Server-Sent Events for now

### 5. **Test Your Deployment**

After deployment:
1. ✅ Visit your Vercel URL
2. ✅ Test user registration/login
3. ✅ Test creating posts
4. ✅ Test basic navigation
5. ⚠️ Real-time chat may not work (expected)

### 6. **Troubleshooting**

#### Build Failures
```bash
# If Prisma issues
vercel env add DATABASE_URL production
vercel --prod
```

#### Database Connection
- Ensure DATABASE_URL is correct
- Check database allows external connections
- Verify IP whitelist (0.0.0.0/0 for testing)

#### Missing Dependencies
```bash
# If build fails, ensure all deps are in package.json
npm install --save-exact
```

### 7. **Quick Commands**

```bash
# Redeploy
vercel --prod

# Check logs
vercel logs

# Open in browser
vercel open

# View environment variables
vercel env ls
```

## 🎯 Expected Results

✅ **Working Features:**
- User authentication
- Post creation/viewing
- Image uploads (with Cloudinary)
- Basic social features
- Responsive design

⚠️ **Limited Features:**
- Real-time messaging (needs separate WebSocket server)
- Live notifications
- Video calling

## 🔄 For Full Real-time Features

After testing, deploy the WebSocket server separately:
- Railway, Render, or DigitalOcean for `server.js`
- Keep Next.js app on Vercel
- Update WebSocket connection URLs

---

**Your app will be live at: `https://your-project-name.vercel.app`** 🎉