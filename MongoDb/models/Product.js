const COLLECTION_NAME = 'products';

/**
 * Valida los datos de un producto antes de su inserción o actualización.
 * @param {object} productData - Los datos del producto a validar.
 * @returns {object} - Un objeto con { isValid: boolean, errors: array }.
 */
function validateProductData(productData, isUpdate = false) {
    const errors = [];

    if (!isUpdate) { // Campos requeridos solo en la creación, en actualización pueden ser parciales
        if (!productData.nombre) errors.push("El campo 'nombre' es requerido.");
        if (!productData.descripcion) errors.push("El campo 'descripcion' es requerido.");
        if (productData.precio === undefined) errors.push("El campo 'precio' es requerido.");
        if (productData.stock === undefined) errors.push("El campo 'stock' es requerido.");
        if (!productData.categoria) errors.push("El campo 'categoria' es requerido.");
    }

    if (productData.nombre && typeof productData.nombre !== 'string') {
        errors.push("El campo 'nombre' debe ser una cadena de texto.");
    }
    if (productData.descripcion && typeof productData.descripcion !== 'string') {
        errors.push("El campo 'descripcion' debe ser una cadena de texto.");
    }
    if (productData.precio !== undefined && (typeof productData.precio !== 'number' || productData.precio <= 0)) {
        errors.push("El campo 'precio' debe ser un número positivo.");
    }
    if (productData.stock !== undefined && (typeof productData.stock !== 'number' || productData.stock < 0)) {
        errors.push("El campo 'stock' debe ser un número no negativo.");
    }
    if (productData.categoria && typeof productData.categoria !== 'string') {
        errors.push("El campo 'categoria' debe ser una cadena de texto.");
    }
    if (productData.marca && typeof productData.marca !== 'string') {
        errors.push("El campo 'marca' debe ser una cadena de texto.");
    }
    if (productData.imagenes && !Array.isArray(productData.imagenes)) {
        errors.push("El campo 'imagenes' debe ser un array.");
    } else if (productData.imagenes) {
        productData.imagenes.forEach((img, index) => {
            if (typeof img !== 'string') errors.push(`La imagen en el índice ${index} debe ser una URL (cadena de texto).`);
        });
    }
    if (productData.especificaciones && typeof productData.especificaciones !== 'object') {
        errors.push("El campo 'especificaciones' debe ser un objeto.");
    }
   

    return {
        isValid: errors.length === 0,
        errors: errors
    };
}


module.exports = {
    COLLECTION_NAME,
    validateProductData
};