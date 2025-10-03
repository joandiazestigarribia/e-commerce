import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';

test.describe('Cart Functionality', () => {
    test('debe agregar múltiples productos al carrito', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();

        await homePage.addProductToCart('Fjallraven - Foldsack No. 1 Ba');

        await page.keyboard.press('Escape');
        await expect(page.locator('[data-testid="cart-modal"]')).toBeHidden();

        await page.waitForTimeout(500);

        await homePage.addProductToCart('Mens Casual Premium Slim Fit T');

        const cartItems = page.locator('[data-testid="cart-item"]');
        await expect(cartItems).toHaveCount(2);
    });

    test('debe persistir carrito entre navegación', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();

        await homePage.addProductToCart('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');

        let cartItems = page.locator('[data-testid="cart-item"]');
        await expect(cartItems).toHaveCount(1);

        await page.keyboard.press('Escape');
        await expect(page.locator('[data-testid="cart-modal"]')).toBeHidden({ timeout: 10000 });

        await page.waitForTimeout(1000);

        await homePage.clickProductByTitle('Mens Casual Premium Slim Fit T-Shirts');

        await expect(page).toHaveURL(/\/p\/mens-casual-premium-slim-fit-t-shirts/);

        await expect(page.locator('h1')).toContainText('Mens Casual Premium Slim Fit T-Shirts');

        const productPage = new ProductPage(page);
        await productPage.addToCart();

        cartItems = page.locator('[data-testid="cart-item"]');
        await expect(cartItems).toHaveCount(2);

        const firstItemTitle = cartItems.nth(0).locator('h4');
        const secondItemTitle = cartItems.nth(1).locator('h4');

        await expect(firstItemTitle).not.toHaveText(await secondItemTitle.textContent() || '');
    });

    test('debe manejar carrito vacío correctamente', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();

        const cartButton = page.locator('[data-testid="cart-button"]');
        await expect(cartButton).toBeVisible();

        await cartButton.evaluate(el => (el as HTMLElement).click());

        const emptyMessage = page.locator('[data-testid="empty-cart-message"]');
        await expect(emptyMessage).toBeVisible();
    });
});