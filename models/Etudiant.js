const mongoose = require('mongoose');

const etudiantSchema = new mongoose.Schema({
    nom : {
        type : String ,
        required : [true , 'Le nom est obligatoire'],
        trim : true 
    },

    prenom : {
        type : String , 
        required : [true , 'Le prénom est obligatoire'],
        trim : true 
    },

    email : {
        type : String ,
        required : [true, 'L\'email est obligaoire'],
        unique : true,
        lowercase : true,
        match : [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
    },
      // Champ filière : choix limité parmi une liste
    filiere: {
        type: String,
        required: [true, 'La filière est obligatoire'],
        enum: ['Informatique', 'Génie Civil', 'Électronique', 'Mécanique']
    },
    
    // Champ année : nombre entre 1 et 5
    annee: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    
    // Champ moyenne : nombre entre 0 et 20 (optionnel)
    moyenne: {
        type: Number,
        min: 0,
        max: 20,
        default:  null
    },
    
    // Date d'inscription automatique
    dateInscription: {
        type: Date,
        default: Date.now
    }
    
}, {
    timestamps: true 
});

// Champ d'activation pour soft-delete
etudiantSchema.add({
    actif: {
        type: Boolean,
        default: true
    }
});

// Unicité sur le couple (nom, prenom)
// Empêche deux étudiants actifs avec le même nom ET prénom
etudiantSchema.index(
    { nom: 1, prenom: 1 },
    { unique: true, partialFilterExpression: { actif: true } }
);

module.exports = mongoose.model('Etudiant', etudiantSchema);
