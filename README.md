# کتابخانه آزاد افغانستان
## Free Library of Afghanistan — Setup & Deployment Guide

---

## 🏗️ Project Structure

```
library/
├── index.html              ← Homepage
├── css/
│   └── style.css           ← Full design system (RTL Dari)
├── js/
│   ├── app.js              ← Supabase client, data layer, utilities
│   └── components.js       ← Shared navbar, footer, auth modal
├── pages/
│   ├── books.html          ← Book listing with filters
│   ├── book.html           ← Book detail + PDF reader
│   ├── search.html         ← Search results
│   ├── contribute.html     ← Contribution submission form
│   ├── admin.html          ← Admin panel (approve/reject)
│   └── about.html          ← About page
└── supabase_schema.sql     ← Database schema + seed data
```

---

## 🚀 Step-by-Step Deployment

### STEP 1 — Create Supabase project (free, takes 2 min)

1. Go to https://supabase.com → "Start for free"
2. Sign in with GitHub or Google
3. Click "New Project"
   - Name: `dari-library`
   - Password: (create a strong one)
   - Region: choose nearest (e.g. EU West for Afghanistan users)
4. Wait ~2 min for project to launch

### STEP 2 — Run the database schema

1. In your Supabase dashboard → click "SQL Editor" (left sidebar)
2. Click "New Query"
3. Open `supabase_schema.sql` from this project
4. Paste the entire file content into the editor
5. Click "Run" — this creates all tables and seeds real books

### STEP 3 — Enable Google Auth (for user login)

1. In Supabase → Authentication → Providers → Google
2. Enable Google provider
3. Go to https://console.cloud.google.com → Create project → APIs → OAuth consent screen
4. Create OAuth 2.0 credentials → copy Client ID and Secret
5. Paste into Supabase Google provider settings
6. Add your site URL to "Redirect URLs" in Supabase Auth settings

### STEP 4 — Get your Supabase credentials

1. In Supabase → Settings → API
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### STEP 5 — Update the config in app.js

Open `js/app.js` and replace lines 8-9:

```javascript
const SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';   // ← your Project URL
const SUPABASE_ANON_KEY = 'eyJ...';                         // ← your anon key
```

### STEP 6 — Set up email notifications (for contribution approvals)

The site uses Supabase Edge Functions + Gmail for email.

**Quick option (no code):** The contribution form already has a `mailto:` fallback — when someone submits a book, if Supabase is configured it saves to the database, and you receive an email at `seyaramiry.2468@gmail.com` when you approve/reject via the admin panel.

**Full email (optional):** 
1. In Supabase → Edge Functions → create function `notify-contribution`
2. Use the Resend.com free API (100 emails/day free) or Gmail SMTP

### STEP 7 — Deploy to Vercel (free, takes 1 min)

1. Go to https://vercel.com → sign in with GitHub
2. Click "Add New Project"
3. Upload this folder OR push to a GitHub repo first:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   # create repo on github.com, then:
   git remote add origin https://github.com/YOUR-USERNAME/dari-library.git
   git push -u origin main
   ```
4. In Vercel → "Import Git Repository" → select your repo
5. Framework: "Other" (static site)
6. Click Deploy → done! You get a free URL like `dari-library.vercel.app`

### STEP 8 — Custom domain (optional, free)

1. In Vercel → your project → Settings → Domains
2. Add a custom domain (e.g. `ketabkhana-azad.af` or `dari-library.org`)
3. Update DNS records with your domain registrar

---

## 📧 Admin Email Notifications

When someone submits a book via the contribution form:
1. It saves to Supabase `contributions` table with `status: 'pending'`
2. You log in to `/pages/admin.html` with your Gmail (seyaramiry.2468@gmail.com)
3. You see all pending submissions, can review and approve/reject
4. The form also has a mailto fallback that opens your email client

To add automatic email notifications, set up a Supabase Database Webhook:
- Table: `contributions`
- Event: `INSERT`
- Webhook URL: your notification service (e.g. make.com or n8n)

---

## 📚 Adding More Books

### Via Admin Panel (recommended)
1. Go to `/pages/admin.html`
2. Sign in with seyaramiry.2468@gmail.com
3. Click "افزودن کتاب" in the sidebar
4. Fill in the form and paste the archive.org URL

### Via SQL (bulk)
Add to `supabase_schema.sql` and re-run in Supabase SQL editor:
```sql
INSERT INTO books (title_dari, author, category, archive_url, gdrive_embed, ...) 
VALUES ('عنوان کتاب', 'نویسنده', 'history', 'https://archive.org/details/...', 'https://archive.org/embed/...', ...);
```

### Finding more free Dari books on archive.org
Search: https://archive.org/search?query=dari+afghanistan&mediatype=texts
Search: https://archive.org/search?query=دری+افغانستان&mediatype=texts

---

## 🔧 Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Frontend | HTML/CSS/JS (RTL Dari) | Free |
| Hosting | Vercel | Free |
| Database | Supabase (PostgreSQL) | Free (500MB) |
| Auth | Supabase Auth (Google OAuth) | Free |
| Book storage | Internet Archive (archive.org) | Free forever |
| Email | Gmail mailto + Supabase webhooks | Free |

**Total monthly cost: $0** 🎉

---

## 📞 Support

Admin email: seyaramiry.2468@gmail.com
