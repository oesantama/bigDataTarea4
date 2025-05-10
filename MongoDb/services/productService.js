const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');
const { COLLECTION_NAME, validateProductData } = require('../models/Product');

function getProductsCollection() {
    const db = getDB();
    return db.collection(COLLECTION_NAME);
}

async function createProduct(productData) {
    const validation = validateProductData(productData);
    if (!validation.isValid) {
        const error = new Error("Datos de producto inválidos");
        error.validationErrors = validation.errors;
        error.statusCode = 400;
        throw error;
    }

    const productsCollection = getProductsCollection();
    const productToInsert = {
        ...productData,
        especificaciones: productData.especificaciones || {},
        imagenes: productData.imagenes || [],
        reviews: productData.reviews || [], // Aunque típicamente un producto nuevo no tiene reviews
        fecha_creacion: new Date(),
        fecha_actualizacion: new Date(),
    };

    const result = await productsCollection.insertOne(productToInsert);
    if (!result.insertedId) {
        const error = new Error("Error al crear el producto, no se obtuvo ID.");
        error.statusCode = 500;
        throw error;
    }
    return await productsCollection.findOne({ _id: result.insertedId });
}

async function getAllProducts(filters = {}, sortOptions = {}, page = 1, limit = 10) {
    const productsCollection = getProductsCollection();
    const skip = (page - 1) * limit;

    const products = await productsCollection.find(filters).sort(sortOptions).skip(skip).limit(limit).toArray();
    const totalProducts = await productsCollection.countDocuments(filters);

    return {
        data: products,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts
    };
}

async function getProductById(productId) {
    if (!ObjectId.isValid(productId)) {
        const error = new Error("ID de producto inválido.");
        error.statusCode = 400;
        throw error;
    }
    const productsCollection = getProductsCollection();
    const product = await productsCollection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
        const error = new Error("Producto no encontrado.");
        error.statusCode = 404;
        throw error;
    }
    return product;
}

async function updateProductById(productId, updates) {
    if (!ObjectId.isValid(productId)) {
        const error = new Error("ID de producto inválido.");
        error.statusCode = 400;
        throw error;
    }
    
    const validation = validateProductData(updates, true); // true para indicar que es una actualización parcial
    if (!validation.isValid) {
        const error = new Error("Datos de actualización de producto inválidos");
        error.validationErrors = validation.errors;
        error.statusCode = 400;
        throw error;
    }


    const productsCollection = getProductsCollection();
    delete updates._id; // No se puede actualizar el _id
    delete updates.fecha_creacion; // No se debe modificar la fecha de creación

    const updatePayload = {
        ...updates,
        fecha_actualizacion: new Date()
    };

    const result = await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $set: updatePayload }
    );

    if (result.matchedCount === 0) {
        const error = new Error("Producto no encontrado para actualizar.");
        error.statusCode = 404;
        throw error;
    }
 
    return await productsCollection.findOne({ _id: new ObjectId(productId) });
}

async function deleteProductById(productId) {
    if (!ObjectId.isValid(productId)) {
        const error = new Error("ID de producto inválido.");
        error.statusCode = 400;
        throw error;
    }
    const productsCollection = getProductsCollection();
    const result = await productsCollection.deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
        const error = new Error("Producto no encontrado para eliminar.");
        error.statusCode = 404;
        throw error;
    }
    return { message: "Producto eliminado exitosamente." };
}

async function addReviewToProduct(productId, reviewData) {
    if (!ObjectId.isValid(productId)) {
        const error = new Error("ID de producto inválido.");
        error.statusCode = 400;
        throw error;
    }
    // Validación de la reseña (simplificada)
    if (!reviewData.id_usuario || !reviewData.nombre_usuario || reviewData.calificacion === undefined || !reviewData.comentario) {
        const error = new Error("Faltan datos para la reseña (id_usuario, nombre_usuario, calificacion, comentario).");
        error.statusCode = 400;
        throw error;
    }
    if (!ObjectId.isValid(reviewData.id_usuario)) {
        const error = new Error("ID de usuario para la reseña es inválido.");
        error.statusCode = 400;
        throw error;
    }
    if (typeof reviewData.calificacion !== 'number' || reviewData.calificacion < 1 || reviewData.calificacion > 5) {
        const error = new Error("La calificación debe ser un número entre 1 y 5.");
        error.statusCode = 400;
        throw error;
    }


    const productsCollection = getProductsCollection();
    const newReview = {
        _id_review: new ObjectId(),
        id_usuario: new ObjectId(reviewData.id_usuario),
        nombre_usuario: reviewData.nombre_usuario,
        calificacion: parseInt(reviewData.calificacion),
        comentario: reviewData.comentario,
        fecha_review: new Date()
    };

    const result = await productsCollection.updateOne(
        { _id: new ObjectId(productId) },
        { $push: { reviews: newReview }, $set: { fecha_actualizacion: new Date() } }
    );

    if (result.matchedCount === 0) {
        const error = new Error("Producto no encontrado para añadir reseña.");
        error.statusCode = 404;
        throw error;
    }
    return newReview; // Devolver la reseña creada
}

async function getProductStatsByCategory(categoryName) {
    const productsCollection = getProductsCollection();
    const stats = await productsCollection.aggregate([
        { $match: { categoria: categoryName } },
        { $unwind: { path: "$reviews", preserveNullAndEmptyArrays: true } }, // preserve para incluir productos sin reviews
        {
            $group: {
                _id: "$_id",
                nombre: { $first: "$nombre" },
                precio: { $first: "$precio" },
                avgCalificacionProducto: { $avg: "$reviews.calificacion" },
                totalReviews: { // Contar solo si hay reviews
                    $sum: { $cond: [{ $ifNull: ["$reviews", false] }, 1, 0] }
                }
            }
        },
        {
            $group: {
                _id: categoryName,
                totalProductosEnCategoria: { $sum: 1 },
                promedioGeneralCalificacion: { $avg: "$avgCalificacionProducto" }, // Solo considerará productos con reviews
                minPrecio: { $min: "$precio" },
                maxPrecio: { $max: "$precio" },
                totalReviewsCategoria: { $sum: "$totalReviews"}
            }
        },
        {
            $project: {
                _id: 0,
                categoria: "$_id",
                totalProductos: "$totalProductosEnCategoria",
                calificacionPromedioGeneral: { $ifNull: ["$promedioGeneralCalificacion", "N/A (sin reseñas)"] },
                rangoPrecios: { min: "$minPrecio", max: "$maxPrecio" },
                totalReseñasEnCategoria: "$totalReviewsCategoria"
            }
        }
    ]).toArray();

    if (stats.length === 0) {
        const error = new Error(`No se encontraron productos o reseñas para la categoría '${categoryName}'.`);
        error.statusCode = 404;
        throw error;
    }
    return stats[0];
}


module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    addReviewToProduct,
    getProductStatsByCategory
};