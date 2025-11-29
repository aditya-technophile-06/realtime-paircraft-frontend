/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_AI_API_KEY: string
  readonly VITE_AI_PROVIDER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
