import { get_all_products, add_product, delete_product, update_product } from '../controllers/productController.js';
import express from 'express';
import { protect, restrictTo } from '../controllers/authMiddleware.js';

const router = express.Router();

router.get('/get_all_products', protect, restrictTo('admin'), get_all_products);
router.post('/add_product', protect, restrictTo('admin'), add_product);
router.delete('/delete_product/:id', protect, restrictTo('admin'), delete_product);
router.put('/update_product/:id', protect, restrictTo('admin'), update_product);

export default router;