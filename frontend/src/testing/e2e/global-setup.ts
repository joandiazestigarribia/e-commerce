import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
    console.log('🚀 Setting up e2e tests...');

    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000';

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        let retries = 30;
        while (retries > 0) {
            try {
                await page.goto(baseURL, { waitUntil: 'networkidle' });
                console.log('✅ App is ready for e2e tests');
                break;
            } catch (error) {
                retries--;
                if (retries === 0) {
                    throw new Error(`App not available at ${baseURL} after 30 retries`);
                }
                await page.waitForTimeout(1000);
            }
        }

        await browser.close();
    } catch (error) {
        console.error('❌ Global setup failed:', error);
        throw error;
    }
}

export default globalSetup;