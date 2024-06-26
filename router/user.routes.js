const express = require('express');
const router = express.Router();
const authController = require('../controleurs/user.controleur');
const contactController = require('../controleurs/contact.controler');
const userController = require('../controleurs/user.controleur');
const { requireAuth } = require('../middleware/auth.middleware');


router.post("/register", authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logout);
router.get("/", userController.getAllUsers);
router.delete("/:id", userController.userDelete);
router.put("/:id", userController.userUpdate);
router.get("/:id", userController.userInfo);

router.get('/contacts/:userId', contactController.getAllContacts);
router.post('/create-contact/', contactController.addContact);
router.patch('/update-contact', contactController.updateContact);
router.delete('/delete-contact/:userId/:contactId', requireAuth, contactController.deleteContact);



module.exports = router; //il faut appeler le router en app.js