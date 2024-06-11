const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Importer Mongoose
const express = require('express');


/*
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

module.exports = authenticateJWT;*/

module.exports.addContact = async (req, res) => {
    try {
        const { userId, contactName, contactPrenom, contactTel } = req.body;
    
        // Recherche de l'utilisateur par ID
        const user = await UserModel.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
    
        // Ajout du nouveau contact à la liste des contacts de l'utilisateur
        user.contacts.push({ contactName, contactPrenom, contactTel });
    
        // Enregistrement des modifications dans la base de données
        await user.save();
    
        return res.status(200).json({ message: "Contact ajouté avec succès", user });
      } catch (error) {
        console.error("Erreur lors de l'ajout du contact :", error);
        return res.status(500).json({ message: "Erreur serveur lors de l'ajout du contact" });
      }
  };

  module.exports.updateContact = async (req, res) => {
    try {
        const { userId, contactId, contactName, contactPrenom, contactTel } = req.body;

        // Recherche de l'utilisateur par ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Recherche du contact dans la liste des contacts de l'utilisateur
        const contact = user.contacts.find(contact => contact._id.toString()=== contactId.toString());

        if (!contact) {
            return res.status(404).json({ message: "Contact non trouvé" });
        }

        // Mise à jour des informations du contact
        if (contactName) {
            contact.contactName = contactName;
        }
        if (contactPrenom) {
            contact.contactPrenom = contactPrenom;
        }
        if (contactTel) {
            contact.contactTel = contactTel;
        }

        // Enregistrement des modifications dans la base de données
        await user.save();

        return res.status(200).json({ message: "Contact mis à jour avec succès", user });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du contact :", error);
        return res.status(500).json({ message: "Erreur serveur lors de la mise à jour du contact" });
    }
};

module.exports.deleteContact = async (req, res) => {
    try {
        const { userId, contactId } = req.params;

        // Recherche de l'utilisateur par ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Recherche du contact dans la liste des contacts de l'utilisateur par son ID
        const contactIndex = user.contacts.findIndex(contact => contact._id.toString() === contactId.toString());

        if (contactIndex === -1) {
            return res.status(404).json({ message: "Contact non trouvé" });
        }

        // Suppression du contact de la liste des contacts de l'utilisateur
        user.contacts.splice(contactIndex, 1);

        // Enregistrement des modifications dans la base de données
        await user.save();

        return res.status(200).json({ message: "Contact supprimé avec succès", user });
    } catch (error) {
        console.error("Erreur lors de la suppression du contact :", error);
        return res.status(500).json({ message: "Erreur serveur lors de la suppression du contact" });
    }
};

module.exports.getAllContacts = async (req, res) => {
    try {
        const { userId} = req.params;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const contacts = user.contacts;
        
        return res.status(200).json({ message: "Contacts envoyés avec succès", contacts });
        
    } catch (error) {
        console.error("Erreur lors de l'envoi de contacts :", error);
        return res.status(500).json({ message: "Erreur lors de l'envoi de contacts" });
    }
}
  