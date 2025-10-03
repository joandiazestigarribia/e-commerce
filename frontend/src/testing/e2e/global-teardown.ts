import { FullConfig } from '@playwright/test';

async function globalTeardown(_config: FullConfig) {
    console.log('🧹 Cleaning up e2e tests...');

    // TODO: limpiar datos de test, cerrar conexiones, etc.
    console.log('✅ E2e tests cleanup completed');
}

export default globalTeardown;