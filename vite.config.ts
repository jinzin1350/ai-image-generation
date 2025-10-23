import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // Use process.env for Replit Secrets, fallback to .env file
    const geminiApiKey = process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL || env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: [
          '.replit.dev',
          '.repl.co',
          'localhost',
          'iranretailai.replit.app',
          'iranretailai.com',
        ],
      },
      preview: {
        port: 3000,
        host: '0.0.0.0',
        allowedHosts: [
          '.replit.dev',
          '.repl.co',
          'localhost',
          'iranretailai.replit.app',
          'iranretailai.com',
        ],
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(geminiApiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(geminiApiKey),
        'process.env.SUPABASE_URL': JSON.stringify(supabaseUrl),
        'process.env.SUPABASE_ANON_KEY': JSON.stringify(supabaseAnonKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
