// Opcional: Limpiar la colección antes de insertar para evitar duplicados en ejecuciones repetidas
db.products.drop();
print("Colección 'products' eliminada (si existía).");

const categorias = ["Electrónica", "Ropa", "Hogar", "Libros", "Deportes", "Juguetes", "Belleza", "Alimentos"];
const marcasPorCategoria = {
    "Electrónica": ["Sony", "Samsung", "Apple", "LG", "Bose"],
    "Ropa": ["Nike", "Adidas", "Zara", "Levi's", "H&M"],
    "Hogar": ["IKEA", "HomeSense", "T-Fal", "Oster"],
    "Libros": ["Penguin Random House", "HarperCollins", "Planeta", "Anagrama"],
    "Deportes": ["Puma", "Under Armour", "Wilson", "Spalding"],
    "Juguetes": ["LEGO", "Mattel", "Hasbro", "Playmobil"],
    "Belleza": ["L'Oréal", "MAC", "Nivea", "Dove"],
    "Alimentos": ["Nestlé", "Coca-Cola", "Bimbo", "Kellogg's"]
};

const nombresProductos = {
    "Electrónica": ["Smart TV 55\"", "Laptop Gamer Pro", "Auriculares Inalámbricos", "Smartphone X10", "Barra de Sonido"],
    "Ropa": ["Camiseta Algodón", "Jeans Slim Fit", "Chaqueta Deportiva", "Vestido Verano", "Zapatillas Running"],
    "Hogar": ["Sofá Modular", "Juego de Sartenes", "Lámpara de Escritorio", "Robot Aspirador", "Set de Toallas"],
    "Libros": ["Cien Años de Soledad", "1984", "El Principito", "Sapiens", "El Hobbit"],
    "Deportes": ["Balón de Fútbol Pro", "Raqueta de Tenis", "Set de Pesas", "Bicicleta Montaña", "Cuerda para Saltar"],
    "Juguetes": ["Set de Construcción Castillo", "Muñeca Interactiva", "Coche de Carreras RC", "Puzzle 1000 Piezas", "Juego de Mesa Familiar"],
    "Belleza": ["Crema Hidratante Facial", "Labial Rojo Intenso", "Champú Reparador", "Máscara de Pestañas Volumen", "Perfume Floral"],
    "Alimentos": ["Café Orgánico Molido", "Chocolate Amargo 70%", "Cereal Integral Fitness", "Galletas Artesanales", "Yogurt Griego Natural"]
};

const especificacionesEjemplo = {
    "Electrónica": () => ({
        resolucion: ["HD", "Full HD", "4K", "8K"][Math.floor(Math.random() * 4)],
        procesador: ["i5", "i7", "Ryzen 5", "Snapdragon"][Math.floor(Math.random() * 4)],
        ram: [8, 16, 32][Math.floor(Math.random() * 3)] + "GB",
        almacenamiento: ["256GB SSD", "512GB SSD", "1TB HDD", "1TB SSD"][Math.floor(Math.random() * 4)]
    }),
    "Ropa": () => ({
        talla: ["S", "M", "L", "XL", "XXL"][Math.floor(Math.random() * 5)],
        color: ["Rojo", "Azul", "Verde", "Negro", "Blanco", "Gris"][Math.floor(Math.random() * 6)],
        material: ["Algodón", "Poliéster", "Lana", "Seda", "Lino"][Math.floor(Math.random() * 5)]
    }),
    "Hogar": () => ({
        material: ["Madera", "Metal", "Plástico", "Vidrio", "Cerámica"][Math.floor(Math.random() * 5)],
        dimensiones: `${Math.floor(Math.random() * 100) + 20}x${Math.floor(Math.random() * 100) + 20}x${Math.floor(Math.random() * 100) + 20} cm`,
        color: ["Blanco", "Negro", "Gris", "Beige", "Marrón"][Math.floor(Math.random() * 5)]
    }),
    "Libros": () => ({
        autor: ["Gabriel García Márquez", "George Orwell", "Antoine de Saint-Exupéry", "Yuval Noah Harari", "J.R.R. Tolkien"][Math.floor(Math.random()*5)],
        isbn: `978-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9)}`,
        paginas: Math.floor(Math.random() * 700) + 100,
        idioma: "Español"
    }),
    "Deportes": () => ({
        material: ["Cuero sintético", "Grafito", "Neopreno", "Aluminio"][Math.floor(Math.random() * 4)],
        tamaño: ["Oficial", "Juvenil", "Infantil"][Math.floor(Math.random() * 3)],
        peso: `${Math.random().toFixed(2) * 2 + 0.5} kg`
    }),
    "Juguetes": () => ({
        edad_recomendada: ["3+", "5+", "8+", "12+"][Math.floor(Math.random() * 4)],
        material: ["Plástico ABS", "Madera", "Peluche", "Metal"][Math.floor(Math.random() * 4)],
        requiere_baterias: [true, false][Math.floor(Math.random() * 2)]
    }),
    "Belleza": () => ({
        tipo_piel: ["Normal", "Seca", "Grasa", "Mixta", "Sensible"][Math.floor(Math.random() * 5)],
        contenido_neto: `${Math.floor(Math.random() * 450) + 50}ml`,
        sin_parabenos: [true, false][Math.floor(Math.random() * 2)]
    }),
    "Alimentos": () => ({
        ingredientes_principales: ["Trigo", "Cacao", "Leche", "Frutas", "Azúcar"][Math.floor(Math.random() * 5)],
        info_alergenos: ["Contiene gluten", "Puede contener trazas de nueces", "Sin lactosa"][Math.floor(Math.random() * 3)],
        fecha_caducidad: new Date(new Date().getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Caducidad en los próximos 30 días
    })
};

const nombresUsuarios = ["AnaPerez", "CarlosG", "LauraV", "DavidM", "SofiaL", "JuanR", "ElenaS", "MiguelA", "IsabelC", "PedroF"];
const comentariosEjemplo = [
    "¡Excelente producto, superó mis expectativas!",
    "Buena calidad-precio, lo recomiendo.",
    "Cumple con lo descrito, estoy satisfecho.",
    "Podría ser mejor, pero no está mal.",
    "No me gustó mucho, esperaba algo diferente.",
    "Llegó rápido y en buen estado.",
    "Funciona perfectamente, muy útil.",
    "Bonito diseño y buenos materiales.",
    "Ideal para regalar.",
    "Un poco caro para lo que ofrece."
];

let productos = [];
const totalProductos = 100; // Queremos al menos 100 productos

for (let i = 0; i < totalProductos; i++) {
    const categoriaRandom = categorias[Math.floor(Math.random() * categorias.length)];
    const marcasDisponibles = marcasPorCategoria[categoriaRandom] || ["Marca Genérica"];
    const marcaRandom = marcasDisponibles[Math.floor(Math.random() * marcasDisponibles.length)];
    const nombresDisponibles = nombresProductos[categoriaRandom] || [`Producto Genérico ${i+1}`];
    const nombreRandom = nombresDisponibles[Math.floor(Math.random() * nombresDisponibles.length)] + ` Modelo ${String.fromCharCode(65 + Math.floor(i/10))}${i%10 +1}`;


    let producto = {
        nombre: `${nombreRandom}`,
        descripcion: `Descripción detallada para ${nombreRandom} de la marca ${marcaRandom} en la categoría ${categoriaRandom}. Ideal para tus necesidades diarias y con excelentes características.`,
        precio: parseFloat((Math.random() * 200 + 10).toFixed(2)), // Precio entre 10 y 210
        stock: Math.floor(Math.random() * 100),
        categoria: categoriaRandom,
        marca: marcaRandom,
        imagenes: [
            `https://picsum.photos/seed/${i+1}p1/400/300`, // Usar picsum para URLs de imagen de ejemplo
            `https://picsum.photos/seed/${i+1}p2/400/300`
        ],
        especificaciones: (especificacionesEjemplo[categoriaRandom] || (() => ({})))(), // Llama a la función para generar especificaciones
        reviews: [],
        fecha_creacion: new Date(new Date().getTime() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000), // Creado en el último año
        fecha_actualizacion: new Date()
    };

    // Añadir algunas reviews aleatorias
    const numReviews = Math.floor(Math.random() * 6); // Entre 0 y 5 reviews
    for (let j = 0; j < numReviews; j++) {
        producto.reviews.push({
            _id_review: new ObjectId(),
            // En una app real, id_usuario vendría de una colección 'users'
            id_usuario: new ObjectId(), // ObjectId de ejemplo, no referenciará a un usuario real aquí
            nombre_usuario: nombresUsuarios[Math.floor(Math.random() * nombresUsuarios.length)],
            calificacion: Math.floor(Math.random() * 5) + 1, // 1 a 5
            comentario: comentariosEjemplo[Math.floor(Math.random() * comentariosEjemplo.length)],
            fecha_review: new Date(producto.fecha_creacion.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000) // Review posterior a la creación
        });
    }
    producto.fecha_actualizacion = producto.reviews.length > 0 ? producto.reviews[producto.reviews.length - 1].fecha_review : producto.fecha_creacion;

    productos.push(producto);
}

if (productos.length > 0) {
    const result = db.products.insertMany(productos);
    print(`Se insertaron ${result.insertedIds.length} documentos en la colección 'products'.`);
} else {
    print("No se generaron productos para insertar.");
}

// Crear algunos índices para mejorar el rendimiento de las consultas comunes
db.products.createIndex({ categoria: 1 });
db.products.createIndex({ precio: 1 });
db.products.createIndex({ stock: 1 });
db.products.createIndex({ "reviews.calificacion": 1 });
db.products.createIndex({ nombre: "text", descripcion: "text" }); // Índice de texto para búsquedas
print("Índices creados en la colección 'products'.");

print(`Total de documentos en 'products': ${db.products.countDocuments()}`);