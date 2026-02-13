const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// ============================================
// CONFIGURATION
// ============================================

// Charger les variables d'environnement depuis . env
dotenv.config();

// Connexion à la base de données MongoDB
connectDB();

// Créer l'application Express
const app = express();
// MIDDLEWARES
// ============================================

// Middleware pour parser le JSON dans les requêtes
// Sans cela, req.body serait undefined
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Route d'accueil - pour tester que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({
        message: '🎓 Bienvenue sur l\'API de gestion des étudiants! ',
        version: '1.0.0',
        endpoints: {
            listeEtudiants: 'GET /api/v1/etudiants',
            creerEtudiant: 'POST /api/v1/etudiants',
            voirEtudiant: 'GET /api/v1/etudiants/:id',
            modifierEtudiant: 'PUT /api/v1/etudiants/:id',
            supprimerEtudiant: 'DELETE /api/v1/etudiants/: id (désactivation)',
            parFiliere: 'GET /api/v1/etudiants/filiere/: filiere',
            recherche: 'GET /api/v1/etudiants/search?q=ahmed',
            inactifs: 'GET /api/v1/etudiants/inactifs'
        }
    });
});

// Monter les routes des étudiants sur /api/v1/etudiants
app.use('/api/v1/etudiants', require('./routes/etudiantRoutes'));

// ============================================
// GESTION DES ERREURS
// ============================================

// Route 404 pour les URLs non trouvées
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} non trouvée`
    });
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════╗
    ║   🚀 Serveur démarré avec succès!          ║
    ╠════════════════════════════════════════════╣
    ║   📍 URL: http://localhost:${PORT}             ║
    ║   📚 API: http://localhost:${PORT}/api/v1/etudiants║
    ╚════════════════════════════════════════════╝
    `);
});


