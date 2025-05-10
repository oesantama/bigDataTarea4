// --- INSERCIÓN ---
print("\n--- 1. CONSULTAS BÁSICAS ---");
print("--- 1.1 Inserción ---");
// Insertar un nuevo producto
const nuevoProducto = {
    nombre: "Teclado Mecánico RGB ProGamer",
    descripcion: "Teclado mecánico con switches Cherry MX Red, retroiluminación RGB personalizable y reposamuñecas.",
    precio: 129.99,
    stock: 25,
    categoria: "Electrónica",
    marca: "ProGamerX",
    imagenes: ["https://example.com/teclado1.jpg", "https://example.com/teclado2.jpg"],
    especificaciones: {
        tipo_switch: "Cherry MX Red",
        iluminacion: "RGB Full Spectrum",
        conectividad: "USB-C"
    },
    reviews: [],
    fecha_creacion: new Date(),
    fecha_actualizacion: new Date()
};
const insertResult = db.products.insertOne(nuevoProducto);
print("Producto insertado con ID:", insertResult.insertedId);
const productoInsertado = db.products.findOne({_id: insertResult.insertedId});
printjson(productoInsertado); // Mostrar el producto insertado


// --- SELECCIÓN ---
print("\n--- 1.2 Selección ---");
// Seleccionar el producto recién insertado por su nombre
print("Seleccionar producto por nombre 'Teclado Mecánico RGB ProGamer':");
const prodPorNombre = db.products.findOne({ nombre: "Teclado Mecánico RGB ProGamer" });
printjson(prodPorNombre);

// Seleccionar los primeros 5 productos de la categoría "Ropa"
print("\nPrimeros 5 productos de la categoría 'Ropa':");
const ropaProductos = db.products.find({ categoria: "Ropa" }).limit(5).toArray();
ropaProductos.forEach(p => printjson(p));


// --- ACTUALIZACIÓN ---
print("\n--- 1.3 Actualización ---");
// Actualizar el stock y el precio del producto recién insertado (usando su ID si lo tenemos)
// Primero, busquémoslo de nuevo para asegurar que tenemos el _id correcto
let productoAActualizar = db.products.findOne({ nombre: "Teclado Mecánico RGB ProGamer" });
if (productoAActualizar) {
    print(`Actualizando stock y precio del producto con ID: ${productoAActualizar._id}`);
    const updateResult = db.products.updateOne(
        { _id: productoAActualizar._id },
        {
            $set: { precio: 119.99, fecha_actualizacion: new Date() },
            $inc: { stock: 10 } // Incrementar el stock en 10
        }
    );
    print("Documentos coincidentes:", updateResult.matchedCount, "| Documentos modificados:", updateResult.modifiedCount);
    print("Producto actualizado:");
    printjson(db.products.findOne({ _id: productoAActualizar._id }));

    // Añadir una review al producto
    print("\nAñadiendo una review al producto actualizado:");
    const reviewUpdateResult = db.products.updateOne(
        { _id: productoAActualizar._id },
        {
            $push: {
                reviews: {
                    _id_review: new ObjectId(),
                    id_usuario: new ObjectId(), // ID de usuario de ejemplo
                    nombre_usuario: "ReviewerExperto",
                    calificacion: 5,
                    comentario: "¡Este teclado es increíble! Totalmente recomendado.",
                    fecha_review: new Date()
                }
            },
            $set: { fecha_actualizacion: new Date() }
        }
    );
    print("Documentos coincidentes para review:", reviewUpdateResult.matchedCount, "| Documentos modificados:", reviewUpdateResult.modifiedCount);
    print("Producto con nueva review:");
    printjson(db.products.findOne({ _id: productoAActualizar._id }));

} else {
    print("No se encontró el producto 'Teclado Mecánico RGB ProGamer' para actualizar.");
}


// --- ELIMINACIÓN ---
print("\n--- 1.4 Eliminación ---");
// Eliminar el producto que acabamos de insertar (si aún existe)
productoAActualizar = db.products.findOne({ nombre: "Teclado Mecánico RGB ProGamer" }); // Buscarlo de nuevo por si acaso
if (productoAActualizar) {
    print(`Eliminando producto con ID: ${productoAActualizar._id}`);
    const deleteResult = db.products.deleteOne({ _id: productoAActualizar._id });
    print("Documentos eliminados:", deleteResult.deletedCount);
} else {
    print("El producto 'Teclado Mecánico RGB ProGamer' ya no existe o no fue encontrado para eliminar.");
}

// Eliminar todos los productos con stock 0 de la categoría "Juguetes"
print("\nEliminando productos de 'Juguetes' con stock 0:");
const deleteSinStockResult = db.products.deleteMany({ categoria: "Juguetes", stock: 0 });
print("Documentos de 'Juguetes' con stock 0 eliminados:", deleteSinStockResult.deletedCount);

print("\n\n--- 2. CONSULTAS CON FILTROS Y OPERADORES ---");

// 1. Productos con precio entre 50 y 100 (inclusive)
print("\n--- 2.1 Productos con precio entre $50 y $100 ---");
db.products.find({ precio: { $gte: 50, $lte: 100 } }).limit(5).forEach(printjson);

// 2. Productos de la categoría "Electrónica" O "Hogar"
print("\n--- 2.2 Productos de 'Electrónica' O 'Hogar' ---");
db.products.find({ $or: [{ categoria: "Electrónica" }, { categoria: "Hogar" }] }).limit(5).forEach(printjson);

// 3. Productos que NO sean de la marca "Sony" y tengan stock > 10
print("\n--- 2.3 Productos NO 'Sony' con stock > 10 ---");
db.products.find({ marca: { $ne: "Sony" }, stock: { $gt: 10 } }).limit(5).forEach(printjson);

// 4. Productos que tengan la palabra "Laptop" O "Smartphone" en su nombre (búsqueda de texto, requiere índice de texto)
// Asegúrate de haber creado el índice: db.products.createIndex({ nombre: "text", descripcion: "text" })
print("\n--- 2.4 Productos con 'Laptop' o 'Smartphone' en el nombre (búsqueda de texto) ---");
db.products.find({ $text: { $search: "Laptop Smartphone" } }).project({nombre:1, categoria:1, score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).limit(5).forEach(printjson);

// 5. Productos que tengan al menos una review con calificación de 5 estrellas
print("\n--- 2.5 Productos con al menos una review de 5 estrellas ---");
db.products.find({ "reviews.calificacion": 5 }).limit(5).forEach(printjson);

// 6. Productos de la categoría "Ropa" con la especificación de talla "M"
print("\n--- 2.6 Productos de 'Ropa' talla 'M' ---");
db.products.find({ categoria: "Ropa", "especificaciones.talla": "M" }).limit(5).forEach(printjson);

// 7. Productos que tengan exactamente 2 imágenes
print("\n--- 2.7 Productos con exactamente 2 imágenes ---");
db.products.find({ imagenes: { $size: 2 } }).limit(5).forEach(printjson);

// 8. Productos actualizados en los últimos 7 días
const sieteDiasAtras = new Date();
sieteDiasAtras.setDate(sieteDiasAtras.getDate() - 7);
print(`\n--- 2.8 Productos actualizados desde ${sieteDiasAtras.toISOString().split('T')[0]} ---`);
db.products.find({ fecha_actualizacion: { $gte: sieteDiasAtras } }).project({nombre:1, fecha_actualizacion:1}).limit(5).forEach(printjson);

print("\n\n--- 3. CONSULTAS DE AGREGACIÓN ---");

// 1. Contar cuántos productos hay por categoría
print("\n--- 3.1 Conteo de productos por categoría ---");
const productosPorCategoria = db.products.aggregate([
    {
        $group: {
            _id: "$categoria", // Agrupar por el campo 'categoria'
            totalProductos: { $sum: 1 } // Contar los documentos en cada grupo
        }
    },
    {
        $sort: { totalProductos: -1 } // Ordenar por el total de productos descendente
    }
]).toArray();
printjson(productosPorCategoria);

// 2. Calcular el precio promedio, mínimo y máximo por categoría
print("\n--- 3.2 Estadísticas de precio por categoría (promedio, min, max) ---");
const preciosPorCategoria = db.products.aggregate([
    {
        $group: {
            _id: "$categoria",
            precioPromedio: { $avg: "$precio" },
            precioMinimo: { $min: "$precio" },
            precioMaximo: { $max: "$precio" },
            totalProductos: { $sum: 1 }
        }
    },
    {
        $project: { // Proyectar para redondear el promedio
            _id: 1,
            totalProductos: 1,
            precioMinimo: 1,
            precioMaximo: 1,
            precioPromedio: { $round: ["$precioPromedio", 2] } // Redondear a 2 decimales
        }
    },
    {
        $sort: { precioPromedio: -1 }
    }
]).toArray();
printjson(preciosPorCategoria);

// 3. Encontrar las 5 marcas con más productos en la categoría "Electrónica"
print("\n--- 3.3 Top 5 marcas en 'Electrónica' por número de productos ---");
const topMarcasElectronica = db.products.aggregate([
    {
        $match: { categoria: "Electrónica" } // Filtrar solo productos de Electrónica
    },
    {
        $group: {
            _id: "$marca",
            cantidadProductos: { $sum: 1 }
        }
    },
    {
        $sort: { cantidadProductos: -1 }
    },
    {
        $limit: 5
    }
]).toArray();
printjson(topMarcasElectronica);

// 4. Calcular la calificación promedio de las reviews para cada producto que tenga reviews
print("\n--- 3.4 Calificación promedio por producto (solo los que tienen reviews) ---");
const calificacionPromedioPorProducto = db.products.aggregate([
    {
        $match: { "reviews.0": { $exists: true } } // Solo productos con al menos una review
    },
    {
        $unwind: "$reviews" // Descomponer el array de reviews
    },
    {
        $group: {
            _id: "$_id", // Agrupar por ID del producto
            nombreProducto: { $first: "$nombre" }, // Tomar el nombre del producto
            calificacionPromedio: { $avg: "$reviews.calificacion" },
            totalReviews: { $sum: 1 }
        }
    },
    {
        $project: {
             _id: 1,
             nombreProducto: 1,
             totalReviews: 1,
             calificacionPromedio: { $round: ["$calificacionPromedio", 1] } // Redondear a 1 decimal
        }
    },
    {
        $sort: { calificacionPromedio: -1, totalReviews: -1 }
    },
    {
        $limit: 10 // Mostrar los 10 mejor calificados
    }
]).toArray();
printjson(calificacionPromedioPorProducto);

// 5. Listar productos y el número de reviews que tienen, ordenados por los que más reviews tienen.
print("\n--- 3.5 Productos ordenados por número de reviews ---");
const productosPorNumReviews = db.products.aggregate([
    {
        $project: { // Proyectar solo los campos necesarios y el tamaño del array de reviews
            nombre: 1,
            categoria: 1,
            numeroReviews: { $size: { $ifNull: ["$reviews", []] } } // Usar $ifNull por si reviews no existe o es null
        }
    },
    {
        $sort: { numeroReviews: -1 }
    },
    {
        $limit: 10
    }
]).toArray();
printjson(productosPorNumReviews);