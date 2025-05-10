const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "tiendaOnlineDB";

let dbInstance = null;

async function connectDB() {
    if (dbInstance) {
        return dbInstance;
    }
    try {
        const client = new MongoClient(uri); // No es necesario useNewUrlParser y useUnifiedTopology en versiones recientes del driver
        await client.connect();
        console.log("Conectado exitosamente a MongoDB");
        dbInstance = client.db(dbName);
        return dbInstance;
    } catch (error) {
        console.error("No se pudo conectar a MongoDB:", error);
        process.exit(1);
    }
}

function getDB() {
    if (!dbInstance) {
        throw new Error("La base de datos no ha sido inicializada. Llama a connectDB primero.");
    }
    return dbInstance;
}

module.exports = { connectDB, getDB };