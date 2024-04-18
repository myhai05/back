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

    const corsOptions = {
        origin: 'http://localhost:3000',
        credentials: true,
        'allowedHeaders': ['sessionId', 'Content-Type'],
        'exposedHeaders': ['sessionId'],
        'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        'preflightContinue': false
      }
      app.use(cors(corsOptions));


app.use(bodyParser.json());





app.use('/api/user', routeUser);

//app.get('/login',(req, res) =>{res.send("Hello world")});

module.exports = app;
