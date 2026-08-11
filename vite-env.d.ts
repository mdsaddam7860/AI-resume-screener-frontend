/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Full base URL of the deployed backend API, e.g. "https://your-backend.example.com/api".
   * Leave unset for local dev - Vite's dev server proxy handles "/api" instead (see vite.config.ts).
   */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
