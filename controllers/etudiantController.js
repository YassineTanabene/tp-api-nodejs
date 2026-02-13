// Importer le modèle Etudiant
const Etudiant = require('../models/Etudiant');

// Les fonctions CRUD seront ajoutées ici...

exports.createEtudiant = async(req, res) => {
    try {
        console.log('Données reçues: ', req.body);
        // Empêcher la création si un étudiant avec le même nom ET prénom existe déjà
        const nom = (req.body.nom || '').trim();
        const prenom = (req.body.prenom || '').trim();

        if (!nom || !prenom) {
            return res.status(400).json({
                success: false,
                message: 'Le nom et le prénom sont obligatoires'
            });
        }

        const dejaExistant = await Etudiant.findOne({ nom, prenom });
        if (dejaExistant) {
            return res.status(409).json({
                success: false,
                message: 'Un étudiant avec le même nom et prénom existe déjà'
            });
        }

        const etudiant = await Etudiant.create({ ...req.body, nom, prenom });
        res.status(201).json({
            success: true,
            message: 'Étudiant créé avec succès',
            data : etudiant
        });
    } catch (error) {
        // Gestion des doublons provenant de l'unicité (email ou nom+prenom)
        if (error && error.code === 11000) {
            const keys = error.keyPattern || {};
            if (keys.nom && keys.prenom) {
                return res.status(409).json({
                    success: false,
                    message: 'Un étudiant avec le même nom et prénom existe déjà'
                });
            }
            if (keys.email) {
                return res.status(400).json({
                    success: false,
                    message: 'Cet email existe déjà'
                });
            }
            return res.status(400).json({
                success: false,
                message: 'Doublon détecté',
                error: error.message
            });
        }
        res.status(400).json({
            success: false,
            message: 'Données invalides',
            error: error.message
        });

    }

};

exports.getAllEtudiants = async (req, res) => {
    try {
        // Étape 1: Récupérer uniquement les étudiants actifs
        const etudiants = await Etudiant.find({ actif: true });
        
        // Étape 2: Renvoyer la liste avec le nombre total
        res.status(200).json({
            success: true,
            count: etudiants.length,  // Nombre d'étudiants trouvés
            data: etudiants
        });
        
    } catch (error) {
        // Erreur serveur (code 500)
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

exports.getEtudiantById = async (req, res) => {
    try {
        // Étape 1: Récupérer l'ID depuis les paramètres de l'URL
        // req.params contient les paramètres de l'URL
        console.log('🔍 Recherche de l\'ID:', req.params.id);
        
        // Étape 2: Chercher l'étudiant par son ID
        const etudiant = await Etudiant.findById(req.params.id);
        
        // Étape 3: Vérifier si l'étudiant existe
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }
        
        // Étape 4: Renvoyer l'étudiant trouvé
        res.status(200).json({
            success: true,
            data: etudiant
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

exports.updateEtudiant = async (req, res) => {
    try {
        console.log('✏️ Mise à jour de l\'ID:', req.params.id);
        console.log('📥 Nouvelles données:', req.body);
        
        // findByIdAndUpdate prend 3 arguments: 
        // 1. L'ID du document à modifier
        // 2. Les nouvelles données
        // 3. Options:  
        //    - new: true = retourne le document modifié (pas l'ancien)
        //    - runValidators: true = applique les validations du schéma
        
        const etudiant = await Etudiant.findByIdAndUpdate(
            req.params. id,
            req.body,
            { new: true, runValidators: true }
        );
        
        // Vérifier si l'étudiant existe
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Étudiant mis à jour avec succès',
            data: etudiant
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur de mise à jour',
            error: error.message
        });
    }
};
exports.deleteEtudiant = async (req, res) => {
    try {
        console.log('🗑️ Suppression de l\'ID:', req.params.id);
        // Soft delete: désactiver l'étudiant au lieu de le supprimer
        const etudiant = await Etudiant.findByIdAndUpdate(
            req.params.id,
            { $set: { actif: false } },
            { new: true }
        );
        
        // Vérifier si l'étudiant existait
        if (!etudiant) {
            return res.status(404).json({
                success: false,
                message: 'Étudiant non trouvé'
            });
        }
        
        res.status(200).json({
            success: true,
            message: 'Étudiant désactivé avec succès',
            data: etudiant
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
};

exports.getEtudiantsByFiliere = async (req, res) => {
    try {
        console.log('🔎 Recherche par filière:', req.params.filiere);
        
        // Chercher tous les étudiants avec cette filière
        const etudiants = await Etudiant. find({ filiere: req.params.filiere });
        
        res.status(200).json({
            success: true,
            count: etudiants.length,
            filiere: req.params.filiere,
            data: etudiants
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error. message
        });
    }
};

// Liste des étudiants désactivés (actif: false)
exports.getEtudiantsInactifs = async (req, res) => {
    try {
        const etudiants = await Etudiant.find({ actif: false });
        return res.status(200).json({
            success: true,
            count: etudiants.length,
            data: etudiants
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};

// Recherche par nom OU prénom (insensible à la casse)
exports.searchEtudiants = async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Le paramètre de requête q est requis'
            });
        }

        // Échapper les caractères spéciaux pour une regex sûre
        const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapeRegex(q), 'i');

        const etudiants = await Etudiant.find({
            $or: [
                { nom: regex },
                { prenom: regex }
            ]
        });

        return res.status(200).json({
            success: true,
            query: q,
            count: etudiants.length,
            data: etudiants
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }


};

// Recherche avancée avec filtres multiples
exports.advancedSearch = async (req, res) => {
    try {
        const { nom, filiere, anneeMin, anneeMax, moyenneMin } = req.query;
        let filter = { actif: true };

        if (nom) filter.nom = new RegExp(nom, 'i');
        if (filiere) filter.filiere = filiere;
        if (anneeMin || anneeMax) {
            filter.annee = {};
            if (anneeMin) filter.annee.$gte = parseInt(anneeMin);
            if (anneeMax) filter.annee.$lte = parseInt(anneeMax);
        }
        if (moyenneMin) filter.moyenne = { $gte: parseFloat(moyenneMin) };

        const etudiants = await Etudiant.find(filter);

        res.status(200).json({
            success: true,
            count: etudiants.length,
            filters: req.query,
            data: etudiants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur serveur',
            error: error.message
        });
    }
};