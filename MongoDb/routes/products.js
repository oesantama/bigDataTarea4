const express = require('express');
const productService = require('../services/productService');

const router = express.Router();

// CREATE - Añadir un nuevo producto
router.post('/', async (req, res, next) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        next(error); // Pasa el error al middleware de manejo de errores
    }
});

// READ - Obtener todos los productos
router.get('/', async (req, res, next) => {
    try {
        const { categoria, precio_max, sort_by_precio, page, limit } = req.query;
        let filters = {};
        let sortOptions = {};

        if (categoria) filters.categoria = categoria;
        if (precio_max) filters.precio = { $lte: parseFloat(precio_max) };
        if (sort_by_precio) sortOptions.precio = sort_by_precio === 'asc' ? 1 : -1;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;

        const result = await productService.getAllProducts(filters, sortOptions, pageNum, limitNum);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// READ - Obtener un producto por su ID
router.get('/:id', async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
});

// UPDATE - Actualizar un producto por su ID
router.put('/:id', async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProductById(req.params.id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        next(error);
    }
});

// DELETE - Eliminar un producto por su ID
router.delete('/:id', async (req, res, next) => {
    try {
        const result = await productService.deleteProductById(req.params.id);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// Añadir una reseña a un producto
router.post('/:id/reviews', async (req, res, next) => {
    try {
        const newReview = await productService.addReviewToProduct(req.params.id, req.body);
        res.status(201).json(newReview);
    } catch (error) {
        next(error);
    }
});

// Obtener estadísticas de productos por categoría
router.get('/categoria/:nombreCategoria/stats', async (req, res, next) => {
    try {
        const stats = await productService.getProductStatsByCategory(req.params.nombreCategoria);
        res.status(200).json(stats);
    } catch (error) {
        next(error);
    }
});

module.exports = router;