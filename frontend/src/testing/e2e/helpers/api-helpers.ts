import { Page, expect } from '@playwright/test';

export class ApiHelpers {
    constructor(private page: Page) { }

    async interceptApiCall(endpoint: string, expectedData?: any) {
        const responsePromise = this.page.waitForResponse(
            response => response.url().includes(endpoint) && response.status() === 200
        );

        const response = await responsePromise;
        const data = await response.json();

        expect(data.success).toBe(true);
        if (expectedData) {
            expect(data.data).toMatchObject(expectedData);
        }

        return data;
    }

    async mockApiError(endpoint: string, status: number = 500) {
        await this.page.route(`**/${endpoint}*`, route => {
            route.fulfill({
                status,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: false,
                    message: 'Mocked error for testing',
                    timestamp: new Date().toISOString()
                })
            });
        });
    }

    async mockSlowApi(endpoint: string, delay: number = 2000) {
        await this.page.route(`**/${endpoint}*`, async route => {
            await new Promise(resolve => setTimeout(resolve, delay));
            route.continue();
        });
    }
}