/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_APP_NAME: string
    readonly VITE_APP_VERSION: string
    readonly VITE_NODE_ENV: string
    readonly VITE_ENABLE_DEBUG: string
    readonly VITE_ITEMS_PER_PAGE: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
