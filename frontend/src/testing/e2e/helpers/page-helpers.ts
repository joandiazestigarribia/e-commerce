import { Page, expect, Locator } from '@playwright/test';

export class PageHelpers {
    constructor(private page: Page) { }

    async navigateAndWaitForLoad(path: string) {
        await this.page.goto(path, { waitUntil: 'networkidle' });
        await this.waitForPageLoad();
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');

        const loadingIndicators = this.page.locator('[data-testid*="loading"], .spinner, [aria-label*="loading" i]');
        await expect(loadingIndicators).toHaveCount(0, { timeout: 10000 });
    }

    async waitForElement(selector: string): Promise<Locator> {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible();
        await expect(element).toBeEnabled();
        return element;
    }

    async scrollToElement(selector: string) {
        const element = this.page.locator(selector);
        await element.scrollIntoViewIfNeeded();
        await expect(element).toBeInViewport();
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({
            path: `test-results/screenshots/${name}-${Date.now()}.png`,
            fullPage: true
        });
    }

    async checkBasicAccessibility() {
        const headings = this.page.locator('h1, h2, h3, h4, h5, h6');
        const headingCount = await headings.count();
        await expect(headingCount).toBeGreaterThanOrEqual(1);

        const images = this.page.locator('img');
        const imageCount = await images.count();

        for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i);
            await expect(img).toHaveAttribute('alt');
        }
    }
}