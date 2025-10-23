<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1jy43wS-y0gQQxSIaOqmaQBeGktzoaXwT

## 🚀 Quick Start - Run on Replit

**For complete Replit setup instructions in Persian, see: [REPLIT_SETUP.md](REPLIT_SETUP.md)**

Quick steps:
1. Create a Supabase project at https://supabase.com
2. Get your Supabase URL and anon key from Project Settings > API
3. Get a Gemini API key from https://aistudio.google.com/app/apikey
4. In Replit, add these **Secrets** (🔒 icon in sidebar):
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
   - `GEMINI_API_KEY` = your Gemini API key
5. Enable Email authentication in Supabase (Authentication > Providers)
6. Click **Run** in Replit

---

## Run Locally

**Prerequisites:**  Node.js, Supabase Account

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a Supabase project:
   - Go to https://supabase.com and create a new project
   - Wait for the project to be provisioned
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. Enable Email Authentication in Supabase:
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable the "Email" provider

5. Run the app:
   ```bash
   npm run dev
   ```

## Features

- **Authentication**: Secure user authentication with Supabase (Email/Password)
- **AI Image Generation**: Generate professional fashion photos using Google Gemini AI
- **Model Selection**: Choose from 25+ professionally styled models
- **Background Options**: Select from 20+ diverse background settings
- **Responsive Design**: Works on all devices
