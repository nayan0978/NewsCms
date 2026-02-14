# 🔐 Admin Account Setup - Two Options

## What's New? Registration Page! 🎉

You now have **TWO ways** to create your admin account:

---

## 🌟 Option 1: Registration Page (RECOMMENDED)

### Why Use This?
- ✅ Create your own custom credentials
- ✅ More secure than default password
- ✅ Perfect for production
- ✅ First user automatically becomes admin

### How to Use:

1. **Setup Database First**
   - Run `scripts/01-init-database.sql` in Supabase
   - Run `scripts/02-rls-policies.sql` in Supabase
   - Configure `.env.local` with Supabase credentials
   - Restart dev server: `pnpm dev`

2. **Visit Registration Page**
   ```
   http://localhost:3000/register
   ```

3. **Fill In Your Details**
   - Email: your-email@example.com
   - Username: yourusername
   - Password: your-secure-password
   - Display Name: Your Name

4. **Click "Create Account"**
   - Account created!
   - Automatically set as admin (first user)
   - Redirected to login

5. **Login and Start!**
   - Use your credentials
   - Access admin panel
   - You're all set! 🎉

---

## 🔧 Option 2: SQL Default Admin

### Why Use This?
- ✅ Quick testing
- ✅ No registration needed
- ✅ Works immediately after SQL setup
- ⚠️ Remember to change password!

### How to Use:

1. **Run SQL Scripts**
   - Run `scripts/01-init-database.sql` in Supabase
     - This creates a default admin user
   - Run `scripts/02-rls-policies.sql` in Supabase

2. **Login Directly**
   ```
   http://localhost:3000/login
   
   Email: admin@example.com
   Password: admin123
   ```

3. **⚠️ IMPORTANT: Change Password!**
   - Go to admin panel
   - Update your profile
   - Set a secure password

---

## 🤔 Which Should I Use?

### Use Registration Page If:
- 🏢 Setting up for production
- 🔒 Want custom credentials from start
- 👥 Multiple team members will use the system
- ✨ Want clean, professional setup

### Use SQL Default If:
- 🧪 Just testing/development
- ⚡ Want fastest setup possible
- 🔄 Frequently resetting database
- 📚 Following a tutorial

---

## 📊 Comparison Table

| Feature | Registration Page | SQL Default |
|---------|------------------|-------------|
| Custom Credentials | ✅ Yes | ❌ No (but changeable) |
| Security | ✅ High | ⚠️ Medium (default pwd) |
| Setup Speed | 🕐 2 minutes | ⚡ 30 seconds |
| Production Ready | ✅ Yes | ⚠️ Needs pwd change |
| Best For | Production | Testing |

---

## 🔄 Can I Switch?

**Yes!** You can:

1. **Start with SQL default, then change**
   - Login with default credentials
   - Go to Settings/Profile
   - Update email and password

2. **Delete SQL user and re-register**
   - In Supabase: Delete admin@example.com from users table
   - Visit `/register` to create new account
   - First user becomes admin

---

## 🚨 Common Questions

### Q: I ran the SQL script. Can I still use registration?

**A:** Yes! But:
- SQL script created default admin already
- New registrations will be 'editor' role (not admin)
- To register as admin: Delete default user first in Supabase

### Q: Which is more secure?

**A:** Registration page
- You set password yourself
- Never uses default credentials
- No one else knows the password

### Q: Can I skip the SQL insert and just register?

**A:** Yes!
- Run `01-init-database.sql` but skip the INSERT admin line
- Or delete admin user after running script
- Then use `/register` page

### Q: What if I forget my password?

**A:** Currently:
- No password reset feature yet
- Can update password_hash directly in Supabase
- Or delete user and re-register

---

## 💡 Best Practice Workflow

### For Production:

```bash
1. Configure .env.local
2. Run 01-init-database.sql (skip INSERT admin line if you want)
3. Run 02-rls-policies.sql
4. Restart: pnpm dev
5. Register at: /register
6. Login and configure site
7. Deploy!
```

### For Development/Testing:

```bash
1. Configure .env.local
2. Run 01-init-database.sql (includes default admin)
3. Run 02-rls-policies.sql
4. Restart: pnpm dev
5. Login: admin@example.com / admin123
6. Test features
```

---

## 🎯 Quick Links

| Page | URL | When to Use |
|------|-----|-------------|
| Setup | `/setup` | Verify configuration |
| Register | `/register` | Create new admin |
| Login | `/login` | Sign in |
 Admin | `/admin` | Manage content |

---

## 🔐 Security Checklist

- [ ] Choose registration method
- [ ] Create account / Login
- [ ] If using SQL default, **change password**
- [ ] Set proper email address
- [ ] Configure site settings
- [ ] Review user roles in Supabase
- [ ] Never commit .env.local

---

**Choose the method that works best for you!**

Both options are fully supported and will get you up and running quickly. 🚀

For complete setup instructions, see [COMPLETE_SETUP.md](COMPLETE_SETUP.md)
