// Charger les variables d'environnement avant toute lecture de process.env
require('dotenv').config();

// Importer mongoose pour se connecter à MongoDB
const mongoose = require('mongoose');

const normalizeEnvValue = (value) => {
    if (typeof value !== 'string') {
        return undefined;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue || trimmedValue === 'undefined' || trimmedValue === 'null') {
        return undefined;
    }

    return trimmedValue;
};

// Fonction asynchrone de connexion à la base de données
const connectDB = async () => {
    try {
        let uri = normalizeEnvValue(process.env.MONGODB_URI);
        const useMemoryDb = normalizeEnvValue(process.env.USE_MEMORY_DB) === 'true';

        // Si USE_MEMORY_DB=true ou aucune URI fournie, utiliser MongoDB en mémoire
        if (!uri || useMemoryDb) {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log('⚡ MongoDB en mémoire démarré (mode test)');
        }

        // Tenter la connexion avec l'URI défini
        const conn = await mongoose.connect(uri);
        
        // Si la connexion réussit, afficher un message
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        // Si la connexion échoue, afficher l'erreur et arrêter le programme
        console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// Exporter la fonction pour l'utiliser ailleurs
module.exports = connectDB;