const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.MOCK_API_PORT || 8080;

app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

const mockProducts = [
    {
        id: 1,
        title: 'Test Product 1',
        price: 29.99,
        description: 'Product description 1',
        category: 'electronics',
        image: 'https://via.placeholder.com/150',
        slug: 'test-product-1'
    },
    {
        id: 2,
        title: 'Test Product 2',
        price: 39.99,
        description: 'Product description 2',
        category: 'clothing',
        image: 'https://via.placeholder.com/150',
        slug: 'test-product-2'
    }
];

app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: mockProducts,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/products/:id', (req, res) => {
    const product = mockProducts.find(p => p.id === Number(req.params.id));
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
            timestamp: new Date().toISOString()
        });
    }
    res.json({
        success: true,
        data: product,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Mock server running on http://localhost:${PORT}`);
    console.log(`🔄 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;