/// <reference types="vite/client" />
interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_SEARCH_DOCS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
