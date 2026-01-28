import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ApiHelpers } from '../helpers/api-helpers';

test.describe('Home Page', () => {
    let homePage: HomePage;

    test.beforeEach(async ({ page }) => {
        const apiHelpers = new ApiHelpers(page);
        await apiHelpers.setupAuthenticatedUser();
        
        homePage = new HomePage(page);
    });

    test('debe mostrar lista de productos correctamente', async () => {
        await homePage.navigate();
        await homePage.verifyProductsDisplayed();
    });

    test('debe navegar a detalle de producto al hacer click', async () => {
        await homePage.navigate();

        const firstProduct = await homePage.getProductCards();
        await expect(firstProduct.first()).toBeVisible();
        await firstProduct.first().click();

        await expect(homePage.page).toHaveURL(/\/p\/.+/);
    });

    test('debe agregar producto al carrito', async () => {
        await homePage.page.route('**/api/products', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: [
                        {
                            id: 1,
                            title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
                            price: 109.95,
                            description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
                            image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png',
                            rating: { rate: 3.9, count: 120 }
                        }
                    ],
                    timestamp: new Date().toISOString()
                })
            });
        });

        await homePage.page.goto('/', { waitUntil: 'networkidle' });
        await homePage.waitForProductsToLoad();

        await homePage.page.waitForTimeout(500);
        await homePage.addProductToCart('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
    });

    test('debe manejar error de API correctamente', async () => {
        await homePage.page.route('**/api/products', route => {
            route.fulfill({
                status: 500,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: false,
                    message: 'Server error',
                    timestamp: new Date().toISOString()
                })
            });
        });

        await homePage.page.goto('/');
        await homePage.verifyErrorState();
    });

    test('debe cumplir estándares básicos de accesibilidad', async () => {
        await homePage.navigate();
        await homePage.checkAccessibility();
    });
});

test.describe('Home Page - Responsive', () => {
    test.beforeEach(async ({ page }) => {
        const apiHelpers = new ApiHelpers(page);
        await apiHelpers.setupAuthenticatedUser();
    });

    test('debe funcionar correctamente en mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.verifyProductsDisplayed();
    });

    test('debe funcionar correctamente en tablet', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });

        const homePage = new HomePage(page);
        await homePage.navigate();
        await homePage.verifyProductsDisplayed();
    });
});