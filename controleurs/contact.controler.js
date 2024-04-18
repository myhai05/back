const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Importer Mongoose
const express = require('express');

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

module.exports.addContactHandler = async (req, res) => {
    const userId = req.params.userId; // Récupérer l'ID de l'utilisateur à partir de l'URL
    const contactData = req.body; // Récupérer les données du nouveau contact depuis le corps de la requête

    try {
        // Utilisation de la méthode statique addContact pour ajouter un contact à l'utilisateur
        const updatedUser = await UserModel.addContact(userId, contactData);
        res.status(200).json({ message: 'Contact added successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
