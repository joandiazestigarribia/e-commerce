export const env = {
    // API Configuration
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,

    // App Information
    APP_NAME: import.meta.env.VITE_APP_NAME,
    APP_VERSION: import.meta.env.VITE_APP_VERSION,

    // Environment
    NODE_ENV: import.meta.env.VITE_NODE_ENV,
    IS_DEVELOPMENT: import.meta.env.VITE_NODE_ENV,
    IS_PRODUCTION: import.meta.env.VITE_NODE_ENV,

    // Features
    ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
    ITEMS_PER_PAGE: parseInt(import.meta.env.VITE_ITEMS_PER_PAGE),
} as const;

export const validateEnv = () => {
    const requiredVars = ['VITE_API_BASE_URL'];

    for (const varName of requiredVars) {
        if (!import.meta.env[varName]) {
            throw new Error(`Variable de entorno requerida faltante: ${varName}`);
        }
    }
};