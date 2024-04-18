const mongoose = require('mongoose');//on appele le module mongoose

const userSchema = new mongoose.Schema(//on crée une bibliothéque mongoose dans laquelle on va déclarer le schèma utilisateur
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png" //le cheman pour 
    },
    firstName :{
      required: true,
      type: String,
      max: 1024,
      minlength: 3
    },
    lastName :{
        type: String,
        max: 1024,
    },
    contacts: {
      type: [
        {
          contactId: String,
          contactName: String,
          contactPrenom: String,
          contactTel: String,
        }
      ],
      required: true,
    },
     
  }
);

userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
        // Vérification du mot de passe
        if (user.password === password) {
            return user; // Si le mot de passe correspond, retourne l'utilisateur
        } else {
            throw new Error('Incorrect password'); // Sinon, lance une erreur
        }
    } else {
        throw new Error('Incorrect email'); // Si l'email n'est pas trouvé, lance une erreur
    }
};

// Définition d'une méthode statique personnalisée pour ajouter un contact à un utilisateur
userSchema.statics.addContact = async function(userId, contactData) {
    try {
        // Recherche de l'utilisateur dans la base de données
        const user = await this.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Ajout du nouveau contact à la liste des contacts de l'utilisateur
        user.contacts.push(contactData);

        // Enregistrement des modifications dans la base de données
        await user.save();

        return user; // Renvoyer l'utilisateur mis à jour avec le nouveau contact ajouté
    } catch (error) {
        throw new Error(error.message);
    }
};


const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel;