const express = require('express');
const router = express.Router();
const authController = require('../controleurs/user.controleur');
const contactController = require('../controleurs/contact.controler');

router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);


router.post("/create", contactController.addContact);


module.exports = router; //il faut appeler le router en app.js