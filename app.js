const express = require('express');
const cors = require('cors');
const {requireAuth} = require('./middleware/auth.middleware');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routeUser = require('./router/user.routes');
const cookieParser = require('cookie-parser');

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




app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
  });

app.use('/api/user', routeUser);

//app.get('/login',(req, res) =>{res.send("Hello world")});

module.exports = app;
