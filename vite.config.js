import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: ['VITE_', 'GOOGLE_', 'GEMINI_', 'GROQ_', 'OPENAI_'],
  server: {
    host: true,
    port: 5173
  }
});
