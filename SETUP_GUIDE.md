# NewsCMS - Complete Setup Guide

Follow these steps to get your news publishing platform up and running.

## Part 1: Supabase Setup (5 minutes)

### 1.1 Create Supabase Account
- Visit https://supabase.com
- Sign up or log in
- Create a new project
- Choose a strong password and note it down
- Wait for the project to initialize

### 1.2 Configure Database
1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `/scripts/01-init-database.sql`
4. Paste into the query editor
5. Click **Run** (Play button)
6. Wait for success message

### 1.3 Add Row Level Security Policies
1. In SQL Editor, click **New Query**
2. Copy the entire contents of `/scripts/02-rls-policies.sql`
3. Paste into the query editor
4. Click **Run**
5. Verify "Success" message

### 1.4 Get API Keys
1. Go to **Project Settings** (gear icon, top right)
2. Click **API** in the left menu
3. Copy these values:
   - **NEXT_PUBLIC_SUPABASE_URL** from "Project URL"
   - **NEXT_PUBLIC_SUPABASE_ANON_KEY** from "anon public" key

Keep these safe! You'll need them in the next step.

## Part 2: Application Setup (5 minutes)

### 2.1 Environment Configuration
1. In the project root, create a file called `.env.local`
2. Copy the contents from `.env.example`
3. Replace with your actual Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Install Dependencies
```bash
pnpm install
```

### 2.3 Start Development Server
```bash
pnpm dev
```

Open http://localhost:3000 in your browser. You should see the homepage!

## Part 3: First Login & Configuration (5 minutes)

### 3.1 Access Admin Panel
1. Click the "Admin" link or go to http://localhost:3000/admin
2. You'll be redirected to login page
3. Use these default credentials:
   - **Email**: admin@example.com
   - **Password**: admin123

### 3.2 Change Admin Password
⚠️ **IMPORTANT**: Change the admin password immediately

1. In database (Supabase):
   - Go to **SQL Editor**
   - Create a new query:
   ```sql
   UPDATE users 
   SET password_hash = '$2b$10$...' 
   WHERE email = 'admin@example.com';
   ```
   - To generate a bcrypt hash, use an online tool or:
   ```bash
   # In Node.js terminal
   const bcrypt = require('bcryptjs');
   bcrypt.hash('your-new-password', 10).then(console.log);
   ```

### 3.3 Configure Site Settings
1. Go to **Admin** → **Settings**
2. Fill in:
   - **Site Name**: Your news site name
   - **Site Description**: What your site is about
   - **Site URL**: https://yourdomain.com
   - **Logo URL**: Link to your logo image
3. Click **Save Settings**

### 3.4 Optional: AdSense Setup
If you use Google AdSense:
1. Go to **Settings** → **AdSense Settings**
2. Add your **AdSense Client ID** (ca-pub-XXXXXXXXX)
3. Add **Slot IDs** in JSON format:
```json
[
  {"position": "header", "slot": "1234567890"},
  {"position": "sidebar", "slot": "0987654321"}
]
```
4. Save

### 3.5 Optional: Analytics & Tracking
1. Go to **Settings** → **Analytics**
2. Add your **Google Analytics ID** (G-XXXXXXXXXX)
3. For custom tracking code, use **Header Code** section
4. Save

## Part 4: Create Your First Post (2 minutes)

### 4.1 Create a Post
1. Go to **Admin** → **Posts** → **Create Post**
2. Fill in:
   - **Title**: Your first article headline
   - **Content**: The article text (supports HTML)
   - **Excerpt**: Short summary for listing pages
   - **Featured Image URL**: Link to a cover image
   - **Category**: News, Tech, etc.
   - **Tags**: Relevant keywords (comma-separated)
3. Set **Status** to "Published"
4. Click **Save Post**

### 4.2 View Your Post
1. Go back to http://localhost:3000
2. Your post should appear on the homepage
3. Click to read the full article
4. Test the WhatsApp share button!

## Part 5: Advanced Features (Optional)

### 5.1 Bulk Import Posts
1. Prepare a CSV file with columns:
   ```
   title,content,excerpt,featured_image_url,category,tags
   Breaking News,Content here,Excerpt here,https://...,News,breaking
   ```
2. Go to **Admin** → **Bulk Import**
3. Upload CSV or paste data
4. Click **Import Posts**
5. Posts will be created and published automatically

### 5.2 Enable Auto-Publishing
1. Go to **Admin** → **Trending**
2. Click **Enable Auto-Publishing**
3. The system will fetch Google Trends every hour
4. New trending topics become published posts automatically

### 5.3 Create Static Pages
1. Go to **Admin** → **Pages** → **Create Page**
2. Create pages for:
   - About Us
   - Contact
   - Terms & Conditions
3. These appear in the footer automatically

### 5.4 Custom Menu
Add navigation items via Supabase:
1. Go to **SQL Editor**
2. Run:
```sql
INSERT INTO menu_items (label, url, order_index)
VALUES 
  ('Latest', '/category/latest', 1),
  ('Tech', '/category/tech', 2),
  ('Business', '/category/business', 3);
```

## Part 6: Deployment (10 minutes)

### Option 1: Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Visit https://vercel.com/new
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### Option 2: Deploy to Other Platforms
The app works with:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js host

Just set the environment variables and deploy!

## Testing Checklist

- [ ] Admin login works
- [ ] Can create a post
- [ ] Post appears on homepage
- [ ] Post has featured image
- [ ] Post has categories/tags
- [ ] WhatsApp share button works
- [ ] Settings save correctly
- [ ] Site title appears in header
- [ ] Logo displays correctly
- [ ] Footer shows correctly

## Common Issues & Solutions

### "Database connection error"
- Check Supabase URL and keys in `.env.local`
- Verify keys are correct and not expired
- Try restarting dev server

### "Login fails with valid credentials"
- Check password was hashed with bcrypt
- Verify user exists in database
- Clear browser cookies and try again

### "Posts not showing"
- Ensure posts have status "published"
- Check date is not in future (for scheduling)
- Verify featured image URL is valid

### "CSS/Styling looks broken"
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server
- Check tailwindcss is compiled

### "AdSense ads not showing"
- Google takes 24-48 hours to activate ads
- Verify Client ID is correct
- Check Slot IDs are valid
- Ads only show on live domains, not localhost

## Next Steps

1. **Customize Design**: Modify colors and fonts in `tailwind.config.ts`
2. **Add Custom Pages**: Create About page and other static content
3. **SEO Setup**: Add meta tags and descriptions
4. **Analytics**: Connect Google Analytics and track readers
5. **Backup**: Regular database backups in Supabase

## Security Reminders

- ✅ Change default admin password
- ✅ Use strong passwords for all accounts
- ✅ Keep API keys secret (never commit to Git)
- ✅ Enable HTTPS in production
- ✅ Regular database backups
- ✅ Monitor admin activity
- ✅ Keep dependencies updated

## Support & Help

- Check README.md for detailed documentation
- Review error messages in browser console
- Check Supabase logs for database errors
- See troubleshooting section in README

## Quick Reference

| Task | Location |
|------|----------|
| Create Post | Admin → Posts → Create |
| Edit Settings | Admin → Settings |
| View Site | http://localhost:3000 |
| Admin Dashboard | http://localhost:3000/admin |
| Supabase Console | https://supabase.com |

---

Congratulations! Your news CMS is ready. Happy publishing! 📰
