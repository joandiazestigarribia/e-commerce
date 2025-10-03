import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { HomePage } from '../pages/HomePage';

test.describe('Product Detail Page', () => {
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        productPage = new ProductPage(page);
    });

    test('debe mostrar detalles del producto correctamente', async () => {
        await productPage.navigateToProduct('test-product-1');

        await productPage.verifyProductDetails({
            title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
            price: '$109.95',
            description: 'Your perfect pack for everyday use'
        });

        await productPage.verifyImageLoaded();
    });

    test('debe agregar producto al carrito desde detalle', async () => {
        await productPage.navigateToProduct('test-product-1');
        await productPage.addToCart();
    });

    test('debe navegar de vuelta a home', async () => {
        await productPage.navigateToProduct('test-product-1');
        await productPage.goBack();

        await expect(productPage.page).toHaveURL('/');
    });

    test('debe manejar producto no encontrado', async () => {
        await productPage.page.route('**/api/products/999', route => {
            route.fulfill({
                status: 404,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: false,
                    message: 'Product not found',
                    timestamp: new Date().toISOString()
                })
            });
        });

        await productPage.page.goto('/p/non-existent-product-999');
        await productPage.verifyErrorState();
    });

    test('debe cumplir estándares básicos de accesibilidad', async () => {
        await productPage.navigateToProduct('test-product-1');
        await productPage.checkAccessibility();
    });
});

test.describe('Product Detail - Navigation Flow', () => {
    test('flujo completo: home -> producto -> agregar al carrito -> volver', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.navigate();

        await homePage.clickProductByTitle('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');

        const productPage = new ProductPage(page);
        await productPage.verifyProductDetails({
            title: 'Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops',
            price: '$109.95'
        });

        await productPage.addToCart();

        await productPage.goBack();
        await expect(page).toHaveURL('/');
    });
});