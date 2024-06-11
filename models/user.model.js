const mongoose = require('mongoose');//on appele le module mongoose
const bcrypt = require('bcrypt');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(//on crée une bibliothéque mongoose dans laquelle on va déclarer le schèma utilisateur
  {
    email: {
      type: String,
      required: true,
      validate: [isEmail],
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
    firstName: {
      required: true,
      type: String,
      max: 1024,
      minlength: 3
    },
    lastName: {
      type: String,
      max: 1024,
    },
    contacts: {
      type: [
        {
          contactId: String,
          contactName: String,
          contactPrenom: String,
          contactTel: Number,
        }
      ],
      required: true,
    },
  }, { timestamps: true },
);

// play function before save into display: 'block',
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();//cela va saler le mdp - ajouter des caractérés 
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user; // Si le mot de passe correspond, retourne l'utilisateur
    } else {
      throw new Error('Incorrect password'); // Sinon, lance une erreur
    }
  } else {
    throw new Error('Incorrect email'); // Si l'email n'est pas trouvé, lance une erreur
  }
};

// Définition d'une méthode statique personnalisée pour ajouter un contact à un utilisateur



const UserModel = mongoose.model('user', userSchema);//user : c'est la table dans laquelle sera enregistré

module.exports = UserModel;