/// <reference types="vite/client" />
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_SEARCH_DOCS_URL: string;
  readonly VITE_GOOGLE_TAG_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
