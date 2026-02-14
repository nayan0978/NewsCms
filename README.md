# NewsCMS - WordPress-Like News Publishing Platform

A modern, full-featured CMS built with Next.js, Supabase, and TypeScript. Perfect for news publishers, bloggers, and content creators.

## Features

### Admin Dashboard
- **Complete Dashboard**: Overview of stats, posts, pages, and system health
- **Post Management**: Create, edit, publish, and delete posts with featured images
- **Page Management**: Build static pages for About, Contact, Terms, etc.
- **Bulk Importer**: Import multiple posts from CSV files
- **Trending Topics**: Auto-publish from Google Trends every hour
- **Settings Panel**: Configure site details, AdSense, meta tags, and custom code

### Frontend Website
- **Modern Homepage**: Beautiful grid layout showcasing published posts
- **Post Pages**: Full article view with related articles, sharing, and print functionality
- **WhatsApp Integration**: One-click sharing to WhatsApp
- **Responsive Design**: Mobile-first, works perfectly on all devices
- **Dynamic Header & Footer**: Customizable navigation and branding
- **Category & Tag System**: Organize and filter content

### Publishing Features
- **Multi-Status Posts**: Draft, Published, and Scheduled states
- **SEO Friendly**: Meta tags, Open Graph, and custom header/footer code
- **AdSense Ready**: Built-in AdSense slot configuration
- **View Tracking**: Track post views and engagement
- **Auto-Publishing**: Hourly auto-publish from trending topics

## Setup Instructions

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account (free tier available at supabase.com)

### Step 1: Database Setup

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the scripts in order:
   - First, run `/scripts/01-init-database.sql`
   - Then run `/scripts/02-rls-policies.sql`

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

### Step 2: Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from Supabase Project Settings → API → Keys

### Step 3: Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit http://localhost:3000 to see the frontend.

## Usage

### Admin Panel
Access the admin dashboard at `/admin` or `/login`

Login with:
- Email: `admin@example.com`
- Password: `admin123`

**Change these credentials immediately in the database for security!**

### Creating Posts
1. Go to **Posts** → **Create Post**
2. Fill in title, content, excerpt, featured image
3. Add category and tags
4. Choose status (Draft/Published/Scheduled)
5. Click **Save Post**

### Bulk Import
1. Go to **Bulk Import**
2. Prepare a CSV file with columns: `title`, `content`, `excerpt`, `featured_image_url`, `category`, `tags`
3. Upload the CSV or paste the data
4. Click **Import Posts**

### Auto-Publishing Trending Topics
1. Go to **Trending**
2. Click **Enable Auto-Publishing** (runs every hour)
3. Click **Refresh** to fetch latest trends
4. Manually publish any topic with the **Publish** button

### Site Settings
Configure in **Admin** → **Settings**:
- Site name and description
- Logo and favicon
- AdSense Client ID and slot IDs
- Custom header code (meta tags, analytics)
- Custom footer code (scripts, trackers)
- Google Analytics ID

## Database Schema

### Tables
- **users**: Admin and editor accounts
- **posts**: Blog posts with status, views, categories
- **pages**: Static pages (About, Contact, etc.)
- **settings**: Site configuration and AdSense setup
- **menu_items**: Navigation menu items
- **import_queue**: Bulk import jobs
- **trending_topics**: Google Trends data
- **meta_tags**: SEO meta tags per post/page

## API Endpoints

### Posts
- `GET /api/posts` - List posts (supports pagination)
- `POST /api/posts` - Create post
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

### Pages
- `GET /api/pages` - List pages
- `POST /api/pages` - Create page
- `GET /api/pages/[id]` - Get single page
- `PUT /api/pages/[id]` - Update page
- `DELETE /api/pages/[id]` - Delete page

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (admin only)

### Other
- `GET /api/menu` - Get navigation menu
- `POST /api/trending` - Fetch and save trending topics
- `POST /api/import` - Start bulk import
- `POST /api/auth/login` - Admin login

## Features Deep Dive

### Auto-Publishing System
The trending topics feature automatically:
1. Fetches top trending topics every hour
2. Creates posts with the trending topic as title
3. Sets them to published status
4. Marks them as trending posts for special display

You can manually control this in the Trending Topics admin page.

### CSV Import Format
```csv
title,content,excerpt,featured_image_url,category,tags
Breaking News,Full article content here,Short excerpt,https://example.com/image.jpg,News,breaking,urgent
Tech Update,Article about new technology,Tech news,https://example.com/tech.jpg,Technology,tech,update
```

### WhatsApp Integration
Users can share articles to WhatsApp directly from:
- Homepage post cards (green Share button)
- Individual post page
- WhatsApp link: `https://wa.me/?text=...`

### AdSense Integration
1. Get your Client ID from Google AdSense
2. Add to Settings → AdSense Client ID
3. Add slot IDs in JSON format
4. Ads will display in header banner and sidebar

### Custom Header/Footer Code
Add custom HTML in Settings for:
- Meta tags (SEO, Open Graph, Twitter Card)
- Analytics scripts (Google Analytics, Matomo)
- Custom CSS or JavaScript

## Security Notes

⚠️ **Important for Production**

1. **Change default admin password** immediately
2. **Enable Row Level Security (RLS)** policies in database
3. **Use environment variables** for all sensitive data
4. **Implement CORS** restrictions
5. **Validate and sanitize** all user inputs
6. **Use HTTPS** in production
7. **Regular backups** of Supabase database

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy with one click

### Deploy Elsewhere
The app is compatible with:
- Netlify
- AWS Amplify
- Railway
- Render
- Any Node.js hosting

## Troubleshooting

### Posts not showing
- Check if posts are set to "published" status
- Verify database connection in Supabase
- Check browser console for errors

### Login not working
- Ensure user exists in database
- Check password hash matches bcrypt format
- Clear browser cookies and try again

### Bulk import failing
- Verify CSV format matches documentation
- Check for special characters in content
- Ensure content column has valid text

### AdSense not showing
- Verify Client ID is correct in settings
- Check if slot IDs are in valid JSON format
- Allow 24 hours for ads to appear

## License

Open source - feel free to use and modify

## Support

For issues or feature requests, please contact support or check documentation.

---

**Built with ❤️ for news publishers and content creators**
