const express = require('express');
const cors = require('cors');

const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routeUser = require('./router/user.routes');

mongoose.connect('mongodb+srv://mmishk0501:12345@express.swgvavr.mongodb.net/')
    .then(() => {
        console.log('Connexion réussie');
    })
    .catch(error => {
        console.error('Erreur de connexion:', error);
    });


app.use(bodyParser.json());

// Middleware pour activer CORS
app.use(cors({
    origin: 'http://localhost:3000', // Autoriser uniquement les requêtes de cette origine
    methods: ['GET', 'POST'], // Autoriser uniquement certaines méthodes HTTP
    allowedHeaders: '*' // Autoriser tous les en-têtes 
}));



app.use('/api/user', routeUser);

//app.get('/login',(req, res) =>{res.send("Hello world")});

module.exports = app;
