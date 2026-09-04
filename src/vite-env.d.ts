/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_VOSK_URL: string
  readonly VITE_PERSONA: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
