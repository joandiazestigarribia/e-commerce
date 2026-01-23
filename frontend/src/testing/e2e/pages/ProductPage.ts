import { Page, expect } from '@playwright/test';
import { PageHelpers } from '../helpers/page-helpers';
import { ApiHelpers } from '../helpers/api-helpers';

export class ProductPage {
    private pageHelpers: PageHelpers;
    private apiHelpers: ApiHelpers;

    private readonly selectors = {
        productTitle: 'main h1[data-testid="product-title"], main h1',
        productPrice: '[data-testid="product-price-original"]',
        productDescription: '[data-testid="product-description"]',
        productImage: '[data-testid="product-image"]',
        addToCartButton: 'main [data-testid="add-to-cart"]',
        backButton: '[data-testid="back-button"]',
        loadingSpinner: '[data-testid="loading-spinner"]',
        errorMessage: '[data-testid="product-not-found"]',
        cartModal: '[data-testid="cart-modal"]'
    };

    constructor(public page: Page) {
        this.pageHelpers = new PageHelpers(page);
        this.apiHelpers = new ApiHelpers(page);
    }

    async navigateToProduct(slug: string, mockData?: {
        title: string;
        price: number;
        description: string;
    }, mockStatus: number = 200) {
        const productId = this.extractIdFromSlug(slug);

        await this.page.route(`**/api/products/${productId}`, route => {
            if (mockStatus === 404 || mockStatus >= 400) {
                route.fulfill({
                    status: mockStatus,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: false,
                        error: 'Product not found',
                        timestamp: new Date().toISOString()
                    })
                });
            } else {
                const productData = mockData || {
                    title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                    price: 109.95,
                    description: 'Your perfect pack for everyday use...'
                };

                route.fulfill({
                    status: mockStatus,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        success: true,
                        data: {
                            id: productId,
                            title: productData.title,
                            price: productData.price,
                            description: productData.description,
                            image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
                            rating: { rate: 3.9, count: 120 }
                        },
                        timestamp: new Date().toISOString()
                    })
                });
            }
        });

        await this.pageHelpers.navigateAndWaitForLoad(`/p/${slug}`);

        if (mockStatus < 400) {
            await this.waitForProductToLoad();
        }
    }

    async waitForProductToLoad() {
        await expect(this.page.locator(this.selectors.productTitle)).toBeVisible();
        await expect(this.page.locator(this.selectors.productPrice)).toBeVisible();
    }

    async verifyProductDetails(expectedProduct: { title: string; price: string; description?: string }) {
        await expect(this.page.locator(this.selectors.productTitle)).toHaveText(expectedProduct.title);
        await expect(this.page.locator(this.selectors.productPrice)).toContainText(expectedProduct.price);

        if (expectedProduct.description) {
            await expect(this.page.locator(this.selectors.productDescription))
                .toContainText(expectedProduct.description);
        }
    }

    async addToCart() {
        const addButton = this.page.locator(this.selectors.addToCartButton).first();
        await expect(addButton).toBeVisible();
        await expect(addButton).toBeEnabled();

        await addButton.click();

        await expect(this.page.locator(this.selectors.cartModal)).toBeVisible();
    }

    async goBack() {
        const cartModal = this.page.locator(this.selectors.cartModal);
        const isModalVisible = await cartModal.isVisible().catch(() => false);

        if (isModalVisible) {
            await this.page.locator('[data-testid="cart-modal"] button').first().click();
            await expect(cartModal).toBeHidden();
        }

        await this.page.getByRole('link', { name: 'ZEPHYRUS' }).click();
        await this.page.waitForURL('/');
    }

    async verifyImageLoaded() {
        const image = this.page.locator(`${this.selectors.productImage} img`).first();
        await expect(image).toBeVisible();
        await expect(image).toHaveAttribute('alt');;
    }

    async verifyErrorState() {
        await this.page.waitForLoadState('networkidle');

        await expect(this.page.locator(this.selectors.productTitle)).not.toBeVisible();

        const errorMessage = this.page.locator(this.selectors.errorMessage);
        await expect(errorMessage).toBeVisible({ timeout: 10000 });
    }

    async checkAccessibility() {
        await this.pageHelpers.checkBasicAccessibility();

        const addButton = this.page.locator(this.selectors.addToCartButton);
        await addButton.focus();
        await expect(addButton).toBeFocused();
    }

    private extractIdFromSlug(slug: string): number {
        const parts = slug.split('-');
        return parseInt(parts[parts.length - 1]) || 1;
    }
}