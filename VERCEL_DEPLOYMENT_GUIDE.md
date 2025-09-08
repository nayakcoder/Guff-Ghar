# 🚀 Vercel Deployment Guide for Guff Ghar

## ✅ Issue Fixed: Environment File Check Error

The Vercel deployment error has been resolved by removing the `ignoreCommand` that was checking for non-existent `.env` files.

## 🔧 Next Steps: Set Up Environment Variables

### 1. **Create Supabase Database** (Required)

1. Go to [supabase.com](https://supabase.com)
2. Create new project:
   - **Name**: `guff-ghar`
   - **Password**: Create strong password (save it!)
   - **Region**: Choose closest to your users
3. Get DATABASE_URL:
   - Settings → Database → Connection string → URI
   - Copy: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### 2. **Add Environment Variables to Vercel**

Go to your Vercel project: [https://vercel.com/nayakcoder/guff-ghar](https://vercel.com/nayakcoder/guff-ghar)

Navigate to: **Settings** → **Environment Variables**

Add these **REQUIRED** variables:

#### **🔐 Database & Authentication**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
JWT_SECRET=guff-ghar-super-secret-jwt-key-2025-production-ready-32-chars-minimum
```

#### **🌐 App Configuration**
```env
NEXT_PUBLIC_APP_URL=https://your-vercel-app-url.vercel.app
NEXT_PUBLIC_SOCKET_URL=https://your-vercel-app-url.vercel.app
NODE_ENV=production
```

#### **🎨 Optional: Cloudinary (for file uploads)**
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

#### **📧 Optional: Email (for notifications)**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### **⚡ Performance Settings**
```env
BCRYPT_ROUNDS=12
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### 3. **Deploy Process**

1. **Push your code** (already done ✅)
2. **Add environment variables** in Vercel dashboard
3. **Trigger new deployment**:
   - Go to Vercel dashboard → Deployments
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger automatic deployment

### 4. **Initialize Database Schema**

After successful deployment, you need to set up your database:

#### Option A: Using Prisma Studio (Recommended)
1. Install Prisma CLI locally: `npm install -g prisma`
2. Set your DATABASE_URL in local `.env.local`
3. Run: `npx prisma db push`
4. Run: `npx prisma db seed` (optional - adds sample data)

#### Option B: Using Vercel CLI
```bash
vercel env pull .env.local
npx prisma db push
npx prisma db seed
```

### 5. **Test Your Deployment**

Once deployed, test these features:
- ✅ Homepage loads
- ✅ User registration works
- ✅ Login/logout functionality
- ✅ Database connection (try creating a post)
- ✅ API endpoints respond correctly

### 6. **Sample Test Account**

After running the seed script, you can test with:
- **Email**: `demo@guffghar.com`
- **Password**: `password123`

## 🐛 Troubleshooting

### **Build Errors**
```bash
# If you see build errors, check:
1. All required environment variables are set
2. DATABASE_URL is valid and accessible
3. No TypeScript errors (we use JavaScript)
```

### **Database Connection Issues**
```bash
# Verify your DATABASE_URL works:
1. Check Supabase dashboard for connection details
2. Ensure password is correct (no special URL encoding needed)
3. Verify database is not paused (free tier limitation)
```

### **Environment Variables Not Working**
```bash
# Make sure:
1. Variables are added in Vercel dashboard
2. New deployment was triggered after adding variables
3. NEXT_PUBLIC_* variables are used for client-side code
4. Regular variables are for server-side only
```

## 📋 **Deployment Checklist**

- [ ] ✅ Code pushed to GitHub
- [ ] ✅ Vercel project connected to GitHub repo
- [ ] ⚠️  Supabase database created
- [ ] ⚠️  DATABASE_URL added to Vercel
- [ ] ⚠️  JWT_SECRET added to Vercel
- [ ] ⚠️  NEXT_PUBLIC_APP_URL updated with actual Vercel URL
- [ ] ⚠️  Database schema deployed (`prisma db push`)
- [ ] ⚠️  Sample data seeded (optional)
- [ ] ⚠️  Application tested in production

## 🎉 **Success!**

Once all steps are completed:
1. Your Guff Ghar social platform will be live
2. Users can register, login, and use all features
3. Real-time chat and social features will work
4. Ready for real users!

---

**Need Help?** Check the [repository issues](https://github.com/nayakcoder/Guff-Ghar/issues) or create a new one.