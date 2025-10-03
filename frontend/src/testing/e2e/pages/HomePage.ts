import { Page, expect, Locator } from '@playwright/test';
import { PageHelpers } from '../helpers/page-helpers';
import { ApiHelpers } from '../helpers/api-helpers';

export class HomePage {
    private pageHelpers: PageHelpers;
    private apiHelpers: ApiHelpers;

    private readonly selectors = {
        productList: '[data-testid="product-list"]',
        productCard: '[data-testid="product-card"]',
        productTitle: '[data-testid="product-title"]',
        productPrice: '[data-testid="product-price"]',
        loadingSpinner: '[data-testid="loading-spinner"]',
        errorMessage: '[data-testid="error-message"]',
        cartButton: '[data-testid="add-to-cart"]',
        cartModal: '[data-testid="cart-modal"]'
    };

    constructor(public page: Page) {
        this.pageHelpers = new PageHelpers(page);
        this.apiHelpers = new ApiHelpers(page);
    }

    async openCart() {
        const cartButton = this.page.locator('[data-testid="cart-button"]');
        await expect(cartButton).toBeVisible();
        await cartButton.scrollIntoViewIfNeeded();
        await cartButton.click();
    }

    async navigateWithLoadingTest() {
        await this.pageHelpers.navigateAndWaitForLoad('/');
    }

    async navigate() {
        const apiPromise = this.apiHelpers.interceptApiCall('/api/products');

        await this.pageHelpers.navigateAndWaitForLoad('/');

        await apiPromise;
        await this.waitForProductsToLoad();
    }

    async waitForProductsToLoad() {
        await expect(this.page.locator(this.selectors.productList)).toBeVisible();

        const products = this.page.locator(this.selectors.productCard);
        const count = await products.count();
        await expect(count).toBeGreaterThanOrEqual(1);
    }

    async getProductCards(): Promise<Locator> {
        return this.page.locator(this.selectors.productCard);
    }

    async getProductByTitle(title: string): Promise<Locator> {
        const searchText = title.split(' ').slice(0, 4).join(' ');

        return this.page.locator(this.selectors.productCard)
            .filter({ has: this.page.locator(this.selectors.productTitle).filter({ hasText: searchText }) });
    }

    async clickProductByTitle(title: string) {
        await expect(this.page.locator('[data-testid="cart-modal"]')).toBeHidden({ timeout: 10000 });
        await expect(this.page.locator('.fixed.inset-0.bg-black.bg-opacity-50')).toBeHidden({ timeout: 10000 });

        await this.page.waitForTimeout(1000);

        const product = await this.getProductByTitle(title);
        await expect(product).toBeVisible();

        await product.scrollIntoViewIfNeeded();
        await product.click();
    }

    async addProductToCart(title: string) {
        const product = await this.getProductByTitle(title);
        await expect(product).toBeVisible();

        const addButton = product.locator(this.selectors.cartButton);
        await expect(addButton).toBeVisible();

        await this.page.waitForTimeout(1000);

        await expect(addButton).toBeEnabled({ timeout: 15000 });
        await addButton.click();

        await expect(this.page.locator(this.selectors.cartModal)).toBeVisible();
    }

    async verifyProductsDisplayed() {
        const products = await this.getProductCards();
        const count = await products.count();

        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
            const product = products.nth(i);
            await expect(product.locator(this.selectors.productTitle)).toBeVisible();
            await expect(product.locator(this.selectors.productPrice)).toBeVisible();
        }
    }

    async verifyErrorState() {
        await expect(this.page.getByText('Error cargando inicio')).toBeVisible({ timeout: 10000 });
        await expect(this.page.locator(this.selectors.productList)).toBeHidden();
    }

    async navigateWithoutApiWait() {
        await this.pageHelpers.navigateAndWaitForLoad('/');
        await this.waitForProductsToLoad();
    }

    async verifyLoadingState() {
        let responseReceived = false;

        await this.page.route('**/api/products', async route => {
            await this.page.waitForTimeout(3000);
            responseReceived = true;
            await route.continue();
        });

        const navigationPromise = this.page.goto('/', {
            waitUntil: 'commit'
        });

        await expect(this.page.locator(this.selectors.loadingSpinner))
            .toBeVisible({ timeout: 3000 });

        await navigationPromise;

        await expect(this.page.locator(this.selectors.loadingSpinner))
            .toBeHidden({ timeout: 5000 });

        expect(responseReceived).toBe(true);
    }

    async checkAccessibility() {
        await this.pageHelpers.checkBasicAccessibility();

        const firstProduct = (await this.getProductCards()).first();

        await expect(firstProduct).toBeVisible();

        const addToCartButton = firstProduct.locator(this.selectors.cartButton);
        await expect(addToCartButton).toBeVisible();

        const productLink = firstProduct.locator('a').first();
        await expect(productLink).toBeVisible();

        await expect(productLink).toHaveAttribute('href');

        const productImage = firstProduct.locator('img');
        await expect(productImage).toHaveAttribute('alt');
    }
}