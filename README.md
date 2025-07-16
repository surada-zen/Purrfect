# Purrfect Pages

This project is a lightweight, distraction-free notepad app built with React and Vite.

## Features
- Create, edit, and delete notes instantly
- Organize notes with custom categories
- Mark your favorite notes for quick access
- Beautiful, minimalist, and responsive design
- All notes are saved locally for privacy and speed

---

## Requirements
- Node.js (v16+ recommended)
- npm (comes with Node.js)
- @supabase/supabase-js (if you want to use Supabase in the future)
- @types/react (for TypeScript projects)

---

## Local Development
s
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. **Install dependencies:**
   ```sh
   npm install
   npm install --save-dev @types/react
   ```
3. **Run the app locally:**
   ```sh
   npm run dev
   ```
   - Open the local server URL (usually http://localhost:5173) in your browser.

---

## Static Assets (Images)

- Place all static images in the `public/` directory (e.g., `public/kitty.png`, `public/pp.png`).
- Reference images in your code as `/kitty.png` or `/pp.png` (not `/assets/kitty.png`).
- This ensures images are served correctly in both development and production (Vercel, Netlify, etc).

---

## Supabase Authentication (Optional)

If you want to add authentication with Supabase, follow these steps:

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com/) and create a new project.
   - Get your Project URL and anon/public API key from the project settings.

2. **Install Supabase client:**
   ```sh
   npm install @supabase/supabase-js
   ```

3. **Initialize Supabase in your app:**
   - Import and configure the Supabase client in your code using your project URL and anon key.
   - Example:
     ```js
     import { createClient } from '@supabase/supabase-js';
     const supabase = createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');
     ```

4. **Add authentication logic:**
   - Implement login/logout UI (e.g., email magic link login).
   - Use Supabase's `auth.signInWithOtp` and `auth.signOut` methods.
   - Manage user state and show/hide UI based on authentication.

5. **(Optional) Remove authentication:**
   - If you no longer need authentication, remove the Supabase logic and UI from your app.

---

## Deployment Steps (Vercel)

### 1. Prepare your project
- Ensure all static images are in the `public/` directory.
- Update all image references in your code to use `/kitty.png` and `/pp.png`.
- Remove any temporary authentication UI or logic if not needed.

### 2. Push your code to GitHub
```sh
# If you haven't already:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/your-repo.git
git push -u origin main
```

### 3. Deploy on Vercel
- Go to [vercel.com](https://vercel.com/) and sign up (use GitHub for easiest integration).
- Click "New Project" and import your GitHub repo.
- Vercel will auto-detect your React/Vite setup.
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- Click "Deploy".

### 4. Test your live app
- Visit your Vercel URL.
- Test all features and ensure images load correctly.

---

## Alternative Deployment Options

### Netlify
- Similar to Vercel, connect your GitHub repo and deploy.
- **Build Command:** `npm run build`
- **Publish directory:** `dist`

### GitHub Pages
- Use a tool like [vite-plugin-gh-pages](https://www.npmjs.com/package/vite-plugin-gh-pages) for easy deployment.
- Not recommended for apps needing environment variables or custom domains.

### Supabase Static Hosting (Beta)
- You can upload your `dist/` folder to a Supabase Storage bucket and serve as a static site.
- Not as feature-rich as Vercel/Netlify, but keeps backend and frontend in one place.

---

## Troubleshooting

- **Images not loading after deploy:**
  - Make sure images are in `public/` and referenced as `/image.png`.
  - Rebuild and redeploy after moving assets.
- **App not updating after changes:**
  - Push your changes to GitHub; Vercel will auto-redeploy.
- **Build errors:**
  - Ensure all dependencies are installed and your Node.js version is compatible.
- **Authentication issues:**
  - Double-check your Supabase keys and project URL.
  - Make sure you enabled the correct auth providers in Supabase dashboard.

---

for icons from lucide-react for logos.
npm install --save-dev @types/react