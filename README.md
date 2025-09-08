# 🏠 Guff Ghar - गफ घर

A modern Nepali social media platform built with Next.js 14, featuring real-time chat, video calls, and social interactions.

![Guff Ghar Banner](https://via.placeholder.com/800x200/DC2626/FFFFFF?text=Guff+Ghar+Social+Platform)

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication system
- Secure password hashing with bcryptjs
- Session management
- Protected routes

### 📱 Social Features
- **Posts**: Create, like, comment, and share posts
- **Real-time Chat**: Instant messaging with Socket.io
- **Video Calls**: WebRTC-powered video and audio calls
- **Follow System**: Follow/unfollow users
- **User Discovery**: Search and discover new users
- **Notifications**: Real-time notifications for interactions

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Light, Dark, and High-Contrast themes
- **Internationalization**: English and Nepali language support
- **Accessibility**: ARIA compliance and keyboard navigation
- **Smooth Animations**: Framer Motion powered interactions

### 🚀 Performance & Scalability
- **Next.js 14**: App Router with Server Components
- **Real-time Features**: Socket.io integration
- **Database**: PostgreSQL with Prisma ORM
- **File Uploads**: Cloudinary integration
- **Deployment**: Optimized for Vercel

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: TailwindCSS + shadcn/ui
- **UI Components**: Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcryptjs
- **Real-time**: Socket.io
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Video Calls**: WebRTC with Simple Peer

### Development
- **Language**: JavaScript (ES2022)
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Next.js config
- **Database Tools**: Prisma Studio

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Supabase account)
- Cloudinary account (optional, for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nayakcoder/Guff-Ghar.git
   cd guff-ghar
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env .env.local
   ```
   
   Update `.env.local` with your values:
   ```env
   # Database (Get from Supabase or your PostgreSQL instance)
   DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
   
   # Authentication
   JWT_SECRET="your-super-secret-jwt-key-32-chars-minimum"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3001"
   
   # Optional: Cloudinary for file uploads
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key" 
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

4. **Set up the database**
   ```bash
   npm run db:setup
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## 📁 Project Structure

```
guff-ghar/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── chat/              # Chat functionality
│   ├── profile/           # User profiles
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                   # Utility libraries
│   ├── hooks/            # Custom React hooks
│   ├── auth.js           # Authentication logic
│   ├── prisma.js         # Database client
│   └── socket.js         # Socket.io setup
├── prisma/               # Database schema & migrations
└── public/               # Static assets
```

## 🗄️ Database Schema

The application uses a comprehensive database schema with:

- **Users**: Profile information, authentication
- **Posts**: Content, media, engagement metrics
- **Messages**: Real-time chat system
- **Follows**: Social connections
- **Notifications**: Real-time updates
- **Call Sessions**: Video call management

## 🎨 Design System

### Color Palette
- **Primary**: `#DC2626` (Red 600)
- **Background**: Dynamic based on theme
- **Text**: Semantic color tokens

### Themes
- **Light**: Default clean interface
- **Dark**: Easy on the eyes
- **High Contrast**: Accessibility focused

## 🚀 Deployment

### Vercel (Recommended)

1. **Set up database**
   - Create a Supabase project
   - Get your DATABASE_URL

2. **Deploy to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Add environment variables**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Add all required variables from `.env.local`

4. **Test your deployment**
   - Visit your Vercel URL
   - Test authentication and features

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- PostCard.test.jsx
```

## 📊 Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run dev:server         # Start with custom server

# Database
npm run db:setup           # Set up database schema
npm run db:seed            # Add sample data
npm run db:studio          # Open Prisma Studio
npm run validate-env       # Check environment configuration

# Production
npm run build              # Build for production
npm run start              # Start production server
npm run vercel-build       # Build for Vercel deployment

# Testing
npm test                   # Run tests
npm run lint               # Run linter
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | `postgresql://...` |
| `JWT_SECRET` | JWT signing secret (32+ chars) | ✅ | `your-secret-key` |
| `NEXT_PUBLIC_APP_URL` | App URL for API calls | ✅ | `https://your-app.vercel.app` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ⚪ | `your-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | ⚪ | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | ⚪ | `secret-key` |

## 🔧 Troubleshooting

### Common Issues

**Database Connection**
```bash
# Check your DATABASE_URL
npm run validate-env

# Reset database
npx prisma db push --force-reset
```

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Environment Issues**
```bash
# Validate environment setup
npm run validate-env
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [Prisma](https://prisma.io/) - Database toolkit
- [Supabase](https://supabase.com/) - Backend as a Service
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

- 📧 Email: support@guffghar.com
- 💬 Discord: [Join our community](https://discord.gg/guffghar)
- 🐛 Issues: [GitHub Issues](https://github.com/nayakcoder/Guff-Ghar/issues)

---

<div align="center">
  <p>Made with ❤️ for the Nepali community</p>
  <p>गफ घर - जहाँ मित्रता सुरु हुन्छ</p>
</div>