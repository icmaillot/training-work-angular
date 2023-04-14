import express from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addPurchases,
  getPurchaseHistory
} from '../controllers/user.controller.js';

const router = express.Router();

router.post('/purchases/:id', addPurchases);
router.get("/purchases/:userId", getPurchaseHistory)

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
