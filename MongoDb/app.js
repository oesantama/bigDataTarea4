const express = require('express');
const { connectDB } = require('./config/db');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB().then(() => {
    app.use('/api/products', productRoutes);

    app.get('/', (req, res) => {
        res.send('API de Catálogo de Productos funcionando!');
    });

    // Manejo de rutas no encontradas (404)
    app.use((req, res, next) => {
        const error = new Error('Ruta no encontrada');
        error.statusCode = 404;
        next(error);
    });

    // Middleware de manejo de errores global
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => {
        console.error("ERROR:", err.message);
        if (err.stack) {
            console.error(err.stack.split('\n').slice(0,5).join('\n')); // Loguea solo las primeras líneas del stack
        }

        const statusCode = err.statusCode || 500;
        const message = err.message || 'Error interno del servidor';
        
        let response = { message };
        if (err.validationErrors) { // Si hay errores de validación específicos
            response.errors = err.validationErrors;
        }

        res.status(statusCode).json(response);
    });

    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("No se pudo iniciar el servidor debido a un error de base de datos:", err);
    process.exit(1);
});