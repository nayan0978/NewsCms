# 🚀 NewsCMS - Quick Start Guide

## ⚡ FASTEST WAY TO GET STARTED

### Option 1: Use Registration Page (RECOMMENDED) ✨

**Perfect for: Creating your own admin account**

1. **Configure Supabase**
   ```bash
   # Edit .env.local with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Setup Database**
   - Go to Supabase → SQL Editor
   - Run `scripts/01-init-database.sql`
   - Run `scripts/02-rls-policies.sql`

3. **Start Server**
   ```bash
   pnpm dev
   ```

4. **Create Admin Account**
   - Visit http://localhost:3000/register
   - Fill in your details
   - **First user automatically becomes admin!** 🎉

5. **Done!**
   - Login at http://localhost:3000/login
   - Access admin panel at http://localhost:3000/admin

---

### Option 2: Use SQL Default Admin

**Perfect for: Quick testing**

Same steps as above, but:
- The SQL script creates default admin: `admin@example.com` / `admin123`
- Login directly at http://localhost:3000/login
- ⚠️ **Change password immediately!**

---

## 📋 Complete Setup (Step by Step)

### 1️⃣ Get Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project (free tier)
3. Settings → API
4. Copy:
   - **Project URL**
   - **Anon Public Key**

### 2️⃣ Configure Environment

Edit `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xpgavxlklqaxyeqegaxu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-key-here
```

### 3️⃣ Initialize Database

In Supabase SQL Editor:
1. Run `scripts/01-init-database.sql` ✅
2. Run `scripts/02-rls-policies.sql` ✅

### 4️⃣ Start & Verify

```bash
# Restart server (IMPORTANT!)
pnpm dev

# Visit setup page to verify
http://localhost:3000/setup
# Should show all green ✓
```

### 5️⃣ Create Account

**Register page** (recommended):
- http://localhost:3000/register
- First user = admin automatically!

**Or use default**:
- http://localhost:3000/login
- Email: `admin@example.com`
- Password: `admin123`

### 6️⃣ Start Creating!

- Admin Panel: http://localhost:3000/admin
- Create posts, pages, manage everything!

---

## 🎯 Quick Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm setup` | Interactive setup wizard |
| `pnpm test:features` | Test all features |
| `pnpm demo:data` | Generate sample content |
| `pnpm demo:complete` | Full demo walkthrough |

---

## ⚠️ Troubleshooting

### Environment Variables Not Working

**Solution:** Restart the dev server!
```bash
# Stop server (Ctrl+C)
pnpm dev
```

### Can't Login

**Check:**
1. Database scripts ran successfully?
2. User exists? (Check Supabase → users table)
3. Or create new account: http://localhost:3000/register

### Port Already in Use

```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
pnpm dev -- -p 3001
```

---

## 📱 Access Points

| Page | URL | Purpose |
|------|-----|---------|
| Setup | `/setup` | Verify configuration |
| Register | `/register` | Create admin account |
| Login | `/login` | Sign in |
| Admin Dashboard | `/admin` | Manage content |
| Homepage | `/` | Public site |

---

## ✨ Features Ready After Setup

✅ User Authentication  
✅ Admin Dashboard  
✅ Posts Management (Create, Edit, Delete, Publish)  
✅ Pages Management  
✅ Site Settings  
✅ Trending Topics  
✅ Navigation Menu  
✅ Bulk Import  
✅ Draft System  
✅ SEO Optimization  

---

## 🎬 Try Demo Content

```bash
# Make sure server is running
pnpm dev

# Generate sample content
pnpm demo:data
```

Creates:
- 8 sample news articles
- 3 pages (About, Privacy, Contact)
- Demo settings

---

## 🔐 Security Reminder

- [ ] Change default password if used SQL script
- [ ] Never commit `.env.local` to git
- [ ] Review user roles regularly
- [ ] Update credentials for production

---

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
4. Deploy!

### Other Platforms

- Netlify: Same process as Vercel
- Railway: Connect GitHub repo
- Digital Ocean: Use App Platform

---

## 📚 More Documentation

- [COMPLETE_SETUP.md](COMPLETE_SETUP.md) - Full setup guide
- [scripts/README.md](scripts/README.md) - Scripts documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed instructions

---

## 💡 Pro Tips

**First User is Always Admin**
- Register page makes first user admin automatically
- Subsequent users get 'editor' role
- Change roles in Supabase users table if needed

**Must Restart Server**
- After .env.local changes
- Environment variables only load on startup

**Two Ways to Create Admin**
1. Register page (custom credentialsRecommended)
2. SQL script (default credentials - testing only)

---

**Happy Publishing! 📰✨**

For help: Review [COMPLETE_SETUP.md](COMPLETE_SETUP.md) or check scripts documentation.
