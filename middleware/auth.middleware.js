require('dotenv').config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const cookieParser = require('cookie-parser');


module.exports.checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      console.log(decodedToken);
      if (err) {
        res.locals.user = null;
        res.cookie("jwt", "", { maxAge: 1 });
        next();
      } else {
        let user = await UserModel.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports.requireAuth = (req, res, next) => {
  const cookieHeader = req.headers.cookie;
  const secretJwt = process.env.JWT_SECRET;
 
  if (cookieHeader) {
    const token = cookieHeader.split(';').find(cookie => cookie.trim().startsWith('jwt='));
          
    if (token) {
      const tokenValue = token.split('=')[1].trim();
      console.log('voici le token '+tokenValue);
      jwt.verify(tokenValue, secretJwt, async (err, decodedToken) => {
        if (err) {
          console.error(err);
          res.status(401).json('Token invalide');
        } else {
          console.log(req.user);
          req.user = decodedToken; // Ajouter le token décodé à la requête pour une utilisation ultérieure
          next();
        }
      });
    } else {
      console.log("Aucun token JWT trouvé dans l'en-tête Cookie.");
      res.status(401).json('Token manquant');
    }
  } else {
    console.log("Aucun en-tête Cookie trouvé.");
    res.status(401).json('En-tête Cookie manquant');
  }
};







/*
module.exports.requireAuth = (req, res, next) => {
  const cookieHeader = req.rawHeaders.find(rawHeaders => rawHeaders.startsWith('jwt'));

  if (cookieHeader) {
    const token = cookieHeader.split('=')[1];
    console.log(token);
  } else {
    console.log("Aucun en-tête Cookie trouvé.");
  }

  console.log(token);
  if (token) {
    jwt.verify(token, '12345', async (err, decodedToken) => {
      if (err) {
        console.log(err);
        res.send(200).json('no token')
      } else {
        req.user = decodedToken; // Ajouter le token décodé à la requête pour une utilisation ultérieure
        console.log(req.user);
        next();
      }
    });
  } else {
    console.log('No token');
  }
};*/