import User from '../models/user.model.js';
import Product from "../models/product.model.js"
import mongoose from "mongoose"

// CREATE
const createUser = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;
    const user = await User.create({ pseudo, email, password });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// READ ALL
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// READ ONE
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// UPDATE
const updateUser = async (req, res) => {
  try {
    const { pseudo, email, password } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { pseudo, email, password },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// DELETE
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getPurchaseHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: `User with id ${userId} not found` });
    }

    const purchases = user.purchases.map(async (purchase) => {
      const products = await Product.find({ _id: { $in: purchase.products } });
      return {
        products: products.map((product) => ({
          id: product._id,
          name: product.name,
          quantity: purchase.products.find((p) => p._id.toString() === product._id.toString()).quantity,
          price: product.price,
        })),
        totalPrice: purchase.totalPrice,
        date: purchase.date,
      };
    });

    const purchasesWithProducts = await Promise.all(purchases);

    res.status(200).json(purchasesWithProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const addPurchases = async (req, res) => {
  try {
    const { id } = req.params;
    const { products } = req.body;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: `User with id ${id} not found` });
    }

    const validProductIds = [];

    // Vérifier chaque identifiant de produit
    for (const productId of products) {
      if (mongoose.isValidObjectId(productId)) {
        validProductIds.push(productId);
      } else {
        console.log(`Invalid product ID: ${productId}`);
      }
    }

    // Récupérer les produits correspondants aux identifiants valides
    const purchaseProducts = await Product.find({ _id: { $in: validProductIds } });

    const totalPrice = purchaseProducts.reduce((acc, product) => {
      return acc + product.price;
    }, 0);

    // Créer un objet d'achat avec la liste de produits, le prix total et la date actuelle
    const purchase = {
      products: purchaseProducts,
      totalPrice,
      date: Date.now(),
    };

    console.log(purchase);

    user.purchases.push(purchase);
    await user.save();

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addPurchases,
  getPurchaseHistory
};
