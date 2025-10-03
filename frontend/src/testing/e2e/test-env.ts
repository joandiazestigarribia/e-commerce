export const testConfig = {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000/api',
    apiURL: process.env.PLAYWRIGHT_API_URL || 'http://localhost:8080',

    timeouts: {
        action: 10 * 1000,
        navigation: 30 * 1000,
        test: 60 * 1000,
    },

    environments: {
        development: {
            baseURL: 'http://localhost:3000/api',
            apiURL: 'http://localhost:8080',
            slowMo: 100,
        },
        staging: {
            baseURL: 'https://staging.ejemplo.com',
            apiURL: 'https://api-staging.ejemplo.com',
            slowMo: 0,
        },
        production: {
            baseURL: 'https://ejemplo.com/api',
            apiURL: 'https://api.ejemplo.com',
            slowMo: 0,
        }
    },

    testData: {
        products: {
            valid: {
                id: 1,
                title: 'Test Product 1',
                price: '$29.99',
                slug: 'test-product-1'
            },
            invalid: {
                id: 999,
                slug: 'non-existent-product'
            }
        }
    }
};