const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

// Clé secrète JWT
const jwtSecret = '12345';

// Middleware pour vérifier l'authentification JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = decoded; // Ajouter les données de l'utilisateur au objet de la requête
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = authenticateJWT;

// Contrôleur pour créer un nouveau contact
module.exports.addContact = async (req, res) => {
    const userId = req.user.id; // Récupérer l'ID de l'utilisateur à partir du token JWT
    const { contactName, contactPrenom, contactTel } = req.body;

    try {
        // Trouver l'utilisateur dans la base de données
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Ajouter le nouveau contact à la liste des contacts de l'utilisateur
        user.contacts.push({ contactName, contactPrenom, contactTel });

        // Enregistrer les modifications dans la base de données
        await user.save();

        res.status(201).json({ message: "Contact added successfully", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};