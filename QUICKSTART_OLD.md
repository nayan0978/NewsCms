# NewsCMS - Quick Start (15 minutes)

Get your news platform running in 15 minutes!

## 1️⃣ Supabase Setup (5 min)

### Create Project
- Go to https://supabase.com → Sign up → New project
- Name it "NewsCMS"
- Create strong password
- Wait for initialization

### Run Database Scripts
1. In Supabase, go to **SQL Editor** → **New Query**
2. Copy entire `/scripts/01-init-database.sql` → Paste → **Run**
3. Create another query
4. Copy entire `/scripts/02-rls-policies.sql` → Paste → **Run**

### Get API Keys
1. **Project Settings** (gear icon)
2. **API** in left menu
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2️⃣ App Configuration (5 min)

### Create .env.local
In project root, create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Install & Run
```bash
pnpm install
pnpm dev
```

✅ Visit http://localhost:3000

## 3️⃣ First Post (5 min)

### Login to Admin
- Go to http://localhost:3000/admin
- **Email**: admin@example.com
- **Password**: admin123

### Create Post
1. **Posts** → **Create Post**
2. **Title**: "My First Article"
3. **Content**: "This is amazing content..."
4. **Category**: "News"
5. **Status**: Published
6. **Save Post**

### View on Website
- Go to http://localhost:3000
- Your post appears! ✨

## Quick Feature Guide

| Feature | Location | How To |
|---------|----------|--------|
| **Create Post** | Admin → Posts → Create | Fill form → Save |
| **Settings** | Admin → Settings | Edit site info → Save |
| **Bulk Import** | Admin → Import | Paste CSV → Import |
| **Trending** | Admin → Trending | Refresh → Publish topics |
| **Pages** | Admin → Pages → Create | Create About/Contact pages |
| **AdSense** | Admin → Settings → AdSense | Add Client ID → Save |

## Login Credentials

```
Email:    admin@example.com
Password: admin123
```

⚠️ Change password immediately!

## Important Files

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- `.env.example` - Environment template
- `/scripts/` - Database setup

## Troubleshooting

### "Module not found" error
```bash
pnpm install
```

### "Cannot connect to database"
- Check `.env.local` keys are correct
- Verify Supabase project is active
- Restart dev server

### "Login fails"
- Verify email: `admin@example.com`
- Verify password: `admin123`
- Clear browser cookies

### "Posts not showing"
- Check post status is "Published"
- Verify database connection
- Check browser console for errors

## Deployment (2 clicks!)

### Deploy to Vercel
1. Push to GitHub
2. Visit https://vercel.com/new
3. Select your repo
4. Add `.env` variables
5. Click **Deploy** ✨

## Next Steps

- [ ] Change admin password
- [ ] Configure site settings
- [ ] Create your first post
- [ ] Add site logo
- [ ] Set up AdSense (optional)
- [ ] Deploy to Vercel

## Need Help?

1. Check `README.md` for detailed docs
2. See `SETUP_GUIDE.md` for step-by-step
3. Review `PROJECT_SUMMARY.md` for architecture

---

**You're ready!** Start creating amazing content. 🚀

Questions? Read the full docs in README.md
