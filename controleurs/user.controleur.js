require('dotenv').config();
const UserModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const ObjectID = require("mongoose").Types.ObjectId;

const maxAge = 5 * 60 * 1000;
const jwtSecret = process.env.JWT_SECRET;

const createToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: `${maxAge}s`
  })
};


module.exports.signUp = async (req, res) => {
  console.log(req.body);
  const { email, password, firstName, lastName } = req.body

  try {
    const user = await UserModel.create({ email, password, firstName, lastName });
    res.status(201).json({ user: user._id });
  }
  catch (err) {
    res.status(200).send({ err })
  }
}

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;

       
  try {
    const user = await UserModel.login(email, password);
    const token = createToken(user._id);//création d'un token avec l'id et la clé secrète
    res.cookie('jwt', token, { httpOnly: true, maxAge });
    const responseData = {
      userId: user._id,
      //email: user.email,
      //picture: user.picture,
      firstName: user.firstName,
      lastName: user.lastName,
     // contacts: user.contacts.map(contact => ({
      //  contactId: contact._id,
     //   contactName: contact.contactName,
     //   contactPrenom: contact.contactPrenom,
     //   contactTel: contact.contactTel
     // })),
      // Include any other fields you want to return
    };
    res.status(200).json({ responseData }); // Retourner un message de succès avec le token   
  } catch (err) {
    res.status(401).json(err);
  }
}

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/login');
}


module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};


// Fonction pour supprimer un utilisateur
module.exports.userDelete = async (req, res) => {

  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  try {
    await UserModel.deleteOne({ _id: req.params.id }).exec(); // Utiliser deleteOne() au lieu de remove()
    res.status(200).json({ message: "Successfully deleted. " });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.userUpdate = async (req, res) => {
  const _id = req.params.id; // Supposant que l'ID de l'utilisateur à mettre à jour est passé en tant que paramètre d'URL
  const { email, password, firstName, lastName } = req.body; // Nouvelles informations de l'utilisateur à partir du corps de la requête

  try {
    // Chercher l'utilisateur dans la base de données
    let user = await UserModel.findById(_id);

    // Si l'utilisateur n'est pas trouvé, envoyer une réponse 404 (Non trouvé)
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non  trouvé" });
    }

    // Mettre à jour les informations de l'utilisateur avec les nouvelles valeurs
    user.email = email;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;

    // Enregistrer les modifications dans la base de données
    await user.save();

    // Envoyer une réponse 200 (OK) si la mise à jour est réussie
    res.status(200).json({ message: "Informations de l'utilisateur mises à jour avec succès" });
  } catch (err) {
    // En cas d'erreur, envoyer une réponse 500 (Erreur de serveur interne)
    res.status(500).json({ error: err.message });
  }
};

module.exports.userInfo = (req, res) => {
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send("ID unknown : " + req.params.id);

  UserModel.findById(req.params.id)
    .select("-password")
    .then(docs => {
      if (!docs) {
        return res.status(404).send("User not found");
      }
      res.send(docs);
    })
    .catch(err => {
      console.log("Error finding user: ", err);
      res.status(500).send("Internal server error");
    });
};


