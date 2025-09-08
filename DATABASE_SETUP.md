# Database Setup Guide for Guff Ghar

## Quick Setup Steps

### 1. Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for free account
3. Click "New Project"
4. Fill in:
   - **Name**: `guff-ghar`
   - **Database Password**: Create strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes 2-3 minutes)

### 2. Get Database Connection String

1. In your Supabase dashboard, go to **Settings** → **Database**
2. Scroll to **Connection string** section
3. Select **URI** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual password

### 3. Update Environment Variables

Edit your `.env.local` file and replace:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

### 4. Set Up Database Schema

Run the setup script:
```bash
npm run db:setup
```

Or manually:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Add sample data
npm run db:seed
```

### 5. Update Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `guffghar` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Supabase connection string |
| `JWT_SECRET` | `guff-ghar-super-secret-jwt-key-2025-production-ready-32-chars-minimum` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL (e.g., `https://your-app.vercel.app`) |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name (optional for now) |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key (optional for now) |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret (optional for now) |

### 6. Deploy to Vercel

```bash
vercel --prod
```

## Test Accounts

After seeding, you can login with:
- **Email**: `demo@guffghar.com`
- **Password**: `password123`

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Check that your IP is not blocked by Supabase
- Ensure the database password is correct

### Prisma Issues
```bash
# Reset and regenerate
npx prisma generate
npx prisma db push --force-reset
```

### Vercel Deployment Issues
- Make sure all environment variables are set
- Check build logs in Vercel dashboard
- Verify DATABASE_URL works in production

## Next Steps

1. ✅ Set up database connection
2. ✅ Deploy to Vercel
3. 🔄 Test authentication and posting
4. 🔄 Set up Cloudinary for image uploads
5. 🔄 Configure real-time features
6. 🔄 Add custom domain (optional)

## Need Help?

- Check Supabase logs: Dashboard → Logs
- Check Vercel logs: Dashboard → Functions → View logs
- Test database: `npx prisma studio`