import bcrypt from 'bcrypt';
import User from '../models/user.model.js';

// Controller pour l'inscription d'un utilisateur
const register = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ pseudo }, { email }] });

    if (existingUser) {
      return res.status(409).json({ message: 'Pseudo ou email déjà utilisé' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ pseudo, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Une erreur est survenue lors de l'inscription" });
  }
};

const login = async (req, res) => {
  try {
    console.log("je suis dans login");
    const { pseudo, password } = req.body;

    const user = await User.findOne({ pseudo });
    if (!user) {
      return res
        .status(401)
        .json({ message: 'Pseudo ou mot de passe incorrect' });
    }

    const isMatch =await bcrypt.compare(password, user.password);
    console.log(isMatch)

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: 'Pseudo ou mot de passe incorrect' });
    }

    res.status(200).json({ message: 'Utilisateur connecté avec succès', user : 
        user._id
     });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Une erreur est survenue lors de la connexion',   });
  }
};

export { register, login };
